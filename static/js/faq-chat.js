// FAQ Chat Functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('faq-chat-messages');
    const chatInput = document.getElementById('faq-chat-input');
    const chatSendBtn = document.querySelector('.faq-chat-send-button');
    const typingIndicator = document.getElementById('faq-typing-indicator');

    // Validar que todos los elementos necesarios existan
    if (!chatMessages || !chatInput || !chatSendBtn || !typingIndicator) {
        console.error('FAQ Chat: No se encontraron todos los elementos necesarios', {
            chatMessages: !!chatMessages,
            chatInput: !!chatInput,
            chatSendBtn: !!chatSendBtn,
            typingIndicator: !!typingIndicator
        });
        return;
    }

    // Generate unique session ID (formato exacto como en React)
    let sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Add welcome message on load
    addWelcomeMessage();

    function addWelcomeMessage() {
        const welcomeMessage = {
            role: 'assistant',
            content: "¡Hola! 👋 Soy tu asistente de inversiones de trii. Estoy aquí para ayudarte con cualquier pregunta sobre nuestros productos, procesos de inversión, regulaciones y más. ¿En qué puedo ayudarte hoy?"
        };
        addMessageToChat(welcomeMessage);
    }

    // Send message function (lógica exacta como React)
    async function handleSubmit(e) {
        if (e) e.preventDefault();

        const input = chatInput.value.trim();
        if (!input) return;

        // 1. Agregar mensaje del usuario al UI
        const userMessage = { role: 'user', content: input };
        addMessageToChat(userMessage);
        chatInput.value = '';
        setIsTyping(true);

        try {
            // 2. Enviar al webhook (URL exacta)
            const response = await fetch('https://trii-growth.app.n8n.cloud/webhook/d7ec1b6f-1baf-48a2-a4b7-809b881d5640', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: input,
                    sessionId: sessionId
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 3. Leer respuesta
            const data = await response.json();

            // Soporta formatos:
            // - { output: "..." }
            // - [{ output: "..." }]
            const output =
                (Array.isArray(data) && data[0] && data[0].output) ||
                (data && data.output);

            if (!output) {
                throw new Error('Respuesta inválida del servidor');
            }

            const botMessage = { role: 'assistant', content: output };

            // 4. Agregar respuesta del bot al UI
            addMessageToChat(botMessage);
        } catch (error) {
            console.error('FAQ Chat Error:', error);
            // Mensaje de error
            const errorMessage = {
                role: 'assistant',
                content: 'Lo siento, hubo un problema al procesar tu mensaje. Por favor, intenta nuevamente.'
            };
            addMessageToChat(errorMessage);
        } finally {
            setIsTyping(false);
        }
    }

    // Add message to chat (estructura exacta como React)
    function addMessageToChat(message) {
        const isBot = message.role === 'assistant';

        const messageDiv = document.createElement('div');
        messageDiv.className = `faq-chat-message ${isBot ? 'faq-chat-message-assistant' : 'faq-chat-message-user'}`;

        const messageContent = document.createElement('div');
        messageContent.className = `faq-chat-message-content ${isBot ? '' : 'faq-chat-message-content-user'}`;

        const avatar = document.createElement('div');
        avatar.className = `faq-chat-message-avatar ${isBot ? 'faq-chat-message-avatar-assistant' : 'faq-chat-message-avatar-user'}`;
        avatar.innerHTML = isBot ? getBotIcon() : getUserIcon();

        const bubble = document.createElement('div');
        bubble.className = `faq-chat-bubble ${isBot ? 'faq-chat-bubble-assistant' : 'faq-chat-bubble-user'}`;

        const text = document.createElement('p');
        text.className = 'faq-chat-bubble-text';
        text.textContent = message.content;

        bubble.appendChild(text);
        messageContent.appendChild(avatar);
        messageContent.appendChild(bubble);
        messageDiv.appendChild(messageContent);

        // Insertar antes del typing indicator
        chatMessages.insertBefore(messageDiv, typingIndicator);

        // Auto scroll
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Typing indicator functions
    function setIsTyping(typing) {
        if (typing) {
            typingIndicator.style.display = 'flex';
        } else {
            typingIndicator.style.display = 'none';
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get bot icon (Font Awesome)
    function getBotIcon() {
        return '<i class="fas fa-robot"></i>';
    }

    // Get user icon (Font Awesome)
    function getUserIcon() {
        return '<i class="fas fa-user"></i>';
    }

    // Event listeners
    const chatForm = document.getElementById('faq-chat-form');

    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSubmit(e);
        });
    } else {
        console.error('FAQ Chat: No se encontró el formulario');
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSubmit(e);
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        });
    }

    console.log('FAQ Chat: Inicializado correctamente');
});
