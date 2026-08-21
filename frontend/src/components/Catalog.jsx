import { useState, useEffect } from 'react';

const Catalog = ({ token, onProductCreated }) => {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  // NUEVO: Estado "gatillo" para recargar la lista
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Todo el fetch queda aislado adentro. 
  // React ejecutará esto al cargar por primera vez O cuando cambie refreshTrigger
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error cargando catálogo:", error);
      }
    };

    if (token) {
      fetchProducts();
    }
  }, [token, refreshTrigger]); // Dependencias totalmente nativas y limpias

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProductName,
          price: parseFloat(newProductPrice)
        })
      });

      if (res.status === 201) {
        onProductCreated(); // Sube el contador en la barra superior de App.jsx
        setNewProductName('');
        setNewProductPrice('');

        // Simplemente "disparamos" el gatillo. 
        // Esto le avisa al useEffect que debe volver a hacer la petición.
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error creando producto:", error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>Crear Nuevo Producto</h3>
        <form onSubmit={handleCreateProduct}>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            required
            style={{ marginRight: '10px' }}
          />
          <input
            type="number"
            placeholder="Precio"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
            required
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Guardar Producto</button>
        </form>
      </div>

      <h3>Listado del Sistema</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map(p => (
          <li key={p.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>{p.name}</strong> - ${p.price}
            <br />
            <small style={{ color: 'gray' }}>Creado por: {p.creator_name}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catalog;