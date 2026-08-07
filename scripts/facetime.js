/* FaceTime app for WorstOS, depends on makeWindow api from script.js */

const FACETIME_CONTACTS = {
  therock: {
    name: 'The Rock',
    photo: 'media/therock.jpeg',
    kind: 'video',
    video: 'media/therock.mp4',
  },
  johnpork: {
    name: 'John Pork',
    photo: 'media/johnpork.jpeg',
    kind: 'gif',
    gif: 'media/johnpork.gif',
    audio: 'audio/johnpork.mp3',
  },
};


let ftInstance = null;

function openFacetime(id, title){
  const win = makeWindow(id, title, `
    <div class="ft-app" id="ftApp-${id}">

      <div class="ft-screen ft-home" id="ftHome-${id}">
        <div class="ft-header">FaceTime</div>
        <div class="ft-section-label">Recents</div>
        <div class="ft-recents-list">
          <div class="ft-recent-item" data-contact="therock">
            <img class="ft-avatar" src="media/therock.jpeg" alt="The Rock">
            <div class="ft-recent-info">
              <div class="ft-recent-name">The Rock</div>
              <div class="ft-recent-sub">FaceTime Video</div>
            </div>
          </div>
          <div class="ft-recent-item" data-contact="johnpork">
            <img class="ft-avatar" src="media/johnpork.jpeg" alt="John Pork">
            <div class="ft-recent-info">
              <div class="ft-recent-name">John Pork</div>
              <div class="ft-recent-sub">FaceTime Video</div>
            </div>
          </div>
        </div>
      </div>

      <div class="ft-screen ft-calling" id="ftCalling-${id}" style="display:none;">
        <img class="ft-calling-photo" id="ftCallingPhoto-${id}" src="" alt="">
        <div class="ft-calling-scrim"></div>
        <div class="ft-calling-info">
          <div class="ft-calling-name" id="ftCallingName-${id}"></div>
          <div class="ft-calling-status" id="ftCallingStatus-${id}">FaceTime video<span class="ft-dots">...</span></div>
        </div>
        <div class="ft-call-controls">
          <button class="ft-btn" id="ftDeclineBtn-${id}"><img src="images/decline.png" alt="Decline"></button>
          <button class="ft-btn" id="ftAnswerBtn-${id}"><img src="images/answer.png" alt="Answer"></button>
        </div>
      </div>

      <audio id="ftRingtone-${id}" src="audio/ringtone.mp3" loop></audio>

      <div class="ft-screen ft-incall" id="ftIncall-${id}" style="display:none;">
        <video class="ft-media" id="ftVideo-${id}" playsinline muted></video>
        <img class="ft-media" id="ftGif-${id}" src="" alt="">
        <audio id="ftAudio-${id}"></audio>
        <div class="ft-incall-name" id="ftIncallName-${id}"></div>
        <div class="ft-call-controls">
          <button class="ft-btn" id="ftHangupBtn-${id}"><img src="images/decline.png" alt="End Call"></button>
        </div>
      </div>

    </div>
  `, 300, 460);

  const home = win.querySelector(`#ftHome-${id}`);
  const calling = win.querySelector(`#ftCalling-${id}`);
  const incall = win.querySelector(`#ftIncall-${id}`);

  const callingPhoto = win.querySelector(`#ftCallingPhoto-${id}`);
  const callingName = win.querySelector(`#ftCallingName-${id}`);
  const declineBtn = win.querySelector(`#ftDeclineBtn-${id}`);
  const answerBtn = win.querySelector(`#ftAnswerBtn-${id}`);

  const callingStatus = win.querySelector(`#ftCallingStatus-${id}`);
  const ringtone = win.querySelector(`#ftRingtone-${id}`);

  const incallName = win.querySelector(`#ftIncallName-${id}`);
  const hangupBtn = win.querySelector(`#ftHangupBtn-${id}`);
  const videoEl = win.querySelector(`#ftVideo-${id}`);
  const gifEl = win.querySelector(`#ftGif-${id}`);
  const audioEl = win.querySelector(`#ftAudio-${id}`);

  let activeContact = null;
  let callActive = false;

  function showScreen(el){
    [home, calling, incall].forEach(s => s.style.display = 'none');
    el.style.display = 'flex';
  }

  function stopMedia(){
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
    videoEl.style.display = 'none';
    gifEl.src = '';
    gifEl.style.display = 'none';
    audioEl.pause();
    audioEl.removeAttribute('src');
    ringtone.pause();
    ringtone.currentTime = 0;
  }

  function goHome(){
    stopMedia();
    activeContact = null;
    callActive = false;
    showScreen(home);
  }

  function startCalling(contactId, incoming){
    const contact = FACETIME_CONTACTS[contactId];
    if (!contact) return;
    activeContact = contact;
    callActive = true;
    callingPhoto.src = contact.photo;
    callingName.textContent = contact.name;
    if (incoming) {
      callingStatus.innerHTML = 'Incoming Call<span class="ft-dots">...</span>';
      ringtone.currentTime = 0;
      ringtone.play().catch(() => {});
    } else {
      callingStatus.innerHTML = 'FaceTime video<span class="ft-dots">...</span>';
    }
    showScreen(calling);
  }

  function answerCall(){
    if (!activeContact) return;
    ringtone.pause();
    ringtone.currentTime = 0;
    incallName.textContent = activeContact.name;
    if (activeContact.kind === 'video') {
      videoEl.src = activeContact.video;
      videoEl.muted = true;
      videoEl.style.display = 'block';
      videoEl.play().catch(() => {});
    } else if (activeContact.kind === 'gif') {
      gifEl.src = activeContact.gif;
      gifEl.style.display = 'block';
      audioEl.src = activeContact.audio;
      audioEl.play().catch(() => {});
    }
    showScreen(incall);
  }

  win.querySelectorAll('.ft-recent-item').forEach(item => {
    item.addEventListener('click', () => startCalling(item.dataset.contact));
  });

  declineBtn.addEventListener('click', goHome);
  hangupBtn.addEventListener('click', goHome);
  answerBtn.addEventListener('click', answerCall);

  win.querySelector('.closeBtn').addEventListener('click', () => {
    stopMedia();
    if (ftInstance && ftInstance.win === win) ftInstance = null;
  });

  ftInstance = {
    win,
    startCalling,
    isCallActive: () => callActive,
  };

 
  if (openFacetime.pendingIncomingContact) {
    const contactId = openFacetime.pendingIncomingContact;
    openFacetime.pendingIncomingContact = null;
    startCalling(contactId, true);
  }
}


function ftMaybeRing(){
  if (ftInstance && !document.body.contains(ftInstance.win)) {
    ftInstance = null;
  }
  if (ftInstance && ftInstance.isCallActive()) return;

  if (Math.random() < 0.35) {
    const ids = Object.keys(FACETIME_CONTACTS);
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    if (ftInstance) {
      ftInstance.startCalling(randomId, true);
    } else {
      openFacetime.pendingIncomingContact = randomId;
      openApp('facetime', 'FaceTime');
    }
  }
}

function startFacetimeRinger(){
  setInterval(ftMaybeRing, 10000);
}