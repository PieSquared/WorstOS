/* Welcome app */
function openWelcome(id, title){
  const win = makeWindow(id, title, `
    <div class="welcome-app-body">
      <div class="welcome-logo-wrap">
        <img src="images/logo.png" alt="WorstOS logo" style="display:none;"
          onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div style="display:flex; align-items:center; justify-content:center; font-size:28px;">🥔</div>
      </div>

      <h2 class="welcome-title">WorstOS</h2>
      <div class="welcome-tagline">"wtf is this" — edition 0.67 (working on it)</div>

      <div class="welcome-blurb">
        <b>Welcome to your desktop.</b> Everything here is fully operational, in the sense that it turns on.
      </div>

      <button type="button" class="welcome-ok-btn">OK</button>
      <div class="welcome-footnote">no refunds, no updates, no promises</div>
    </div>
  `, 340, 300, 'welcome', 'images/logo.png');

  const desktopRect = ui.desktop.getBoundingClientRect();
  const left = Math.max(20, Math.round((desktopRect.width - win.offsetWidth) / 2));
  const top = Math.max(20, Math.round((desktopRect.height - win.offsetHeight) / 2 - 20));
  win.style.left = `${left}px`;
  win.style.top = `${top}px`;

  const okBtn = win.querySelector('.welcome-ok-btn');
  okBtn.addEventListener('click', () => {
    win.querySelector('.closeBtn').click();
  });
}