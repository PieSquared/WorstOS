/* Terminal app for WorstOS, uses depends on makeWindow api thingy from script.js */

function openTerminal(id, title){
  const win = makeWindow(id, title, `
    <div class="terminal-body" id="termOutput-${id}">
      <div class="terminal-line">WorstOS Terminal [Version 0.67]</div>
      <div class="terminal-line">(C) Copyright nobody in particular. All wrongs reserved.</div>
      <div class="terminal-line">Type "help" for a list of commands that mostly don't work.</div>
      <div class="terminal-line"></div>
      <div class="terminal-command-row" id="termRow-${id}">
        <span class="terminal-prompt">C:\\Users\\Guest&gt;</span>
        <span class="terminal-input-display" id="termDisplay-${id}"></span>
        <span class="terminal-cursor" id="termCursor-${id}">▌</span>
        <input type="text" class="terminal-input" id="termInput-${id}" autocomplete="off" autocapitalize="off" spellcheck="false">
      </div>
    </div>
  `, 420, 320);

  const output = win.querySelector(`#termOutput-${id}`);
  const input = win.querySelector(`#termInput-${id}`);
  const commandLine = win.querySelector(`#termRow-${id}`);
  const display = win.querySelector(`#termDisplay-${id}`);

  function updateInputDisplay(){
    display.textContent = input.value;
  }

  function termPrint(text){
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    output.insertBefore(line, commandLine);
    output.scrollTop = output.scrollHeight;
  }

  function runCommand(raw){
    const trimmed = raw.trim();
    termPrint('C:\\Users\\Guest>' + trimmed);
    if (trimmed === '') return;
    const lower = trimmed.toLowerCase();

    if (lower === 'help' || lower === '?') {
      [
        'Available commands:',
        '  help       - shows this, somehow',
        '  ls         - lists files that may not exist',
        '  whoami     - unclear',
        '  date/time  - approximately correct',
        '  cls/clear  - does not clear',
        '  sudo ...   - will not work',
        '  format c:  - please do not',
        '  potato     - trust the process',
        '  exit       - it will not',
      ].forEach(termPrint);

    } else if (lower === 'ls') {
      [
        ' Volume in drive C is WORST_OS',
        ' ',
        '05/12/2026  03:14 AM    <DIR>          Definitely_Not_A_Virus.exe',
        '05/12/2026  03:14 AM                 0 my_hopes_and_dreams.txt',
        '05/12/2026  03:14 AM               404 potato.sys',
        '05/12/2026  03:14 AM    <DIR>          System Volume Regret',
      ].forEach(termPrint);

    } else if (lower === 'whoami') {
      termPrint('unclear. running a background check...');
      termPrint('still loading. ask again never.');

    } else if (lower === 'date' || lower === 'time') {
      const h = Math.floor(Math.random() * 12) + 1;
      const m = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const ampm = Math.random() < 0.5 ? 'AM' : 'PM';
      termPrint(`The current time is: ${h}:${m} ${ampm} (probably)`);

    } else if (lower === 'cls' || lower === 'clear') {
      termPrint('Nice try.');

    } else if (lower.startsWith('sudo')) {
      termPrint('Permission denied. You are not important enough.');

    } else if (lower.startsWith('format')) {
      termPrint('Formatting C:... 0 percent complete.');
      termPrint('Just kidding. Please do not format your C: drive.');

    } else if (lower === 'potato') {
      termPrint('🥔 the potato acknowledges you.');

    } else if (lower === 'exit') {
      termPrint('There is no exit.');

    } else {
      termPrint(`'${trimmed}' is not recognized as an internal command, external command, operable program, potato, or batch file.`);
    }
  }

  input.addEventListener('input', updateInputDisplay);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.value;
      input.value = '';
      updateInputDisplay();
      runCommand(val);
    }
  });

  input.addEventListener('focus', () => commandLine.classList.add('active'));
  input.addEventListener('blur', () => commandLine.classList.remove('active'));

  commandLine.addEventListener('click', () => input.focus());
  output.addEventListener('click', () => input.focus());
  win.addEventListener('mousedown', () => setTimeout(() => input.focus(), 0));
  setTimeout(() => input.focus(), 0);
}