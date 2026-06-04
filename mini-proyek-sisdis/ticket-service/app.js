const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const amqp = require('amqplib');

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke Database PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'ticket_postgres',
  user: 'amik_user',
  password: 'superpassword',
  database: 'helpdesk_db',
  port: 5432,
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        username VARCHAR(100),
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database & Tabel Tiket aman/berhasil di-init!");
  } catch (error) {
    console.error("Gagal inisialisasi database:", error);
  }
};
initDb();

// Fungsi Kirim ke RabbitMQ
async function publishToQueue(ticketData) {
  try {
    const rabbitHost = process.env.RABBITMQ_HOST || 'ticket_rabbitmq';
    const connection = await amqp.connect(`amqp://${rabbitHost}`);
    const channel = await connection.createChannel();
    const queueName = 'ticket_queue';

    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(ticketData)), {
      persistent: true,
    });

    setTimeout(() => connection.close(), 500);
  } catch (error) {
    console.error("Gagal kirim ke RabbitMQ:", error);
  }
}

// Endpoint GET /api/tickets (Dashboard)
app.get('/api/tickets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC');
    return res.status(200).json({ tickets: result.rows });
  } catch (error) {
    return res.status(500).json({ error: 'Gagal mengambil daftar tiket!' });
  }
});

// Endpoint POST /api/tickets (Kirim Tiket)
app.post('/api/tickets', async (req, res) => { 
  const { title, description, username } = req.body;
  if (!title || !description || !username) {
    return res.status(400).json({ error: "Data gak lengkap, bro!" });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tickets (title, description, username, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, username, 'PENDING']
    );
    const newTicket = result.rows[0];

    // Mapping strict ID ke RabbitMQ
    await publishToQueue({
      id: Number(newTicket.id),
      title: newTicket.title,
      description: newTicket.description,
      username: newTicket.username,
      status: newTicket.status
    });

    return res.status(201).json({ message: "Tiket berhasil masuk antrean!", ticket: newTicket });
  } catch (error) {
    return res.status(500).json({ error: "Waduh, server error!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Ticket Service jalan di port ${PORT}`));