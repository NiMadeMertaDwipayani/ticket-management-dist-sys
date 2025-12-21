// Mini Games - Improved Simple and Fun Games
const miniGameType = localStorage.getItem('miniGameType') || 'quiz';

document.addEventListener('DOMContentLoaded', function() {
  switch(miniGameType) {
    case 'quiz':
      initQuiz();
      break;
    case 'truefalse':
      initTrueFalse();
      break;
    case 'quickmatch':
      initQuickMatch();
      break;
    case 'puzzle':
      initPuzzle();
      break;
    case 'category':
      initCategory();
      break;
    default:
      initQuiz();
  }
});

// ============================================
// QUIZ GAME (IMPROVED)
// ============================================
function initQuiz() {
  document.getElementById('gameTitle').textContent = '❓ Quiz Hutan Indonesia';
  document.getElementById('gameSubtitle').textContent = 'Uji Pengetahuan Anda!';
  
  const questions = [
    {
      question: 'Berapa persen spesies dunia yang ada di Indonesia?',
      options: ['10%', '17%', '25%', '30%'],
      correct: 1,
      explanation: 'Indonesia memiliki 17% spesies dunia meskipun hanya mencakup 1,3% luas daratan global.'
    },
    {
      question: 'Berapa luas hutan Indonesia saat ini (2024)?',
      options: ['80 juta hektar', '100 juta hektar', '120,3 juta hektar', '150 juta hektar'],
      correct: 2,
      explanation: 'Luas hutan Indonesia saat ini sekitar 120,3 juta hektar berdasarkan data KLHK 2024.'
    },
    {
      question: 'Apa fungsi utama hutan gambut dalam mengurangi perubahan iklim?',
      options: ['Menyerap air hujan', 'Menyimpan karbon dalam jumlah besar', 'Menjadi habitat satwa', 'Mencegah banjir'],
      correct: 1,
      explanation: 'Hutan gambut menyimpan karbon dalam jumlah sangat besar, bahkan lebih dari hutan biasa.'
    },
    {
      question: 'Berapa jumlah Orangutan yang tersisa di Kalimantan?',
      options: ['30.000 ekor', '57.000 ekor', '80.000 ekor', '100.000 ekor'],
      correct: 1,
      explanation: 'Populasi Orangutan di Kalimantan diperkirakan sekitar 57.000 ekor dan terus menurun.'
    },
    {
      question: 'Apa yang dimaksud dengan FOLU Net Sink 2030?',
      options: ['Target deforestasi nol', 'Target emisi nol dari sektor kehutanan', 'Target restorasi 20 juta hektar', 'Target konservasi 50% hutan'],
      correct: 1,
      explanation: 'FOLU Net Sink 2030 adalah target Indonesia untuk mencapai net sink (penyerapan lebih besar dari emisi) dari sektor kehutanan pada 2030.'
    },
    {
      question: 'Berapa persen kontribusi sektor kehutanan terhadap PDB Indonesia?',
      options: ['1,5%', '2,5%', '3,5%', '5%'],
      correct: 2,
      explanation: 'Sektor kehutanan dan perkebunan menyumbang sekitar 3,5% terhadap PDB nasional.'
    },
    {
      question: 'Apa yang dimaksud dengan agroforestri?',
      options: ['Pertanian monokultur', 'Sistem yang menggabungkan pohon dengan tanaman pertanian', 'Hutan produksi murni', 'Konservasi tanpa pemanfaatan'],
      correct: 1,
      explanation: 'Agroforestri adalah sistem yang menggabungkan pohon dengan tanaman pertanian untuk manfaat ganda.'
    },
    {
      question: 'Berapa target restorasi hutan Indonesia hingga 2030?',
      options: ['10 juta hektar', '12 juta hektar', '14 juta hektar', '16 juta hektar'],
      correct: 2,
      explanation: 'Indonesia menargetkan restorasi 14 juta hektar lahan terdegradasi hingga 2030.'
    },
    {
      question: 'Apa dampak utama deforestasi terhadap siklus air?',
      options: ['Meningkatkan kapasitas penyerapan air', 'Mengurangi kapasitas penyerapan air hingga 40%', 'Tidak ada dampak', 'Meningkatkan kualitas air'],
      correct: 1,
      explanation: 'Deforestasi mengurangi kapasitas penyerapan air hingga 40%, meningkatkan risiko banjir dan kekeringan.'
    },
    {
      question: 'Apa yang dimaksud dengan RSPO?',
      options: ['Regulasi Sawit Indonesia', 'Roundtable on Sustainable Palm Oil', 'Rencana Strategis Perkebunan Organik', 'Riset Sawit dan Perkebunan'],
      correct: 1,
      explanation: 'RSPO adalah Roundtable on Sustainable Palm Oil, standar internasional untuk sawit berkelanjutan.'
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let timeStart = Date.now();

  function renderGame() {
    const content = document.getElementById('gameContent');
    
    if (currentQuestion < questions.length) {
      const q = questions[currentQuestion];
      
      content.innerHTML = `
        <div class="card">
          <div style="text-align: center; margin-bottom: 1rem;">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${((currentQuestion + 1) / questions.length) * 100}%;">
                ${currentQuestion + 1}/${questions.length}
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, var(--forest-lightest) 0%, var(--sky-blue) 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
            <h2 style="color: var(--forest-dark); margin-bottom: 0;">${q.question}</h2>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            ${q.options.map((option, idx) => `
              <button class="btn option-btn" 
                      onclick="selectAnswer(${idx})"
                      style="text-align: left; padding: 1.2rem; font-size: 1rem; background: white; border: 2px solid var(--forest-lightest); color: #2c3e2d; transition: all 0.3s;">
                <span style="font-weight: 700; color: var(--forest-medium); margin-right: 0.5rem;">${String.fromCharCode(65 + idx)}.</span>
                ${option}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      showResults();
    }
  }

  window.selectAnswer = function(answerIdx) {
    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach(btn => btn.disabled = true);
    
    if (answerIdx === q.correct) {
      score++;
      buttons[answerIdx].style.background = '#e8f5e9';
      buttons[answerIdx].style.borderColor = 'var(--forest-medium)';
      buttons[answerIdx].style.transform = 'scale(1.05)';
    } else {
      buttons[answerIdx].style.background = '#ffebee';
      buttons[answerIdx].style.borderColor = '#d32f2f';
      buttons[q.correct].style.background = '#e8f5e9';
      buttons[q.correct].style.borderColor = 'var(--forest-medium)';
    }
    
    setTimeout(() => {
      const explanation = document.createElement('div');
      explanation.className = 'card';
      explanation.style.background = '#fff3cd';
      explanation.style.borderLeft = '4px solid #ff9800';
      explanation.innerHTML = `
        <p><strong>💡 Penjelasan:</strong> ${q.explanation}</p>
        <button class="btn btn-primary" onclick="nextQuestion()" style="width: 100%; margin-top: 1rem;">
          ${currentQuestion < questions.length - 1 ? 'Pertanyaan Berikutnya →' : 'Lihat Hasil'}
        </button>
      `;
      document.getElementById('gameContent').appendChild(explanation);
    }, 800);
  };

  window.nextQuestion = function() {
    currentQuestion++;
    renderGame();
  };

  function showResults() {
    const content = document.getElementById('gameContent');
    const percentage = (score / questions.length * 100).toFixed(0);
    const timeSpent = Math.floor((Date.now() - timeStart) / 1000);
    
    content.innerHTML = `
      <div class="card" style="text-align: center;">
        <div style="font-size: 5rem; margin-bottom: 1rem;">
          ${percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
        </div>
        <h2 style="color: var(--forest-dark);">Hasil Quiz</h2>
        <div style="margin: 2rem 0;">
          <div style="font-size: 4rem; color: var(--forest-medium); font-weight: 700;">
            ${score}/${questions.length}
          </div>
          <p style="font-size: 1.5rem; color: var(--forest-dark); margin-top: 0.5rem;">
            Skor: ${percentage}%
          </p>
          <p style="color: var(--forest-medium); margin-top: 0.5rem;">
            Waktu: ${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')}
          </p>
        </div>
        <div style="background: ${percentage >= 80 ? '#e8f5e9' : percentage >= 60 ? '#fff3cd' : '#ffebee'}; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
          <p style="font-size: 1.1rem; line-height: 1.8;">
            ${percentage >= 80 
              ? '🎉 Luar biasa! Pengetahuan Anda tentang hutan Indonesia sangat baik!'
              : percentage >= 60
              ? '👍 Bagus! Anda memiliki pemahaman yang cukup baik tentang hutan Indonesia.'
              : '💪 Terus belajar! Masih ada banyak hal menarik tentang hutan Indonesia yang bisa dipelajari.'
            }
          </p>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn" onclick="location.reload()" style="flex: 1;">🔄 Coba Lagi</button>
          <button class="btn btn-primary" onclick="window.location.href='mini-games.html'" style="flex: 1;">🏠 Kembali ke Menu</button>
        </div>
      </div>
    `;
  }

  renderGame();
}

// ============================================
// TRUE/FALSE GAME
// ============================================
function initTrueFalse() {
  document.getElementById('gameTitle').textContent = '✅ Benar atau Salah';
  document.getElementById('gameSubtitle').textContent = 'Cepat! Tentukan Benar atau Salah!';
  
  const statements = [
    {statement: 'Indonesia memiliki 17% spesies dunia.', answer: true, explanation: 'Benar! Indonesia memiliki 17% spesies dunia meskipun hanya 1,3% luas daratan global.'},
    {statement: 'Luas hutan Indonesia saat ini sekitar 150 juta hektar.', answer: false, explanation: 'Salah! Luas hutan Indonesia sekitar 120,3 juta hektar (2024).'},
    {statement: 'Hutan gambut menyimpan karbon lebih banyak dari hutan biasa.', answer: true, explanation: 'Benar! Hutan gambut adalah penyimpan karbon terbesar di dunia.'},
    {statement: 'Deforestasi meningkatkan kapasitas penyerapan air.', answer: false, explanation: 'Salah! Deforestasi mengurangi kapasitas penyerapan air hingga 40%.'},
    {statement: 'Agroforestri menggabungkan pohon dengan tanaman pertanian.', answer: true, explanation: 'Benar! Agroforestri adalah sistem yang menggabungkan pohon dengan tanaman pertanian.'},
    {statement: 'Target restorasi hutan Indonesia hingga 2030 adalah 20 juta hektar.', answer: false, explanation: 'Salah! Target restorasi adalah 14 juta hektar hingga 2030.'},
    {statement: 'RSPO adalah standar internasional untuk sawit berkelanjutan.', answer: true, explanation: 'Benar! RSPO (Roundtable on Sustainable Palm Oil) adalah standar internasional.'},
    {statement: 'Populasi Orangutan di Kalimantan sekitar 100.000 ekor.', answer: false, explanation: 'Salah! Populasi Orangutan di Kalimantan sekitar 57.000 ekor dan terus menurun.'},
    {statement: 'FOLU Net Sink 2030 adalah target emisi nol dari sektor kehutanan.', answer: true, explanation: 'Benar! FOLU Net Sink 2030 adalah target net sink (penyerapan lebih besar dari emisi).'},
    {statement: 'Sektor kehutanan menyumbang 5% terhadap PDB Indonesia.', answer: false, explanation: 'Salah! Sektor kehutanan menyumbang sekitar 3,5% terhadap PDB nasional.'}
  ];

  let currentIndex = 0;
  let score = 0;
  let timeStart = Date.now();

  function renderGame() {
    const content = document.getElementById('gameContent');
    
    if (currentIndex < statements.length) {
      const s = statements[currentIndex];
      
      content.innerHTML = `
        <div class="card">
          <div style="text-align: center; margin-bottom: 1rem;">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${((currentIndex + 1) / statements.length) * 100}%;">
                ${currentIndex + 1}/${statements.length}
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, var(--forest-lightest) 0%, var(--sky-blue) 100%); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; min-height: 150px; display: flex; align-items: center; justify-content: center;">
            <h2 style="color: var(--forest-dark); margin: 0; font-size: 1.5rem; text-align: center;">
              ${s.statement}
            </h2>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
            <button class="btn btn-primary" 
                    onclick="selectAnswer(true)"
                    style="padding: 2rem; font-size: 1.5rem; background: linear-gradient(135deg, var(--forest-medium) 0%, var(--forest-light) 100%);">
              ✅ BENAR
            </button>
            <button class="btn" 
                    onclick="selectAnswer(false)"
                    style="padding: 2rem; font-size: 1.5rem; background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%); color: white;">
              ❌ SALAH
            </button>
          </div>
        </div>
      `;
    } else {
      showTrueFalseResults();
    }
  }

  window.selectAnswer = function(answer) {
    const s = statements[currentIndex];
    
    if (answer === s.answer) {
      score++;
    }
    
    const explanation = document.createElement('div');
    explanation.className = 'card';
    explanation.style.background = answer === s.answer ? '#e8f5e9' : '#ffebee';
    explanation.style.borderLeft = `4px solid ${answer === s.answer ? 'var(--forest-medium)' : '#d32f2f'}`;
    explanation.innerHTML = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="font-size: 3rem;">${answer === s.answer ? '✅' : '❌'}</div>
        <h3 style="color: var(--forest-dark);">${answer === s.answer ? 'Benar!' : 'Salah!'}</h3>
      </div>
      <p style="line-height: 1.8;">${s.explanation}</p>
      <button class="btn btn-primary" onclick="nextStatement()" style="width: 100%; margin-top: 1rem;">
        ${currentIndex < statements.length - 1 ? 'Pernyataan Berikutnya →' : 'Lihat Hasil'}
      </button>
    `;
    document.getElementById('gameContent').appendChild(explanation);
  };

  window.nextStatement = function() {
    currentIndex++;
    renderGame();
  };

  function showTrueFalseResults() {
    const content = document.getElementById('gameContent');
    const percentage = (score / statements.length * 100).toFixed(0);
    const timeSpent = Math.floor((Date.now() - timeStart) / 1000);
    
    content.innerHTML = `
      <div class="card" style="text-align: center;">
        <div style="font-size: 5rem; margin-bottom: 1rem;">${percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}</div>
        <h2 style="color: var(--forest-dark);">Hasil Game</h2>
        <div style="margin: 2rem 0;">
          <div style="font-size: 4rem; color: var(--forest-medium); font-weight: 700;">
            ${score}/${statements.length}
          </div>
          <p style="font-size: 1.5rem; color: var(--forest-dark); margin-top: 0.5rem;">
            Skor: ${percentage}%
          </p>
          <p style="color: var(--forest-medium); margin-top: 0.5rem;">
            Waktu: ${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')}
          </p>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn" onclick="location.reload()" style="flex: 1;">🔄 Coba Lagi</button>
          <button class="btn btn-primary" onclick="window.location.href='mini-games.html'" style="flex: 1;">🏠 Kembali ke Menu</button>
        </div>
      </div>
    `;
  }

  renderGame();
}

// ============================================
// QUICK MATCH GAME
// ============================================
function initQuickMatch() {
  document.getElementById('gameTitle').textContent = '⚡ Quick Match';
  document.getElementById('gameSubtitle').textContent = 'Cocokkan dengan Cepat!';
  
  const pairs = [
    {left: 'Deforestasi', right: 'Penebangan hutan permanen'},
    {left: 'Biodiversitas', right: 'Keanekaragaman hayati'},
    {left: 'Restorasi', right: 'Mengembalikan ekosistem'},
    {left: 'Agroforestri', right: 'Pohon + pertanian'},
    {left: 'Konservasi', right: 'Pelestarian sumber daya'},
    {left: 'Legitimasi', right: 'Dukungan publik'},
    {left: 'Emisi Karbon', right: 'Pelepasan CO₂'},
    {left: 'Ekosistem', right: 'Sistem ekologi'}
  ];

  let leftItems = [...pairs].map(p => p.left).sort(() => Math.random() - 0.5);
  let rightItems = [...pairs].map(p => p.right).sort(() => Math.random() - 0.5);
  let selectedLeft = null;
  let selectedRight = null;
  let matchedPairs = [];
  let attempts = 0;
  let timeStart = Date.now();

  function renderGame() {
    const content = document.getElementById('gameContent');
    
    if (matchedPairs.length === pairs.length) {
      showQuickMatchResults();
      return;
    }

    const availableLeft = leftItems.filter(item => !matchedPairs.some(m => m.left === item));
    const availableRight = rightItems.filter(item => !matchedPairs.some(m => m.right === item));

    content.innerHTML = `
      <div class="card">
        <div style="text-align: center; margin-bottom: 1rem;">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(matchedPairs.length / pairs.length) * 100}%;">
              ${matchedPairs.length}/${pairs.length}
            </div>
          </div>
          <p style="margin-top: 0.5rem; color: var(--forest-medium);">
            Percobaan: ${attempts} | Pasangan: ${matchedPairs.length}/${pairs.length}
          </p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
        <div class="card">
          <h3 style="color: var(--forest-dark); margin-bottom: 1rem;">📝 Konsep</h3>
          <div style="display: flex; flex-direction: column; gap: 0.8rem;">
            ${availableLeft.map(item => {
              const isSelected = selectedLeft === item;
              const isMatched = matchedPairs.some(m => m.left === item);
              return `
                <button class="btn" 
                        onclick="selectLeft('${item}')"
                        style="text-align: left; padding: 1rem; background: ${isMatched ? '#e8f5e9' : isSelected ? 'var(--forest-lightest)' : 'white'}; 
                               border: 2px solid ${isMatched ? 'var(--forest-medium)' : isSelected ? 'var(--forest-medium)' : 'var(--forest-lightest)'};
                               color: #2c3e2d; ${isMatched ? 'opacity: 0.6;' : ''}"
                        ${isMatched ? 'disabled' : ''}>
                  ${item} ${isMatched ? '✓' : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="card">
          <h3 style="color: var(--forest-dark); margin-bottom: 1rem;">📖 Definisi</h3>
          <div style="display: flex; flex-direction: column; gap: 0.8rem;">
            ${availableRight.map(item => {
              const isSelected = selectedRight === item;
              const isMatched = matchedPairs.some(m => m.right === item);
              return `
                <button class="btn" 
                        onclick="selectRight('${item}')"
                        style="text-align: left; padding: 1rem; background: ${isMatched ? '#e8f5e9' : isSelected ? 'var(--forest-lightest)' : 'white'}; 
                               border: 2px solid ${isMatched ? 'var(--forest-medium)' : isSelected ? 'var(--forest-medium)' : 'var(--forest-lightest)'};
                               color: #2c3e2d; ${isMatched ? 'opacity: 0.6;' : ''}"
                        ${isMatched ? 'disabled' : ''}>
                  ${item} ${isMatched ? '✓' : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      ${selectedLeft && selectedRight ? `
        <div class="card" style="background: #fff3cd; border-left: 4px solid #ff9800;">
          <p><strong>Pilihan:</strong> "${selectedLeft}" ↔ "${selectedRight}"</p>
          <button class="btn btn-primary" onclick="checkMatch()" style="width: 100%; margin-top: 1rem;">
            Cek Cocokkan
          </button>
        </div>
      ` : ''}
    `;
  }

  window.selectLeft = function(item) {
    selectedLeft = item;
    renderGame();
  };

  window.selectRight = function(item) {
    selectedRight = item;
    renderGame();
  };

  window.checkMatch = function() {
    attempts++;
    const pair = pairs.find(p => p.left === selectedLeft && p.right === selectedRight);
    
    if (pair) {
      matchedPairs.push(pair);
      selectedLeft = null;
      selectedRight = null;
      renderGame();
    } else {
      alert('Tidak cocok! Coba lagi.');
      selectedLeft = null;
      selectedRight = null;
      renderGame();
    }
  };

  function showQuickMatchResults() {
    const content = document.getElementById('gameContent');
    const timeSpent = Math.floor((Date.now() - timeStart) / 1000);
    const accuracy = ((pairs.length / attempts) * 100).toFixed(0);
    
    content.innerHTML = `
      <div class="card" style="text-align: center;">
        <div style="font-size: 5rem; margin-bottom: 1rem;">🎉</div>
        <h2 style="color: var(--forest-dark);">Selamat! Semua Cocok!</h2>
        <div style="margin: 2rem 0;">
          <p style="font-size: 1.2rem; color: var(--forest-dark);">
            Akurasi: ${accuracy}%
          </p>
          <p style="margin-top: 0.5rem; color: var(--forest-medium);">
            Total Percobaan: ${attempts} | Waktu: ${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')}
          </p>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn" onclick="location.reload()" style="flex: 1;">🔄 Coba Lagi</button>
          <button class="btn btn-primary" onclick="window.location.href='mini-games.html'" style="flex: 1;">🏠 Kembali ke Menu</button>
        </div>
      </div>
    `;
  }

  renderGame();
}

// ============================================
// NUMBER PUZZLE GAME
// ============================================
function initPuzzle() {
  document.getElementById('gameTitle').textContent = '🧩 Puzzle Angka';
  document.getElementById('gameSubtitle').textContent = 'Susun Angka dengan Benar!';
  
  // Puzzle dengan data hutan Indonesia
  const puzzleData = [
    {label: 'Luas Hutan (juta ha)', value: 120.3},
    {label: 'Spesies Dunia (%)', value: 17},
    {label: 'Karbon Tersimpan (miliar ton)', value: 22.6},
    {label: 'Deforestasi Tahunan (ribu ha)', value: 104},
    {label: 'Target Restorasi 2030 (juta ha)', value: 14},
    {label: 'Kontribusi PDB (%)', value: 3.5}
  ];

  let shuffled = [...puzzleData].sort(() => Math.random() - 0.5);
  let matched = [];
  let selectedLabel = null;
  let selectedValue = null;

  function renderGame() {
    const content = document.getElementById('gameContent');
    
    if (matched.length === puzzleData.length) {
      showPuzzleResults();
      return;
    }

    const availableLabels = shuffled.filter(item => !matched.some(m => m.label === item.label));
    const availableValues = shuffled.map(item => item.value).sort(() => Math.random() - 0.5);

    content.innerHTML = `
      <div class="card">
        <div style="text-align: center; margin-bottom: 1rem;">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(matched.length / puzzleData.length) * 100}%;">
              ${matched.length}/${puzzleData.length}
            </div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
        <div class="card">
          <h3 style="color: var(--forest-dark); margin-bottom: 1rem;">📊 Data</h3>
          <div style="display: flex; flex-direction: column; gap: 0.8rem;">
            ${availableLabels.map(item => {
              const isSelected = selectedLabel === item.label;
              const isMatched = matched.some(m => m.label === item.label);
              return `
                <button class="btn" 
                        onclick="selectLabel('${item.label}')"
                        style="text-align: left; padding: 1rem; background: ${isMatched ? '#e8f5e9' : isSelected ? 'var(--forest-lightest)' : 'white'}; 
                               border: 2px solid ${isMatched ? 'var(--forest-medium)' : isSelected ? 'var(--forest-medium)' : 'var(--forest-lightest)'};
                               color: #2c3e2d; ${isMatched ? 'opacity: 0.6;' : ''}"
                        ${isMatched ? 'disabled' : ''}>
                  ${item.label} ${isMatched ? '✓' : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="card">
          <h3 style="color: var(--forest-dark); margin-bottom: 1rem;">🔢 Nilai</h3>
          <div style="display: flex; flex-direction: column; gap: 0.8rem;">
            ${availableValues.map(value => {
              const isSelected = selectedValue === value;
              const isMatched = matched.some(m => m.value === value);
              return `
                <button class="btn" 
                        onclick="selectValue(${value})"
                        style="text-align: center; padding: 1rem; background: ${isMatched ? '#e8f5e9' : isSelected ? 'var(--forest-lightest)' : 'white'}; 
                               border: 2px solid ${isMatched ? 'var(--forest-medium)' : isSelected ? 'var(--forest-medium)' : 'var(--forest-lightest)'};
                               color: #2c3e2d; font-weight: 600; ${isMatched ? 'opacity: 0.6;' : ''}"
                        ${isMatched ? 'disabled' : ''}>
                  ${value} ${isMatched ? '✓' : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      ${selectedLabel && selectedValue !== null ? `
        <div class="card" style="background: #fff3cd; border-left: 4px solid #ff9800;">
          <p><strong>Pilihan:</strong> "${selectedLabel}" = ${selectedValue}</p>
          <button class="btn btn-primary" onclick="checkPuzzleMatch()" style="width: 100%; margin-top: 1rem;">
            Cek Cocokkan
          </button>
        </div>
      ` : ''}
    `;
  }

  window.selectLabel = function(label) {
    selectedLabel = label;
    renderGame();
  };

  window.selectValue = function(value) {
    selectedValue = value;
    renderGame();
  };

  window.checkPuzzleMatch = function() {
    const item = shuffled.find(p => p.label === selectedLabel);
    
    if (item && item.value === selectedValue) {
      matched.push(item);
      selectedLabel = null;
      selectedValue = null;
      renderGame();
    } else {
      alert('Tidak cocok! Coba lagi.');
      selectedLabel = null;
      selectedValue = null;
      renderGame();
    }
  };

  function showPuzzleResults() {
    const content = document.getElementById('gameContent');
    
    content.innerHTML = `
      <div class="card" style="text-align: center;">
        <div style="font-size: 5rem; margin-bottom: 1rem;">🎉</div>
        <h2 style="color: var(--forest-dark);">Selamat! Puzzle Selesai!</h2>
        <div style="margin: 2rem 0;">
          <p style="font-size: 1.2rem; color: var(--forest-dark);">
            Semua data telah dicocokkan dengan benar!
          </p>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn" onclick="location.reload()" style="flex: 1;">🔄 Coba Lagi</button>
          <button class="btn btn-primary" onclick="window.location.href='mini-games.html'" style="flex: 1;">🏠 Kembali ke Menu</button>
        </div>
      </div>
    `;
  }

  renderGame();
}

// ============================================
// CATEGORY GAME
// ============================================
function initCategory() {
  document.getElementById('gameTitle').textContent = '📂 Kategorisasi';
  document.getElementById('gameSubtitle').textContent = 'Pilih Kategori yang Tepat!';
  
  const activities = [
    {name: 'Restorasi Hutan Gambut', category: 'ramah'},
    {name: 'Illegal Logging', category: 'merusak'},
    {name: 'Agroforestri', category: 'ramah'},
    {name: 'Pembakaran Hutan', category: 'merusak'},
    {name: 'Program Konservasi', category: 'ramah'},
    {name: 'Konversi Hutan untuk Sawit', category: 'merusak'},
    {name: 'Ekowisata', category: 'ramah'},
    {name: 'Penambangan di Hutan', category: 'merusak'},
    {name: 'Pemberdayaan Masyarakat Adat', category: 'ramah'},
    {name: 'Deforestasi Besar-besaran', category: 'merusak'}
  ];

  let shuffled = [...activities].sort(() => Math.random() - 0.5);
  let currentIndex = 0;
  let score = 0;
  let timeStart = Date.now();

  function renderGame() {
    const content = document.getElementById('gameContent');
    
    if (currentIndex >= activities.length) {
      showCategoryResults();
      return;
    }

    const activity = shuffled[currentIndex];

    content.innerHTML = `
      <div class="card">
        <div style="text-align: center; margin-bottom: 1rem;">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${((currentIndex + 1) / activities.length) * 100}%;">
              ${currentIndex + 1}/${activities.length}
            </div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, var(--forest-lightest) 0%, var(--sky-blue) 100%); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; min-height: 100px; display: flex; align-items: center; justify-content: center;">
          <h2 style="color: var(--forest-dark); margin: 0; font-size: 1.5rem; text-align: center;">
            ${activity.name}
          </h2>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
          <button class="btn btn-primary" 
                  onclick="selectCategory('ramah')"
                  style="padding: 2rem; font-size: 1.3rem; background: linear-gradient(135deg, var(--forest-medium) 0%, var(--forest-light) 100%);">
            ✅ Ramah Lingkungan
          </button>
          <button class="btn" 
                  onclick="selectCategory('merusak')"
                  style="padding: 2rem; font-size: 1.3rem; background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%); color: white;">
            ❌ Merusak Lingkungan
          </button>
        </div>
      </div>
    `;
  }

  window.selectCategory = function(category) {
    const activity = shuffled[currentIndex];
    
    if (category === activity.category) {
      score++;
    }
    
    const explanation = document.createElement('div');
    explanation.className = 'card';
    explanation.style.background = category === activity.category ? '#e8f5e9' : '#ffebee';
    explanation.style.borderLeft = `4px solid ${category === activity.category ? 'var(--forest-medium)' : '#d32f2f'}`;
    explanation.innerHTML = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="font-size: 3rem;">${category === activity.category ? '✅' : '❌'}</div>
        <h3 style="color: var(--forest-dark);">${category === activity.category ? 'Benar!' : 'Salah!'}</h3>
      </div>
      <p style="line-height: 1.8;">
        <strong>${activity.name}</strong> adalah aktivitas yang 
        <strong>${activity.category === 'ramah' ? 'ramah lingkungan' : 'merusak lingkungan'}</strong>.
      </p>
      <button class="btn btn-primary" onclick="nextActivity()" style="width: 100%; margin-top: 1rem;">
        ${currentIndex < activities.length - 1 ? 'Aktivitas Berikutnya →' : 'Lihat Hasil'}
      </button>
    `;
    document.getElementById('gameContent').appendChild(explanation);
  };

  window.nextActivity = function() {
    currentIndex++;
    renderGame();
  };

  function showCategoryResults() {
    const content = document.getElementById('gameContent');
    const percentage = (score / activities.length * 100).toFixed(0);
    const timeSpent = Math.floor((Date.now() - timeStart) / 1000);
    
    content.innerHTML = `
      <div class="card" style="text-align: center;">
        <div style="font-size: 5rem; margin-bottom: 1rem;">${percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}</div>
        <h2 style="color: var(--forest-dark);">Hasil Kategorisasi</h2>
        <div style="margin: 2rem 0;">
          <div style="font-size: 4rem; color: var(--forest-medium); font-weight: 700;">
            ${score}/${activities.length}
          </div>
          <p style="font-size: 1.5rem; color: var(--forest-dark); margin-top: 0.5rem;">
            Skor: ${percentage}%
          </p>
          <p style="color: var(--forest-medium); margin-top: 0.5rem;">
            Waktu: ${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')}
          </p>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn" onclick="location.reload()" style="flex: 1;">🔄 Coba Lagi</button>
          <button class="btn btn-primary" onclick="window.location.href='mini-games.html'" style="flex: 1;">🏠 Kembali ke Menu</button>
        </div>
      </div>
    `;
  }

  renderGame();
}

window.closeResults = function() {
  const modal = document.getElementById('resultsModal');
  if (modal) modal.style.display = 'none';
};