import { useState, useEffect } from 'react'
import { Login, Chat, Catalog } from './components'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentView, setCurrentView] = useState('catalog');

  const [userName, setUserName] = useState('Cargando...');
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await fetch('http://localhost:3000/users/me/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserName(data.name);
          setProductCount(data.count);
        }
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };

    if (token) {
      fetchUserStats();
    }
  }, [token]);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div>
      <nav style={styles.navbar}>
        <div>
          <button
            style={currentView === 'catalog' ? styles.activeBtn : styles.btn}
            onClick={() => setCurrentView('catalog')}
          >
            Catálogo
          </button>
          <button
            style={currentView === 'chat' ? styles.activeBtn : styles.btn}
            onClick={() => setCurrentView('chat')}
          >
            Chat
          </button>
        </div>

        <div style={styles.userInfo}>
          {userName} ({productCount})
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </nav>

      <main style={{ padding: '20px' }}>
        {currentView === 'catalog' && (
          <Catalog
            token={token}
            onProductCreated={() => setProductCount(prev => prev + 1)}
          />
        )}
        {currentView === 'chat' && <Chat token={token} />}
      </main>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white'
  },
  userInfo: {
    fontWeight: 'bold',
    color: '#4CAF50', // Un verde estilo EcoHome para resaltar
    fontSize: '18px'
  },
  btn: {
    marginRight: '10px',
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    borderRadius: '4px'
  },
  activeBtn: {
    marginRight: '10px',
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid white',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  logoutBtn: {
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  }
}

export default App