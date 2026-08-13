require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { verifySocketToken } = require('./middlewares/socketAuthMiddleware');

const chatSocket = require('./sockets/chatSocket');

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

io.use(verifySocketToken);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

chatSocket(io);

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});