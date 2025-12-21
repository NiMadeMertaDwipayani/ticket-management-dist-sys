// Game Berpikir Kritis - Multiple Game Modes
const gameType = localStorage.getItem('gameType') || 'allocation';

// Initialize game based on type
document.addEventListener('DOMContentLoaded', function() {
  switch(gameType) {
    case 'allocation':
      initResourceAllocation();
      break;
    case 'scenario':
      initScenarioAnalysis();
      break;
    case 'strategic':
      initStrategicPlanning();
      break;
    default:
      initResourceAllocation();
  }
});

// ============================================
// GAME 1: RESOURCE ALLOCATION
// ============================================
function initResourceAllocation() {
  document.getElementById('gameTitle').textContent = '💰 Alokasi Sumber Daya';
  document.getElementById('gameSubtitle').textContent = 'Optimalkan Alokasi Budget untuk Program Konservasi';
  
  const budget = 50000; // 50 miliar dalam juta
  let allocated = 0;
  let allocations = {};
  
  const programs = [
    {
      id: 'restorasi',
      name: 'Restorasi Hutan Gambut',
      cost: 15000,
      description: 'Restorasi 50.000 hektar lahan gambut terdegradasi. Mencegah emisi karbon, mengurangi risiko kebakaran, dan meningkatkan biodiversitas.',
      benefits: {lingkungan: 25, emisi: -30, biodiversitas: 15, legitimasi: 20},
      risks: 'Tingkat keberhasilan 70%, memerlukan monitoring jangka panjang'
    },
    {
      id: 'rehabilitasi',
      name: 'Rehabilitasi Hutan Produksi',
      cost: 12000,
      description: 'Rehabilitasi 100.000 hektar hutan produksi dengan sistem silvikultur intensif. Meningkatkan produktivitas dan konservasi.',
      benefits: {ekonomi: 20, lingkungan: 15, sosial: 10, air: 15},
      risks: 'Memerlukan komitmen jangka panjang, risiko konflik dengan masyarakat'
    },
    {
      id: 'konservasi',
      name: 'Perluasan Kawasan Konservasi',
      cost: 8000,
      description: 'Menambah 200.000 hektar kawasan konservasi baru. Melindungi habitat satwa langka dan keanekaragaman hayati.',
      benefits: {biodiversitas: 30, lingkungan: 20, legitimasi: 25, emisi: -10},
      risks: 'Dapat mengurangi akses ekonomi lokal, memerlukan dukungan masyarakat'
    },
    {
      id: 'agroforestri',
      name: 'Program Agroforestri',
      cost: 10000,
      description: 'Mengembangkan 150.000 hektar sistem agroforestri. Menggabungkan produksi pangan dengan konservasi.',
      benefits: {ekonomi: 15, sosial: 20, lingkungan: 18, air: 12},
      risks: 'Adopsi petani lambat, memerlukan pelatihan intensif'
    },
    {
      id: 'pencegahan',
      name: 'Pencegahan Deforestasi',
      cost: 18000,
      description: 'Program pencegahan deforestasi melalui patroli, teknologi satelit, dan pemberdayaan masyarakat. Target 500.000 hektar.',
      benefits: {lingkungan: 30, emisi: -25, biodiversitas: 20, legitimasi: 15},
      risks: 'Tingkat efektivitas bervariasi, memerlukan koordinasi lintas sektor'
    },
    {
      id: 'riset',
      name: 'Riset & Pengembangan',
      cost: 5000,
      description: 'Program riset untuk teknologi konservasi, monitoring, dan inovasi pengelolaan hutan berkelanjutan.',
      benefits: {legitimasi: 10, lingkungan: 8, ekonomi: 5},
      risks: 'Hasil jangka panjang, ROI tidak langsung'
    },
    {
      id: 'masyarakat',
      name: 'Pemberdayaan Masyarakat Adat',
      cost: 7000,
      description: 'Program pemberdayaan dan pengakuan hak masyarakat adat dalam pengelolaan hutan. Target 50 komunitas.',
      benefits: {sosial: 25, legitimasi: 30, lingkungan: 12, biodiversitas: 10},
      risks: 'Proses panjang, memerlukan negosiasi kompleks'
    }
  ];

  let selectedPrograms = {};

  function renderGame() {
    const content = document.getElementById('gameContent');
    const remaining = budget - allocated;
    const percentage = (allocated / budget * 100).toFixed(1);

    content.innerHTML = `
      <div class="card">
        <h2>📊 Status Alokasi Budget</h2>
        <div class="progress-container">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span><strong>Budget Tersedia:</strong> Rp ${budget.toLocaleString('id-ID')} juta</span>
            <span><strong>Tersisa:</strong> Rp ${remaining.toLocaleString('id-ID')} juta</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%; background: ${percentage > 100 ? '#d32f2f' : percentage > 80 ? '#ff9800' : 'linear-gradient(90deg, var(--forest-medium) 0%, var(--forest-light) 100%)'};">
              ${percentage}%
            </div>
          </div>
          <p style="text-align: center; margin-top: 0.5rem; color: ${remaining < 0 ? '#d32f2f' : remaining < 10000 ? '#ff9800' : 'var(--forest-medium)'}; font-weight: 500;">
            ${remaining < 0 ? '⚠️ Budget terlampaui!' : remaining < 10000 ? '⚠️ Budget hampir habis' : '✓ Budget masih tersedia'}
          </p>
        </div>
      </div>

      <div class="card">
        <h2>🎯 Target yang Harus Dicapai</h2>
        <div class="data">
          <p>🌳 <strong>Lingkungan:</strong> Minimal +50 poin</p>
          <p>💰 <strong>Ekonomi:</strong> Minimal +30 poin</p>
          <p>🐾 <strong>Biodiversitas:</strong> Minimal +40 poin</p>
          <p>👥 <strong>Sosial:</strong> Minimal +35 poin</p>
          <p>⚠️ <strong>Emisi:</strong> Maksimal -40 poin (semakin negatif semakin baik)</p>
          <p>🧾 <strong>Legitimasi:</strong> Minimal +30 poin</p>
        </div>
        <p style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-left: 4px solid #ff9800; border-radius: 4px;">
          <strong>⚠️ Tantangan:</strong> Anda harus mencapai semua target di atas dengan budget terbatas. 
          Setiap program memiliki trade-off yang berbeda. Pilih dengan bijak!
        </p>
      </div>

      <div class="card">
        <h2>📋 Program yang Tersedia</h2>
        <p style="margin-bottom: 1rem; color: var(--forest-medium);">
          Klik pada program untuk melihat detail, lalu pilih untuk mengalokasikan budget.
        </p>
        <div id="programsList"></div>
      </div>

      <div class="card">
        <h2>📊 Ringkasan Alokasi</h2>
        <div id="summary"></div>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
          <button class="btn" onclick="resetAllocation()" style="flex: 1;">🔄 Reset</button>
          <button class="btn btn-primary" onclick="submitAllocation()" style="flex: 2;">✅ Submit Alokasi</button>
        </div>
      </div>
    `;

    renderPrograms();
    renderSummary();
  }

  function renderPrograms() {
    const list = document.getElementById('programsList');
    list.innerHTML = programs.map(program => {
      const isSelected = selectedPrograms[program.id];
      const canAfford = (budget - allocated + (isSelected ? program.cost : 0)) >= 0;
      
      return `
        <div class="policy-option ${isSelected ? 'selected' : ''}" 
             style="cursor: pointer; ${!canAfford && !isSelected ? 'opacity: 0.6;' : ''}"
             onclick="${canAfford || isSelected ? `toggleProgram('${program.id}')` : 'alert(\"Budget tidak mencukupi!\")'}">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <h4>${program.name} ${isSelected ? '✓' : ''}</h4>
              <p class="description">${program.description}</p>
              <div style="margin-top: 0.5rem;">
                <strong>💰 Biaya:</strong> Rp ${program.cost.toLocaleString('id-ID')} juta
              </div>
              <div style="margin-top: 0.5rem; padding: 0.5rem; background: #f1f8f4; border-radius: 4px;">
                <strong>📈 Manfaat:</strong> 
                ${Object.entries(program.benefits).map(([key, val]) => 
                  `<span style="margin-right: 0.5rem; color: ${val > 0 ? 'var(--forest-medium)' : '#d32f2f'};">
                    ${getIndicatorName(key)} ${val > 0 ? '+' : ''}${val}
                  </span>`
                ).join('')}
              </div>
              <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                <strong>⚠️ Risiko:</strong> ${program.risks}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function toggleProgram(programId) {
    const program = programs.find(p => p.id === programId);
    if (selectedPrograms[programId]) {
      delete selectedPrograms[programId];
      allocated -= program.cost;
    } else {
      selectedPrograms[programId] = true;
      allocated += program.cost;
    }
    renderGame();
  }

  function renderSummary() {
    const summary = document.getElementById('summary');
    const totals = {
      lingkungan: 0, ekonomi: 0, biodiversitas: 0, sosial: 0,
      emisi: 0, air: 0, legitimasi: 0
    };

    programs.forEach(program => {
      if (selectedPrograms[program.id]) {
        Object.keys(totals).forEach(key => {
          totals[key] += program.benefits[key] || 0;
        });
      }
    });

    const targets = {
      lingkungan: 50, ekonomi: 30, biodiversitas: 40,
      sosial: 35, emisi: -40, legitimasi: 30
    };

    const met = Object.keys(targets).every(key => {
      if (key === 'emisi') {
        return totals[key] <= targets[key];
      }
      return totals[key] >= targets[key];
    });

    summary.innerHTML = `
      <table>
        <tr>
          <th>Indikator</th>
          <th>Target</th>
          <th>Pencapaian</th>
          <th>Status</th>
        </tr>
        ${Object.keys(targets).map(key => {
          const achieved = key === 'emisi' ? totals[key] <= targets[key] : totals[key] >= targets[key];
          return `
            <tr>
              <td><strong>${getIndicatorName(key)}</strong></td>
              <td>${key === 'emisi' ? '≤' : '≥'} ${targets[key]}</td>
              <td>${totals[key] > 0 ? '+' : ''}${totals[key]}</td>
              <td style="color: ${achieved ? 'var(--forest-medium)' : '#d32f2f'}; font-weight: 600;">
                ${achieved ? '✓ Mencapai' : '✗ Belum'}
              </td>
            </tr>
          `;
        }).join('')}
      </table>
      <div style="margin-top: 1rem; padding: 1rem; background: ${met ? '#e8f5e9' : '#ffebee'}; border-radius: 8px; border-left: 4px solid ${met ? 'var(--forest-medium)' : '#d32f2f'};">
        <strong>${met ? '🎉 Semua target tercapai!' : '⚠️ Beberapa target belum tercapai'}</strong>
        <p style="margin-top: 0.5rem; margin-bottom: 0;">
          ${met ? 'Alokasi Anda optimal dan memenuhi semua kriteria!' : 'Perlu menyesuaikan alokasi untuk mencapai semua target.'}
        </p>
      </div>
    `;
  }

  function resetAllocation() {
    if (confirm('Apakah Anda yakin ingin mereset semua alokasi?')) {
      selectedPrograms = {};
      allocated = 0;
      renderGame();
    }
  }

  function submitAllocation() {
    const totals = {
      lingkungan: 0, ekonomi: 0, biodiversitas: 0, sosial: 0,
      emisi: 0, air: 0, legitimasi: 0
    };

    programs.forEach(program => {
      if (selectedPrograms[program.id]) {
        Object.keys(totals).forEach(key => {
          totals[key] += program.benefits[key] || 0;
        });
      }
    });

    const targets = {
      lingkungan: 50, ekonomi: 30, biodiversitas: 40,
      sosial: 35, emisi: -40, legitimasi: 30
    };

    const met = Object.keys(targets).every(key => {
      if (key === 'emisi') {
        return totals[key] <= targets[key];
      }
      return totals[key] >= targets[key];
    });

    const score = Object.keys(targets).reduce((acc, key) => {
      const diff = key === 'emisi' 
        ? Math.max(0, totals[key] - targets[key]) 
        : Math.max(0, targets[key] - totals[key]);
      return acc + (diff === 0 ? 100 : Math.max(0, 100 - diff * 2));
    }, 0) / Object.keys(targets).length;

    const efficiency = allocated > 0 ? (score / (allocated / 1000)).toFixed(2) : 0;

    showResults({
      met,
      score: score.toFixed(1),
      efficiency,
      totals,
      targets,
      allocated,
      programsSelected: Object.keys(selectedPrograms).length
    });
  }

  function showResults(data) {
    const modal = document.getElementById('resultsModal');
    const content = document.getElementById('resultsContent');
    
    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">${data.met ? '🎉' : '📊'}</div>
        <h2 style="color: var(--forest-dark);">Hasil Evaluasi Alokasi</h2>
      </div>

      <div style="background: ${data.met ? 'linear-gradient(135deg, var(--forest-lightest) 0%, var(--sky-blue) 100%)' : 'linear-gradient(135deg, #fff3cd 0%, #ffe082 100%)'}; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h3 style="color: var(--forest-dark); margin-bottom: 1rem;">Skor Akhir: ${data.score}/100</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 8px;">
            <strong>Program Terpilih:</strong><br>
            <span style="font-size: 1.5rem; color: var(--forest-medium);">${data.programsSelected}</span>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 8px;">
            <strong>Budget Digunakan:</strong><br>
            <span style="font-size: 1.2rem; color: var(--forest-medium);">Rp ${data.allocated.toLocaleString('id-ID')} juta</span>
          </div>
        </div>
      </div>

      <div class="glossary-item">
        <h4>📊 Detail Pencapaian Target</h4>
        ${Object.keys(data.targets).map(key => {
          const achieved = key === 'emisi' ? data.totals[key] <= data.targets[key] : data.totals[key] >= data.targets[key];
          return `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; margin: 0.3rem 0; background: ${achieved ? '#e8f5e9' : '#ffebee'}; border-radius: 4px;">
              <span><strong>${getIndicatorName(key)}:</strong></span>
              <span>${data.totals[key] > 0 ? '+' : ''}${data.totals[key]} / ${key === 'emisi' ? '≤' : '≥'} ${data.targets[key]} 
              <span style="color: ${achieved ? 'var(--forest-medium)' : '#d32f2f'};">
                ${achieved ? '✓' : '✗'}
              </span></span>
            </div>
          `;
        }).join('')}
      </div>

      <div style="margin-top: 1.5rem; padding: 1rem; background: #f1f8f4; border-radius: 8px;">
        <h4 style="color: var(--forest-dark); margin-bottom: 0.5rem;">💡 Analisis & Rekomendasi</h4>
        <p style="line-height: 1.8;">
          ${data.met 
            ? `Selamat! Anda berhasil mencapai semua target dengan efisien. Alokasi budget Anda optimal dan menunjukkan pemahaman yang baik tentang trade-off antar program. Skor ${data.score} menunjukkan strategi yang sangat baik.`
            : `Alokasi Anda belum mencapai semua target. Skor ${data.score} menunjukkan perlu optimasi lebih lanjut. Pertimbangkan untuk: (1) Menyeimbangkan alokasi antar program, (2) Memprioritaskan program dengan ROI tinggi, (3) Mempertimbangkan sinergi antar program.`
          }
        </p>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button class="btn" onclick="closeResults(); resetAllocation();" style="flex: 1;">🔄 Coba Lagi</button>
        <button class="btn btn-primary" onclick="window.location.href='games.html'" style="flex: 1;">🏠 Kembali ke Menu</button>
      </div>
    `;

    modal.style.display = 'block';
  }

  function closeResults() {
    document.getElementById('resultsModal').style.display = 'none';
  }

  window.toggleProgram = toggleProgram;
  window.resetAllocation = resetAllocation;
  window.submitAllocation = submitAllocation;
  window.closeResults = closeResults;

  renderGame();
}

// ============================================
// GAME 2: SCENARIO ANALYSIS
// ============================================
function initScenarioAnalysis() {
  document.getElementById('gameTitle').textContent = '📊 Analisis Skenario';
  document.getElementById('gameSubtitle').textContent = 'Analisis Data Kompleks dan Prediksi Dampak Jangka Panjang';
  
  const scenarios = [
    {
      id: 'A',
      name: 'Skenario Ekspansi Ekonomi',
      data: {
        deforestasi: {tahun1: 120000, tahun5: 150000, tahun10: 180000},
        emisi: {tahun1: 850, tahun5: 1200, tahun10: 1800},
        pdb: {tahun1: 3.2, tahun5: 4.5, tahun10: 6.1},
        biodiversitas: {tahun1: -15, tahun5: -28, tahun10: -42},
        sosial: {tahun1: 8, tahun5: 12, tahun10: 15},
        legitimasi: {tahun1: -5, tahun5: -12, tahun10: -20}
      },
      description: 'Fokus pada pertumbuhan ekonomi dengan ekspansi perkebunan dan industri kehutanan. Investasi besar dalam infrastruktur dan teknologi.'
    },
    {
      id: 'B',
      name: 'Skenario Konservasi Ketat',
      data: {
        deforestasi: {tahun1: 40000, tahun5: 25000, tahun10: 15000},
        emisi: {tahun1: -200, tahun5: -450, tahun10: -800},
        pdb: {tahun1: 0.8, tahun5: 0.5, tahun10: 0.3},
        biodiversitas: {tahun1: 12, tahun5: 25, tahun10: 38},
        sosial: {tahun1: -3, tahun5: -8, tahun10: -12},
        legitimasi: {tahun1: 15, tahun5: 28, tahun10: 40}
      },
      description: 'Moratorium total deforestasi, fokus pada restorasi dan konservasi. Pembatasan ketat aktivitas ekonomi di kawasan hutan.'
    },
    {
      id: 'C',
      name: 'Skenario Berkelanjutan',
      data: {
        deforestasi: {tahun1: 70000, tahun5: 50000, tahun10: 35000},
        emisi: {tahun1: -50, tahun5: -180, tahun10: -350},
        pdb: {tahun1: 2.1, tahun5: 2.8, tahun10: 3.5},
        biodiversitas: {tahun1: 5, tahun5: 12, tahun10: 20},
        sosial: {tahun1: 6, tahun5: 10, tahun10: 14},
        legitimasi: {tahun1: 8, tahun5: 15, tahun10: 22}
      },
      description: 'Pendekatan seimbang dengan intensifikasi lahan terdegradasi, agroforestri, dan konservasi selektif. Investasi dalam teknologi berkelanjutan.'
    }
  ];

  let analysis = {
    selectedScenario: null,
    keyVariables: [],
    predictedImpacts: {},
    recommendation: ''
  };

  function renderGame() {
    const content = document.getElementById('gameContent');
    
    content.innerHTML = `
      <div class="card">
        <h2>📋 Instruksi Game</h2>
        <div class="education-section">
          <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1rem;">
            <strong>Tugas Anda:</strong> Analisis ketiga skenario di bawah ini dan pilih skenario terbaik berdasarkan kriteria berikut:
          </p>
          <ul style="padding-left: 1.5rem; line-height: 2;">
            <li>Minimalisasi deforestasi dan emisi karbon</li>
            <li>Pertumbuhan ekonomi yang wajar (minimal 2% per tahun)</li>
            <li>Peningkatan biodiversitas dan legitimasi</li>
            <li>Dampak sosial yang positif</li>
            <li>Kelayakan implementasi jangka panjang</li>
          </ul>
          <p style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-left: 4px solid #ff9800; border-radius: 4px;">
            <strong>⚠️ Tantangan:</strong> Tidak ada skenario yang sempurna. Anda harus menganalisis trade-off dan memilih yang paling optimal secara keseluruhan.
          </p>
        </div>
      </div>

      <div class="card">
        <h2>📊 Data Skenario</h2>
        <div id="scenariosList"></div>
      </div>

      <div class="card">
        <h2>🔍 Analisis Anda</h2>
        <div id="analysisArea"></div>
      </div>

      <div class="card">
        <h2>✅ Kesimpulan & Rekomendasi</h2>
        <div id="conclusionArea"></div>
      </div>
    `;

    renderScenarios();
    renderAnalysis();
    renderConclusion();
  }

  function renderScenarios() {
    const list = document.getElementById('scenariosList');
    list.innerHTML = scenarios.map(scenario => `
      <div class="policy-option" style="margin-bottom: 2rem;">
        <h3 style="color: var(--forest-dark); margin-bottom: 1rem; font-weight: 600;">Skenario ${scenario.id}: ${scenario.name}</h3>
        <p class="description" style="margin-bottom: 1rem; color: #2c3e2d; line-height: 1.7;">${scenario.description}</p>
        
        <table style="width: 100%; margin-top: 1rem;">
          <tr>
            <th style="color: var(--text-light);">Indikator</th>
            <th style="color: var(--text-light);">Tahun 1</th>
            <th style="color: var(--text-light);">Tahun 5</th>
            <th style="color: var(--text-light);">Tahun 10</th>
            <th style="color: var(--text-light);">Trend</th>
          </tr>
          ${Object.keys(scenario.data).map(key => {
            const values = scenario.data[key];
            const trend = values.tahun10 > values.tahun1 ? '📈 Naik' : values.tahun10 < values.tahun1 ? '📉 Turun' : '➡️ Stabil';
            const color = key === 'deforestasi' || key === 'emisi' 
              ? (values.tahun10 < values.tahun1 ? 'var(--forest-medium)' : '#d32f2f')
              : (values.tahun10 > values.tahun1 ? 'var(--forest-medium)' : '#d32f2f');
            
            return `
              <tr>
                <td style="color: #2c3e2d;"><strong>${getIndicatorName(key)}</strong></td>
                <td style="color: #2c3e2d;">${formatValue(key, values.tahun1)}</td>
                <td style="color: #2c3e2d;">${formatValue(key, values.tahun5)}</td>
                <td style="color: #2c3e2d;">${formatValue(key, values.tahun10)}</td>
                <td style="color: ${color}; font-weight: 600;">${trend}</td>
              </tr>
            `;
          }).join('')}
        </table>
      </div>
    `).join('');
  }

  function formatValue(key, value) {
    if (key === 'deforestasi') return `${value.toLocaleString('id-ID')} ha`;
    if (key === 'emisi') return `${value > 0 ? '+' : ''}${value} juta ton CO₂`;
    if (key === 'pdb') return `${value > 0 ? '+' : ''}${value}%`;
    return `${value > 0 ? '+' : ''}${value}`;
  }

  function renderAnalysis() {
    const area = document.getElementById('analysisArea');
    area.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--forest-dark);">
          Pilih Skenario Terbaik:
        </label>
        <select id="selectedScenario" class="btn" style="width: 100%; padding: 12px; font-size: 1rem; color: #2c3e2d; background: white; border: 2px solid var(--forest-lightest);" onchange="updateAnalysis()">
          <option value="" style="color: #666;">-- Pilih Skenario --</option>
          ${scenarios.map(s => `<option value="${s.id}" style="color: #2c3e2d;">Skenario ${s.id}: ${s.name}</option>`).join('')}
        </select>
      </div>

      <div id="analysisDetails" style="display: none;">
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--forest-dark);">
            Identifikasi 3 Variabel Kunci yang Paling Mempengaruhi Hasil:
          </label>
          <div id="keyVariables"></div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--forest-dark);">
            Prediksi Dampak Jangka Panjang (20 tahun):
          </label>
          <textarea id="predictedImpacts" class="btn" style="width: 100%; min-height: 120px; padding: 12px; font-family: 'Poppins', sans-serif; color: #2c3e2d; background: white; border: 2px solid var(--forest-lightest); border-radius: 8px;" 
                    placeholder="Tuliskan prediksi Anda tentang dampak jangka panjang dari skenario yang dipilih..."></textarea>
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--forest-dark);">
            Rekomendasi Implementasi:
          </label>
          <textarea id="recommendation" class="btn" style="width: 100%; min-height: 100px; padding: 12px; font-family: 'Poppins', sans-serif; color: #2c3e2d; background: white; border: 2px solid var(--forest-lightest); border-radius: 8px;" 
                    placeholder="Berikan rekomendasi strategi implementasi untuk memaksimalkan manfaat dan meminimalkan risiko..."></textarea>
        </div>
      </div>
    `;
  }

  function renderConclusion() {
    const area = document.getElementById('conclusionArea');
    area.innerHTML = `
      <div id="conclusionContent" style="padding: 1rem; background: #f1f8f4; border-radius: 8px; min-height: 100px;">
        <p style="color: #666; text-align: center; padding: 2rem;">
          Lengkapi analisis di atas terlebih dahulu untuk melihat kesimpulan.
        </p>
      </div>
      <button class="btn btn-primary" onclick="submitAnalysis()" style="width: 100%; margin-top: 1rem;" id="submitBtn" disabled>
        ✅ Submit Analisis
      </button>
    `;
  }

  window.updateAnalysis = function() {
    const selected = document.getElementById('selectedScenario').value;
    const details = document.getElementById('analysisDetails');
    const submitBtn = document.getElementById('submitBtn');
    
    if (selected) {
      details.style.display = 'block';
      submitBtn.disabled = false;
      
      const scenario = scenarios.find(s => s.id === selected);
      const variables = Object.keys(scenario.data);
      
      document.getElementById('keyVariables').innerHTML = variables.map((key, idx) => `
        <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; margin: 0.3rem 0; background: white; border-radius: 4px; cursor: pointer;">
          <input type="checkbox" value="${key}" onchange="updateKeyVariables()" style="width: 20px; height: 20px; accent-color: var(--forest-medium);">
          <span style="color: #2c3e2d;"><strong>${getIndicatorName(key)}</strong></span>
        </label>
      `).join('');
    } else {
      details.style.display = 'none';
      submitBtn.disabled = true;
    }
  };

  window.updateKeyVariables = function() {
    const checkboxes = document.querySelectorAll('#keyVariables input[type="checkbox"]:checked');
    analysis.keyVariables = Array.from(checkboxes).map(cb => cb.value);
  };

  window.submitAnalysis = function() {
    const selected = document.getElementById('selectedScenario').value;
    const predicted = document.getElementById('predictedImpacts').value;
    const recommendation = document.getElementById('recommendation').value;
    
    if (!selected || analysis.keyVariables.length < 3 || !predicted || !recommendation) {
      alert('Harap lengkapi semua bagian analisis!');
      return;
    }

    const scenario = scenarios.find(s => s.id === selected);
    
    // Evaluate analysis
    let score = 0;
    let feedback = [];

    // Check if scenario C is selected (most balanced)
    if (selected === 'C') {
      score += 30;
      feedback.push('✓ Memilih Skenario Berkelanjutan menunjukkan pemahaman yang baik tentang keseimbangan.');
    } else if (selected === 'B') {
      score += 20;
      feedback.push('Skenario Konservasi Ketat baik untuk lingkungan namun kurang optimal untuk ekonomi.');
    } else {
      score += 10;
      feedback.push('Skenario Ekspansi Ekonomi memberikan pertumbuhan tinggi namun dengan risiko lingkungan besar.');
    }

    // Check key variables
    const importantVars = ['deforestasi', 'emisi', 'biodiversitas'];
    const selectedImportant = analysis.keyVariables.filter(v => importantVars.includes(v)).length;
    score += selectedImportant * 15;
    feedback.push(`Identifikasi variabel kunci: ${selectedImportant}/3 variabel penting teridentifikasi.`);

    // Check analysis quality (simple heuristic)
    const analysisLength = predicted.length + recommendation.length;
    if (analysisLength > 200) {
      score += 20;
      feedback.push('✓ Analisis cukup detail dan mendalam.');
    } else {
      feedback.push('Analisis bisa lebih detail dan mendalam.');
    }

    // Check if mentions trade-offs
    if (predicted.toLowerCase().includes('trade-off') || predicted.toLowerCase().includes('tradeoff') || 
        recommendation.toLowerCase().includes('trade-off') || recommendation.toLowerCase().includes('tradeoff') ||
        predicted.toLowerCase().includes('keseimbangan') || recommendation.toLowerCase().includes('keseimbangan')) {
      score += 20;
      feedback.push('✓ Memahami konsep trade-off dan keseimbangan.');
    }

    showAnalysisResults({
      score: Math.min(100, score),
      scenario: scenario.name,
      feedback,
      predicted,
      recommendation
    });
  };

  function showAnalysisResults(data) {
    const modal = document.getElementById('resultsModal');
    const content = document.getElementById('resultsContent');
    
    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">${data.score >= 70 ? '🎉' : data.score >= 50 ? '📊' : '💡'}</div>
        <h2 style="color: var(--forest-dark);">Hasil Evaluasi Analisis</h2>
      </div>

      <div style="background: ${data.score >= 70 ? 'linear-gradient(135deg, var(--forest-lightest) 0%, var(--sky-blue) 100%)' : data.score >= 50 ? 'linear-gradient(135deg, #fff3cd 0%, #ffe082 100%)' : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'}; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h3 style="color: var(--forest-dark); margin-bottom: 1rem;">Skor Analisis: ${data.score}/100</h3>
        <p style="margin-bottom: 0.5rem;"><strong>Skenario yang Dipilih:</strong> ${data.scenario}</p>
      </div>

      <div class="glossary-item">
        <h4>📝 Feedback Analisis</h4>
        ${data.feedback.map(f => `<p style="margin: 0.5rem 0;">${f}</p>`).join('')}
      </div>

      <div class="glossary-item" style="margin-top: 1rem;">
        <h4>💡 Analisis Anda</h4>
        <p><strong>Prediksi Dampak:</strong></p>
        <p style="background: white; padding: 1rem; border-radius: 4px; margin-top: 0.5rem;">${data.predicted}</p>
        <p style="margin-top: 1rem;"><strong>Rekomendasi:</strong></p>
        <p style="background: white; padding: 1rem; border-radius: 4px; margin-top: 0.5rem;">${data.recommendation}</p>
      </div>

      <div style="margin-top: 1.5rem; padding: 1rem; background: #f1f8f4; border-radius: 8px;">
        <h4 style="color: var(--forest-dark); margin-bottom: 0.5rem;">🎯 Kesimpulan</h4>
        <p style="line-height: 1.8;">
          ${data.score >= 70 
            ? 'Analisis Anda sangat baik! Anda menunjukkan pemahaman mendalam tentang kompleksitas pengelolaan hutan dan mampu menganalisis trade-off dengan baik.'
            : data.score >= 50
            ? 'Analisis Anda cukup baik. Pertimbangkan untuk lebih mendalam dalam menganalisis trade-off dan dampak jangka panjang.'
            : 'Analisis Anda menunjukkan pemahaman dasar. Coba lagi dengan lebih memperhatikan variabel kunci dan dampak jangka panjang.'
          }
        </p>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button class="btn" onclick="closeResults(); location.reload();" style="flex: 1;">🔄 Coba Lagi</button>
        <button class="btn btn-primary" onclick="window.location.href='games.html'" style="flex: 1;">🏠 Kembali ke Menu</button>
      </div>
    `;

    modal.style.display = 'block';
  }

  window.closeResults = function() {
    document.getElementById('resultsModal').style.display = 'none';
  };

  renderGame();
}

// ============================================
// GAME 3: STRATEGIC PLANNING
// ============================================
function initStrategicPlanning() {
  document.getElementById('gameTitle').textContent = '🗺️ Perencanaan Strategis';
  document.getElementById('gameSubtitle').textContent = 'Rencanakan Strategi 10 Tahun dengan Multiple Constraints';
  
  const years = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let plan = {
    year1: [], year2: [], year3: [], year4: [], year5: [],
    year6: [], year7: [], year8: [], year9: [], year10: []
  };
  
  let resources = {
    budget: 100000, // 100 miliar
    politicalCapital: 100,
    publicSupport: 70,
    internationalSupport: 60
  };
  
  const strategies = [
    {
      id: 'moratorium',
      name: 'Moratorium Deforestasi',
      cost: {budget: 5000, politicalCapital: 20},
      effects: {lingkungan: 15, emisi: -10, legitimasi: 10, ekonomi: -5},
      prerequisites: [],
      description: 'Menghentikan sementara semua izin pembukaan hutan baru. Dampak langsung terhadap lingkungan namun berisiko ekonomi.',
      yearAvailable: 1
    },
    {
      id: 'restorasi',
      name: 'Program Restorasi Besar-besaran',
      cost: {budget: 15000, politicalCapital: 10},
      effects: {lingkungan: 25, biodiversitas: 20, emisi: -20, legitimasi: 15},
      prerequisites: [],
      description: 'Restorasi 500.000 hektar lahan terdegradasi. Investasi besar namun hasil jangka panjang.',
      yearAvailable: 1
    },
    {
      id: 'intensifikasi',
      name: 'Intensifikasi Lahan Terdegradasi',
      cost: {budget: 8000, politicalCapital: 5},
      effects: {ekonomi: 15, lingkungan: 10, sosial: 8},
      prerequisites: [],
      description: 'Meningkatkan produktivitas lahan yang sudah terdegradasi tanpa membuka hutan baru.',
      yearAvailable: 1
    },
    {
      id: 'agroforestri',
      name: 'Ekspansi Agroforestri',
      cost: {budget: 10000, politicalCapital: 8},
      effects: {ekonomi: 12, lingkungan: 18, sosial: 15, biodiversitas: 10},
      prerequisites: [],
      description: 'Mengembangkan sistem agroforestri di lahan masyarakat. Kombinasi ekonomi dan konservasi.',
      yearAvailable: 1
    },
    {
      id: 'teknologi',
      name: 'Investasi Teknologi Monitoring',
      cost: {budget: 3000, politicalCapital: 3},
      effects: {legitimasi: 8, lingkungan: 5},
      prerequisites: [],
      description: 'Teknologi satelit dan AI untuk monitoring hutan real-time. Meningkatkan transparansi.',
      yearAvailable: 1
    },
    {
      id: 'masyarakat',
      name: 'Pemberdayaan Masyarakat Adat',
      cost: {budget: 6000, politicalCapital: 15},
      effects: {sosial: 20, legitimasi: 25, lingkungan: 12, biodiversitas: 15},
      prerequisites: [],
      description: 'Pengakuan dan pemberdayaan hak masyarakat adat dalam pengelolaan hutan.',
      yearAvailable: 2
    },
    {
      id: 'ekonomi',
      name: 'Ekonomi Hijau',
      cost: {budget: 12000, politicalCapital: 12},
      effects: {ekonomi: 18, lingkungan: 15, legitimasi: 12, emisi: -8},
      prerequisites: ['teknologi'],
      description: 'Mengembangkan ekonomi berbasis konservasi: ekowisata, jasa ekosistem, karbon offset.',
      yearAvailable: 3
    },
    {
      id: 'penegakan',
      name: 'Penegakan Hukum Kuat',
      cost: {budget: 4000, politicalCapital: 25},
      effects: {lingkungan: 20, legitimasi: 15, emisi: -15},
      prerequisites: [],
      description: 'Memperkuat penegakan hukum terhadap illegal logging dan pembakaran hutan.',
      yearAvailable: 2
    },
    {
      id: 'riset',
      name: 'Riset & Inovasi',
      cost: {budget: 5000, politicalCapital: 5},
      effects: {legitimasi: 10, lingkungan: 8},
      prerequisites: [],
      description: 'Program riset untuk teknologi konservasi dan pengelolaan hutan berkelanjutan.',
      yearAvailable: 1
    },
    {
      id: 'kerjasama',
      name: 'Kerjasama Internasional',
      cost: {budget: 2000, politicalCapital: 8},
      effects: {legitimasi: 20, internationalSupport: 15, emisi: -5},
      prerequisites: [],
      description: 'Kerjasama dengan negara lain dan organisasi internasional untuk pendanaan dan teknologi.',
      yearAvailable: 2
    }
  ];
  
  let cumulativeEffects = {
    lingkungan: 70, ekonomi: 70, biodiversitas: 70, sosial: 70,
    emisi: 40, air: 70, legitimasi: 60
  };
  
  function renderGame() {
    const content = document.getElementById('gameContent');
    
    content.innerHTML = `
      <div class="card">
        <h2>📋 Instruksi Game</h2>
        <div class="education-section">
          <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1rem;">
            <strong>Tugas Anda:</strong> Rencanakan strategi pengelolaan hutan selama 10 tahun ke depan. 
            Setiap tahun, Anda dapat memilih beberapa strategi untuk diimplementasikan.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div style="padding: 1rem; background: #f1f8f4; border-radius: 8px;">
              <strong>💰 Budget:</strong> Rp ${resources.budget.toLocaleString('id-ID')} juta
            </div>
            <div style="padding: 1rem; background: #f1f8f4; border-radius: 8px;">
              <strong>🏛️ Political Capital:</strong> ${resources.politicalCapital}/100
            </div>
            <div style="padding: 1rem; background: #f1f8f4; border-radius: 8px;">
              <strong>👥 Public Support:</strong> ${resources.publicSupport}/100
            </div>
            <div style="padding: 1rem; background: #f1f8f4; border-radius: 8px;">
              <strong>🌍 International Support:</strong> ${resources.internationalSupport}/100
            </div>
          </div>
          <p style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-left: 4px solid #ff9800; border-radius: 4px;">
            <strong>⚠️ Tantangan:</strong> Setiap strategi memerlukan budget dan political capital. 
            Beberapa strategi memerlukan prerequisite. Rencanakan dengan hati-hati untuk mencapai target akhir!
          </p>
        </div>
      </div>

      <div class="card">
        <h2>🎯 Target Akhir (Tahun 10)</h2>
        <div class="data">
          <p>🌳 <strong>Lingkungan:</strong> Minimal 85</p>
          <p>💰 <strong>Ekonomi:</strong> Minimal 75</p>
          <p>🐾 <strong>Biodiversitas:</strong> Minimal 80</p>
          <p>👥 <strong>Sosial:</strong> Minimal 80</p>
          <p>⚠️ <strong>Emisi:</strong> Maksimal 20</p>
          <p>🧾 <strong>Legitimasi:</strong> Minimal 85</p>
        </div>
      </div>

      <div class="card">
        <h2>📊 Status Saat Ini</h2>
        <div class="data">
          <p>🌳 <strong>Lingkungan:</strong> <span id="currLing">${cumulativeEffects.lingkungan}</span></p>
          <p>💰 <strong>Ekonomi:</strong> <span id="currEko">${cumulativeEffects.ekonomi}</span></p>
          <p>🐾 <strong>Biodiversitas:</strong> <span id="currBio">${cumulativeEffects.biodiversitas}</span></p>
          <p>👥 <strong>Sosial:</strong> <span id="currSos">${cumulativeEffects.sosial}</span></p>
          <p>⚠️ <strong>Emisi:</strong> <span id="currEmi">${cumulativeEffects.emisi}</span></p>
          <p>🧾 <strong>Legitimasi:</strong> <span id="currLeg">${cumulativeEffects.legitimasi}</span></p>
        </div>
      </div>

      <div class="card">
        <h2>📅 Rencana Strategis (10 Tahun)</h2>
        <div id="planningArea"></div>
      </div>

      <div class="card">
        <h2>📋 Strategi yang Tersedia</h2>
        <div id="strategiesList"></div>
      </div>

      <div class="card">
        <div style="display: flex; gap: 1rem;">
          <button class="btn" onclick="resetPlan()" style="flex: 1;">🔄 Reset Rencana</button>
          <button class="btn btn-primary" onclick="submitPlan()" style="flex: 2;">✅ Submit Rencana Strategis</button>
        </div>
      </div>
    `;

    renderPlanningArea();
    renderStrategies();
  }

  function renderPlanningArea() {
    const area = document.getElementById('planningArea');
    area.innerHTML = years.map(year => {
      const yearStrategies = plan[`year${year}`] || [];
      return `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f1f8f4; border-radius: 8px; border-left: 4px solid var(--forest-medium);">
          <h3 style="color: var(--forest-dark); margin-bottom: 0.5rem;">Tahun ${year}</h3>
          <div id="year${year}Strategies" style="min-height: 50px; padding: 0.5rem; background: white; border-radius: 4px; margin-top: 0.5rem;">
            ${yearStrategies.length > 0 
              ? yearStrategies.map(s => `<span style="display: inline-block; padding: 0.3rem 0.8rem; margin: 0.2rem; background: var(--forest-lightest); border-radius: 4px; color: var(--forest-dark);">
                ${strategies.find(st => st.id === s).name} 
                <button onclick="removeStrategy(${year}, '${s}')" style="margin-left: 0.5rem; background: #d32f2f; color: white; border: none; border-radius: 3px; cursor: pointer; padding: 0 5px;">×</button>
              </span>`).join('')
              : '<span style="color: #999;">Belum ada strategi dipilih</span>'
            }
          </div>
        </div>
      `;
    }).join('');
  }

  function renderStrategies() {
    const list = document.getElementById('strategiesList');
    list.innerHTML = strategies.map(strategy => {
      const isAvailable = strategy.yearAvailable <= getCurrentYear();
      const prerequisitesMet = strategy.prerequisites.every(prereq => 
        years.some(year => plan[`year${year}`]?.includes(prereq))
      );
      const canSelect = isAvailable && prerequisitesMet;
      
      return `
        <div class="policy-option" style="${!canSelect ? 'opacity: 0.6;' : ''}">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <h4>${strategy.name} ${!isAvailable ? '(Tersedia tahun ' + strategy.yearAvailable + ')' : ''}</h4>
              <p class="description">${strategy.description}</p>
              <div style="margin-top: 0.5rem;">
                <strong>💰 Biaya:</strong> Budget Rp ${strategy.cost.budget.toLocaleString('id-ID')} juta, 
                Political Capital ${strategy.cost.politicalCapital}
              </div>
              ${strategy.prerequisites.length > 0 
                ? `<div style="margin-top: 0.5rem; color: #ff9800;">
                    <strong>📋 Prerequisite:</strong> ${strategy.prerequisites.map(p => strategies.find(s => s.id === p).name).join(', ')}
                  </div>`
                : ''
              }
              <div style="margin-top: 0.5rem; padding: 0.5rem; background: #f1f8f4; border-radius: 4px;">
                <strong>📈 Dampak:</strong> 
                ${Object.entries(strategy.effects).map(([key, val]) => 
                  `<span style="margin-right: 0.5rem; color: ${val > 0 ? 'var(--forest-medium)' : '#d32f2f'};">
                    ${getIndicatorName(key)} ${val > 0 ? '+' : ''}${val}
                  </span>`
                ).join('')}
              </div>
            </div>
          </div>
          ${canSelect ? `
            <div style="margin-top: 1rem;">
              <label style="display: block; margin-bottom: 0.5rem; color: var(--forest-dark); font-weight: 600;">
                Pilih Tahun Implementasi:
              </label>
              <select id="yearSelect_${strategy.id}" style="width: 100%; padding: 8px; border: 2px solid var(--forest-lightest); border-radius: 6px; color: #2c3e2d;">
                <option value="">-- Pilih Tahun --</option>
                ${years.filter(y => y >= strategy.yearAvailable).map(y => 
                  `<option value="${y}">Tahun ${y}</option>`
                ).join('')}
              </select>
              <button class="btn" onclick="addStrategy('${strategy.id}')" style="width: 100%; margin-top: 0.5rem;">
                ➕ Tambahkan ke Rencana
              </button>
            </div>
          ` : '<p style="margin-top: 1rem; color: #999;">Strategi belum tersedia atau prerequisite belum terpenuhi</p>'}
        </div>
      `;
    }).join('');
  }

  function getCurrentYear() {
    // Return the latest year that has strategies
    for (let i = years.length; i >= 1; i--) {
      if (plan[`year${i}`] && plan[`year${i}`].length > 0) {
        return i;
      }
    }
    return 1;
  }

  function addStrategy(strategyId) {
    const yearSelect = document.getElementById(`yearSelect_${strategyId}`);
    const year = parseInt(yearSelect.value);
    
    if (!year) {
      alert('Pilih tahun terlebih dahulu!');
      return;
    }
    
    const strategy = strategies.find(s => s.id === strategyId);
    
    // Check if already added to this year
    if (plan[`year${year}`]?.includes(strategyId)) {
      alert('Strategi ini sudah ditambahkan di tahun tersebut!');
      return;
    }
    
    // Check resources
    if (resources.budget < strategy.cost.budget) {
      alert('Budget tidak mencukupi!');
      return;
    }
    
    if (resources.politicalCapital < strategy.cost.politicalCapital) {
      alert('Political capital tidak mencukupi!');
      return;
    }
    
    // Add strategy
    if (!plan[`year${year}`]) {
      plan[`year${year}`] = [];
    }
    plan[`year${year}`].push(strategyId);
    
    // Deduct resources
    resources.budget -= strategy.cost.budget;
    resources.politicalCapital -= strategy.cost.politicalCapital;
    
    // Apply effects
    Object.keys(cumulativeEffects).forEach(key => {
      cumulativeEffects[key] += strategy.effects[key] || 0;
    });
    
    // Update international support
    if (strategy.effects.internationalSupport) {
      resources.internationalSupport += strategy.effects.internationalSupport;
    }
    
    // Update public support based on legitimacy
    if (cumulativeEffects.legitimasi > 80) {
      resources.publicSupport = Math.min(100, resources.publicSupport + 2);
    }
    
    renderGame();
  }

  function removeStrategy(year, strategyId) {
    const strategy = strategies.find(s => s.id === strategyId);
    
    // Remove from plan
    plan[`year${year}`] = plan[`year${year}`].filter(id => id !== strategyId);
    
    // Return resources
    resources.budget += strategy.cost.budget;
    resources.politicalCapital += strategy.cost.politicalCapital;
    
    // Remove effects
    Object.keys(cumulativeEffects).forEach(key => {
      cumulativeEffects[key] -= strategy.effects[key] || 0;
    });
    
    renderGame();
  }

  function resetPlan() {
    if (confirm('Apakah Anda yakin ingin mereset seluruh rencana?')) {
      plan = {
        year1: [], year2: [], year3: [], year4: [], year5: [],
        year6: [], year7: [], year8: [], year9: [], year10: []
      };
      resources = {
        budget: 100000,
        politicalCapital: 100,
        publicSupport: 70,
        internationalSupport: 60
      };
      cumulativeEffects = {
        lingkungan: 70, ekonomi: 70, biodiversitas: 70, sosial: 70,
        emisi: 40, air: 70, legitimasi: 60
      };
      renderGame();
    }
  }

  function submitPlan() {
    const targets = {
      lingkungan: 85, ekonomi: 75, biodiversitas: 80,
      sosial: 80, emisi: 20, legitimasi: 85
    };
    
    const met = Object.keys(targets).every(key => {
      if (key === 'emisi') {
        return cumulativeEffects[key] <= targets[key];
      }
      return cumulativeEffects[key] >= targets[key];
    });
    
    let score = 0;
    let feedback = [];
    
    // Calculate score
    Object.keys(targets).forEach(key => {
      const diff = key === 'emisi' 
        ? Math.max(0, cumulativeEffects[key] - targets[key])
        : Math.max(0, targets[key] - cumulativeEffects[key]);
      score += diff === 0 ? 100 : Math.max(0, 100 - diff * 2);
    });
    score = score / Object.keys(targets).length;
    
    // Check resource efficiency
    const budgetUsed = 100000 - resources.budget;
    const efficiency = budgetUsed > 0 ? (score / (budgetUsed / 1000)).toFixed(2) : 0;
    
    // Check plan coherence
    let coherence = 0;
    years.forEach(year => {
      if (plan[`year${year}`] && plan[`year${year}`].length > 0) {
        coherence += 10;
      }
    });
    
    if (coherence === 100) {
      feedback.push('✓ Rencana mencakup semua 10 tahun');
    }
    
    if (met) {
      feedback.push('✓ Semua target tercapai');
      score += 20;
    } else {
      feedback.push('Beberapa target belum tercapai');
    }
    
    if (resources.budget < 10000) {
      feedback.push('Budget digunakan dengan efisien');
    }
    
    if (resources.politicalCapital > 20) {
      feedback.push('Political capital masih tersedia untuk strategi tambahan');
    }
    
    showPlanResults({
      met,
      score: Math.min(100, score),
      efficiency,
      totals: cumulativeEffects,
      targets,
      budgetUsed,
      coherence,
      feedback
    });
  }

  function showPlanResults(data) {
    const modal = document.getElementById('resultsModal');
    const content = document.getElementById('resultsContent');
    
    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">${data.score >= 80 ? '🎉' : data.score >= 60 ? '📊' : '💡'}</div>
        <h2 style="color: var(--forest-dark);">Hasil Evaluasi Rencana Strategis</h2>
      </div>

      <div style="background: ${data.score >= 80 ? 'linear-gradient(135deg, var(--forest-lightest) 0%, var(--sky-blue) 100%)' : data.score >= 60 ? 'linear-gradient(135deg, #fff3cd 0%, #ffe082 100%)' : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'}; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h3 style="color: var(--forest-dark); margin-bottom: 1rem;">Skor Rencana: ${data.score.toFixed(1)}/100</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 8px;">
            <strong>Budget Digunakan:</strong><br>
            <span style="font-size: 1.2rem; color: var(--forest-medium);">Rp ${data.budgetUsed.toLocaleString('id-ID')} juta</span>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 8px;">
            <strong>Koherensi Rencana:</strong><br>
            <span style="font-size: 1.2rem; color: var(--forest-medium);">${data.coherence}%</span>
          </div>
        </div>
      </div>

      <div class="glossary-item">
        <h4>📊 Detail Pencapaian Target</h4>
        ${Object.keys(data.targets).map(key => {
          const achieved = key === 'emisi' ? data.totals[key] <= data.targets[key] : data.totals[key] >= data.targets[key];
          return `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; margin: 0.3rem 0; background: ${achieved ? '#e8f5e9' : '#ffebee'}; border-radius: 4px;">
              <span><strong>${getIndicatorName(key)}:</strong></span>
              <span>${data.totals[key]} / ${key === 'emisi' ? '≤' : '≥'} ${data.targets[key]} 
              <span style="color: ${achieved ? 'var(--forest-medium)' : '#d32f2f'};">
                ${achieved ? '✓' : '✗'}
              </span></span>
            </div>
          `;
        }).join('')}
      </div>

      <div style="margin-top: 1.5rem; padding: 1rem; background: #f1f8f4; border-radius: 8px;">
        <h4 style="color: var(--forest-dark); margin-bottom: 0.5rem;">💡 Feedback</h4>
        ${data.feedback.map(f => `<p style="margin: 0.5rem 0;">${f}</p>`).join('')}
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button class="btn" onclick="closeResults(); resetPlan();" style="flex: 1;">🔄 Coba Lagi</button>
        <button class="btn btn-primary" onclick="window.location.href='games.html'" style="flex: 1;">🏠 Kembali ke Menu</button>
      </div>
    `;

    modal.style.display = 'block';
  }

  window.addStrategy = addStrategy;
  window.removeStrategy = removeStrategy;
  window.resetPlan = resetPlan;
  window.submitPlan = submitPlan;
  window.closeResults = function() {
    document.getElementById('resultsModal').style.display = 'none';
  };

  renderGame();
}

// Helper Functions
function getIndicatorName(key) {
  const names = {
    lingkungan: '🌳 Lingkungan',
    ekonomi: '💰 Ekonomi',
    biodiversitas: '🐾 Biodiversitas',
    sosial: '👥 Sosial',
    emisi: '⚠️ Emisi',
    air: '💧 Air',
    legitimasi: '🧾 Legitimasi',
    deforestasi: '🌲 Deforestasi',
    pdb: '📈 PDB'
  };
  return names[key] || key;
}

