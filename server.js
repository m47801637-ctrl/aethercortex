const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 2. Point root route to 'public/index.html'
app.get('/', (req, res) => {
    const indexPath = path.resolve(__dirname, 'public', 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('index.html not found in public directory');
    }
});

// API Endpoint
app.post('/api/chat', async (req, res) => {
    const { apiKey, model, messages } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'NVIDIA API Key is required.' });
    }

    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || 'deepseek-ai/deepseek-r1',
                messages: messages,
                temperature: 0.6,
                max_tokens: 4096,
                stream: true
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).send(errorText);
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = response.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
        }
        res.end();

    } catch (err) {
        console.error('Backend Error:', err);
        res.status(500).json({ error: 'Server Connection Failed: ' + err.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
});

async function sendMessage() {
    const apiKey = document.getElementById('api-key').value.trim();

    if (!apiKey) return alert('Enter your NVIDIA API Key in sidebar settings!');

    const inputField = document.getElementById('user-input');
    const prompt = inputField.value.trim();
    if (!prompt) return;

    const chat = chats.find(c => c.id === currentChatId);
    if (chat.messages.length === 0) {
        chat.title = prompt.substring(0, 20) + '...';
        renderChatList();
    }

    // 1. User message DOM me add karein
    chat.messages.push({ role: 'user', content: prompt });
    appendMessageDOM('user', prompt);
    inputField.value = '';

    // 2. Bot message placeholder banayein aur usme "Thinking..." loader dikhayein
    const botContentDOM = appendMessageDOM('assistant', '');
    botContentDOM.innerHTML = `
        <div class="thinking-loader" style="display: flex; align-items: center; gap: 10px; color: var(--text-sub); font-style: italic;">
            <i class="fa-solid fa-spinner spinner" style="animation: spin 1s linear infinite; color: var(--cyan-glow);"></i>
            <span>AI is thinking & generating response...</span>
        </div>
    `;

    document.getElementById('send-btn').disabled = true;
    const targetModel = document.getElementById('model-select').value;

    try {
        // Backend API request
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: apiKey,
                model: targetModel,
                messages: chat.messages
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Server Response ${response.status}: ${err}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let rawStreamText = "";
        let isFirstToken = true;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.replace('data: ', '').trim();
                    if (dataStr === '[DONE]') break;
                    try {
                        const parsed = JSON.parse(dataStr);
                        const token = parsed.choices[0]?.delta?.content || '';
                        
                        if (token) {
                            // Pehla token aate hi "Thinking..." loader ko hata kar clean kar do
                            if (isFirstToken) {
                                botContentDOM.innerHTML = '';
                                isFirstToken = false;
                            }
                            
                            rawStreamText += token;
                            updateMessageContent(botContentDOM, rawStreamText);
                        }
                    } catch (e) {}
                }
            }
        }

        chat.messages.push({ role: 'assistant', content: rawStreamText });
        saveChats();

    } catch (err) {
        botContentDOM.innerHTML = `
            <div style="color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);">
                <strong>Connection Error:</strong> ${err.message}<br><br>
                <em>Ensure your Node server is running on <code>http://localhost:3000</code>!</em>
            </div>
        `;
    } finally {
        document.getElementById('send-btn').disabled = false;
    }
}