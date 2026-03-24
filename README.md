# MeetingFlowAI 🎙️📝

Una poderosa aplicación web responsiva diseñada para gestionar actas de reuniones utilizando dictado por voz y un motor algorítmico de resúmenes potenciado por Inteligencia Artificial de grado de producción (vía OpenRouter / OpenAI SDK).

## Características Principales

- **Dictado en Tiempo Real**: Usa la Web Speech API del navegador para convertir tu voz en texto instantáneamente.
- **Resumen Automático Inteligente**: Envía la transcripción de forma dinámica al modelo de Inteligencia Artificial que tú elijas. Por default procesa a través de la infraestructura global de OpenRouter, extrayendo mágicamente puntos clave discutidos y listando las tareas (accionables).
- **Regeneración de Memorias**: Capacidad de "Regenerar" con IA aquellas actas huérfanas o elaboradas en previas iteraciones, pisando textos antiguos simulados con lógica genuina en un clic.
- **Protección Financiera Activa**: El backend autocalcula la longitud temporal de tu reunión y asigna dinámicamente un *Techo Lógico Escalable* (`max_tokens`), asegurándose de que la IA responda fluidamente sin dilapidar sorpresivamente tu saldo de créditos si te extiendes más de una hora.
- **Historial y Búsqueda**: Interfaz para buscar en vivo tus actas, filtrar por título o encontrar retazos de texto, todo sincronizado con base de datos.
- **Herramienta de Diagnóstico (Sandbox)**: Incluye un probador de red completamente aislado (`/chat-test.html`) para depurar tus APIS directamente en el ecosistema Frontend.

## Stack Tecnológico Modernizado

- **Frontend**: HTML5 Puro, Tailwind CSS (CDN ligero), Alpine.js (para la reactividad de componentes y Modales VDOM), y Axios para las peticiones persistentes. 
- **Backend**: Servidor asíncrono sobre Node.js y Express.js.
- **Servicios de IA Integrados**: Paquete oficial **`openai`** de NPM, el popular SDK estándar de IA está inyectado e interceptado internamente hacia los nodos de OpenRouter sin vulnerar la sintaxis ni estabilidad pura.
- **Base de Datos**: Ecosistema MySQL gestionado inteligentemente mediante el ORM Sequelize.

## Requisitos Previos

- **Node.js**: Versión estable recomendada (v18+).
- **MySQL**: Servidor local o remoto configurado y corriendo (ej: XAMPP, WAMP, nativo, Docker).

## Instalación y Configuración

1. **Abre una terminal** en la raíz de este proyecto.
2. **Instalar dependencias clave**:
   Asegúrate de ejecutar esta línea para arrancar e instalar todo el arnés tecnológico de módulos:
   ```bash
   npm init -y
   npm install express sequelize mysql2 cors dotenv openai axios
   ```
3. **Seguridad Descentralizada (Ajustes de IA)**:
   - ¡Cero complicaciones escribiendo archivos `.env` complicados del lado del servidor para conectarnos a OpenRouter!
   - La API Key y el texto del Modelo (ej. `google/gemini-flash-1.5`) que rutean el cerebro de la aplicación son guardados segura y permanentemente en tu computadora (vía LocalStorage local del navegador). 
   - Si deseas cambiar de modelo a medio dictado, haz clic en el Ícono de Engranaje (Ajustes) en la interfaz principal del Dashboard en cualquier momento.
   
4. **Configuración de la Base de Datos**:
   - Accede a tu entorno de consultas MySQL (ej. PhpMyAdmin, DBeaver, MySQL CLI).
   - Crea una base de datos virgen con el nombre: `meeting_minutes_db`.
   - Modifica el archivo ruta `config/database.js` para que coincida con tus contraseñas y usuario local (generalmente usuario `root` y Password vacío).

## Modo de Ejecución

1. Inicia el servidor backend y escucha el puerto mediante Node:
   ```bash
   node server.js
   ```
2. La arquitectura sincronizará automáticamente y construirá las Tablas si es tu primera vez ejecutándolo.
3. Abre tu navegador oficial moderno (Google Chrome o navegadores Chromium sugeridos).
4. Levanta el proyecto e ingresa a tu Dashboard general de Reuniones:
   [http://localhost:3000](http://localhost:3000)
5. Para testear credenciales directamente con un Robot puro, elude el backend entrando al Sandbox:
   [http://localhost:3000/chat-test.html](http://localhost:3000/chat-test.html)
