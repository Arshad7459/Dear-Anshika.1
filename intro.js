/* Intro: Turn On Lights → Play Music → Let's Decorate → Fly With Balloons → Open Surprise
   After the last button the original Shinchan experience (midnight countdown → passcode → gifts) starts. */
// ═══════ SETTINGS (yahan badlo) ═══════
const BALLOON_NAME = 'BESTIE';   // naam jo balloons banayenge; do words ho to do rows, jaise 'ANYA SHARMA'
const MASS_BALLOONS = 36;        // ek saath udne wale balloons ki ginti
// ═══════════════════════════════════════

(function () {
  const stage = document.getElementById('intro-stage');
  if (!stage) { if (window.startMainExperience) window.startMainExperience(); return; }

  const $ = id => document.getElementById(id);
  const song = $('intro-song');
  const soundBtn = $('sound-toggle');
  const banner = $('intro-banner');
  const bulbs = Array.from(stage.querySelectorAll('.intro-bulb'));

  // Show a button (hiding the previous one) after an optional delay
  function showBtn(id, delay) {
    setTimeout(() => $(id).classList.add('show'), delay || 0);
  }
  function hideBtn(id) { $(id).classList.remove('show'); }

  // 1) Lights
  $('btn-lights').addEventListener('click', () => {
    hideBtn('btn-lights');
    stage.classList.add('lit');
    bulbs.forEach((b, i) => { b.style.setProperty('--d', (i * 0.25) + 's'); b.classList.add('on'); });
    showBtn('btn-music', 3200);
  });

  // 2) Music
  $('btn-music').addEventListener('click', () => {
    hideBtn('btn-music');
    stage.classList.add('music');
    if (song) {
      song.volume = 0.7;
      const p = song.play();
      if (p && p.catch) p.catch(() => {});
      soundBtn.classList.add('show');
    }
    showBtn('btn-decorate', 3000);
  });

  // 3) Decorate (banner drops down)
  $('btn-decorate').addEventListener('click', () => {
    hideBtn('btn-decorate');
    banner.classList.add('come');
    showBtn('btn-balloons', 3500);
  });

  // 4) Balloons: pehle bahut saare balloons ek saath udte hain,
  //    phir naam wale balloons rukkar naam banate hain
  const IMGS = [1, 2, 3, 4, 5, 6, 7].map(n => 'assets/intro/b' + n + '.png');

  function makeBalloon(img, label, bw) {
    const b = document.createElement('div');
    b.className = 'intro-balloon';
    b.style.setProperty('--img', "url('" + img + "')");
    if (label) b.dataset.label = label;
    if (bw) {
      b.style.width = bw + 'px';
      b.style.setProperty('--fs', Math.round(bw * 0.4) + 'px');
    }
    b.style.bottom = '-300px';
    stage.appendChild(b);
    return b;
  }
  const flush = fn => requestAnimationFrame(() => requestAnimationFrame(fn));

  // (a) ek saath bahut saare balloons
  function massRelease() {
    const w = window.innerWidth, h = window.innerHeight, list = [];
    for (let i = 0; i < MASS_BALLOONS; i++) {
      const bw = 55 + Math.random() * 45;
      const b = makeBalloon(IMGS[i % IMGS.length], '', bw);
      b.style.left = Math.random() * (w - bw) + 'px';
      b.style.setProperty('--sw', (2.5 + Math.random() * 2) + 's');
      list.push(b);
    }
    flush(() => list.forEach(b => {
      const dur = 6 + Math.random() * 4, delay = Math.random() * 3;
      const x = Math.max(0, Math.min(w - 80, parseFloat(b.style.left) + (Math.random() - 0.5) * 160));
      b.style.transition = 'bottom ' + dur + 's ' + delay + 's cubic-bezier(.25,.1,.4,1), left ' + dur + 's ' + delay + 's ease-in-out';
      b.style.bottom = (h + 320) + 'px';
      b.style.left = x + 'px';
    }));
    setTimeout(() => list.forEach(b => b.remove()), 14500);
  }

  // (b) naam wale balloons: har letter ek balloon, upar jaakar ruk jaate hain
  function nameBalloons() {
    const w = window.innerWidth, h = window.innerHeight;
    const words = String(BALLOON_NAME).trim().toUpperCase().split(/\s+/).filter(Boolean);
    if (!words.length) return 0;
    const maxLen = Math.max.apply(null, words.map(x => x.length));
    const bannerW = Math.min(w * 0.92, 470);
    const topLimit = 78 + bannerW * 147 / 470 + 24;      // banner ke neeche se
    const botLimit = h - 100;                              // button ke upar tak
    const avail = Math.max(120, botLimit - topLimit);
    let bw = Math.min(100, Math.floor((w - 24) / maxLen));
    bw = Math.min(bw, avail / (1.83 * (1 + (words.length - 1) * 0.82)));
    bw = Math.max(34, bw);
    const bh = bw * 1.83, rowH = bh * 0.82, step = bw * 0.95;
    const blockH = rowH * (words.length - 1) + bh;
    const top0 = topLimit + Math.max(0, (avail - blockH) / 2);

    let count = 0, lastEnd = 0;
    words.forEach((word, r) => {
      const rowLeft = (w - word.length * step) / 2 + (step - bw) / 2;
      word.split('').forEach((ch, i) => {
        const b = makeBalloon(IMGS[count % IMGS.length], ch, bw);
        b.style.left = Math.random() * (w - bw) + 'px';
        b.style.setProperty('--amp', '5deg');
        b.style.setProperty('--sw', (3 + Math.random() * 1.5) + 's');
        const tx = rowLeft + i * step;
        const ty = top0 + r * rowH + (i % 2 ? bh * 0.05 : 0);
        const dur = 4.5 + Math.random() * 1.2, delay = count * 0.18;
        lastEnd = Math.max(lastEnd, (delay + dur) * 1000);
        flush(() => {
          b.style.transition = 'bottom ' + dur + 's ' + delay + 's cubic-bezier(.15,.8,.25,1), left ' + dur + 's ' + delay + 's cubic-bezier(.15,.8,.25,1)';
          b.style.bottom = (h - (ty + bh)) + 'px';
          b.style.left = tx + 'px';
        });
        count++;
      });
    });
    return lastEnd;
  }

  $('btn-balloons').addEventListener('click', () => {
    hideBtn('btn-balloons');
    massRelease();
    setTimeout(() => {
      const end = nameBalloons();
      showBtn('btn-open', end + 600);
    }, 2500);
  });

  // 5) Hand over to the Shinchan surprise
  $('btn-open').addEventListener('click', () => {
    hideBtn('btn-open');
    stage.classList.add('leaving');
    setTimeout(() => {
      stage.style.display = 'none';
      if (window.startMainExperience) window.startMainExperience();
    }, 1300);
  });

  // Mute / unmute (stays visible during the whole experience)
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      song.muted = !song.muted;
      soundBtn.textContent = song.muted ? '🔇' : '🔊';
    });
  }

  showBtn('btn-lights', 600);
})();
