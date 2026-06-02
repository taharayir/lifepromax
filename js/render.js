/* ═══════════════════════════════════════
   QUESTLIFE — RENDER
   ═══════════════════════════════════════ */

let currentShopTab  = 'items';
let currentTreeStat = 'str';

function renderAll() {
  renderTopbar();
  renderDashboard();
  renderQuests();
  renderSkillTree();
  renderMap();
  renderShop();
  renderProfile();
}

// ── TOPBAR ────────────────────────────
function renderTopbar() {
  document.getElementById('topLvl').textContent    = player.level;
  document.getElementById('topStreak').textContent = '🔥 ' + player.streak;
}

// ── DASHBOARD ─────────────────────────
function renderDashboard() {
  const p = player;
  const ci = p.class ? DATA.CLASSES[p.class] : null;

  document.getElementById('avatarEmoji').textContent = ci ? ci.avatar : '⚔️';
  document.getElementById('avatarLevel').textContent = p.level;
  document.getElementById('playerName').textContent  = p.name;
  document.getElementById('playerTitle').textContent = getTitle(p.level);
  document.getElementById('goldVal').textContent     = p.gold;

  const classBadge = document.getElementById('playerClass');
  if (ci) {
    classBadge.innerHTML = `<span class="class-badge">${ci.icon} ${ci.name}</span>`;
  } else {
    classBadge.innerHTML = `<span class="class-badge none" onclick="openClassModal()">انتخاب کلاس ←</span>`;
  }

  // HP
  const hpPct = Math.round((p.hp / p.maxHp) * 100);
  document.getElementById('hpBar').style.width  = hpPct + '%';
  document.getElementById('hpText').textContent = `${p.hp}/${p.maxHp}`;

  // XP
  const needed = DATA.XP_PER_LEVEL(p.level);
  const xpPct  = Math.min(100, Math.round((p.xp / needed) * 100));
  document.getElementById('xpBar').style.width  = xpPct + '%';
  document.getElementById('xpText').textContent = `${p.xp}/${needed}`;

  // Stats
  const maxStat = Math.max(1, ...Object.values(p.stats));
  ['str','int','wis','com','eng','vit'].forEach(s => {
    document.getElementById('stat-' + s).textContent = p.stats[s] || 0;
    document.getElementById('bar-' + s).style.width  = Math.round(((p.stats[s]||0)/Math.max(50,maxStat))*100) + '%';
  });
  const totalPower = Object.values(p.stats).reduce((a,b)=>a+b,0);
  document.getElementById('totalPower').textContent = 'Power: ' + totalPower;

  // Boss
  renderBoss();

  // Daily Challenge
  renderChallenge();

  // Achievements
  renderAchievements();
}

function renderBoss() {
  const p    = player;
  const boss = DATA.BOSSES[Math.min(p.bossIndex, DATA.BOSSES.length-1)];
  document.getElementById('bossAvatar').textContent   = boss.icon;
  document.getElementById('bossName').textContent     = boss.name;
  document.getElementById('bossSubtitle').textContent = `باس #${p.bossIndex+1}`;
  const pct = Math.max(0, Math.round((p.bossHp / p.bossMaxHp) * 100));
  document.getElementById('bossHpBar').style.width    = pct + '%';
  document.getElementById('bossHpText').textContent   = `${Math.max(0,p.bossHp)} / ${p.bossMaxHp}`;
  // SVG ring
  const circumference = 163;
  const offset = circumference - (circumference * pct / 100);
  const ring = document.getElementById('bossRingFill');
  if (ring) ring.style.strokeDashoffset = offset;

  if (p.bossHp <= 0) {
    document.getElementById('bossDmgPreview').textContent = '✅ باس شکست خورد! فردا باس جدید میاد';
  } else {
    document.getElementById('bossDmgPreview').textContent = 'هر مأموریت = ضربه 💥';
  }
}

function renderChallenge() {
  const ch  = getDailyChallenge();
  const done = player.challengeDone && player.challengeDate === todayStr();
  document.getElementById('challengeIcon').textContent    = ch.icon;
  document.getElementById('challengeName').textContent    = ch.title;
  document.getElementById('challengeReward').textContent  = `+${ch.reward.xp} XP  +${ch.reward.gold} 🪙`;
  const btn = document.getElementById('challengeBtn');
  btn.disabled    = done;
  btn.textContent = done ? '✓ انجام شد' : 'انجام';
}

function renderAchievements() {
  const unlocked = player.achievements.length;
  const total    = DATA.ACHIEVEMENTS.length;
  document.getElementById('achCount').textContent = `${unlocked}/${total}`;
  const scroll = document.getElementById('achScroll');
  scroll.innerHTML = DATA.ACHIEVEMENTS.map(a => {
    const isUnlocked = player.achievements.includes(a.id) || a.condition(player);
    return `<div class="ach-item ${isUnlocked?'unlocked':'locked'}">
      <div class="ach-emoji">${a.icon}</div>
      <div class="ach-name">${a.name}</div>
      <div class="ach-desc">${a.desc}</div>
    </div>`;
  }).join('');
}

// ── QUESTS PAGE ───────────────────────
function renderQuests() {
  // date
  const d = new Date();
  const days = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];
  const months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  document.getElementById('questDate').textContent = `${days[d.getDay()]}، ${d.getDate()} ${months[d.getMonth()]}`;

  // progress ring
  const total = DATA.DEFAULT_QUESTS.length + player.customQuests.length;
  const done  = player.completedToday.length;
  const pct   = total > 0 ? Math.round((done/total)*100) : 0;
  const ring  = document.getElementById('questRing');
  const circ  = 125.6;
  if (ring) ring.style.strokeDashoffset = circ - (circ * pct / 100);
  document.getElementById('questRingText').textContent = pct + '%';

  // custom quests
  const list = document.getElementById('questList');
  if (player.customQuests.length === 0) {
    list.innerHTML = `<div style="color:var(--text3);font-size:12px;text-align:center;padding:16px;">
      مأموریت سفارشی اضافه نشده
    </div>`;
  } else {
    list.innerHTML = player.customQuests.map((q,i) => questHTML(q, i, true)).join('');
  }

  // default quests
  document.getElementById('defaultQuestList').innerHTML =
    DATA.DEFAULT_QUESTS.map((q,i) => questHTML(q, i, false)).join('');
}

function questHTML(q, i, isCustom) {
  const key  = q.id + (isCustom ? '-c' : '');
  const done = player.completedToday.includes(key);
  const STAT_LABELS = { str:'STR', int:'INT', wis:'WIS', com:'COM', eng:'ENG', vit:'VIT' };
  return `<div class="quest-item ${done?'completed':''}"
    onclick="completeQuest('${q.id}',${isCustom},${i}); addRipple(event,this)">
    <div class="quest-check">${done ? '<span class="tick-animate">✓</span>' : ''}</div>
    <div class="quest-content">
      <div class="quest-title">${q.title}</div>
      <div class="quest-rewards">
        <span class="reward-tag xp">+${q.xp} XP</span>
        <span class="reward-tag gold">+${q.gold} 🪙</span>
        <span class="reward-tag stat">+${STAT_LABELS[q.stat]}</span>
      </div>
    </div>
  </div>`;
}

// ── SKILL TREE ────────────────────────
function renderSkillTree() {
  const stat  = currentTreeStat;
  const tree  = DATA.SKILL_TREES[stat];
  const val   = player.stats[stat] || 0;
  const wrap  = document.getElementById('skillTreeWrap');
  if (!wrap) return;

  wrap.innerHTML = tree.nodes.map((node, idx) => {
    const unlocked = val >= node.req;
    const connector = idx < tree.nodes.length - 1
      ? `<div class="tree-connector ${unlocked?'active':''}"></div>`
      : '';
    return `
      <div class="tree-node ${unlocked?'unlocked':'locked'}">
        <div class="tree-node-header">
          <div class="tree-node-icon">${node.icon}</div>
          <div class="tree-node-info">
            <div class="tree-node-name">${node.name}</div>
            <div class="tree-node-desc">${node.desc} — <span style="color:var(--cyan)">${node.bonus}</span></div>
          </div>
          <div class="tree-node-req">${unlocked ? '✓ باز' : node.req + ' STR'}</div>
        </div>
      </div>
      ${connector}
    `;
  }).join('');
}

function switchTree(stat, btn) {
  currentTreeStat = stat;
  document.querySelectorAll('.tree-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderSkillTree();
}

// ── MAP ───────────────────────────────
function renderMap() {
  const path = document.getElementById('mapPath');
  if (!path) return;

  let currentIdx = 0;
  DATA.WORLD_ZONES.forEach((z,i) => {
    if (!z.req || (z.req.type === 'level' && player.level >= z.req.val)) currentIdx = i;
  });

  path.innerHTML = DATA.WORLD_ZONES.map((z, i) => {
    const unlocked = !z.req || (z.req.type === 'level' && player.level >= z.req.val);
    const isCurrent = i === currentIdx;
    const cls = isCurrent ? 'current' : (unlocked ? 'unlocked' : 'locked');

    const lineRight = i < DATA.WORLD_ZONES.length - 1
      ? `<div class="zone-line ${unlocked?'done':''}"></div>` : '';
    const lineLeft  = i > 0
      ? `<div class="zone-line ${DATA.WORLD_ZONES[i-1].req && (!DATA.WORLD_ZONES[i-1].req || player.level >= (DATA.WORLD_ZONES[i-1].req?.val||0)) ? 'done' : ''}"></div>`
      : '';

    const isEven = i % 2 === 1;
    return `<div class="zone-item">
      ${isEven ? lineRight : ''}
      ${!isEven && i > 0 ? lineLeft : ''}
      <div class="zone-dot-wrap">
        <div class="zone-dot ${cls}" title="${z.name}">${z.icon}</div>
        <div class="zone-label ${cls}">${z.name}</div>
      </div>
      ${isEven ? (i > 0 ? lineLeft : '') : lineRight}
      <div class="zone-info-side">
        <div class="zone-name-big" style="color:${isCurrent?'var(--cyan)':unlocked?'var(--text)':'var(--text3)'}">${z.name}</div>
        <div class="zone-req-text">${unlocked ? '🔓 باز شده' : '🔒 نیاز: ' + z.reqLabel}</div>
      </div>
    </div>`;
  }).join('');
}

// ── SHOP ──────────────────────────────
function renderShop() {
  document.getElementById('shopGold').textContent = player.gold;
  const grid  = document.getElementById('shopGrid');
  if (!grid) return;
  const items = DATA.SHOP_ITEMS.filter(x => x.category === currentShopTab);
  grid.innerHTML = items.map(item => {
    const owned     = player.inventory.includes(item.id);
    const isBoost   = item.category === 'boosts';
    const cantAfford = player.gold < item.price;
    return `<div class="shop-item ${owned&&!isBoost?'owned':''} ${cantAfford&&!owned?'cant-afford':''}"
      onclick="buyItem('${item.id}')">
      ${owned && !isBoost ? '<div class="shop-item-owned-badge">✓ دارم</div>' : ''}
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-bonus">${item.bonus}</div>
      <div class="shop-item-price">🪙 ${item.price}</div>
    </div>`;
  }).join('');
}

function switchShopTab(tab, btn) {
  currentShopTab = tab;
  document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderShop();
}

// ── PROFILE ───────────────────────────
function renderProfile() {
  const p = player;
  const ci = p.class ? DATA.CLASSES[p.class] : null;
  document.getElementById('profileAvatar').textContent     = ci ? ci.avatar : '⚔️';
  document.getElementById('nameInput').value               = p.name;
  document.getElementById('profileClassLabel').textContent = ci ? ci.icon + ' ' + ci.name : 'بدون کلاس';

  const grid = document.getElementById('statsFullGrid');
  if (grid) grid.innerHTML = [
    { val: p.level,              lbl: 'Level',        color: 'var(--gold)'   },
    { val: p.xp,                 lbl: 'XP',           color: 'var(--blue)'   },
    { val: p.gold,               lbl: '🪙 Gold',       color: 'var(--gold)'   },
    { val: p.streak,             lbl: '🔥 Streak',     color: 'var(--orange)' },
    { val: p.totalQuestsDone,    lbl: 'مأموریت‌ها',   color: 'var(--green)'  },
    { val: p.achievements.length,lbl: 'دستاوردها',    color: 'var(--purple)' },
    { val: p.bossesKilled,       lbl: 'باس کشته',     color: 'var(--red)'    },
    { val: p.inventory.length,   lbl: 'آیتم‌ها',      color: 'var(--cyan)'   },
    { val: p.totalXpEarned,      lbl: 'کل XP',        color: 'var(--blue)'   },
  ].map(s => `
    <div class="stat-full-card">
      <div class="stat-full-val" style="color:${s.color}">${s.val}</div>
      <div class="stat-full-lbl">${s.lbl}</div>
    </div>
  `).join('');

  // Activity chart (last 30 days)
  const chart = document.getElementById('activityChart');
  if (chart) {
    const log = [...player.activityLog].slice(-14);
    const max = Math.max(1, ...log);
    chart.innerHTML = log.map(v => {
      const h = Math.max(4, Math.round((v/max)*56));
      return `<div class="activity-bar ${v>0?'has-data':''}" style="height:${h}px" title="${v} مأموریت"></div>`;
    }).join('');
  }
}

// ── MODALS ────────────────────────────
function showLevelUpModal() {
  document.getElementById('levelUpNum').textContent = player.level;
  document.getElementById('levelUpSub').textContent = getTitle(player.level) + ' شدی!';
  openModal('levelUpModal');
  launchConfetti(60);
}

function showBossDefeated(boss) {
  document.getElementById('bossDefeatedIcon').textContent   = boss.icon;
  document.getElementById('bossDefeatedName').textContent   = boss.name + ' شکست خورد!';
  document.getElementById('bossDefeatedReward').textContent = '+' + boss.reward.gold + ' 🪙';
  openModal('bossModal');
  launchConfetti(60);
}

function showStatInfo(stat) {
  const info = DATA.STAT_INFO[stat];
  const val  = player.stats[stat] || 0;
  document.getElementById('statModalContent').innerHTML = `
    <div style="text-align:center;padding:8px 0 16px">
      <div style="font-size:40px;margin-bottom:8px">${DATA.SKILL_TREES[stat]?.nodes[0]?.icon||'⭐'}</div>
      <div style="font-family:'Cinzel',serif;font-size:18px;color:${info.color};margin-bottom:4px">${info.name}</div>
      <div style="font-size:32px;font-weight:800;color:${info.color}">${val}</div>
    </div>
    <div style="font-size:13px;color:var(--text2);margin-bottom:12px;line-height:1.7">${info.desc}</div>
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px;font-size:12px;color:var(--text3)">
      💡 ${info.tip}
    </div>
    <button class="btn-cancel" onclick="closeModal('statModal')" style="width:100%;margin-top:14px">بستن</button>
  `;
  openModal('statModal');
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
function openClassModal() {
  openModal('classModal');
}
function openQuestModal() {
  openModal('questModal');
}

// ── BOSS ANIMATION ────────────────────
function animateBossHit() {
  const el = document.getElementById('bossCard');
  el.classList.remove('boss-hit');
  void el.offsetWidth;
  el.classList.add('boss-hit');
  setTimeout(() => el.classList.remove('boss-hit'), 500);
}

// ── RIPPLE ────────────────────────────
function addRipple(e, el) {
  const r   = document.createElement('span');
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.className = 'ripple';
  r.style.width  = r.style.height = size + 'px';
  r.style.left   = (e.clientX - rect.left  - size/2) + 'px';
  r.style.top    = (e.clientY - rect.top   - size/2) + 'px';
  el.appendChild(r);
  setTimeout(() => r.remove(), 700);
}

// ── TOAST ─────────────────────────────
function showToast(msg, type='green') {
  const c   = document.getElementById('toastContainer');
  const el  = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

// ── XP FLOAT ──────────────────────────
function showXpFloat(text, amount) {
  const c  = document.getElementById('xpFloats');
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = text;
  const x = 30 + Math.random() * 40;
  el.style.left = x + '%';
  el.style.top  = '40%';
  if (amount >= 50) el.style.color = 'var(--orange)';
  if (amount >= 80) el.style.color = 'var(--red)';
  c.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

// ── CONFETTI ──────────────────────────
function launchConfetti(count=30) {
  const colors = ['#f0c040','#ff8c42','#9b6dff','#5b8dee','#4caf7d','#e85d5d','#ff6b9d','#3dd9c5'];
  for (let i = 0; i < count; i++) {
    const el  = document.createElement('div');
    el.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    el.style.cssText = `
      left:${10+Math.random()*80}%;
      top:${10+Math.random()*40}%;
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      --dur:${1+Math.random()*0.8}s;
      --ty:${150+Math.random()*150}px;
      --tx:${-60+Math.random()*120}px;
      --rot:${360+Math.random()*360}deg;
      animation-delay:${Math.random()*0.3}s;
      border-radius:${Math.random()>0.5?'50%':'2px'};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
}

// ── PAGE NAV ──────────────────────────
function goPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  btn.classList.add('active');
  // lazy render on switch
  if (id === 'shop')      renderShop();
  if (id === 'profile')   renderProfile();
  if (id === 'map')       renderMap();
  if (id === 'skilltree') renderSkillTree();
}
