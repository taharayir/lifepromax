/* ═══════════════════════════════════════
   QUESTLIFE — PARTICLES
   ═══════════════════════════════════════ */

(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(240,192,64,',
    'rgba(91,141,238,',
    'rgba(155,109,255,',
    'rgba(61,217,197,',
  ];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.vx  = (Math.random() - 0.5) * 0.25;
      this.vy  = -Math.random() * 0.35 - 0.1;
      this.r   = Math.random() * 1.5 + 0.3;
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.a   = Math.random() * 0.35 + 0.05;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 400;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -10 || this.x < -10 || this.x > W+10) {
        this.reset();
        this.y = H + 10;
      }
    }
    draw() {
      const fade = this.life < 40 ? this.life/40 : (this.life > this.maxLife-40 ? (this.maxLife-this.life)/40 : 1);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + (this.a * fade) + ')';
      ctx.fill();
    }
  }

  // spawn 60 particles
  for (let i = 0; i < 60; i++) {
    const p = new Particle();
    p.life = Math.random() * p.maxLife; // stagger
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();
