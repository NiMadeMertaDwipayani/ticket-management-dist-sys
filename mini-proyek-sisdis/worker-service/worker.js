const express = require('express');
const amqp = require('amqplib');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// ==========================================
// KONFIGURASI NODE
// ==========================================
const NODE_ID        = parseInt(process.env.NODE_ID) || 1;
const PORT           = parseInt(process.env.PORT)    || 4001;
const LEFT_NEIGHBOR  = process.env.LEFT_NEIGHBOR;
const RIGHT_NEIGHBOR = process.env.RIGHT_NEIGHBOR;
const RABBITMQ_HOST  = process.env.RABBITMQ_HOST || 'rabbitmq';
const TOTAL_NODES    = parseInt(process.env.TOTAL_NODES) || 6;

// ==========================================
// STATE PEMILU
// ==========================================
let isLeader        = false;
let currentLeaderId = null;
let isParticipant   = false;
let isConsuming     = false; // guard agar startConsumingTickets tidak dipanggil berkali-kali

// ==========================================
// KONEKSI DATABASE POSTGRESQL
// BUG #1 FIX: DB_HOST sekarang dibaca dari environment variable
// ==========================================
const pool = new Pool({
  host:     process.env.DB_HOST || 'postgres_db',
  user:     'amik_user',
  password: 'superpassword',
  database: 'helpdesk_db',
  port:     5432,
});

// ==========================================
// HELPER: TERUSKAN PESAN KE TETANGGA
// ==========================================
async function forwardElection(direction, data) {
  const targetUrl = direction === 'left' ? LEFT_NEIGHBOR : RIGHT_NEIGHBOR;
  if (!targetUrl) return;
  try {
    await fetch(`${targetUrl}/election`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
  } catch (_) {
    // Abaikan error saat node tetangga belum siap (booting)
  }
}

// ==========================================
// HELPER: MULAI FASE PEMILU BERIKUTNYA
// ==========================================
async function startNextPhase(k) {
  isParticipant = true;
  const hops = Math.pow(2, k);
  console.log(`[Node ${NODE_ID}] Memulai fase Hirschberg-Sinclair ${k} (hop: ${hops})`);

  // Jika jarak hop sudah >= total node → node ini menang mutlak
  if (hops >= TOTAL_NODES) {
    console.log(`[Node ${NODE_ID}] 🏆 Menang pemilu! Menyebarkan proklamasi...`);
    currentLeaderId = NODE_ID;
    isLeader        = true;
    if (!isConsuming) startConsumingTickets();
    forwardElection('left', { direction: 'left', leaderId: NODE_ID });
    return;
  }

  // Kirim pesan outbound ke dua arah sekaligus
  forwardElection('left',  { direction: 'left',  originId: NODE_ID, phase: k, hopCount: hops });
  forwardElection('right', { direction: 'right', originId: NODE_ID, phase: k, hopCount: hops });
}

// ==========================================
// ENDPOINT UTAMA: ALGORITMA HIRSCHBERG-SINCLAIR
// ==========================================
app.post('/election', async (req, res) => {
  const { direction, originId, leaderId, phase, hopCount } = req.body;

  // --- KASUS 1: Proklamasi kemenangan ---
  if (leaderId !== undefined) {
    if (currentLeaderId === leaderId) return res.sendStatus(200); // sudah tahu, stop flood
    currentLeaderId = leaderId;
    isParticipant   = true; // FIX: tandai sudah selesai agar setTimeout tidak picu election baru
    isLeader        = leaderId === NODE_ID;
    console.log(`[Node ${NODE_ID}] Pemilu selesai! Leader: Node ${leaderId}`);
    if (isLeader && !isConsuming) startConsumingTickets(); // FIX: guard agar tidak konek berkali-kali
    forwardElection(direction, req.body);
    return res.sendStatus(200);
  }

  // --- KASUS 2: Pesan milik diri sendiri kembali (lolos satu fase) ---
  if (originId === NODE_ID) {
    console.log(`[Node ${NODE_ID}] Lolos fase ${phase}!`);
    startNextPhase(phase + 1);
    return res.sendStatus(200);
  }

  // --- KASUS 3: originId > NODE_ID → kita kalah, teruskan ---
  if (originId > NODE_ID) {
    isParticipant = true;

    if (hopCount > 1) {
      // Outbound: masih ada sisa hop, teruskan ke arah yang sama
      forwardElection(direction, { ...req.body, hopCount: hopCount - 1 });

    } else if (hopCount === 1) {
      // Outbound habis: balikkan arah jadi inbound (kembali ke pengirim)
      const reverseDir = direction === 'left' ? 'right' : 'left';
      forwardElection(reverseDir, { ...req.body, direction: reverseDir, hopCount: 0 });

    }
    // hopCount === 0 (inbound) dan originId > NODE_ID:
    // Pesan ini sedang kembali ke pengirim yang lebih besar, biarkan lewat
    else {
      forwardElection(direction, req.body);
    }

    return res.sendStatus(200);
  }

  // --- KASUS 4: originId < NODE_ID → kita lebih besar, blokir ---
  // BUG #3 FIX: pesan dari node yang lebih kecil (outbound maupun inbound) di-drop di sini.
  // Tidak perlu diteruskan sama sekali karena node tersebut sudah kalah.
  return res.sendStatus(200);
});

// ==========================================
// CONSUMER RABBITMQ (HANYA DIJALANKAN OLEH LEADER)
// ==========================================
async function startConsumingTickets() {
  isConsuming = true;
  console.log(`[Node ${NODE_ID}] 🔌 Mencoba konek ke RabbitMQ...`);
  try {
    const connection = await amqp.connect(`amqp://${RABBITMQ_HOST}`);
    const channel    = await connection.createChannel();
    const queueName  = 'ticket_queue';

    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1);
    console.log(`[Node ${NODE_ID}] ✅ Konek RabbitMQ berhasil! Menunggu tiket...`);

    channel.consume(queueName, async (msg) => {
      if (!msg) return;

      const ticket   = JSON.parse(msg.content.toString());
      const ticketId = parseInt(ticket.id, 10);
      console.log(`[Node ${NODE_ID}] 📥 Menangani tiket #${ticketId}: "${ticket.title}"`);

      // Simulasi waktu proses 2 detik
      setTimeout(async () => {
        try {
          // BUG #1 FIX: DB_HOST sudah benar → query ini sekarang bisa jalan
          await pool.query("UPDATE tickets SET status = 'SUCCESS' WHERE id = $1", [ticketId]);
          console.log(`[Node ${NODE_ID}] ✅ Tiket #${ticketId} → SUCCESS`);
          channel.ack(msg);
        } catch (err) {
          console.error(`[Node ${NODE_ID}] ❌ Gagal update DB:`, err.message);
        }
      }, 2000);
    });

    // Auto-reconnect jika koneksi RabbitMQ putus
    connection.on('error', () => setTimeout(startConsumingTickets, 5000));
    connection.on('close', () => setTimeout(startConsumingTickets, 5000));

  } catch (err) {
    console.log(`[Node ${NODE_ID}] ⚠️ RabbitMQ belum siap. Retry dalam 4 detik...`);
    setTimeout(startConsumingTickets, 4000);
  }
}

// ==========================================
// MULAI PEMILU (tunggu 12 detik agar RabbitMQ siap)
// ==========================================
setTimeout(() => {
  if (!currentLeaderId && !isParticipant) {
    console.log(`[Node ${NODE_ID}] Memulai algoritma Hirschberg-Sinclair...`);
    startNextPhase(0);
  }
}, 12000);

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Node ${NODE_ID}] Server berjalan di port ${PORT}`);
});
