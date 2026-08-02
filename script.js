const ui = {
  logoImg: document.getElementById('logoImg'),
  logoFallback: document.getElementById('logoFallback'),
  desktopBg: document.getElementById('desktopBg'),
  boot: document.getElementById('boot'),
  welcomeScreen: document.getElementById('welcomeScreen'),
  enterBtn: document.getElementById('enterBtn'),
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

ui.logoImg.addEventListener('load', () => { ui.logoImg.style.display = 'block'; ui.logoFallback.style.display = 'none'; });
ui.logoImg.addEventListener('error', () => { ui.logoImg.style.display = 'none'; ui.logoFallback.style.display = 'flex'; });

ui.desktopBg.addEventListener('load', () => { ui.desktopBg.style.display = 'block'; });
ui.desktopBg.addEventListener('error', () => { ui.desktopBg.style.display = 'none'; });

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
    setStatus('Almost there. Click below to (maybe) continue.');
    const target = document.querySelector('#boot .window-body') || ui.boot;
    if (target) {
      const btn = document.createElement('button');
      btn.className = 'continue-btn';
      btn.textContent = 'Continue ▶';
      btn.style.position = 'fixed';
      btn.style.right = '32px';
      btn.style.bottom = '32px';
      btn.style.zIndex = '1001';
      btn.style.transition = 'transform 0.2s ease-out';
      document.body.appendChild(btn);

      let dodges = 0;
      btn.addEventListener('mouseenter', () => {
        if (dodges >= 6) return;
        dodges++;
        const dx = (Math.random() - 0.5) * 780;
        const dy = (Math.random() - 0.5) * 420;
        const maxX = Math.max(0, window.innerWidth - btn.offsetWidth - 40);
        const maxY = Math.max(0, window.innerHeight - btn.offsetHeight - 40);
        const nextX = Math.max(0, Math.min(maxX, btn.offsetLeft + dx));
        const nextY = Math.max(0, Math.min(maxY, btn.offsetTop + dy));
        btn.style.left = `${nextX}px`;
        btn.style.top = `${nextY}px`;
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
      });
      btn.addEventListener('click', () => {
        playAudio('startupAudio');
        btn.remove();
        ui.boot.style.display = 'none';
        ui.desktop.style.display = 'block';
        ui.taskbar.style.display = 'flex';
        buildStartMenu();
        startClock();
        scheduleAnnoyingPopup();
      });
    }

  }, 6200);
}

window.addEventListener('load', () => {
  ui.welcomeScreen.style.display = 'flex';
  ui.boot.style.display = 'none';
});

ui.enterBtn.addEventListener('click', () => {
  playAudio('startupAudio');
  ui.welcomeScreen.style.display = 'none';
  ui.boot.style.display = 'flex';
  startBoot();
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
});

function buildStartMenu(){
  const list = ui.startMenuList;
  list.innerHTML = `
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

/* window manager for future use  */
let zTop = 100;
let winCount = 0;
const openWins = {};

function makeWindow(id, title, contentHTML, w=380, h=320){
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

  openWins[id] = { el: win, title };
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
    item.textContent = info.title;
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
    if (popupCount < 8 && Math.random() < 0.85) spawnPopup();
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
    if (Math.random() < 0.4 && popupCount < 5) spawnPopup();
    remove();
  });
  p.querySelector('.dismiss').addEventListener('click', () => {
    if (Math.random() < 0.4 && popupCount < 5) spawnPopup();
    remove();
  });
}

document.addEventListener('contextmenu', (e) => {
  if (ui.desktop.style.display !== 'none') {
    e.preventDefault();
    alert("Right-click menu is under construction (it will always be under construction).");
  }
});
