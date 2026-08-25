const { pool } = require('../config/db');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log(`Usuario autenticado conectado | BD DATA: ${socket.user.id} | Socket: ${socket.id}`);

    try {
      const historyResult = await pool.query(`
                SELECT * FROM (
                    SELECT id, user_id, text, created_at 
                    FROM messages 
                    ORDER BY created_at DESC 
                    LIMIT 10
                ) sub 
                ORDER BY created_at ASC;
            `);

      socket.emit('chat-history', historyResult.rows);
      console.log(`Historial cargado: ${historyResult.rows.length} mensajes`);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }

    socket.on('new-message', async (data) => {
      try {
        const result = await pool.query(
          'INSERT INTO messages (user_id, text) VALUES ($1, $2) RETURNING id, user_id, text, created_at',
          [socket.user.id, data.text]
        );

        const savedMessage = result.rows[0];
        console.log(`Mensaje guardado en BD con ID: ${savedMessage.id}`);

        io.emit('new-message', savedMessage);
        console.log(`Mensaje emitido por ${socket.user.id}: ${savedMessage.text}`);

      } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        socket.emit('chat-error', { error: 'No se pudo guardar el mensaje' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.user.id}`);
    });
  });
};