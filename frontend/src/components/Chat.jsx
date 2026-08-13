import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function Chat({ token, setToken }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      auth: { token }
    });

    socketRef.current.on('chat-history', (history) => {
      setMessages(history);
    });

    socketRef.current.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('connect_error', (err) => {
      alert(`Error de conexión: ${err.message}`);
      handleLogout();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      socketRef.current.emit('new-message', { text: input });
      setInput('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Chat Interno</h3>
        <button onClick={handleLogout} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none' }}>Salir</button>
      </div>

      <div style={{
        border: '1px solid #ccc', height: '400px', overflowY: 'auto',
        padding: '15px', marginBottom: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px'
      }}>
        {messages.length === 0 ? <p style={{ color: '#888' }}>No hay mensajes en el historial...</p> : null}

        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <strong style={{ color: '#2196F3' }}>User {msg.user_id}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px' }}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default Chat;