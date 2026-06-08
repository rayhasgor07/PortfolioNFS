const SOUNDS = {  
  loading: loadSound('./loading.mp3'),   // plays during loading screen updates
  select:  loadSound('./button.mp3'),   // plays on nav item click
  nav:     loadSound('./button.mp3'),   // plays on arrow key / prev-next
  hover:   null,   // plays on button/nav hover
  confirm: null,   // plays on contact button click
  ambient: loadSound('./song.mp3'),   // loops in the background — add your file here
};

let audioUnlocked = false;
let audioEnabled = true;  // Audio is on by default
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  const hint = document.getElementById('audioHint');
  if (hint) hint.style.display = 'none';
  Object.values(SOUNDS).forEach(sound => {
    if (!sound) return;
    sound.play().then(() => sound.pause()).catch(() => {});
  });
}

document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });
document.addEventListener('mousedown', unlockAudio, { once: true });
document.addEventListener('touchstart', unlockAudio, { once: true });

function loadSound(src) {
  if (!src) return null;
  const a = new Audio(src);
  a.preload = 'auto';
  return a;
}

function playSound(key) {
  if (!audioEnabled) return;
  const s = SOUNDS[key];
  if (!s) return;
  try {
    const clone = s.cloneNode(true);
    clone.currentTime = 0;
    clone.play().catch(() => {});
  } catch(e) {}
}

function startAmbient() {
  const a = SOUNDS.ambient;
  if (!a || !audioEnabled) return;
  
  const startTime = 1;   // Start at 1 second
  const endTime = 10;    // End at 10 seconds
  
  a.currentTime = startTime;
  a.play().catch(() => {
    document.addEventListener('click', () => {
      if (audioEnabled) {
        a.currentTime = startTime;
        a.play();
      }
    }, { once: true });
  });
  
  // Loop the segment when it reaches the end
  a.addEventListener('timeupdate', () => {
    if (audioEnabled && a.currentTime >= endTime) {
      a.currentTime = startTime;
    }
  });
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const btn = document.getElementById('audioToggle');
  const a = SOUNDS.ambient;
  
  if (audioEnabled) {
    btn.textContent = '🔊';
    btn.title = 'Turn off audio';
    if (a) {
      a.currentTime = 1;
      a.play().catch(() => {});
    }
  } else {
    btn.textContent = '🔇';
    btn.title = 'Turn on audio';
    if (a) {
      a.pause();
    }
  }
}

/* ================================================================
   LOADING
   ================================================================ */
const loadMsgs = [
  'ACCESSING DATABASE...',
  'RETRIEVING FILE...',
  'DECRYPTING...',
  'COMPILING PORTFOLIO...',
  'ACCESS GRANTED'
];

const username = 'RAYYAN HASAN GORAYA';
const password = '••••••••••••••••••';
let prog = 0, mi = 0;
let uIdx = 0, pIdx = 0;
let typeFinished = false;

function typeCharacter() {
  // Type username
  if (uIdx < username.length) {
    document.getElementById('usernameText').textContent = username.substring(0, ++uIdx);
    setTimeout(typeCharacter, 40);
    return;
  }
  
  // Type password
  if (pIdx < password.length) {
    document.getElementById('passwordText').textContent = password.substring(0, ++pIdx);
    setTimeout(typeCharacter, 30);
    return;
  }
  
  // Typing finished
  if (!typeFinished) {
    typeFinished = true;
    setTimeout(loadStep, 300);
  }
}

function loadStep() {
  prog += Math.random() * 18 + 8;
  if (prog > 100) prog = 100;
  document.getElementById('lbar').style.width = prog + '%';
  document.getElementById('lmsg').textContent = loadMsgs[Math.min(mi++, loadMsgs.length - 1)];

  if (prog < 100) {
    playSound('loading');
    setTimeout(loadStep, 220 + Math.random() * 300);
  } else {
    setTimeout(() => {
      document.getElementById('loading').classList.add('out');
      setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('app').classList.add('on');
        startAmbient();
      }, 900);
    }, 400);
  }
}
setTimeout(typeCharacter, 400);

/* ================================================================
   CLOCK
   ================================================================ */
function tickClock() {
  const n = new Date(), p = x => String(x).padStart(2,'0');
  document.getElementById('clock').textContent = `${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`;
}
tickClock(); setInterval(tickClock, 1000);

/* ================================================================
   NAVIGATION
   ================================================================ */
const navSections = ['projects','experience','volunteering','certifications','education'];
let curIdx = 0;

function show(name, el) {
  playSound('select');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('on'));
  document.getElementById('sec-' + name).classList.add('on');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('on'));
  if (el) el.classList.add('on');
  curIdx = navSections.indexOf(name);
  document.querySelector('.content-wrap').scrollTop = 0;
}

function cycleNav(dir) {
  curIdx = (curIdx + dir + navSections.length) % navSections.length;
  const items = document.querySelectorAll('.nav-item');
  show(navSections[curIdx], items[curIdx]);
  playSound('nav');
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') cycleNav(1);
  if (e.key === 'ArrowUp')   cycleNav(-1);
});

function onContact() {
  playSound('confirm');
  window.open('https://www.linkedin.com/in/rayyanhasangoraya', '_blank');
}

/* hover sounds */
let lastHoverT = 0;
document.addEventListener('mouseover', e => {
  const now = Date.now();
  if (now - lastHoverT < 100) return;
  if (e.target.closest('.nav-item, .bb-btn, .proj-link, .social-icon-btn')) {
    lastHoverT = now;
    playSound('hover');
  }
});

/* audio toggle */
document.addEventListener('DOMContentLoaded', () => {
  const audioBtn = document.getElementById('audioToggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', toggleAudio);
  }
});