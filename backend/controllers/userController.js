const { pool } = require('../config/db');

const getUserStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.name, COUNT(p.id) as total_products 
      FROM users u 
      LEFT JOIN products p ON u.id = p.created_by 
      WHERE u.id = $1 
      GROUP BY u.id
    `, [req.user.id]); // Utiliza el ID extraído por tu middleware

    res.status(200).json({
      name: result.rows[0].name,
      count: parseInt(result.rows[0].total_products) // COUNT devuelve un string en pg, lo parseamos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserStats
};