const Meeting = require('../models/Meeting');
const { Op } = require('sequelize');
const OpenAI = require('openai');

// Función para llamar a la IA (OpenRouter a través de OpenAI SDK)
async function generateSummaryOpenRouter(transcription, apiKey, model) {
    const prompt = `Actúa como un asistente de proyectos hiper profesional. Resume la siguiente transcripción de una reunión de forma clara, extrayendo los puntos clave discutidos y listando las tareas (accionables) por hacer si existiesen:\n\n"${transcription}"`;
    
    // Instanciar el cliente nativamente con el Endpoint de OpenRouter
    const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
        defaultHeaders: {
            'HTTP-Referer': 'http://localhost:3000',
            'X-OpenRouter-Title': 'MeetingFlowAI',
        }
    });

    // Cálculo lineal exacto a petición escalar: 
    // 1 hora de dictado (~54,000 caracteres)   => 1000 tokens
    // 30 min de dictado (~27,000 caracteres)   => 500 tokens
    // Establecemos un piso mínimo de seguridad de 300 tokens para que reuniones exprés (5 minutos) no terminen cortando a medias una oración.
    const limiteTokens = Math.max(300, Math.ceil((transcription.length / 54000) * 1000));

    try {
        const completion = await openai.chat.completions.create({
            model: model || 'openai/gpt-5.2',
            max_tokens: limiteTokens, // Techo de generación financiero y lógico
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        if (!completion.choices || completion.choices.length === 0 || !completion.choices[0].message) {
            throw new Error("El SDK devolvió una estructura vacía u omitió datos.");
        }

        return completion.choices[0].message.content;
    } catch (error) {
        throw new Error(`Módulo OpenAI SDK devolvió error: ${error.message}`);
    }
}

exports.createMeeting = async (req, res) => {
    try {
        const { title, transcription } = req.body;

        if (!title || !transcription) {
            return res.status(400).json({ error: 'Faltan campos requeridos: title y/o transcription.' });
        }

        // Guardar el registro en la base de datos usando Sequelize de forma instantánea
        const newMeeting = await Meeting.create({
            title,
            transcription,
            summary: null
        });

        res.status(201).json({
            message: 'Acta de reunión creada exitosamente',
            data: newMeeting
        });
    } catch (error) {
        console.error('Error al crear la reunión:', error);
        res.status(500).json({ error: 'Ocurrió un error al guardar la reunión.' });
    }
};

exports.getMeetings = async (req, res) => {
    try {
        const { q } = req.query;
        let whereClause = {};

        // Si hay una query de búsqueda (q), filtramos por título o resumen usando LIKE
        if (q) {
            whereClause = {
                [Op.or]: [
                    { title: { [Op.like]: `%${q}%` } },
                    { summary: { [Op.like]: `%${q}%` } }
                ]
            };
        }

        const meetings = await Meeting.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ data: meetings });
    } catch (error) {
        console.error('Error al obtener las reuniones:', error);
        res.status(500).json({ error: 'Ocurrió un error al obtener las reuniones.' });
    }
};

exports.generateSummaryForMeeting = async (req, res) => {
    try {
        const { id } = req.params;

        const { apiKey, model, forceRegenerate } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'Falta la API Key de OpenRouter. Revisa tus Ajustes.' });
        }

        const meeting = await Meeting.findByPk(id);

        if (!meeting) {
            return res.status(404).json({ error: 'Reunión no encontrada.' });
        }

        if (meeting.summary && !forceRegenerate) {
            // Ya tiene resumen generado y no solicitaron regenerarlo forzosamente
            return res.status(200).json({ message: 'Resumen preexistente', data: meeting });
        }

        // Llamada manual asíncrona a la IA de OpenRouter
        const summary = await generateSummaryOpenRouter(meeting.transcription, apiKey, model);

        // Guardarlo en BD
        meeting.summary = summary;
        await meeting.save();

        res.status(200).json({
            message: 'Resumen generado exitosamente',
            data: meeting
        });

    } catch (error) {
        console.error('Error al generar el resumen para ID:', req.params.id, error);
        res.status(500).json({ error: `Resolución Fallida/IA: ${error.message}` });
    }
};
