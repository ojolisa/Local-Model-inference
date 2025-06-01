import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/api/models', async (req, res) => {
    try {
        const ollamaRes = await fetch('http://localhost:11434/api/tags');
        
        if (!ollamaRes.ok) {
            throw new Error(`Ollama API responded with status ${ollamaRes.status}`);
        }

        const data = await ollamaRes.json();
        const models = data.models?.map(model => ({
            name: model.name,
            size: model.size,
            modified_at: model.modified_at
        })) || [];
        
        res.json({ models });
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ error: 'Failed to fetch models from Ollama' });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        // Build conversation context for Ollama
        const { messages, model = 'llama3.1' } = req.body;
        
        // Convert conversation history to a single prompt with context
        let conversationPrompt = '';
        
        // Add system message if this is the first message
        if (messages.length === 1) {
            conversationPrompt += 'You are a helpful AI assistant. Please provide accurate and helpful responses.\n\n';
        }
        
        // Build the conversation history
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            if (msg.role === 'user') {
                conversationPrompt += `Human: ${msg.content}\n\n`;
            } else if (msg.role === 'assistant') {
                conversationPrompt += `Assistant: ${msg.content}\n\n`;
            }
        }
        
        // Add a final prompt for the assistant to respond
        if (messages[messages.length - 1]?.role === 'user') {
            conversationPrompt += 'Assistant: ';
        }
        
        const ollamaRes = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: conversationPrompt,
                stream: false
            }),
        })

        if (!ollamaRes.ok) {
            throw new Error(`Ollama API responded with status ${ollamaRes.status}`);
        }        const data = await ollamaRes.json();
        const response = data.response || 'No response from model';
        
        // Parse thinking content if present
        const thinkMatch = response.match(/<think>([\s\S]*?)<\/think>/);
        const thinking = thinkMatch ? thinkMatch[1].trim() : null;
        const content = response.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        
        res.json({ 
            message: { 
                content: content || response,
                thinking: thinking
            } 
        });
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ error: 'Failed to reach Ollama' })
    }
})

app.listen(3001, () => console.log('🚀 Proxy running at http://localhost:3001'))
