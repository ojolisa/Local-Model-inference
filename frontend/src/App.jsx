import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

function MarkdownMessage({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              className={className}
              style={{
                backgroundColor: "#f1f3f4",
                padding: "2px 4px",
                borderRadius: "3px",
                fontSize: "0.9em",
              }}
              {...props}
            >
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                margin: "10px 0",
              }}
            >
              {children}
            </table>
          );
        },
        th({ children }) {
          return (
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#f2f2f2",
                textAlign: "left",
              }}
            >
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
              }}
            >
              {children}
            </td>
          );
        },
        blockquote({ children }) {
          return (
            <blockquote
              style={{
                borderLeft: "4px solid #ddd",
                margin: "10px 0",
                paddingLeft: "15px",
                color: "#666",
              }}
            >
              {children}
            </blockquote>
          );
        },
        h1({ children }) {
          return (
            <h1
              style={{
                color: "#333",
                borderBottom: "2px solid #eee",
                paddingBottom: "5px",
              }}
            >
              {children}
            </h1>
          );
        },
        h2({ children }) {
          return (
            <h2
              style={{
                color: "#333",
                borderBottom: "1px solid #eee",
                paddingBottom: "3px",
              }}
            >
              {children}
            </h2>
          );
        },
        h3({ children }) {
          return <h3 style={{ color: "#333" }}>{children}</h3>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function ThinkingDropdown({ thinking }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinking) return null;

  return (
    <div style={{ marginTop: 8, marginBottom: 8 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: 4,
          padding: "4px 8px",
          fontSize: "0.85em",
          cursor: "pointer",
          color: "#6c757d",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span>{isOpen ? "▼" : "▶"}</span>
        💭 Show thinking process
      </button>
      {isOpen && (
        <div
          style={{
            marginTop: 4,
            padding: 12,
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: 4,
            fontSize: "0.9em",
            color: "#495057",
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          <MarkdownMessage content={thinking} />
        </div>
      )}
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [modelLoading, setModelLoading] = useState(true);

  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/models");
        const data = await res.json();
        if (data.models && data.models.length > 0) {
          setModels(data.models);

          if (!savedModel) {
            setSelectedModel(data.models[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
      } finally {
        setModelLoading(false);
      }
    };

    fetchModels();
  }, []);

  const clearChat = () => {
    if (messages.length > 0) {
      const confirmClear = window.confirm(
        "Are you sure you want to clear the entire chat history? This cannot be undone."
      );
      if (confirmClear) {
        setMessages([]);
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedModel) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.message.content,
          thinking: data.message.thinking,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>🧠 Ollama Chat</h2>
        <span
          style={{
            fontSize: "0.8em",
            color: "#666",
            backgroundColor: "#fff3cd",
            padding: "2px 6px",
            borderRadius: 3,
            border: "1px solid #ffeaa7",
          }}
        >
          ⚠️ Not saved
        </span>
      </div>

      {/* Model Selection */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10, fontWeight: "bold" }}>Model:</label>
        {modelLoading ? (
          <span>Loading models...</span>
        ) : models.length > 0 ? (
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              padding: 5,
              marginRight: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          >
            {models.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
        ) : (
          <span style={{ color: "red" }}>No models available</span>
        )}
        {selectedModel && (
          <span style={{ fontSize: "0.9em", color: "#666" }}>
            Selected: {selectedModel}
          </span>
        )}
        <button
          onClick={clearChat}
          disabled={messages.length === 0}
          style={{
            marginLeft: 15,
            padding: "6px 12px",
            borderRadius: 4,
            border: "1px solid #dc3545",
            backgroundColor: messages.length === 0 ? "#f8f9fa" : "#dc3545",
            color: messages.length === 0 ? "#6c757d" : "white",
            cursor: messages.length === 0 ? "not-allowed" : "pointer",
            fontSize: "0.9em",
          }}
        >
          🗑️ Clear Chat
        </button>
      </div>

      {/* Chat Messages */}
      <div
        style={{
          marginBottom: 10,
          minHeight: 200,
          border: "1px solid #eee",
          padding: 10,
          borderRadius: 4,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 15 }}>
            <div>
              <b style={{ color: msg.role === "user" ? "#007acc" : "#28a745" }}>
                {msg.role === "user" ? "You" : "AI"}:
              </b>
              <div style={{ marginTop: 5 }}>
                {msg.role === "assistant" ? (
                  <MarkdownMessage content={msg.content} />
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            </div>
            {msg.role === "assistant" && msg.thinking && (
              <ThinkingDropdown thinking={msg.thinking} />
            )}
          </div>
        ))}
        {loading && (
          <div style={{ fontStyle: "italic", color: "#666" }}>
            AI is thinking...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            width: "70%",
            marginRight: 10,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          placeholder="Type your message..."
          disabled={loading || !selectedModel}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !selectedModel || !input.trim()}
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: "none",
            backgroundColor: loading || !selectedModel ? "#ccc" : "#007acc",
            color: "white",
            cursor: loading || !selectedModel ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
