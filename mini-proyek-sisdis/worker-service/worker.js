const express = require('express');
const amqp = require('amqplib');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const NODE_ID = parseInt(process.env.NODE_ID) || 1;
const PORT = parseInt(process.env.PORT) || 4001;
const LEFT_NEIGHBOR = process.env.LEFT_NEIGHBOR;
const RIGHT_NEIGHBOR = process.env.RIGHT_NEIGHBOR;

let isLeader = false;
let currentLeaderId = null;
let isParticipant = false;

// Koneksi ke Database PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'ticket_postgres',
  user: 'amik_user',
  password: 'superpassword',
  database: 'helpdesk_db',
  port: 5432,
});

app.post('/election', async (req, res) => {
  const { direction, originId, leaderId, phase, hopCount } = req.body;

  if (leaderId) {
    if (currentLeaderId === leaderId) return res.sendStatus(200);
    currentLeaderId = leaderId;
    isLeader = (leaderId === NODE_ID);
    console.log(`[Node ${NODE_ID}] Pemilu selesai! Leader sah: Node ${leaderId}`);
    
    if (isLeader) {
      startConsumingTickets(); 
    }
    
    forwardElection(direction, req.body);
    return res.sendStatus(200);
  }

  if (originId === NODE_ID) {
    console.log(`[Node ${NODE_ID}] Sukses melewati fase ${phase}!`);
    startNextPhase(phase + 1);
  } else if (originId > NODE_ID) {
    isParticipant = true;
    if (hopCount > 1) {
      forwardElection(direction, { ...req.body, hopCount: hopCount - 1 });
    } else if (hopCount === 1) {
      let reverseDir = (direction === 'left') ? 'right' : 'left';
      forwardElection(reverseDir, { ...req.body, direction: reverseDir, hopCount: 0 });
    }
  } else {
    if (hopCount === 0) {
      forwardElection(direction, req.body);
    }
  }
  res.sendStatus(200);
});

async function forwardElection(direction, data) {
  const targetUrl = (direction === 'left') ? LEFT_NEIGHBOR : RIGHT_NEIGHBOR;
  if (!targetUrl) return;
  try {
    await fetch(`${targetUrl}/election`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) {}
}

async function startNextPhase(k) {
  isParticipant = true;
  const hops = Math.pow(2, k);
  console.log(`[Node ${NODE_ID}] Memulai Hirschberg-Sinclair Fase ${k} (Jarak Hop: ${hops})`);
  
  // Tarik jumlah total node dari env, kalau gak ada default ke 6.
  const TOTAL_NODES = process.env.TOTAL_NODES ? parseInt(process.env.TOTAL_NODES) : 6;

  // Rumus HS asli: Jika jarak lompatan sudah meliputi ring (>= TOTAL_NODES), deklarasikan kemenangan!
  if (hops >= TOTAL_NODES) { 
    console.log(`[🚀 Node ${NODE_ID}] MENANG PEMILU MUTLAK! Menyebarkan proklamasi ke ring...`);
    currentLeaderId = NODE_ID;
    isLeader = true;
    startConsumingTickets(); // Kunci utama biar dia mulai dengerin RabbitMQ
    forwardElection('left', { direction: 'left', leaderId: NODE_ID });
    return;
  }

  forwardElection('left', { direction: 'left', originId: NODE_ID, phase: k, hopCount: hops });
  forwardElection('right', { direction: 'right', originId: NODE_ID, phase: k, hopCount: hops });
}

// Mulai pemilu agak telat biar container lain napas dulu
setTimeout(() => {
  if (!currentLeaderId && !isParticipant) {
    console.log(`[Node ${NODE_ID}] Memulai algoritma Hirschberg-Sinclair...`);
    startNextPhase(0);
  }
}, 7000);

// 🔥 FUNGSI CONSUME UTAMA DENGAN LOOPING RETRY ANTI REWEL 🔥
async function startConsumingTickets() {
  const rabbitHost = process.env.RABBITMQ_HOST || 'ticket_rabbitmq';
  
  console.log(`[🔌 KONEKSI AMQP] Node ${NODE_ID} mencoba mengetuk pintu RabbitMQ...`);
  
  try {
    const connection = await amqp.connect(`amqp://${rabbitHost}`);
    const channel = await connection.createChannel();
    const queueName = 'ticket_queue';

    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1);

    console.log(`[🔥 WORKER LIVE] Node ${NODE_ID} (Leader) SUKSES Konek RabbitMQ! Menunggu tiket...`);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const ticket = JSON.parse(msg.content.toString());
        const ticketId = parseInt(ticket.id, 10);
        
        console.log(`[📥 WORKER LEADER] Menangani Tiket ID #${ticketId}: "${ticket.title}"`);
        
        // Simulasi pengerjaan helpdesk selama 2 detik
        setTimeout(async () => {
          try {
            await pool.query("UPDATE tickets SET status = 'SUCCESS' WHERE id = $1", [ticketId]);
            console.log(`[✅ DB UPDATED] Status Tiket ID #${ticketId} berhasil diubah jadi SUCCESS!`);
            channel.ack(msg);
          } catch (dbErr) {
            console.error("Worker gagal update DB:", dbErr.message);
          }
        }, 2000);
      }
    });

    // Handle kalau tiba-tiba RabbitMQ crash di tengah jalan
    connection.on('error', () => setTimeout(startConsumingTickets, 5000));
    connection.on('close', () => setTimeout(startConsumingTickets, 5000));

  } catch (error) {
    console.log(`[⚠️ RABBITMQ DOWN] Belum ready. Node ${NODE_ID} mencoba konek ulang dalam 4 detik...`);
    setTimeout(startConsumingTickets, 4000); // Ngulang terus sampai dapet koneksi!
  }
}

app.listen(PORT);