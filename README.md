# Local Model Inference

A full-stack application for running AI model inference locally using Ollama. This project provides a clean, modern web interface for chatting with locally hosted AI models.

## Features

- 🤖 **Local AI Model Inference** - Run AI models locally using Ollama
- 💬 **Chat Interface** - Clean, modern chat UI with markdown support
- 🔄 **Model Selection** - Browse and switch between available local models
- 📝 **Markdown Rendering** - Full markdown support with syntax highlighting
- 🎨 **Modern UI** - Built with React and styled for a great user experience
- 🚀 **Fast Performance** - Direct communication with local models

## Architecture

```
Local-Model-Inference/
├── backend/          # Express.js API server
├── frontend/         # React.js web application
└── README.md         # This file
```

### Backend
- **Express.js** server acting as a proxy to Ollama
- **CORS enabled** for frontend communication
- **RESTful API** for model management and chat functionality

### Frontend
- **React 19** with modern hooks
- **Vite** for fast development and building
- **React Markdown** with syntax highlighting
- **ESLint** for code quality

## Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v18 or higher)
2. **Ollama** installed and running locally
   - Download from [ollama.ai](https://ollama.ai)
   - Install at least one model (e.g., `ollama pull llama3.1`)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Local-Model-inference-main
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Start Ollama (Required)
Make sure Ollama is running on your system:
```bash
ollama serve
```

### Start the Backend Server
```bash
cd backend
npm start
```
The API server will run on `http://localhost:3001`

### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The web application will be available at `http://localhost:5173`

## API Endpoints

### GET `/api/models`
Fetches available models from Ollama
- **Response**: List of available models with metadata

### POST `/api/chat`
Sends chat messages to the selected model
- **Body**: `{ messages: [], model: "model-name" }`
- **Response**: Model response with optional thinking process

## Usage

1. **Start Ollama** and ensure you have models installed
2. **Run both servers** (backend and frontend)
3. **Open your browser** to `http://localhost:5173`
4. **Select a model** from the dropdown (if multiple models available)
5. **Start chatting** with your local AI model!

## Development

### Frontend Development
```bash
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run ESLint
npm run preview # Preview production build
```

### Backend Development
```bash
cd backend
npm start       # Start the server
```

## Configuration

### Default Model
The backend defaults to using `llama3.1` if no model is specified. You can modify this in `backend/server.js`.

### Port Configuration
- Backend: `3001`
- Frontend: `5173` (Vite default)

To change ports, update the configuration in:
- Backend: `server.js`
- Frontend: `vite.config.js`

## Troubleshooting

### Ollama Connection Issues
- Ensure Ollama is running: `ollama serve`
- Check if Ollama is accessible: `curl http://localhost:11434/api/tags`
- Verify you have models installed: `ollama list`

### Port Conflicts
- Change backend port in `server.js`
- Update frontend API calls to match new backend port

### Model Not Found
- Install models: `ollama pull <model-name>`
- Check available models: `ollama list`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License

## Technologies Used

### Backend
- Express.js
- CORS
- Body Parser
- Node Fetch

### Frontend
- React 19
- Vite
- React Markdown
- React Syntax Highlighter
- Remark GFM
- ESLint

---

**Note**: This application requires Ollama to be installed and running locally. Make sure you have sufficient system resources for running AI models locally.
