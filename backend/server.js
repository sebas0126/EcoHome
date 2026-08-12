require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

io.on('connection', (socket) => {
  console.log(`Nuevo usuario conectado: ${socket.id}`);

  socket.on('new-message', (data) => {
    console.log(`Mensaje recibido de ${socket.id}:`, data);

    userData = {
      userId: socket.id,
      text: data.text,
      timestamp: new Date().toISOString()
    };

    io.emit('new-message', userData);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});