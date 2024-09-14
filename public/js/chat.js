// public/js/chat.js
document.getElementById('createGroupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;

    const token = localStorage.getItem('token');
    const response = await fetch('/api/groups/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name }),
    });

    if (response.ok) {
        alert('Group created successfully!');
    } else {
        alert('Error creating group');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const messageInput = document.getElementById('messageInput');
    const chatBox = document.getElementById('chatBox');
    const sendBtn = document.getElementById('sendBtn');

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
    }

    socket.on('connect', () => {
        console.log('Connected to the server');
        socket.emit('joinGroup', 'defaultGroup');  // فرض کنید یک گروه پیش‌فرض وجود دارد
    });

    socket.on('message', (message) => {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);
    });

    sendBtn.addEventListener('click', () => {
        const message = messageInput.value;
        if (message.trim()) {
            socket.emit('message', { groupId: 'defaultGroup', message });
            messageInput.value = '';
        }
    });
});