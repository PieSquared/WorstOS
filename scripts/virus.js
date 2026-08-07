let virusAudioPlayers = [];

const VIRUS_FAKE_FILES = [
  'my_hopes_and_dreams.txt',
  'potato.sys',
  'cookies.dll,
  'your_boot_sector.dll',
  'the_last_save_file.dat',
  'totally_not_important.exe',
  'System32',
  'Definitely_Not_A_Virus.exe',
  'homework_final_FINAL_v3.docx',
  'C:\\Users\\Guest\\password.exe,
  'one_(1)_potato.png',
  'passwords_definitely_not_here.txt',
];

const VIRUS_STATUS_LINES = [
  'Encrypting your potatoes...',
  'Rearranging your pixels...',
  'Contacting the potato mothership...',
  'Politely asking your files to leave...',
  'Feeling threatening...',
  'Charging dramatic music license...',
];

let virusActive = false;
let virusIntervals = [];
function spawnVirusIcons(count = 80) {
  const desktop = document.getElementById('icons');
  if (!desktop) return;

  const iconSize = 84;
  const cols = Math.max(1, Math.floor(window.innerWidth / iconSize));
  const rows = Math.max(1, Math.floor((window.innerHeight - 60) / iconSize));

  let placed = 0;

  for (let y = 0; y < rows && placed < count; y++) {
    for (let x = 0; x < cols && placed < count; x++) {

      const icon = document.createElement('div');
      icon.className = 'icon virus-icon';

      icon.style.position = 'absolute';
      icon.style.left = (x * iconSize + 12) + 'px';
      icon.style.top = (y * iconSize + 12) + 'px';

      icon.innerHTML = `
        <img class="glyph"
             src="images/desktop/virus.png"
             style="width:44px;height:44px;object-fit:contain;">
        <div class="label">Definitely_Not_A_Virus</div>
      `;

      icon.addEventListener('dblclick', () => {
        openVirus('virus' + Date.now(), 'Definitely_Not_A_Virus.exe');
      });

      desktop.appendChild(icon);

      virusIntervals.push({
        type: 'icon',
        el: icon
      });

      placed++;
    }
  }
}

function openVirus(id, title) {
  const win = makeWindow(
    id,
    title,
    `
      <div class="vir-app" id="virApp-${id}">
        <div class="vir-flashbar">⚠ THREAT DETECTED ⚠</div>

        <div class="vir-scan" id="virScan-${id}">
          <div class="vir-icon" aria-hidden="true">☣️</div>
          <div class="vir-title">VIRUS DETECTED</div>
          <div class="vir-sub">Definitely_Not_A_Virus.exe is doing something</div>

          <div class="vir-log" id="virLog-${id}"></div>

          <div class="vir-progress-wrap">
            <div class="vir-progress-bar" id="virProgress-${id}"></div>
          </div>
          <div class="vir-pct-row">
            <span id="virPct-${id}">0%</span>
            <span id="virStatus-${id}">${VIRUS_STATUS_LINES[0]}</span>
          </div>
        </div>

        <div class="vir-done" id="virDone-${id}" style="display:none;">
          <div class="vir-done-emoji">💀</div>
          <div class="vir-done-title">TOO LATE.</div>
          <div class="vir-done-text">The virus has escaped. Your system is now potato-free.</div>
          <button class="vir-done-btn" id="virCloseBtn-${id}">PANIC</button>
        </div>
      </div>
    `,
    320,
    420
  );

  const scan = win.querySelector(`#virScan-${id}`);
  const done = win.querySelector(`#virDone-${id}`);
  const log = win.querySelector(`#virLog-${id}`);
  const progressBar = win.querySelector(`#virProgress-${id}`);
  const pctText = win.querySelector(`#virPct-${id}`);
  const statusText = win.querySelector(`#virStatus-${id}`);
  const closeBtn = win.querySelector(`#virCloseBtn-${id}`);

  let pct = 0;
  let fileIdx = 0;
  let virusTriggered = false;

  function logLine(text) {
    const line = document.createElement('div');
    line.className = 'vir-log-line';
    line.textContent = text;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }


  const logInterval = setInterval(() => {
    const file = VIRUS_FAKE_FILES[fileIdx % VIRUS_FAKE_FILES.length];
    fileIdx++;
    logLine(`Deleting ${file}... done (not really)`);
  }, 650);

  const progressInterval = setInterval(() => {
    pct = Math.min(100, pct + (8 + Math.random() * 10));
    progressBar.style.width = pct + '%';
    pctText.textContent = Math.round(pct) + '%';

    if (Math.random() < 0.45) {
      statusText.textContent = VIRUS_STATUS_LINES[Math.floor(Math.random() * VIRUS_STATUS_LINES.length)];
    }

    if (pct >= 100 && !virusTriggered) {
      virusTriggered = true;
      clearInterval(progressInterval);
      clearInterval(logInterval);
      statusText.textContent = 'Virus done';

      setTimeout(() => {
        scan.style.display = 'none';
        done.style.display = 'flex';
        activateVirus();
      }, 300);
    }
  }, 200);


  win.querySelector('.closeBtn').addEventListener('click', () => {
    clearInterval(logInterval);
    clearInterval(progressInterval);

    if (!virusTriggered) {
      setTimeout(() => activateVirus(), 800);
    }
  });

  closeBtn.addEventListener('click', () => {
    win.querySelector('.closeBtn').click();
  });
}

function activateVirus() {
  if (virusActive) return;
  virusActive = true;

  const bg = document.getElementById('desktopBg');
  if (bg) {
    bg.src = 'images/virus.jpeg';
    bg.style.display = 'block';
  }


  spawnVirusPopups(8);

  const popupInterval = setInterval(() => {
    if (!virusActive) {
      clearInterval(popupInterval);
      return;
    }


    if (Math.random() < 0.95) {
      spawnVirusPopups(2 + Math.floor(Math.random() * 4)); 
    }

    if (Math.random() < 0.12) {
      spawnVirusPopups(10 + Math.floor(Math.random() * 10)); 
    }

  }, 800 + Math.random() * 800);

  virusIntervals.push({
    type: 'interval',
    interval: popupInterval
  });

  spawnVirusIcons(670);
  playVirusAudio();
  showVirusTimer();
}

function spawnVirusPopups(count = 3) {
  const virusMessages = [
    { t: '⚠ VIRUS DETECTED', b: 'Multiple threats detected! Your system is cooked', type: 'error' },
    { t: '⚠ MALWARE FOUND', b: 'Definitely_Not_A_Virus.exe is running wild', type: 'error' },
    { t: '⚠ SYSTEM INFECTION', b: 'Your potato is now a virus host. Congratulations', type: 'error' },
    { t: '⚠ DATA LOSS IMMINENT', b: 'All your files are being deleted.', type: 'error' },
    { t: '⚠ CRITICAL FAILURE', b: 'The virus has breached the firewall', type: 'error' },
    { t: '⚠ SYSTEM COMPROMISED', b: 'Your system has been infected. Prepare for chaos.', type: 'error' },
    { t: '⚠ VIRUS SPREADING', b: 'The virus is replicating across your system!', type: 'error' },
    { t: '⚠ CRITICAL ERROR', b: 'A critical error has occurred.', type: 'error' },
  ];

  const toSpawn = Math.max(1, Math.min(count, 10));

  for (let i = 0; i < toSpawn; i++) {
    setTimeout(() => {
      if (!virusActive) return;

      const msg = virusMessages[Math.floor(Math.random() * virusMessages.length)];

      const p = document.createElement('div');
      p.className = 'popup virus-popup simplified-virus-popup';

      // Keep position random but avoid extra “motion” effects
      const popupW = 280, popupH = 130;
      const maxLeft = Math.max(10, window.innerWidth - popupW - 10);
      const maxTop = Math.max(10, window.innerHeight - popupH - 50);
      p.style.left = (Math.random() * maxLeft) + 'px';
      p.style.top = (Math.random() * maxTop) + 'px';
      p.style.zIndex = ++zTop;

      p.innerHTML = `
        <div class="app-titlebar" style="background:linear-gradient(180deg, #ff0000, #8b0000);">
          <span>☣️ ${msg.t}</span>
          <span class="closeX" style="cursor:pointer;color:#fff;">✕</span>
        </div>
        <div class="app-body" style="background:#1a0000;color:#ff4444;">
          ${msg.b}
          <br><button class="dismiss" style="background:#8b0000;color:#fff;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">OK</button>
        </div>
      `;

      document.body.appendChild(p);

      // Drag support kept, but no “animation” usage
      const titleBar = p.querySelector('.app-titlebar');
      let dragging = false, offsetX = 0, offsetY = 0;

      titleBar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('closeX')) return;
        dragging = true;
        offsetX = e.clientX - p.offsetLeft;
        offsetY = e.clientY - p.offsetTop;
        p.style.zIndex = ++zTop;
      });

      document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        p.style.left = Math.max(10, Math.min(window.innerWidth - p.offsetWidth - 10, e.clientX - offsetX)) + 'px';
        p.style.top = Math.max(10, Math.min(window.innerHeight - p.offsetHeight - 40, e.clientY - offsetY)) + 'px';
      });

      document.addEventListener('mouseup', () => (dragging = false));

      function removePopup() {
        p.remove();
      }

      p.querySelector('.closeX').addEventListener('click', () => removePopup());
      p.querySelector('.dismiss').addEventListener('click', () => removePopup());

      virusIntervals.push({ type: 'popup', el: p });
    }, i * 180); // faster initial spawn; still not “moving”
  }
}

function playVirusAudio() {
  const audioFiles = ['1.mp3', '2.mp3', '3.mp3'];

  function playOverlapping() {
    if (!virusActive) return;

    const count = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {
      const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];

      const audio = new Audio('audio/' + randomFile);
      audio.volume = 0.2 + Math.random() * 0.25;

      virusAudioPlayers.push(audio);

      audio.onended = () => {
        virusAudioPlayers = virusAudioPlayers.filter(a => a !== audio);
      };

      audio.play().catch(() => {});
    }

    const delay = 800 + Math.random() * 1300;

    const timeout = setTimeout(playOverlapping, delay);

    virusIntervals.push({
      type: 'audio',
      timeout
    });
  }

  playOverlapping();
}

function showVirusTimer() {

  const timerDiv = document.createElement('div');
  timerDiv.id = 'virusTimer';
  timerDiv.style.cssText = `
    position: fixed;
    bottom: 50px;
    right: 20px;
    background: rgba(0,0,0,0.85);
    color: #ff0000;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 18px;
    font-weight: bold;
    padding: 15px 20px;
    border: 2px solid #ff0000;
    border-radius: 8px;
    z-index: 9999;
    text-shadow: 0 0 10px #ff0000;
    box-shadow: 0 0 30px rgba(255,0,0,0.3);
  `;

  timerDiv.innerHTML = `
    <div style="font-size:14px;color:#ff6666;margin-bottom:4px;">⚠ FIXING IN:</div>
    <div id="virusTimerCountdown" style="font-size:32px;text-align:center;">30</div>
  `;
  document.body.appendChild(timerDiv);

  let seconds = 30;
  const countdownEl = document.getElementById('virusTimerCountdown');

  const timerInterval = setInterval(() => {
    seconds--;
    if (countdownEl) {
      countdownEl.textContent = seconds;

      if (seconds <= 10) {
        countdownEl.style.color = '#ff4444';
        countdownEl.style.fontSize = (32 + (10 - seconds) * 2) + 'px';
      }
      if (seconds <= 5) {
        countdownEl.style.color = '#ff0000';
        countdownEl.style.textShadow = '0 0 30px #ff0000';
      }
    }

    if (seconds <= 0) {
      clearInterval(timerInterval);
      showBSOD();
    }
  }, 1000);

  virusIntervals.push({ type: 'timer', interval: timerInterval });
}

function showBSOD() {

virusActive = false;


virusIntervals.forEach(item => {
  if (item.interval) clearInterval(item.interval);
  if (item.timeout) clearTimeout(item.timeout);
});


virusAudioPlayers.forEach(audio => {
  try {
    audio.pause();
    audio.currentTime = 0;
    audio.src = "";
    audio.load();
  } catch (e) {}
});

virusAudioPlayers.length = 0;
  const timer = document.getElementById('virusTimer');
  if (timer) timer.remove();

  // Remove virus popups/icons (we only create popups now)
  document.querySelectorAll('.virus-popup, .virus-icon').forEach(el => el.remove());

  // Stop any audio/video currently playing
  document.querySelectorAll('audio, video').forEach(media => {
    try {
      media.pause();
      media.currentTime = 0;
    } catch (e) {}
  });

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  const bsodAudio = new Audio('audio/bsod.mp3');
  bsodAudio.loop = true;
  bsodAudio.volume = 1;
  bsodAudio.play().catch(() => {});

  const bsod = document.createElement('div');
  bsod.id = 'bsodScreen';

  bsod.style.cssText = `
    position:fixed;
    inset:0;
    background:#0000AA;
    color:#FFFFFF;
    font-family:"Lucida Console","Courier New",monospace;
    font-size:18px;
    line-height:1.45;
    white-space:pre-wrap;
    padding:48px;
    box-sizing:border-box;
    z-index:999999;
    overflow:hidden;
  `;

  bsod.textContent =
`A problem has been detected and WorstOS has been shut down
to prevent damage to your computer.

POTATO_ERROR

Technical information:

*** STOP: 0x00000067
*** potato.sys`;

  document.body.appendChild(bsod);

  setTimeout(() => location.reload(), 5000);
}

// optional cleanup hook if you call it elsewhere
function cleanupVirus() {
  virusActive = false;
  virusIntervals.forEach(item => {
    if (item.interval) clearInterval(item.interval);
    if (item.timeout) clearTimeout(item.timeout);
    if (item.el && item.el.parentNode) item.el.remove();
  });
  virusIntervals = [];
}