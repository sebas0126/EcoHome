import { useState, useEffect } from 'react';

const Catalog = ({ token, onProductCreated }) => {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  }, [token, refreshTrigger]);

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
        onProductCreated();
        setNewProductName('');
        setNewProductPrice('');

        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error creando producto:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await fetch(`http://localhost:3000/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 200) {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error eliminando producto:", error);
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
          <li key={p.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
            <div>
              <strong>{p.name}</strong> - ${p.price}
              <br />
              <small style={{ color: 'gray' }}>Creado por: {p.creator_name}</small>
            </div>
            <button
              style={{ marginLeft: 'auto', backgroundColor: '#dc3545', padding: '8px 16px', borderRadius: '4px', color: 'white', border: 'none', cursor: 'pointer' }}
              onClick={() => handleDeleteProduct(p.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catalog;