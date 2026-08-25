-- Tabla de Usuarios (users)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'cliente',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos (products)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE
  SET
    NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Mensajes (messages)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba ------CAMBIAR LOS HASH GENERICOS POR HASH REALES USANDO BCRYPT------
TRUNCATE TABLE messages,
products,
users RESTART IDENTITY CASCADE;

INSERT INTO
  users (name, email, password_hash, role)
VALUES
  (
    'Arturo Administrador',
    'admin@ecohome.com',
    -- CAMBIAR POR HASH REAL USANDO BCRYPT
    'hash_generico_123',
    'admin'
  ),
  (
    'Carlos Operario',
    'carlos@ecohome.com',
    -- CAMBIAR POR HASH REAL USANDO BCRYPT
    'hash_generico_123',
    'operario'
  ),
  (
    'María Logística',
    'maria@ecohome.com',
    -- CAMBIAR POR HASH REAL USANDO BCRYPT
    'hash_generico_123',
    'operario'
  );

INSERT INTO
  products (name, price, created_by)
VALUES
  ('Refrigerador Inverter Eco', 1250.00, 1),
  ('Estufa de Inducción Inteligente', 850.50, 1),
  ('Panel Solar Portátil 100W', 420.00, 2),
  ('Focos LED Inteligentes (Pack 4)', 45.99, 2),
  ('Purificador de Agua de Ósmosis', 210.00, 3),
  ('Termostato Inteligente WiFi', 130.00, 3);

INSERT INTO
  messages (sender_id, content)
VALUES
  (
    1,
    'Hola equipo, ¿cómo va la actualización del inventario para la campaña de este mes?'
  ),
  (
    2,
    'Hola Arturo, acabo de agregar los paneles solares portátiles y los focos LED.'
  ),
  (
    3,
    'Yo registré los purificadores de agua y los termostatos. Todo en orden en bodega central.'
  ),
  (
    1,
    'Excelente trabajo, gracias a ambos. Recuerden verificar que los precios coincidan con el sistema contable.'
  );