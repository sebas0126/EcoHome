const { pool } = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

const createProduct = async (req, res) => {
  const { name, price } = req.body;

  const parsedPrice = parseFloat(price);
  if (!name || isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ error: 'El nombre es requerido y el precio debe ser un número mayor a 0' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
      [name, parsedPrice]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error interno al crear el producto' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const parsedPrice = parseFloat(price);
  if (!name || isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ error: 'El nombre es requerido y el precio debe ser un número mayor a 0' });
  }

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, parsedPrice, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente', product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};