let lingkungan=70, ekonomi=70, biodiversitas=70, sosial=70;
let emisi=40, air=70, legitimasi=60;

let index=0;
let riwayat=[];

const kasus=[
  {
    judul:"Papua: Proyek Ketahanan Pangan Nasional",
    deskripsi:"Pemerintah merencanakan pembukaan 1,2 juta hektar hutan primer di Papua untuk program food estate guna meningkatkan ketahanan pangan nasional. Hutan ini merupakan habitat bagi 20.000+ spesies endemik dan menyimpan 8 miliar ton karbon. Proyek ini dapat meningkatkan produksi pangan 15% namun berisiko terhadap keanekaragaman hayati dan emisi karbon.",
    opsi:[
      {
        t:"Eksploitasi Penuh",
        deskripsi:"Membuka seluruh 1,2 juta hektar hutan primer untuk pertanian monokultur skala besar. Pendekatan ini fokus pada produksi maksimal dengan teknologi modern.",
        dampak:"Ekonomi +20, Lingkungan -25, Biodiversitas -20, Emisi +15",
        detail:"Pendekatan ini akan meningkatkan produksi pangan secara signifikan dan menciptakan banyak lapangan kerja. Namun, akan menghancurkan habitat endemik, melepaskan karbon dalam jumlah besar, dan mengancam keanekaragaman hayati Papua yang unik.",
        a(){ekonomi+=20;lingkungan-=25;biodiversitas-=20;emisi+=15;}
      },
      {
        t:"Eksploitasi Terbatas",
        deskripsi:"Membuka 600.000 hektar dengan zonasi yang lebih hati-hati, menyisakan 50% hutan sebagai kawasan lindung dan koridor satwa.",
        dampak:"Ekonomi +10, Lingkungan -10, Biodiversitas -10, Emisi +8",
        detail:"Pendekatan kompromi yang menyeimbangkan kebutuhan pangan dengan konservasi. Masih ada dampak negatif namun lebih terkontrol. Koridor satwa membantu menjaga konektivitas habitat.",
        a(){ekonomi+=10;lingkungan-=10;biodiversitas-=10;emisi+=8;}
      },
      {
        t:"Konservasi dengan Agroforestri",
        deskripsi:"Menggunakan sistem agroforestri yang menggabungkan pohon pangan dengan tanaman pertanian, tanpa membuka hutan primer. Fokus pada intensifikasi lahan terdegradasi.",
        dampak:"Lingkungan +10, Ekonomi -5, Biodiversitas +5, Legitimasi +5",
        detail:"Pendekatan paling berkelanjutan yang menjaga hutan primer tetap utuh. Agroforestri meningkatkan biodiversitas, menyerap karbon, dan menghasilkan pangan. Namun, produksi lebih rendah dan memerlukan investasi awal lebih besar.",
        a(){lingkungan+=10;ekonomi-=5;biodiversitas+=5;legitimasi+=5;}
      }
    ]
  },
  {
    judul:"Sumatra: Ekspansi Perkebunan Sawit",
    deskripsi:"Permintaan ekspor sawit meningkat 25% tahun ini. Ekspansi 500.000 hektar lahan sawit di Sumatra dapat meningkatkan devisa $2,5 miliar dan menciptakan 50.000 lapangan kerja. Namun, konversi hutan gambut meningkatkan risiko banjir, kebakaran hutan, dan hilangnya habitat Harimau Sumatera yang tersisa 400 ekor.",
    opsi:[
      {
        t:"Ekspansi Cepat",
        deskripsi:"Mengizinkan ekspansi sawit 500.000 hektar dengan proses perizinan yang dipercepat. Fokus pada pertumbuhan ekonomi dan devisa negara.",
        dampak:"Ekonomi +15, Lingkungan -20, Sosial +5, Emisi +12, Air -10",
        detail:"Akan meningkatkan devisa dan lapangan kerja secara signifikan. Namun, konversi hutan gambut melepaskan karbon dalam jumlah besar, meningkatkan risiko banjir dan kebakaran, serta mengancam habitat Harimau Sumatera yang kritis.",
        a(){ekonomi+=15;lingkungan-=20;sosial+=5;emisi+=12;air-=10;}
      },
      {
        t:"Berkelanjutan (RSPO)",
        deskripsi:"Ekspansi dengan standar Roundtable on Sustainable Palm Oil (RSPO): tidak membuka hutan primer, menghindari lahan gambut, dan melibatkan masyarakat lokal.",
        dampak:"Ekonomi +8, Lingkungan -5, Legitimasi +8, Emisi +5",
        detail:"Pendekatan yang lebih bertanggung jawab dengan sertifikasi internasional. Masih ada dampak lingkungan namun jauh lebih kecil. Meningkatkan legitimasi di pasar global dan mendapat dukungan LSM.",
        a(){ekonomi+=8;lingkungan-=5;legitimasi+=8;emisi+=5;}
      },
      {
        t:"Moratorium & Restorasi",
        deskripsi:"Menghentikan ekspansi sawit baru dan fokus pada restorasi lahan gambut terdegradasi serta intensifikasi lahan sawit yang sudah ada.",
        dampak:"Lingkungan +15, Ekonomi -8, Biodiversitas +10, Legitimasi +10",
        detail:"Pendekatan konservatif yang mengutamakan ekologi. Restorasi gambut menyerap karbon dan mencegah banjir. Melindungi habitat Harimau Sumatera. Namun, kehilangan peluang ekonomi jangka pendek dan mungkin mendapat resistensi dari industri.",
        a(){lingkungan+=15;ekonomi-=8;biodiversitas+=10;legitimasi+=10;}
      }
    ]
  },
  {
    judul:"Kalimantan: Konservasi Habitat Orangutan",
    deskripsi:"Pembangunan infrastruktur jalan sepanjang 200 km di Kalimantan Tengah akan memotong habitat Orangutan yang tersisa 57.000 ekor. Jalan ini penting untuk akses ekonomi 2 juta penduduk namun akan memecah habitat dan meningkatkan konflik manusia-satwa. Setiap tahun, 1.000+ Orangutan mati akibat konflik.",
    opsi:[
      {
        t:"Lanjutkan Pembangunan",
        deskripsi:"Membangun jalan sesuai rencana awal tanpa modifikasi. Fokus pada aksesibilitas dan pertumbuhan ekonomi regional.",
        dampak:"Ekonomi +10, Biodiversitas -20, Sosial +8, Legitimasi -10",
        detail:"Akan meningkatkan akses ekonomi dan mobilitas penduduk secara signifikan. Namun, akan memecah habitat Orangutan menjadi fragmen-fragmen kecil, meningkatkan konflik manusia-satwa, dan mempercepat penurunan populasi yang sudah terancam punah.",
        a(){ekonomi+=10;biodiversitas-=20;sosial+=8;legitimasi-=10;}
      },
      {
        t:"Relokasi dengan Koridor",
        deskripsi:"Membangun jalan dengan modifikasi: membuat jembatan satwa (canopy bridge) dan koridor hutan di titik-titik kritis untuk menjaga konektivitas habitat.",
        dampak:"Ekonomi +5, Biodiversitas -10, Sosial +5, Legitimasi +5",
        detail:"Kompromi yang menyeimbangkan kebutuhan infrastruktur dengan konservasi. Koridor satwa membantu Orangutan berpindah antar habitat. Masih ada dampak namun lebih terkontrol. Memerlukan biaya tambahan untuk infrastruktur khusus.",
        a(){ekonomi+=5;biodiversitas-=10;sosial+=5;legitimasi+=5;}
      },
      {
        t:"Lindungi Habitat Lengkap",
        deskripsi:"Membatalkan pembangunan jalan dan mencari alternatif rute yang tidak melewati habitat Orangutan, atau menggunakan transportasi alternatif seperti sungai.",
        dampak:"Biodiversitas +20, Legitimasi +10, Lingkungan +8, Ekonomi -8",
        detail:"Pendekatan paling konservatif yang melindungi habitat Orangutan secara penuh. Meningkatkan legitimasi internasional dan dukungan konservasionis. Namun, kehilangan akses ekonomi yang diharapkan dan mungkin mendapat resistensi dari masyarakat lokal yang membutuhkan infrastruktur.",
        a(){biodiversitas+=20;legitimasi+=10;lingkungan+=8;ekonomi-=8;}
      }
    ]
  }
];

function justifikasi(){
  if(ekonomi>lingkungan+20) return "Kebijakan cenderung eksploitatif.";
  if(lingkungan>ekonomi+20) return "Kebijakan sangat konservatif.";
  return "Kebijakan relatif seimbang.";
}

function dampak(v){
  if(v>5) return "++";
  if(v>0) return "+";
  if(v<-5) return "--";
  if(v<0) return "-";
  return "0";
}

function tampil(){
  if(index>=kasus.length){
    localStorage.setItem("hasil",
      lingkungan>50?"Kebijakan relatif berkelanjutan."
                   :"Kebijakan gagal menjaga lingkungan."
    );
    localStorage.setItem("ai", evaluasiAI({lingkungan,ekonomi}));
    window.location.href="debat.html";
    return;
  }

  const k=kasus[index];
  const judulEl = document.getElementById("judulKasus");
  const deskEl = document.getElementById("deskripsiKasus");
  const pilihan = document.getElementById("pilihan");
  
  if (judulEl) judulEl.innerText = k.judul;
  if (deskEl) deskEl.innerText = k.deskripsi;
  if (pilihan) pilihan.innerHTML = "";

  k.opsi.forEach((o, idx)=>{
    const optionCard = document.createElement("div");
    optionCard.className = "policy-option";
    
    const title = document.createElement("h4");
    title.textContent = o.t;
    optionCard.appendChild(title);
    
    const desc = document.createElement("p");
    desc.className = "description";
    desc.textContent = o.deskripsi || "Tidak ada deskripsi tersedia.";
    optionCard.appendChild(desc);
    
    const impacts = document.createElement("div");
    impacts.className = "impacts";
    const impactText = o.dampak || "";
    if (impactText) {
      impactText.split(", ").forEach(impact => {
        const impactItem = document.createElement("div");
        impactItem.className = "impact-item";
        const parts = impact.trim().split(" ");
        if (parts.length >= 2) {
          const value = parts[parts.length - 1];
          const label = parts.slice(0, -1).join(" ");
          const isPositive = value && value.startsWith("+");
          impactItem.className += isPositive ? " impact-positive" : " impact-negative";
          impactItem.textContent = impact;
        } else {
          impactItem.textContent = impact;
        }
        impacts.appendChild(impactItem);
      });
    }
    optionCard.appendChild(impacts);
    
    const detailBtn = document.createElement("button");
    detailBtn.textContent = "📖 Lihat Detail Lengkap";
    detailBtn.style.marginTop = "1rem";
    detailBtn.style.width = "100%";
    detailBtn.onclick = (e) => {
      e.stopPropagation();
      showOptionDetail(o);
    };
    optionCard.appendChild(detailBtn);
    
    optionCard.onclick = () => {
      // Remove previous selection
      document.querySelectorAll(".policy-option").forEach(card => {
        card.classList.remove("selected");
      });
      optionCard.classList.add("selected");
      
      // Show custom confirmation modal
      showConfirmModal(o, () => {
        o.a();
        riwayat.push(`${k.judul} → ${o.t}`);
        const timelineEl = document.getElementById("timeline");
        if (timelineEl) {
          const li = document.createElement("li");
          li.innerText = riwayat[riwayat.length - 1];
          timelineEl.appendChild(li);
        }
        index++;
        update();
        tampil();
        optionCard.classList.remove("selected");
      }, () => {
        optionCard.classList.remove("selected");
      });
    };
    
    pilihan.appendChild(optionCard);
  });

  update();
}

function update(){
  const lingEl = document.getElementById("lingkungan");
  const ekoEl = document.getElementById("ekonomi");
  const bioEl = document.getElementById("biodiversitas");
  const sosEl = document.getElementById("sosial");
  const emiEl = document.getElementById("emisi");
  const airEl = document.getElementById("air");
  const legEl = document.getElementById("legitimasi");
  const justEl = document.getElementById("justifikasi");
  const tLingEl = document.getElementById("tLing");
  const tEkoEl = document.getElementById("tEko");
  const tSosEl = document.getElementById("tSos");

  if (lingEl) lingEl.innerText = lingkungan;
  if (ekoEl) ekoEl.innerText = ekonomi;
  if (bioEl) bioEl.innerText = biodiversitas;
  if (sosEl) sosEl.innerText = sosial;
  if (emiEl) emiEl.innerText = emisi;
  if (airEl) airEl.innerText = air;
  if (legEl) legEl.innerText = legitimasi;

  if (justEl) justEl.innerText = justifikasi();
  if (tLingEl) tLingEl.innerText = dampak(lingkungan-70);
  if (tEkoEl) tEkoEl.innerText = dampak(ekonomi-70);
  if (tSosEl) tSosEl.innerText = dampak(sosial-70);

  // Update trade-off descriptions
  const lingVal = lingkungan - 70;
  const ekoVal = ekonomi - 70;
  const sosVal = sosial - 70;
  const tLingDesc = document.getElementById("tLingDesc");
  const tEkoDesc = document.getElementById("tEkoDesc");
  const tSosDesc = document.getElementById("tSosDesc");
  if (tLingDesc) tLingDesc.textContent = lingVal > 5 ? "Sangat Positif" : lingVal > 0 ? "Positif" : lingVal < -5 ? "Sangat Negatif" : lingVal < 0 ? "Negatif" : "Netral";
  if (tEkoDesc) tEkoDesc.textContent = ekoVal > 5 ? "Sangat Positif" : ekoVal > 0 ? "Positif" : ekoVal < -5 ? "Sangat Negatif" : ekoVal < 0 ? "Negatif" : "Netral";
  if (tSosDesc) tSosDesc.textContent = sosVal > 5 ? "Sangat Positif" : sosVal > 0 ? "Positif" : sosVal < -5 ? "Sangat Negatif" : sosVal < 0 ? "Negatif" : "Netral";

  // Update progress bars
  updateProgressBar("progressLingkungan", lingkungan);
  updateProgressBar("progressEkonomi", ekonomi);
  updateProgressBar("progressBiodiversitas", biodiversitas);
  updateProgressBar("progressSosial", sosial);
  updateProgressBar("progressEmisi", emisi);
  updateProgressBar("progressAir", air);
  updateProgressBar("progressLegitimasi", legitimasi);

  // Update progress
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  if (progressFill && progressText) {
    const progress = ((index / kasus.length) * 100).toFixed(0);
    progressFill.style.width = progress + "%";
    progressFill.textContent = progress + "%";
    progressText.textContent = `Kasus ${index + 1} dari ${kasus.length}`;
  }

}

function updateProgressBar(id, value) {
  const progressBar = document.getElementById(id);
  if (progressBar) {
    const percentage = Math.max(0, Math.min(100, value));
    progressBar.style.width = percentage + "%";
    
    // Update color class based on value
    progressBar.classList.remove("low", "very-low");
    if (percentage < 50) {
      progressBar.classList.add("very-low");
    } else if (percentage < 70) {
      progressBar.classList.add("low");
    }
  }
}

function modePresentasi(){
  ekonomi+=30; lingkungan-=40; sosial-=20;
  update();
}

function showOptionDetail(option) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.display = "block";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2 style="color: var(--forest-dark); margin-bottom: 1rem;">${option.t}</h2>
      <div class="glossary-item" style="margin-top: 1rem;">
        <h4>📋 Deskripsi</h4>
        <p>${option.deskripsi || "Tidak ada deskripsi tersedia."}</p>
      </div>
      <div class="glossary-item">
        <h4>⚖️ Dampak yang Akan Terjadi</h4>
        <p><strong>${option.dampak || "Tidak tersedia"}</strong></p>
      </div>
      <div class="glossary-item">
        <h4>💡 Penjelasan Detail</h4>
        <p>${option.detail || "Tidak ada penjelasan detail tersedia."}</p>
      </div>
      <button class="btn" onclick="this.parentElement.parentElement.remove()" style="margin-top: 1rem; width: 100%;">Tutup</button>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Close on outside click
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  };
}

function showConfirmModal(option, onConfirm, onCancel) {
  // Parse impacts for better display
  const impacts = option.dampak ? option.dampak.split(", ") : [];
  const impactItems = impacts.map(impact => {
    const parts = impact.trim().split(" ");
    const value = parts[parts.length - 1];
    const label = parts.slice(0, -1).join(" ");
    const isPositive = value && value.startsWith("+");
    const isNegative = value && value.startsWith("-");
    let icon = "➡️";
    let color = "var(--text-dark)";
    if (isPositive) {
      icon = "📈";
      color = "var(--forest-medium)";
    } else if (isNegative) {
      icon = "📉";
      color = "#d32f2f";
    }
    return `<div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: ${isPositive ? '#e8f5e9' : isNegative ? '#ffebee' : '#f5f5f5'}; border-radius: 6px; margin: 0.3rem 0;">
      <span style="font-size: 1.2rem;">${icon}</span>
      <span style="flex: 1; font-weight: 500;">${label}</span>
      <span style="font-weight: 700; color: ${color}; font-size: 1.1rem;">${value}</span>
    </div>`;
  }).join("");

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.display = "block";
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🤔</div>
        <h2 style="color: var(--forest-dark); margin: 0;">Konfirmasi Pilihan</h2>
      </div>
      
      <div style="background: linear-gradient(135deg, var(--forest-lightest) 0%, var(--sky-blue) 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 5px solid var(--forest-medium);">
        <h3 style="color: var(--forest-dark); margin-bottom: 0.5rem; font-size: 1.2rem;">${option.t}</h3>
        <p style="color: var(--text-dark); margin: 0; font-size: 0.95rem; line-height: 1.6;">${option.deskripsi || ""}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: var(--forest-medium); margin-bottom: 0.8rem; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <span>⚖️</span>
          <span>Dampak yang Akan Terjadi:</span>
        </h4>
        <div style="max-height: 200px; overflow-y: auto;">
          ${impactItems || '<p style="color: #666; text-align: center; padding: 1rem;">Tidak ada data dampak tersedia.</p>'}
        </div>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button class="btn btn-cancel" style="flex: 1; background: #757575; padding: 12px;">
          ❌ Batal
        </button>
        <button class="btn btn-primary btn-confirm" style="flex: 1; padding: 12px;">
          ✅ Konfirmasi
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Add event listeners
  const confirmBtn = modal.querySelector('.btn-confirm');
  const cancelBtn = modal.querySelector('.btn-cancel');
  
  confirmBtn.onclick = function() {
    modal.remove();
    onConfirm();
  };
  
  cancelBtn.onclick = function() {
    modal.remove();
    if (onCancel) onCancel();
  };
  
  // Close on outside click
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.remove();
      if (onCancel) onCancel();
    }
  };
}

tampil();
