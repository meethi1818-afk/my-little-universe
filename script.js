/* ==========================================================================
   MY LITTLE UNIVERSE — INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. STATE & STORAGE MANAGEMENT
     -------------------------------------------------------------------------- */
  const Storage = {
    get: (key, fallback) => {
      try {
        const item = localStorage.getItem(`universe_${key}`);
        return item ? JSON.parse(item) : fallback;
      } catch (e) {
        console.warn('Storage read failed:', e);
        return fallback;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(`universe_${key}`, JSON.stringify(value));
      } catch (e) {
        console.warn('Storage write failed:', e);
      }
    }
  };

  /* Default Initial Data */
  const DEFAULT_NAME = 'Nova';

  const DEFAULT_QUESTS = [
    { id: 'q1', text: 'Brew a warm cup of lavender Earl Grey tea 🍵', category: 'care', priority: '1', completed: true },
    { id: 'q2', text: 'Sketch the Orion constellation from the balcony 🔭', category: 'creative', priority: '2', completed: true },
    { id: 'q3', text: 'Learn 3 new chord shapes on the synthesizer 🎹', category: 'creative', priority: '2', completed: false },
    { id: 'q4', text: 'Master CSS Grid & procedural canvas animations 💻', category: 'code', priority: '3', completed: false },
    { id: 'q5', text: 'Read 2 chapters of Carl Sagan’s Cosmos 📖', category: 'study', priority: '1', completed: false }
  ];

  const DEFAULT_MOODS = [
    { id: 'm1', mood: 'serene', name: 'Cosmic Zen', emoji: '🌸', color: '#c084fc', energy: 8, note: 'Sat on the porch listening to gentle night rain. Felt so deeply peaceful.', date: 'Yesterday' },
    { id: 'm2', mood: 'radiant', name: 'Radiant & Inspired', emoji: '🌟', color: '#fbbf24', energy: 9, note: 'Coded a floating starry universe and designed pastel UI dreams!', date: '2 days ago' },
    { id: 'm3', mood: 'dreamy', name: 'Nebula Dreamer', emoji: '☁️', color: '#38bdf8', energy: 7, note: 'Daydreaming about distant galaxies and sipping matcha latte.', date: '3 days ago' },
    { id: 'm4', mood: 'supernova', name: 'Supernova Glow', emoji: '⚡', color: '#f472b6', energy: 10, note: 'High momentum! Finished 4 big milestones today.', date: '4 days ago' }
  ];

  const DEFAULT_WISHES = [
    { text: 'May everyone who visits this sanctuary find soft peace tonight.', author: 'Stargazer Maya', date: 'Yesterday' },
    { text: 'Wishing for gentle courage to follow my creative dreams.', author: 'A Dreamer', date: '2 days ago' },
    { text: 'I hope the stars guide you to where you are truly loved.', author: 'Cosmic Wanderer', date: '3 days ago' },
    { text: 'May your thoughts be light and your heart unburdened.', author: 'Luna', date: 'Just now' }
  ];

  const COSMIC_QUOTES = [
    '"Somewhere, something incredible is waiting to be known." — Carl Sagan',
    '"We are all made of stardust, dreaming of the infinite." — Alan Lightman',
    '"For small creatures such as we, the vastness is bearable only through love." — Carl Sagan',
    '"The cosmos is within us. We are a way for the universe to know itself."',
    '"Look up at the stars and not down at your feet. Be curious." — Stephen Hawking',
    '"Dwell on the beauty of life. Watch the stars, and see yourself running with them." — Marcus Aurelius'
  ];

  /* --------------------------------------------------------------------------
     2. THEME SWITCHER (DARK / LIGHT MODE)
     -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  function initTheme() {
    const savedTheme = Storage.get('theme', null);
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    Storage.set('theme', theme);
  }

  themeToggle?.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    SoundFX.playPop(next === 'dark' ? 380 : 540);
  });

  initTheme();

  /* --------------------------------------------------------------------------
     3. AUDIO FX & SYNTHESIZER SOUND ENGINE (WEB AUDIO API)
     -------------------------------------------------------------------------- */
  let audioCtx = null;
  let isSfxMuted = Storage.get('sfx_muted', false);

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const SoundFX = {
    playChime: (freq = 587.33) => {
      if (isSfxMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (e) {}
    },
    playSuccessChord: () => {
      if (isSfxMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

          gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.5);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + idx * 0.06 + 0.55);
        });
      } catch (e) {}
    },
    playPop: (freq = 440) => {
      if (isSfxMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } catch (e) {}
    }
  };

  // SFX Toggle button
  const sfxToggleBtn = document.getElementById('sfxToggle');
  function updateSfxBtnState() {
    if (isSfxMuted) {
      sfxToggleBtn?.classList.add('muted');
    } else {
      sfxToggleBtn?.classList.remove('muted');
    }
  }
  sfxToggleBtn?.addEventListener('click', () => {
    isSfxMuted = !isSfxMuted;
    Storage.set('sfx_muted', isSfxMuted);
    updateSfxBtnState();
    if (!isSfxMuted) SoundFX.playChime(660);
  });
  updateSfxBtnState();

  /* --------------------------------------------------------------------------
     4. STARRY CANVAS & CELESTIAL BACKGROUND
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('star-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStars = [];
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  }

  const STAR_COLORS = ['#ffffff', '#fbcfe8', '#c084fc', '#38bdf8', '#fef08a', '#e2e8f0'];

  function initStars() {
    const starCount = Math.floor((width * height) / 8000);
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        vy: (Math.random() * 0.15 + 0.05) // gentle downward drift
      });
    }
  }

  function addShootingStar() {
    if (shootingStars.length >= 2) return;
    shootingStars.push({
      x: Math.random() * width * 0.8,
      y: Math.random() * height * 0.4,
      length: Math.random() * 80 + 50,
      speed: Math.random() * 6 + 6,
      angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
      alpha: 1,
      color: '#fef08a'
    });
  }

  function animateStars() {
    ctx.clearRect(0, 0, width, height);

    // Draw twinkling stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 1) {
        s.alpha = 1;
        s.twinkleDir = -1;
      } else if (s.alpha <= 0.2) {
        s.alpha = 0.2;
        s.twinkleDir = 1;
      }

      s.y += s.vy;
      if (s.y > height) {
        s.y = 0;
        s.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow for larger stars
      if (s.radius > 1.2) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
      }
      ctx.restore();
    }

    // Draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      const tailX = ss.x - Math.cos(ss.angle) * ss.length;
      const tailY = ss.y - Math.sin(ss.angle) * ss.length;

      const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0)');
      grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.stroke();
      ctx.restore();

      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.015;

      if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
        shootingStars.splice(i, 1);
      }
    }

    // Random shooting star trigger (approx every 6-8 seconds)
    if (Math.random() < 0.006) {
      addShootingStar();
    }

    requestAnimationFrame(animateStars);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animateStars();

  /* --------------------------------------------------------------------------
     5. STARDUST CURSOR TRAIL
     -------------------------------------------------------------------------- */
  const cursor = document.getElementById('stardust-cursor');
  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    if (cursor) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Stardust click ripple
  window.addEventListener('click', (e) => {
    createClickSparkle(e.clientX, e.clientY);
  });

  function createClickSparkle(x, y) {
    const symbols = ['✨', '⭐', '🌸', '💫'];
    for (let i = 0; i < 4; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'celebration-sparkle';
      sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      const angle = (Math.PI * 2 * i) / 4 + Math.random() * 0.5;
      const dist = 30 + Math.random() * 30;
      sparkle.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      sparkle.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1600);
    }
  }

  /* --------------------------------------------------------------------------
     6. WELCOME SCREEN & PERSONALIZATION
     -------------------------------------------------------------------------- */
  // Time Greeting & Cosmic Clock
  const timeGreetingEl = document.getElementById('timeGreeting');
  const liveClockEl = document.getElementById('liveClock');
  const moonPhaseTextEl = document.getElementById('moonPhaseText');

  function updateClockAndGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    if (liveClockEl) {
      liveClockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
    }

    if (timeGreetingEl) {
      if (hours >= 5 && hours < 12) {
        timeGreetingEl.textContent = 'Good Morning, Stargazer ✨';
      } else if (hours >= 12 && hours < 18) {
        timeGreetingEl.textContent = 'Good Afternoon, Dreamer ☀️';
      } else if (hours >= 18 && hours < 22) {
        timeGreetingEl.textContent = 'Good Evening, Starlight 🌆';
      } else {
        timeGreetingEl.textContent = 'Good Night, Cosmic Wanderer 🌙';
      }
    }
  }
  setInterval(updateClockAndGreeting, 1000);
  updateClockAndGreeting();

  // Simple Moon Phase Calculator
  function calculateMoonPhase() {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 3) {
      year--;
      month += 12;
    }
    const a = Math.floor(year / 100);
    const b = Math.floor(a / 4);
    const c = 2 - a + b;
    const e = Math.floor(365.25 * (year + 4716));
    const f = Math.floor(30.6001 * (month + 1));
    const jd = c + day + e + f - 1524.5;
    const daysSinceNew = (jd - 2451549.5) % 29.53058867;
    const phase = daysSinceNew < 0 ? daysSinceNew + 29.53058867 : daysSinceNew;

    let phaseName = 'Waxing Gibbous 🌔';
    if (phase < 1.84) phaseName = 'New Moon 🌑';
    else if (phase < 5.53) phaseName = 'Waxing Crescent 🌒';
    else if (phase < 9.22) phaseName = 'First Quarter 🌓';
    else if (phase < 12.91) phaseName = 'Waxing Gibbous 🌔';
    else if (phase < 16.61) phaseName = 'Full Moon 🌕';
    else if (phase < 20.30) phaseName = 'Waning Gibbous 🌖';
    else if (phase < 23.99) phaseName = 'Last Quarter 🌗';
    else if (phase < 27.68) phaseName = 'Waning Crescent 🌘';
    else phaseName = 'New Moon 🌑';

    if (moonPhaseTextEl) moonPhaseTextEl.textContent = phaseName;
  }
  calculateMoonPhase();

  // Owner Name Customization Modal
  const universeOwnerEl = document.getElementById('universeOwner');
  const editNameBtn = document.getElementById('editNameBtn');
  const nameModal = document.getElementById('nameModal');
  const closeNameModalBtn = document.getElementById('closeNameModalBtn');
  const customNameInput = document.getElementById('customNameInput');
  const saveNameBtn = document.getElementById('saveNameBtn');

  const currentName = Storage.get('owner_name', DEFAULT_NAME);
  if (universeOwnerEl) universeOwnerEl.textContent = currentName;

  editNameBtn?.addEventListener('click', () => {
    if (customNameInput) customNameInput.value = universeOwnerEl.textContent;
    nameModal?.classList.add('open');
    SoundFX.playPop(520);
  });

  function closeNameModal() {
    nameModal?.classList.remove('open');
  }

  closeNameModalBtn?.addEventListener('click', closeNameModal);
  nameModal?.addEventListener('click', (e) => {
    if (e.target === nameModal) closeNameModal();
  });

  saveNameBtn?.addEventListener('click', () => {
    const val = customNameInput?.value.trim();
    if (val) {
      if (universeOwnerEl) universeOwnerEl.textContent = val;
      Storage.set('owner_name', val);
      SoundFX.playSuccessChord();
      triggerStardustBurst();
    }
    closeNameModal();
  });

  // Cosmic Quotes Generator
  const cosmicQuoteText = document.getElementById('cosmicQuoteText');
  const nextQuoteBtn = document.getElementById('nextQuoteBtn');
  let currentQuoteIdx = 0;

  nextQuoteBtn?.addEventListener('click', () => {
    currentQuoteIdx = (currentQuoteIdx + 1) % COSMIC_QUOTES.length;
    if (cosmicQuoteText) {
      cosmicQuoteText.style.opacity = '0';
      setTimeout(() => {
        cosmicQuoteText.textContent = COSMIC_QUOTES[currentQuoteIdx];
        cosmicQuoteText.style.opacity = '1';
      }, 200);
    }
    SoundFX.playPop(620);
  });

  /* --------------------------------------------------------------------------
     7. HOBBIES, GOALS & INTERESTS
     -------------------------------------------------------------------------- */
  // Tabs Navigation
  const tabPills = document.querySelectorAll('.tab-pill');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetTab = pill.dataset.tab;
      tabPills.forEach(p => p.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      pill.classList.add('active');
      document.getElementById(`tab-${targetTab}`)?.classList.add('active');
      SoundFX.playPop(480);
    });
  });

  // Reaction counters on hobbies
  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      let count = parseInt(btn.dataset.reactions || '0', 10);
      count++;
      btn.dataset.reactions = count;
      const countSpan = btn.querySelector('.reaction-count');
      if (countSpan) countSpan.textContent = count;
      btn.classList.add('reacted');
      SoundFX.playChime(750);
      createClickSparkle(e.clientX, e.clientY);
    });
  });

  // Interactive Interest Curiosities Chips
  const interestChips = document.querySelectorAll('.interest-chip');
  const interestTitle = document.getElementById('interestTitle');
  const interestDescription = document.getElementById('interestDescription');

  interestChips.forEach(chip => {
    chip.addEventListener('click', () => {
      interestChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const info = chip.dataset.info;
      const label = chip.querySelector('span')?.textContent || 'Curiosity';

      if (interestTitle) interestTitle.textContent = label;
      if (interestDescription) interestDescription.textContent = info;
      SoundFX.playPop(600);
    });
  });

  /* --------------------------------------------------------------------------
     8. INTERACTIVE DAILY MOOD TRACKER
     -------------------------------------------------------------------------- */
  const moodOptions = document.querySelectorAll('.mood-option');
  const energySlider = document.getElementById('energySlider');
  const energyValueText = document.getElementById('energyValueText');
  const moodNoteInput = document.getElementById('moodNoteInput');
  const saveMoodBtn = document.getElementById('saveMoodBtn');
  const jarMarblesContainer = document.getElementById('jarMarblesContainer');
  const moodHistoryList = document.getElementById('moodHistoryList');
  const dominantMoodText = document.getElementById('dominantMoodText');
  const avgEnergyText = document.getElementById('avgEnergyText');
  const moodStreakText = document.getElementById('moodStreakText');
  const moodEntriesCount = document.getElementById('moodEntriesCount');
  const todayHeroVibe = document.getElementById('todayHeroVibe');

  let selectedMood = 'radiant';
  let selectedMoodName = 'Radiant & Inspired';
  let selectedMoodEmoji = '🌟';
  let selectedMoodColor = '#fbbf24';

  moodOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      moodOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selectedMood = opt.dataset.mood;
      selectedMoodName = opt.dataset.name;
      selectedMoodEmoji = opt.dataset.emoji;
      selectedMoodColor = opt.dataset.color;
      SoundFX.playPop(580);
    });
  });

  // Energy Slider change
  energySlider?.addEventListener('input', () => {
    const val = energySlider.value;
    let label = 'Balanced ⚖️';
    if (val <= 3) label = 'Gentle Rest 🌙';
    else if (val <= 6) label = 'Calm Orbit 🍵';
    else if (val <= 8) label = 'High Orbit ⚡';
    else label = 'Hyperdrive 🚀';

    if (energyValueText) energyValueText.textContent = `${val} / 10 — ${label}`;
  });

  // Tag chips selection
  document.querySelectorAll('#moodTagChips .tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      SoundFX.playPop(500);
    });
  });

  // Mood Storage & Render
  let moods = Storage.get('moods', DEFAULT_MOODS);

  function renderMoodJar() {
    if (!jarMarblesContainer) return;
    jarMarblesContainer.innerHTML = '';
    moods.forEach((m, idx) => {
      const marble = document.createElement('div');
      marble.className = 'mood-marble';
      marble.style.background = m.color;
      marble.style.color = '#ffffff';
      marble.style.boxShadow = `0 0 12px ${m.color}`;
      marble.style.animationDelay = `${idx * 0.08}s`;
      marble.textContent = m.emoji;
      marble.title = `${m.name} (${m.energy}/10) - ${m.note || 'No notes'}`;

      marble.addEventListener('click', () => {
        SoundFX.playChime(650);
        if (m.note) alert(`🪐 Mood Entry:\n${m.emoji} ${m.name}\nEnergy: ${m.energy}/10\nNote: "${m.note}"`);
      });

      jarMarblesContainer.appendChild(marble);
    });
  }

  function renderMoodHistory() {
    if (!moodHistoryList) return;
    moodHistoryList.innerHTML = '';

    if (moods.length === 0) {
      moodHistoryList.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:12px;">No mood stars logged yet. Add your first above!</div>';
      return;
    }

    moods.slice(0, 6).forEach(m => {
      const item = document.createElement('div');
      item.className = 'mood-history-item';
      item.innerHTML = `
        <div class="history-item-left">
          <span class="history-item-emoji">${m.emoji}</span>
          <div class="history-item-meta">
            <h5>${m.name} <span style="color:var(--pastel-amber); font-size:0.75rem;">⚡ ${m.energy}/10</span></h5>
            <p>${m.note ? m.note.substring(0, 48) + (m.note.length > 48 ? '...' : '') : 'Quiet cosmic day'}</p>
          </div>
        </div>
        <span class="history-item-date">${m.date}</span>
      `;
      moodHistoryList.appendChild(item);
    });

    updateMoodStats();
  }

  function updateMoodStats() {
    if (moodEntriesCount) moodEntriesCount.textContent = `${moods.length} entries`;

    if (moods.length === 0) {
      if (dominantMoodText) dominantMoodText.textContent = 'None yet';
      if (avgEnergyText) avgEnergyText.textContent = '-';
      return;
    }

    // Dominant Mood
    const freq = {};
    let totalEnergy = 0;
    moods.forEach(m => {
      freq[m.name] = (freq[m.name] || 0) + 1;
      totalEnergy += Number(m.energy) || 7;
    });

    let bestMood = moods[0].name;
    let maxCount = 0;
    for (const [name, count] of Object.entries(freq)) {
      if (count > maxCount) {
        maxCount = count;
        bestMood = name;
      }
    }

    if (dominantMoodText) dominantMoodText.textContent = bestMood;
    const avg = (totalEnergy / moods.length).toFixed(1);
    if (avgEnergyText) avgEnergyText.textContent = `${avg} / 10`;
    if (moodStreakText) moodStreakText.textContent = `🔥 ${Math.min(moods.length, 14)} Days`;

    if (todayHeroVibe && moods[0]) {
      todayHeroVibe.textContent = `${moods[0].emoji} ${moods[0].name}`;
    }
  }

  saveMoodBtn?.addEventListener('click', () => {
    const note = moodNoteInput?.value.trim() || '';
    const energy = parseInt(energySlider?.value || '8', 10);
    const newEntry = {
      id: `m_${Date.now()}`,
      mood: selectedMood,
      name: selectedMoodName,
      emoji: selectedMoodEmoji,
      color: selectedMoodColor,
      energy: energy,
      note: note,
      date: 'Just now'
    };

    moods.unshift(newEntry);
    Storage.set('moods', moods);
    renderMoodJar();
    renderMoodHistory();

    if (moodNoteInput) moodNoteInput.value = '';
    SoundFX.playSuccessChord();
    triggerStardustBurst();
  });

  renderMoodJar();
  renderMoodHistory();

  /* --------------------------------------------------------------------------
     9. TO-DO LIST (COSMIC QUESTS)
     -------------------------------------------------------------------------- */
  const questsList = document.getElementById('questsList');
  const newQuestForm = document.getElementById('newQuestForm');
  const questInput = document.getElementById('questInput');
  const questCategory = document.getElementById('questCategory');
  const questPriority = document.getElementById('questPriority');
  const questProgressBar = document.getElementById('questProgressBar');
  const questsProgressText = document.getElementById('questsProgressText');
  const questRankTitle = document.getElementById('questRankTitle');
  const emptyQuestsState = document.getElementById('emptyQuestsState');
  const filterPills = document.querySelectorAll('.filter-pill');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');
  const resetSampleQuestsBtn = document.getElementById('resetSampleQuestsBtn');

  const countAllQuests = document.getElementById('countAllQuests');
  const countActiveQuests = document.getElementById('countActiveQuests');
  const countDoneQuests = document.getElementById('countDoneQuests');

  let quests = Storage.get('quests', DEFAULT_QUESTS);
  let currentFilter = 'all';

  function renderQuests() {
    if (!questsList) return;
    questsList.innerHTML = '';

    const filtered = quests.filter(q => {
      if (currentFilter === 'active') return !q.completed;
      if (currentFilter === 'completed') return q.completed;
      return true;
    });

    if (filtered.length === 0) {
      emptyQuestsState?.classList.remove('hidden');
    } else {
      emptyQuestsState?.classList.add('hidden');
    }

    filtered.forEach(q => {
      const li = document.createElement('li');
      li.className = `quest-item ${q.completed ? 'completed' : ''}`;
      li.dataset.id = q.id;

      const priorityStars = q.priority === '3' ? '🌟 Urgent' : (q.priority === '2' ? '⭐⭐ High' : '⭐ Normal');

      li.innerHTML = `
        <div class="quest-item-left">
          <button class="star-checkbox" title="${q.completed ? 'Mark in progress' : 'Fulfill quest'}">
            <span class="check-icon">✓</span>
          </button>
          <div class="quest-details">
            <span class="quest-title-text">${escapeHtml(q.text)}</span>
            <div class="quest-meta-chips">
              <span class="quest-category-badge">${getCategoryEmoji(q.category)} ${q.category}</span>
              <span class="quest-priority-badge">${priorityStars}</span>
            </div>
          </div>
        </div>
        <button class="quest-delete-btn" title="Delete quest">✕</button>
      `;

      // Checkbox click
      const chk = li.querySelector('.star-checkbox');
      chk?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleQuest(q.id, chk);
      });

      // Delete click
      const del = li.querySelector('.quest-delete-btn');
      del?.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteQuest(q.id);
      });

      questsList.appendChild(li);
    });

    updateQuestMetrics();
  }

  function getCategoryEmoji(cat) {
    switch (cat) {
      case 'creative': return '🎨';
      case 'code': return '💻';
      case 'care': return '🍵';
      case 'study': return '📚';
      default: return '🚀';
    }
  }

  function toggleQuest(id, chkElement) {
    const quest = quests.find(q => q.id === id);
    if (!quest) return;
    quest.completed = !quest.completed;
    Storage.set('quests', quests);

    if (quest.completed) {
      SoundFX.playSuccessChord();
      if (chkElement) {
        const rect = chkElement.getBoundingClientRect();
        createClickSparkle(rect.left + 14, rect.top + 14);
      }
      triggerStardustBurst();
    } else {
      SoundFX.playPop(420);
    }
    renderQuests();
  }

  function deleteQuest(id) {
    quests = quests.filter(q => q.id !== id);
    Storage.set('quests', quests);
    SoundFX.playPop(340);
    renderQuests();
  }

  function updateQuestMetrics() {
    const total = quests.length;
    const done = quests.filter(q => q.completed).length;
    const active = total - done;

    if (countAllQuests) countAllQuests.textContent = total;
    if (countActiveQuests) countActiveQuests.textContent = active;
    if (countDoneQuests) countDoneQuests.textContent = done;

    const percentage = total === 0 ? 0 : Math.round((done / total) * 100);
    if (questProgressBar) questProgressBar.style.width = `${percentage}%`;
    if (questsProgressText) questsProgressText.textContent = `${done} / ${total} Fulfilled (${percentage}%)`;

    // Dynamic Rank Title
    let rank = 'Cosmic Wanderer 🌌';
    if (percentage === 100 && total > 0) rank = 'Universal Master ✨';
    else if (percentage >= 75) rank = 'Supernova Voyager ⚡';
    else if (percentage >= 50) rank = 'Starlight Pathfinder 🚀';
    else if (percentage >= 25) rank = 'Astral Apprentice 🔭';

    if (questRankTitle) questRankTitle.textContent = rank;
  }

  // Add new quest
  newQuestForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = questInput?.value.trim();
    if (!text) return;

    const newQ = {
      id: `q_${Date.now()}`,
      text: text,
      category: questCategory?.value || 'explore',
      priority: questPriority?.value || '1',
      completed: false
    };

    quests.unshift(newQ);
    Storage.set('quests', quests);
    if (questInput) questInput.value = '';
    SoundFX.playPop(620);
    renderQuests();
  });

  // Filter pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      SoundFX.playPop(450);
      renderQuests();
    });
  });

  // Clear Completed
  clearCompletedBtn?.addEventListener('click', () => {
    quests = quests.filter(q => !q.completed);
    Storage.set('quests', quests);
    SoundFX.playPop(400);
    renderQuests();
  });

  // Reset Samples
  resetSampleQuestsBtn?.addEventListener('click', () => {
    quests = JSON.parse(JSON.stringify(DEFAULT_QUESTS));
    Storage.set('quests', quests);
    SoundFX.playChime(640);
    renderQuests();
  });

  renderQuests();

  /* --------------------------------------------------------------------------
     10. LO-FI MUSIC & AMBIENT PROCEDURAL SOUNDSTATION (WEB AUDIO SYNTHESIZER)
     -------------------------------------------------------------------------- */
  const PLAYLIST = [
    {
      id: 0,
      title: 'Moonlit Nebula',
      artist: 'Cosmic Ambient Synthesizer',
      mood: 'Dreamy Rhodes & 9th Chords',
      duration: '2:40',
      progression: [
        [293.66, 369.99, 440.00, 554.37], // Dmaj9
        [277.18, 329.63, 415.30, 493.88], // C#m7
        [246.94, 293.66, 369.99, 440.00], // Bm7
        [220.00, 277.18, 329.63, 415.30]  // Amaj7
      ]
    },
    {
      id: 1,
      title: 'Cosmic Rain & Coffee',
      artist: 'Lush Tape Lo-Fi Session',
      mood: 'Gentle Beats & Nostalgia',
      duration: '3:15',
      progression: [
        [349.23, 440.00, 523.25, 659.25], // Fmaj7
        [329.63, 392.00, 493.88, 587.33], // Em7
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [261.63, 329.63, 392.00, 523.25]  // Cmaj7
      ]
    },
    {
      id: 2,
      title: 'Stardust Lullaby',
      artist: 'Deep Sleep Astral Pad',
      mood: 'Binaural Drift & Warm Waves',
      duration: '4:00',
      progression: [
        [196.00, 246.94, 293.66, 392.00], // Gmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [246.94, 293.66, 369.99, 440.00], // Bm7
        [220.00, 277.18, 329.63, 440.00]  // A
      ]
    },
    {
      id: 3,
      title: 'Orbit Cafe Reverie',
      artist: 'Midnight Study Session',
      mood: 'Warm Neo-Soul & Vinyl',
      duration: '2:50',
      progression: [
        [311.13, 392.00, 466.16, 587.33], // Ebmaj9
        [293.66, 369.99, 440.00, 523.25], // D7#9
        [261.63, 311.13, 392.00, 466.16], // Cm9
        [233.08, 293.66, 349.23, 440.00]  // Bbmaj7
      ]
    }
  ];

  let currentTrackIdx = 0;
  let isMusicPlaying = false;
  let musicMasterGain = null;
  let chordInterval = null;
  let trackElapsedSeconds = 0;
  let trackTimer = null;
  let analyserNode = null;

  const vinylDisc = document.getElementById('vinylDisc');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIconSvg = document.getElementById('playIconSvg');
  const pauseIconSvg = document.getElementById('pauseIconSvg');
  const prevTrackBtn = document.getElementById('prevTrackBtn');
  const nextTrackBtn = document.getElementById('nextTrackBtn');
  const currentTrackTitle = document.getElementById('currentTrackTitle');
  const currentTrackArtist = document.getElementById('currentTrackArtist');
  const currentTrackMood = document.getElementById('currentTrackMood');
  const currentTimeText = document.getElementById('currentTimeText');
  const totalDurationText = document.getElementById('totalDurationText');
  const trackProgressFill = document.getElementById('trackProgressFill');
  const trackScrubber = document.getElementById('trackScrubber');
  const playerStatusBadge = document.getElementById('playerStatusBadge');
  const playlistItemsContainer = document.getElementById('playlistItems');
  const masterVolume = document.getElementById('masterVolume');
  const favoriteTrackBtn = document.getElementById('favoriteTrackBtn');
  const favHeartIcon = document.getElementById('favHeartIcon');

  function renderPlaylist() {
    if (!playlistItemsContainer) return;
    playlistItemsContainer.innerHTML = '';
    PLAYLIST.forEach((track, idx) => {
      const item = document.createElement('div');
      item.className = `playlist-item ${idx === currentTrackIdx ? 'active' : ''}`;
      item.innerHTML = `
        <div class="playlist-item-left">
          <span class="track-index-num">0${idx + 1}</span>
          <span class="playlist-track-name">${track.title}</span>
        </div>
        <span class="playlist-track-duration">${track.duration}</span>
      `;
      item.addEventListener('click', () => {
        currentTrackIdx = idx;
        loadTrack(currentTrackIdx);
        startSynthesizerMusic();
      });
      playlistItemsContainer.appendChild(item);
    });
  }

  function loadTrack(idx) {
    const track = PLAYLIST[idx];
    if (currentTrackTitle) currentTrackTitle.textContent = track.title;
    if (currentTrackArtist) currentTrackArtist.textContent = track.artist;
    if (currentTrackMood) currentTrackMood.textContent = track.mood;
    if (totalDurationText) totalDurationText.textContent = track.duration;
    trackElapsedSeconds = 0;
    updateTrackProgress();
    renderPlaylist();
  }

  function startSynthesizerMusic() {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (!musicMasterGain) {
      musicMasterGain = ctx.createGain();
      musicMasterGain.gain.setValueAtTime(parseFloat(masterVolume?.value || '0.7') * 0.15, ctx.currentTime);

      analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 64;
      musicMasterGain.connect(analyserNode);
      analyserNode.connect(ctx.destination);
      startVisualizer();
    }

    isMusicPlaying = true;
    vinylDisc?.classList.add('playing');
    playIconSvg?.classList.add('hidden');
    pauseIconSvg?.classList.remove('hidden');
    if (playerStatusBadge) playerStatusBadge.innerHTML = '<span class="pulse-dot"></span> Synthesizing live celestial audio';

    // Play chords progression repeatedly
    const track = PLAYLIST[currentTrackIdx];
    let chordIdx = 0;

    clearInterval(chordInterval);
    playSynthChord(track.progression[chordIdx], ctx, musicMasterGain);

    chordInterval = setInterval(() => {
      chordIdx = (chordIdx + 1) % track.progression.length;
      playSynthChord(track.progression[chordIdx], ctx, musicMasterGain);
    }, 2800);

    // Track timer
    clearInterval(trackTimer);
    trackTimer = setInterval(() => {
      trackElapsedSeconds++;
      updateTrackProgress();
      if (trackElapsedSeconds >= 160) {
        nextTrack();
      }
    }, 1000);
  }

  function playSynthChord(frequencies, ctx, destGain) {
    if (!isMusicPlaying) return;
    frequencies.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle'; // warm Rhodes tone
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Low pass filter for buttery analog lo-fi warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destGain);

      osc.start();
      osc.stop(ctx.currentTime + 2.75);
    });
  }

  function pauseSynthesizerMusic() {
    isMusicPlaying = false;
    clearInterval(chordInterval);
    clearInterval(trackTimer);
    vinylDisc?.classList.remove('playing');
    playIconSvg?.classList.remove('hidden');
    pauseIconSvg?.classList.add('hidden');
    if (playerStatusBadge) playerStatusBadge.innerHTML = '<span class="pulse-dot" style="background:#94a3b8"></span> Paused';
  }

  function nextTrack() {
    currentTrackIdx = (currentTrackIdx + 1) % PLAYLIST.length;
    loadTrack(currentTrackIdx);
    if (isMusicPlaying) {
      startSynthesizerMusic();
    }
  }

  function prevTrack() {
    currentTrackIdx = (currentTrackIdx - 1 + PLAYLIST.length) % PLAYLIST.length;
    loadTrack(currentTrackIdx);
    if (isMusicPlaying) {
      startSynthesizerMusic();
    }
  }

  function updateTrackProgress() {
    const mins = Math.floor(trackElapsedSeconds / 60);
    const secs = String(trackElapsedSeconds % 60).padStart(2, '0');
    if (currentTimeText) currentTimeText.textContent = `${mins}:${secs}`;

    const totalSecs = 160;
    const pct = Math.min((trackElapsedSeconds / totalSecs) * 100, 100);
    if (trackProgressFill) trackProgressFill.style.width = `${pct}%`;
    if (trackScrubber) trackScrubber.style.left = `${pct}%`;
  }

  playPauseBtn?.addEventListener('click', () => {
    if (isMusicPlaying) {
      pauseSynthesizerMusic();
    } else {
      startSynthesizerMusic();
    }
  });

  nextTrackBtn?.addEventListener('click', nextTrack);
  prevTrackBtn?.addEventListener('click', prevTrack);

  masterVolume?.addEventListener('input', () => {
    if (musicMasterGain && audioCtx) {
      musicMasterGain.gain.setValueAtTime(parseFloat(masterVolume.value) * 0.15, audioCtx.currentTime);
    }
  });

  favoriteTrackBtn?.addEventListener('click', () => {
    if (favHeartIcon) {
      favHeartIcon.textContent = favHeartIcon.textContent === '🤍' ? '💖' : '🤍';
      SoundFX.playChime(880);
    }
  });

  // Frequency Visualizer Canvas
  const visualizerCanvas = document.getElementById('visualizerCanvas');
  const vCtx = visualizerCanvas?.getContext('2d');

  function startVisualizer() {
    if (!visualizerCanvas || !vCtx) return;
    const bufferLength = analyserNode?.frequencyBinCount || 32;
    const dataArray = new Uint8Array(bufferLength);

    function drawVisualizer() {
      requestAnimationFrame(drawVisualizer);
      vCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

      if (isMusicPlaying && analyserNode) {
        analyserNode.getByteFrequencyData(dataArray);
      } else {
        // Idle gentle wave animation
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.sin(Date.now() * 0.003 + i * 0.3) * 10 + 12;
        }
      }

      const barWidth = (visualizerCanvas.width / bufferLength) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * visualizerCanvas.height * 0.85 + 4;
        
        const grad = vCtx.createLinearGradient(0, visualizerCanvas.height, 0, 0);
        grad.addColorStop(0, '#f472b6');
        grad.addColorStop(0.5, '#c084fc');
        grad.addColorStop(1, '#38bdf8');

        vCtx.fillStyle = grad;
        vCtx.beginPath();
        vCtx.roundRect(x, visualizerCanvas.height - barHeight, barWidth - 2, barHeight, [4, 4, 0, 0]);
        vCtx.fill();

        x += barWidth;
      }
    }
    drawVisualizer();
  }

  loadTrack(0);

  /* --------------------------------------------------------------------------
     11. AMBIENT ATMOSPHERIC SOUND MIXER
     -------------------------------------------------------------------------- */
  const AmbientEngine = {
    channels: {
      rain: { active: false, gainNode: null, sourceNode: null },
      drone: { active: false, gainNode: null, osc1: null, osc2: null },
      chimes: { active: false, gainNode: null, interval: null },
      vinyl: { active: false, gainNode: null, sourceNode: null }
    },

    toggleRain: () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      const ch = AmbientEngine.channels.rain;
      if (ch.active) {
        ch.sourceNode?.stop();
        ch.active = false;
      } else {
        // Procedural White/Pink Noise with bandpass filter
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.15;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        ch.gainNode = ctx.createGain();
        const vol = parseFloat(document.getElementById('volRain')?.value || '0.5') * 0.2;
        ch.gainNode.gain.setValueAtTime(vol, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(ch.gainNode);
        ch.gainNode.connect(ctx.destination);
        whiteNoise.start();

        ch.sourceNode = whiteNoise;
        ch.active = true;
      }
      AmbientEngine.updateButtonUI('toggleRainBtn', ch.active);
    },

    toggleDrone: () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      const ch = AmbientEngine.channels.drone;
      if (ch.active) {
        ch.osc1?.stop();
        ch.osc2?.stop();
        ch.active = false;
      } else {
        ch.osc1 = ctx.createOscillator();
        ch.osc2 = ctx.createOscillator();
        ch.gainNode = ctx.createGain();

        // 432 Hz octave deep space drone
        ch.osc1.type = 'sine';
        ch.osc1.frequency.setValueAtTime(108, ctx.currentTime);
        ch.osc2.type = 'triangle';
        ch.osc2.frequency.setValueAtTime(108.5, ctx.currentTime); // binaural beating

        const vol = parseFloat(document.getElementById('volDrone')?.value || '0.4') * 0.12;
        ch.gainNode.gain.setValueAtTime(vol, ctx.currentTime);

        ch.osc1.connect(ch.gainNode);
        ch.osc2.connect(ch.gainNode);
        ch.gainNode.connect(ctx.destination);

        ch.osc1.start();
        ch.osc2.start();
        ch.active = true;
      }
      AmbientEngine.updateButtonUI('toggleDroneBtn', ch.active);
    },

    toggleChimes: () => {
      const ch = AmbientEngine.channels.chimes;
      if (ch.active) {
        clearInterval(ch.interval);
        ch.active = false;
      } else {
        ch.active = true;
        const chimeNotes = [783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98];
        ch.interval = setInterval(() => {
          if (!ch.active) return;
          const ctx = getAudioContext();
          if (!ctx) return;
          const freq = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const vol = parseFloat(document.getElementById('volChimes')?.value || '0.35') * 0.08;
          gain.gain.setValueAtTime(vol, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.85);
        }, 1200 + Math.random() * 800);
      }
      AmbientEngine.updateButtonUI('toggleChimesBtn', ch.active);
    },

    toggleVinyl: () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      const ch = AmbientEngine.channels.vinyl;
      if (ch.active) {
        ch.sourceNode?.stop();
        ch.active = false;
      } else {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() < 0.005 ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.03);
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        ch.gainNode = ctx.createGain();
        const vol = parseFloat(document.getElementById('volVinyl')?.value || '0.3') * 0.15;
        ch.gainNode.gain.setValueAtTime(vol, ctx.currentTime);

        noise.connect(ch.gainNode);
        ch.gainNode.connect(ctx.destination);
        noise.start();
        ch.sourceNode = noise;
        ch.active = true;
      }
      AmbientEngine.updateButtonUI('toggleVinylBtn', ch.active);
    },

    updateButtonUI: (btnId, isActive) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      if (isActive) {
        btn.classList.add('active');
        btn.textContent = 'Active 🎵';
      } else {
        btn.classList.remove('active');
        btn.textContent = 'Start';
      }
    }
  };

  document.getElementById('toggleRainBtn')?.addEventListener('click', AmbientEngine.toggleRain);
  document.getElementById('toggleDroneBtn')?.addEventListener('click', AmbientEngine.toggleDrone);
  document.getElementById('toggleChimesBtn')?.addEventListener('click', AmbientEngine.toggleChimes);
  document.getElementById('toggleVinylBtn')?.addEventListener('click', AmbientEngine.toggleVinyl);

  document.getElementById('allAmbientOnBtn')?.addEventListener('click', () => {
    if (!AmbientEngine.channels.rain.active) AmbientEngine.toggleRain();
    if (!AmbientEngine.channels.drone.active) AmbientEngine.toggleDrone();
    if (!AmbientEngine.channels.chimes.active) AmbientEngine.toggleChimes();
    if (!AmbientEngine.channels.vinyl.active) AmbientEngine.toggleVinyl();
  });

  document.getElementById('allAmbientOffBtn')?.addEventListener('click', () => {
    if (AmbientEngine.channels.rain.active) AmbientEngine.toggleRain();
    if (AmbientEngine.channels.drone.active) AmbientEngine.toggleDrone();
    if (AmbientEngine.channels.chimes.active) AmbientEngine.toggleChimes();
    if (AmbientEngine.channels.vinyl.active) AmbientEngine.toggleVinyl();
  });

  // Ambient Sliders volume adjustments
  ['Rain', 'Drone', 'Chimes', 'Vinyl'].forEach(name => {
    document.getElementById(`vol${name}`)?.addEventListener('input', (e) => {
      const chKey = name.toLowerCase();
      const ch = AmbientEngine.channels[chKey];
      if (ch?.gainNode && audioCtx) {
        ch.gainNode.gain.setValueAtTime(parseFloat(e.target.value) * 0.2, audioCtx.currentTime);
      }
    });
  });

  /* --------------------------------------------------------------------------
     12. STARLIGHT WISHING WELL
     -------------------------------------------------------------------------- */
  const wishesStarsContainer = document.getElementById('wishesStarsContainer');
  const visitorWishInput = document.getElementById('visitorWishInput');
  const visitorWishAuthor = document.getElementById('visitorWishAuthor');
  const submitWishBtn = document.getElementById('submitWishBtn');
  const inspectWishContent = document.getElementById('inspectWishContent');
  const inspectWishAuthor = document.getElementById('inspectWishAuthor');
  const inspectWishDate = document.getElementById('inspectWishDate');

  let wishes = Storage.get('wishes', DEFAULT_WISHES);

  function renderWishingSky() {
    if (!wishesStarsContainer) return;
    wishesStarsContainer.innerHTML = '';

    wishes.forEach((w, idx) => {
      const star = document.createElement('div');
      star.className = 'wish-star';
      
      // Distribute stars poetically in sky
      const x = 8 + (idx * 21) % 84;
      const y = 15 + ((idx * 37) % 65);

      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.animationDelay = `${(idx * 0.35) % 2.5}s`;
      star.textContent = '⭐';
      star.title = `Click to reveal wish from ${w.author}`;

      star.addEventListener('click', () => {
        if (inspectWishContent) inspectWishContent.textContent = w.text;
        if (inspectWishAuthor) inspectWishAuthor.textContent = `— ${w.author}`;
        if (inspectWishDate) inspectWishDate.textContent = w.date;
        SoundFX.playChime(698.46);
      });

      wishesStarsContainer.appendChild(star);
    });

    // Default inspect first
    if (wishes[0] && inspectWishContent) {
      inspectWishContent.textContent = wishes[0].text;
      if (inspectWishAuthor) inspectWishAuthor.textContent = `— ${wishes[0].author}`;
      if (inspectWishDate) inspectWishDate.textContent = wishes[0].date;
    }
  }

  submitWishBtn?.addEventListener('click', () => {
    const text = visitorWishInput?.value.trim();
    const author = visitorWishAuthor?.value.trim() || 'A Gentle Stargazer';
    if (!text) return;

    const newWish = {
      text: text,
      author: author,
      date: 'Just now'
    };

    wishes.unshift(newWish);
    Storage.set('wishes', wishes);
    renderWishingSky();

    if (visitorWishInput) visitorWishInput.value = '';
    if (visitorWishAuthor) visitorWishAuthor.value = '';

    SoundFX.playSuccessChord();
    triggerStardustBurst();
  });

  renderWishingSky();

  /* --------------------------------------------------------------------------
     13. STARDUST CELEBRATION BURST EFFECT
     -------------------------------------------------------------------------- */
  function triggerStardustBurst() {
    const container = document.getElementById('stardustCelebration');
    if (!container) return;

    const icons = ['✨', '⭐', '🌸', '💫', '🌟', '🪐'];
    const count = 30;

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'celebration-sparkle';
      sparkle.textContent = icons[Math.floor(Math.random() * icons.length)];
      
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight * 0.45;
      
      sparkle.style.left = `${startX}px`;
      sparkle.style.top = `${startY}px`;

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 220 + 80;
      sparkle.style.setProperty('--tx', `${Math.cos(angle) * velocity}px`);
      sparkle.style.setProperty('--ty', `${Math.sin(angle) * velocity}px`);

      container.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1800);
    }
  }

  /* --------------------------------------------------------------------------
     14. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksWrapper = document.getElementById('navLinks');

  mobileMenuBtn?.addEventListener('click', () => {
    navLinksWrapper?.classList.toggle('open');
    SoundFX.playPop(480);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksWrapper?.classList.remove('open');
      SoundFX.playPop(520);
    });
  });

  /* --------------------------------------------------------------------------
     15. UTILITIES
     -------------------------------------------------------------------------- */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  console.log('✨ My Little Universe has loaded smoothly into orbit. Welcome, Dreamer.');
});
