document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Notify user joined
    socket.on('user joined', data => {
        addMessageToDOM(data.message, 'notification');
    });

    // Notify when user is disconnected
    socket.on('user disconnected',data=>{
        addMessageToDOM(data.message,'notification');
    });
    
    // Handle incoming messages
    socket.on('chat message', data => {
        addMessageToDOM(data.message, 'other-message', data.color);
    });

    // Send message
    const sendMessage = () => {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        if (message !== '') {
            socket.emit('chat message', message);
            messageInput.value = '';
        }
    };

    // Add message to DOM
    const addMessageToDOM = (message, className, color) => {
        const messages = document.getElementById('messages');
        const li = document.createElement('li');
        li.textContent = message;
        li.classList.add(className);
        li.style.backgroundColor = color;
        messages.appendChild(li);
        messages.scrollTop = messages.scrollHeight;
    };

    // Send message on button click
    document.getElementById('sendButton').addEventListener('click', sendMessage);

    // Send message on Enter key press
    document.getElementById('messageInput').addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
