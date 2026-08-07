const ui = {
  desktopBg: document.getElementById('desktopBg'),
  boot: document.getElementById('boot'),
  bootBar: document.getElementById('bootBar'),
  bootStatus: document.getElementById('bootStatus'),
  specs: document.getElementById('specs'),
  pctText: document.getElementById('pctText'),
  captchaGate: document.getElementById('captchaGate'),
  verifyBtn: document.getElementById('verifyBtn'),
  captchaMsg: document.getElementById('captchaMsg'),
  desktop: document.getElementById('desktop'),
  taskbar: document.getElementById('taskbar'),
  startMenu: document.getElementById('startMenu'),
  startBtn: document.getElementById('startBtn'),
  startMenuList: document.getElementById('startMenuList'),
  clock: document.getElementById('clock'),
  openWindows: document.getElementById('openWindows'),
  startupAudio: document.getElementById('startupAudio'),
  errorAudio: document.getElementById('errorAudio'),
  notifAudio: document.getElementById('notifAudio')
};

function playAudio(key) {
  const audio = ui[key];
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function showDesktopBackground() {
  if (ui.desktopBg) {
    ui.desktopBg.style.display = 'block';
  }
}

if (ui.desktopBg) {
  ui.desktopBg.addEventListener('load', showDesktopBackground);
  ui.desktopBg.addEventListener('error', () => {
    if (ui.desktopBg) ui.desktopBg.style.display = 'none';
  });

  if (ui.desktopBg.complete && ui.desktopBg.naturalWidth > 0) {
    showDesktopBackground();
  }
}

const updates = [
  "Installing update 1 of infinite...",
  "Calcualting the mass of 67 potato...",
  "Downloading more RAM...",
  "Installing update 12 of infinite...",
  "Un-installing update 3 of infinite by mistake...",
  "Reinstalling update 3 of infinite...",
  "Asking for permission to ask for permission...",
  "Convincing the fan to spin...",
  "Installing update 2 of infinite...",
  "Installing update 12 of infinite (again)...",
  "Pretending this is normal...",
  "Finalizing (this may take forever)...",
];
const specLines = [
  "checking for problems... found = yes",
  "CPU temp = high",
  "RAM: 8 potatoes detected",
  "disk health = kill me",
  "loading bar integrity = questionable",
  "GPU: potato-powered",
  "glitches = a little",
];

const bootState = { pct: 0, upIdx: 0, interval: null, started: false };

function setStatus(text){
  if (ui.bootStatus) {
    ui.bootStatus.innerHTML = text + '<span class="cursor-blink">▌</span>';
  }
}

function startBoot(){
  if (bootState.started) return;
  bootState.started = true;

  bootState.interval = setInterval(() => {
    const roll = Math.random();
    let step;
    if (roll < 0.22) step = -(Math.random() * 9);
    else if (roll < 0.32) step = 0;
    else step = Math.random() * 11;

    bootState.pct = Math.max(2, Math.min(97, bootState.pct + step));
    if (ui.bootBar) ui.bootBar.style.width = bootState.pct + '%';
    if (ui.pctText) ui.pctText.textContent = Math.round(bootState.pct) + '%';

    if (Math.random() < 0.35) {
      bootState.upIdx = (bootState.upIdx + 1) % updates.length;
      setStatus(updates[bootState.upIdx]);
    }
    if (Math.random() < 0.25 && ui.specs) {
      ui.specs.textContent = specLines[Math.floor(Math.random() * specLines.length)];
    }
  }, 380);

  setTimeout(() => {
    clearInterval(bootState.interval);
    if (ui.bootBar) ui.bootBar.style.width = '100%';
    if (ui.pctText) ui.pctText.textContent = '100%';
    setStatus('Boot complete. Entering desktop...');
    playAudio('startupAudio');
    ui.boot.style.display = 'none';
    ui.desktop.style.display = 'block';
    ui.taskbar.style.display = 'flex';
    buildIcons();
    buildStartMenu();
    startClock();
    scheduleAnnoyingPopup();
    startFacetimeRinger();
    openApp('welcome', 'Welcome to WorstOS');
  }, 6200);
}

const fakeCursor = document.getElementById('fakeCursor');
if (fakeCursor) {
  document.addEventListener('mousemove', (e) => {
    fakeCursor.style.left = `${e.clientX}px`;
    fakeCursor.style.top = `${e.clientY}px`;
    fakeCursor.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => {
    fakeCursor.style.opacity = '0';
  });
  window.addEventListener('blur', () => {
    fakeCursor.style.opacity = '0';
  });
}

const biosLines = [
  'AMIBIOS(C)2020 American Megatrends, Inc.',
  '',
  'POTATO BOARD GAMING ACPI BIOS Revision 0.67',
  'CPU: Potato(R) Core(TM) i-Nothing CPU @ 0.03GHz (POTATO INSIDE)',
  '  Speed: 1.2GHz (overclocked to 0.03GHz)',
  '',
  'Total Memory: 1 potato',
  '',
  'USB Devices total: 1 Drive, 0 Keyboards (works anyway), 12 Mice, 1 Hub (on fire)',
  'USB Drive #0: Definitely_Not_A_Virus 0915',
  '',
  '__DETECT__',
  '',
  '',
  'Please enter setup to recover BIOS setting.',
  'After setting up the potato, some configuration was built,',
  'SATA Mode Selection must be changed to worse to avoid working issues.',
  'If OS was previously installed as good, set SATA mode to bad in BIOS.',
  'Press F1 to Run SETUP (does nothing)',
];

function typeBiosLines(container, onDone){
  container.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'bios-cursor';
  container.appendChild(cursor);

  let i = 0;
  function next(){
    if (i >= biosLines.length) {
      cursor.remove();
      if (onDone) onDone();
      return;
    }
    const raw = biosLines[i];
    const line = document.createElement('div');
    if (raw === '__DETECT__') {
      line.innerHTML = 'Detected ATA/ATAPI Devices<span class="bios-dots">...</span>';
    } else {
      line.textContent = raw === '' ? '\u00A0' : raw;
    }
    container.insertBefore(line, cursor);
    i++;
    setTimeout(next, raw === '' ? 60 : 90 + Math.random() * 70);
  }
  next();
}

window.addEventListener('load', () => {
  if (ui.boot) ui.boot.style.display = 'none';

  const bios = document.getElementById('biosScreen');
  const biosLinesEl = document.getElementById('biosLines');
  if (bios && biosLinesEl) {
    bios.style.display = 'flex';

    let advanced = false;
    function advance(){
      if (advanced) return;
      advanced = true;
      document.removeEventListener('keydown', advance);
      bios.style.display = 'none';
      if (ui.boot) ui.boot.style.display = 'flex';
      startBoot();
    }
    document.addEventListener('keydown', advance);

    typeBiosLines(biosLinesEl, () => {
      const anykey = document.createElement('div');
      anykey.className = 'bios-anykey';
      anykey.innerHTML = 'Press any key to continue<span class="bios-dots">...</span>';
      biosLinesEl.appendChild(anykey);
      setTimeout(advance, 1800);
    });
  } else {
    if (ui.boot) ui.boot.style.display = 'flex';
    startBoot();
  }
});

/* CAPTCHA  */
const CORRECT_TILES = ['g1', 'g3', 'g6', 'g8']; // the potato ones
const ALL_TILES = ['g1','g2','g3','g4','g5','g6','g7','g8','g9'];

function captchaIsCorrect(){
  const selected = ALL_TILES.filter(id => document.getElementById(id).checked);
  return selected.length === CORRECT_TILES.length && CORRECT_TILES.every(id => selected.includes(id));
}

ui.verifyBtn.addEventListener('click', () => {
  const msg = ui.captchaMsg;
  if (captchaIsCorrect()) {
    msg.classList.remove('show');
    ui.captchaGate.style.display = 'none';
    ui.boot.style.display = 'flex';
    startBoot();
  } else {
    msg.classList.add('show');
    playAudio('errorAudio');
  }
});

/*  DESKTOP */
ui.desktop.addEventListener('click', () => {
  ui.startMenu.style.display = 'none';
  document.querySelectorAll('#icons .icon.selected').forEach(icon => icon.classList.remove('selected'));
});

function buildStartMenu(){
  const list = ui.startMenuList;
  list.innerHTML = `
    <li onclick="openApp('terminal','Command Prompt')">🖥️ Terminal</li>
    <li onclick="openApp('facetime','FaceTime')">📞 FaceTime</li>
    <li onclick="openApp('virus','Definitely_Not_A_Virus.exe')">☣️ Definitely_Not_A_Virus.exe</li>
    <li>🔌 Shut Down
      <div class="submenu"><ul>
        <li onclick="confirmShutdown(1)">Restart</li>
        <li onclick="confirmShutdown(1)">Sleep</li>
        <li onclick="confirmShutdown(1)">Actually Shut Down</li>
      </ul></div>
    </li>
  `;
}
ui.startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const m = ui.startMenu;
  m.style.display = m.style.display === 'block' ? 'none' : 'block';
});

function confirmShutdown(stage){
  if (stage === 1){
    if (confirm("Are you sure you want to shut down?")) confirmShutdown(2);
    return;
  }
  if (stage === 2){
    if (confirm("Are you REALLY sure? You will lose unsaved progress on nothing, since nothing was saved.")) confirmShutdown(3);
    return;
  }
  if (stage === 3){
    if (!confirm("Final answer?")) { alert("Shutdown cancelled. Obviously."); return; }
  }
  location.reload();
}

function startClock(){
  const clock = ui.clock;
  function tick(){
    const h = Math.floor(Math.random()*12)+1;
    const m = Math.floor(Math.random()*60).toString().padStart(2,'0');
    const ampm = Math.random() < 0.5 ? 'AM' : 'PM';
    clock.textContent = `${h}:${m} ${ampm}`;
  }
  tick();
  setInterval(tick, 4000 + Math.random()*3000);
}

/* desktop icons */
const iconDefs = [
  { label: 'Terminal', glyph: '🖥️', image: 'images/desktop/terminal.png', app: 'terminal' },
  { label: 'FaceTime', glyph: '📞', image: 'images/desktop/ft.png', app: 'facetime' },
  { label: 'Definitely_Not_A_Virus', glyph: '☣️', image: 'images/desktop/virus.png', app: 'virus' },
];
function buildIcons(){
  const wrap = document.getElementById('icons');
  wrap.innerHTML = '';
  iconDefs.forEach(def => {
    const el = document.createElement('div');
    el.className = 'icon';
    const glyphMarkup = def.image
      ? `<img class="glyph" src="${def.image}" alt="${def.label}" style="width:44px;height:44px;object-fit:contain;">`
      : `<div class="glyph">${def.glyph}</div>`;
    el.innerHTML = `${glyphMarkup}<div class="label">${def.label}</div>`;
    let clicks = 0, clickTimer;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('#icons .icon.selected').forEach(icon => icon.classList.remove('selected'));
      el.classList.add('selected');
      clicks++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => clicks = 0, 400);
      if (clicks >= 2) {
        clicks = 0;
        openApp(def.app, def.label);
      }
    });
    wrap.appendChild(el);
  });
}

function openApp(kind, title){
  ui.startMenu.style.display = 'none';
  const id = kind + Date.now();
  if (kind === 'terminal') openTerminal(id, title);
  else if (kind === 'welcome') openWelcome(id, title);
  else if (kind === 'facetime') openFacetime(id, title);
  else if (kind === 'virus') openVirus(id, title);
}

/* window manager for future use  */
let zTop = 100;
let winCount = 0;
const openWins = {};

function makeWindow(id, title, contentHTML, w=380, h=320, appKind='generic', appIcon=''){
  const win = document.createElement('div');
  win.className = 'app-win';
  win.style.width = w + 'px';
  win.style.left = (60 + (winCount % 6) * 30) + 'px';
  win.style.top = (40 + (winCount % 6) * 26) + 'px';
  win.style.zIndex = ++zTop;
  winCount++;

  win.innerHTML = `
    <div class="app-titlebar">
      <span>${title}</span>
      <div class="app-btns">
        <button class="minBtn">_</button>
        <button class="maxBtn">▢</button>
        <button class="closeBtn">✕</button>
      </div>
    </div>
    <div class="app-body">${contentHTML}</div>
  `;
  ui.desktop.appendChild(win);
  bringToFront(win);

  const bar = win.querySelector('.app-titlebar');
  let dragging = false, ox=0, oy=0;
  bar.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    dragging = true;
    ox = e.clientX - win.offsetLeft; oy = e.clientY - win.offsetTop;
    bringToFront(win);
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    win.style.left = (e.clientX - ox) + 'px';
    win.style.top = Math.max(0, e.clientY - oy) + 'px';
  });
  document.addEventListener('mouseup', () => dragging = false);
  win.addEventListener('mousedown', () => bringToFront(win));

  win.querySelector('.closeBtn').addEventListener('click', () => {
    win.remove();
    delete openWins[id];
    renderTaskbar();
  });
  win.querySelector('.minBtn').addEventListener('click', () => { win.style.display = 'none'; });
  win.querySelector('.maxBtn').addEventListener('click', () => {});

  openWins[id] = { el: win, title, kind: appKind, icon: appIcon };
  renderTaskbar();
  return win;
}
function bringToFront(win){
  document.querySelectorAll('.app-win').forEach(w => w.classList.remove('focused'));
  win.classList.add('focused');
  win.style.zIndex = ++zTop;
}
function renderTaskbar(){
  const bar = ui.openWindows;
  bar.innerHTML = '';
  Object.entries(openWins).forEach(([id, info]) => {
    const item = document.createElement('div');
    item.className = 'taskitem';
    const iconMarkup = info.icon
      ? `<img src="${info.icon}" alt="" class="task-icon">`
      : `<span class="task-icon">▣</span>`;
    item.innerHTML = `${iconMarkup}<span class="task-label">${info.title}</span>`;
    item.addEventListener('click', () => {
      info.el.style.display = 'block';
      bringToFront(info.el);
    });
    bar.appendChild(item);
  });
}



/* annoying popups, each tagged error or notification for sound purposes */
const popupMsgs = [
  {t:'System Notice', b:'A critical update is available. Ignoring this message will not make it go away.', type:'error'},
  {t:'Battery', b:'Battery at 12%. This device does not have a battery.', type:'error'},
  {t:'Driver Required', b:'A new driver is required to continue using your mouse.', type:'error'},
  {t:'Survey', b:'How is your experience with WorstOS so far? (This popup cannot be dismissed with an honest answer.)', type:'notification'},
  {t:'Reminder', b:'You have 0 new messages. This is still worth a popup.', type:'notification'},
];
let popupCount = 0;
function scheduleAnnoyingPopup(){
  setTimeout(() => {
    if (Math.random() < 0.85) spawnPopup();
    scheduleAnnoyingPopup();
  }, 6000 + Math.random()*7000);
}
function spawnPopup(){
  popupCount++;
  const msg = popupMsgs[Math.floor(Math.random()*popupMsgs.length)];
  const p = document.createElement('div');
  p.className = 'popup';

  // scatter anywhere on screen, clear of the taskbar at the bottom
  const popupW = 250, popupH = 130, taskbarH = 40, margin = 10;
  const maxLeft = Math.max(margin, window.innerWidth - popupW - margin);
  const maxTop = Math.max(margin, window.innerHeight - popupH - taskbarH - margin);
  p.style.left = (margin + Math.random() * maxLeft) + 'px';
  p.style.top = (margin + Math.random() * maxTop) + 'px';

  p.innerHTML = `
    <div class="app-titlebar"><span>${msg.t}</span><span class="closeX" style="cursor:pointer;">✕</span></div>
    <div class="app-body">${msg.b}<br><button class="dismiss">Dismiss</button></div>
  `;
  document.body.appendChild(p);

  const titleBar = p.querySelector('.app-titlebar');
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titleBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('closeX')) return;
    dragging = true;
    offsetX = e.clientX - p.offsetLeft;
    offsetY = e.clientY - p.offsetTop;
    p.style.zIndex = ++zTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const maxLeft = Math.max(10, window.innerWidth - p.offsetWidth - 10);
    const maxTop = Math.max(10, window.innerHeight - p.offsetHeight - 40);
    p.style.left = Math.max(10, Math.min(maxLeft, e.clientX - offsetX)) + 'px';
    p.style.top = Math.max(10, Math.min(maxTop, e.clientY - offsetY)) + 'px';
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
  });

  playAudio(msg.type === 'error' ? 'errorAudio' : 'notifAudio');

  function remove(){ p.remove(); popupCount--; }
  p.querySelector('.closeX').addEventListener('click', () => {
    if (Math.random() < 0.4) spawnPopup();
    remove();
  });
  p.querySelector('.dismiss').addEventListener('click', () => {
    if (Math.random() < 0.4) spawnPopup();
    remove();
  });
}

document.addEventListener('contextmenu', (e) => {
  if (ui.desktop.style.display !== 'none') {
    e.preventDefault();
    alert("Right-click menu is under construction (it will always be under construction).");
  }
});