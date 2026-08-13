import { useState } from 'react';

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
      // eslint-disable-next-line no-unused-vars
    } catch (_err) {
      setError('Error conectando con el backend');
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>EcoHome modulo interno</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email" placeholder="Correo" required
          value={email} onChange={e => setEmail(e.target.value)}
          style={{ padding: '10px' }}
        />
        <input
          type="password" placeholder="Contraseña" required
          value={password} onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          Entrar al Chat
        </button>
      </form>
    </div>
  );
}

export default Login;