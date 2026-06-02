/* ═══════════════════════════════════════
   QUESTLIFE — ENGINE (core logic)
   ═══════════════════════════════════════ */

// ── STATE ──────────────────────────────
let player = JSON.parse(localStorage.getItem('qlPlayer') || 'null');
if (!player) {
  player = deepClone(DATA.DEFAULT_PLAYER);
} else {
  // merge missing fields
  const def = DATA.DEFAULT_PLAYER;
  for (const k in def) { if (!(k in player)) player[k] = deepClone(def[k]); }
}

function save() {
  localStorage.setItem('qlPlayer', JSON.stringify(player));
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ── DAILY RESET ────────────────────────
function checkDailyReset() {
  const today = todayStr();
  if (player.lastCompleteDate && player.lastCompleteDate !== today) {
    // streak logic
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yStr = yesterday.toDateString();
    if (player.lastCompleteDate === yStr) {
      player.streak++;
    } else {
      player.streak = 0;
    }
    // reset boss if killed yesterday
    if (player.bossHp <= 0) {
      const nextIdx = Math.min(player.bossIndex + 1, DATA.BOSSES.length - 1);
      if (nextIdx > player.bossIndex) {
        player.bossIndex = nextIdx;
      }
      const boss = DATA.BOSSES[player.bossIndex];
      player.bossHp = boss.hp;
      player.bossMaxHp = boss.hp;
    }
    // log activity
    player.activityLog.push(player.completedToday.length);
    if (player.activityLog.length > 30) player.activityLog.shift();
    // reset daily
    player.completedToday = [];
    player.challengeDate = null;
    player.challengeDone = false;
  }
  save();
}

function todayStr() { return new Date().toDateString(); }

// ── QUEST COMPLETE ─────────────────────
function completeQuest(questId, isCustom, idx) {
  const key = questId + (isCustom ? '-c' : '');
  if (player.completedToday.includes(key)) {
    showToast('قبلاً انجام دادی!', 'red'); return;
  }
  const q = isCustom
    ? player.customQuests[idx]
    : DATA.DEFAULT_QUESTS.find(x => x.id === questId);
  if (!q) return;

  let xp   = q.xp;
  let gold = q.gold;

  // streak multiplier
  const streakMult = player.streak >= 30 ? 1.5
                   : player.streak >= 7  ? 1.2
                   : player.streak >= 3  ? 1.1 : 1.0;
  xp = Math.round(xp * streakMult);

  // class bonus (+20%)
  if (player.class) {
    const cls = DATA.CLASSES[player.class];
    if (cls.bonusStat === q.stat) xp = Math.round(xp * 1.2);
  }

  // item bonuses
  player.inventory.forEach(itemId => {
    const item = DATA.SHOP_ITEMS.find(x => x.id === itemId);
    if (!item) return;
    if (item.stat === q.stat) xp   = Math.round(xp   * (1 + item.bonusPct));
    if (item.stat === 'all')  xp   = Math.round(xp   * (1 + item.bonusPct));
    if (item.stat === 'gold') gold = Math.round(gold  * (1 + item.bonusPct));
    if (item.id   === 'wolf') gold += 5;
  });

  // active boosts
  const now = Date.now();
  if (player.boosts.boost_xp2   && player.boosts.boost_xp2   > now) xp   *= 2;
  if (player.boosts.boost_gold2 && player.boosts.boost_gold2 > now) gold *= 2;

  xp   = Math.round(xp);
  gold = Math.round(gold);

  player.xp   += xp;
  player.gold += gold;
  player.stats[q.stat] = (player.stats[q.stat] || 0) + 2;
  player.completedToday.push(key);
  player.totalXpEarned   += xp;
  player.totalGoldEarned += gold;
  player.totalQuestsDone += 1;
  player.lastCompleteDate = todayStr();

  // boss damage
  if (player.bossHp > 0) {
    player.bossHp -= xp;
    if (player.bossHp <= 0) {
      player.bossHp = 0;
      const boss = DATA.BOSSES[player.bossIndex];
      player.gold += boss.reward.gold;
      player.bossesKilled++;
      setTimeout(() => showBossDefeated(boss), 600);
    } else {
      animateBossHit();
    }
  }

  // check all quests done
  const totalDefault = DATA.DEFAULT_QUESTS.length;
  const totalCustom  = player.customQuests.length;
  const doneDef = DATA.DEFAULT_QUESTS.every(q => player.completedToday.includes(q.id));
  const doneCus = player.customQuests.every((q,i) => player.completedToday.includes(q.id+'-c'));
  if (doneDef && (totalCustom === 0 || doneCus)) {
    player.allQuestsInDay++;
    showToast('🏆 همه مأموریت‌ها انجام شدن!', 'gold');
    launchConfetti(50);
  }

  checkLevelUp();
  checkAchievements();
  save();

  // UI updates
  renderAll();
  showXpFloat('+' + xp + ' XP', xp);
  showToast(`✅ +${xp} XP  +${gold} 🪙`, 'green');
}

// ── LEVEL UP ───────────────────────────
function checkLevelUp() {
  const needed = DATA.XP_PER_LEVEL(player.level);
  if (player.xp >= needed) {
    player.xp -= needed;
    player.level++;
    player.hp = Math.min(player.maxHp, player.hp + 20);
    // new boss every 3 levels
    if (player.level % 3 === 0) {
      const next = Math.min(player.bossIndex + 1, DATA.BOSSES.length - 1);
      if (next > player.bossIndex) {
        player.bossIndex = next;
        const boss = DATA.BOSSES[player.bossIndex];
        player.bossHp    = boss.hp;
        player.bossMaxHp = boss.hp;
        setTimeout(() => showToast('👾 باس جدید: ' + boss.name + '!', 'red'), 1200);
      }
    }
    // class unlock at 10
    if (player.level === 10 && !player.class) {
      setTimeout(() => openClassModal(), 1000);
    }
    showLevelUpModal();
    checkLevelUp(); // recursive for multi-level
  }
}

// ── ACHIEVEMENTS ───────────────────────
function checkAchievements() {
  DATA.ACHIEVEMENTS.forEach(a => {
    if (!player.achievements.includes(a.id) && a.condition(player)) {
      player.achievements.push(a.id);
      setTimeout(() => {
        showToast('🏆 ' + a.name + ' — دستاورد جدید!', 'gold');
        launchConfetti(30);
      }, 400);
    }
  });
}

// ── SHOP ──────────────────────────────
function buyItem(itemId) {
  if (player.inventory.includes(itemId)) {
    showToast('قبلاً خریدی!', 'red'); return;
  }
  const item = DATA.SHOP_ITEMS.find(x => x.id === itemId);
  if (!item) return;
  if (player.gold < item.price) {
    showToast('Gold کافی نداری! 💸', 'red'); return;
  }
  player.gold -= item.price;
  // apply one-time effects
  if (item.id === 'shield')      { player.maxHp += 30; player.hp = Math.min(player.hp + 30, player.maxHp); }
  if (item.id === 'hp_potion')   { player.hp = Math.min(player.hp + 50, player.maxHp); }
  if (item.stat === 'boost_xp')  { player.boosts['boost_xp2']   = Date.now() + 86400000; }
  if (item.stat === 'boost_gold'){ player.boosts['boost_gold2']  = Date.now() + 86400000; }

  if (!['hp_potion','boost_xp2','boost_gold2'].includes(item.id)) {
    player.inventory.push(itemId);
  }
  checkAchievements();
  save();
  renderAll();
  showToast('🎁 ' + item.name + ' خریداری شد!', 'gold');
  launchConfetti(25);
}

// ── DAILY CHALLENGE ────────────────────
function getDailyChallenge() {
  const idx = new Date().getDate() % DATA.DAILY_CHALLENGES.length;
  return DATA.DAILY_CHALLENGES[idx];
}

function completeChallenge() {
  const today = todayStr();
  if (player.challengeDate === today && player.challengeDone) {
    showToast('چالش امروز رو انجام دادی!', 'red'); return;
  }
  const ch = getDailyChallenge();
  player.xp   += ch.reward.xp;
  player.gold += ch.reward.gold;
  player.challengeDate = today;
  player.challengeDone = true;
  checkLevelUp();
  checkAchievements();
  save();
  renderAll();
  showToast(`🎯 چالش کامل! +${ch.reward.xp} XP +${ch.reward.gold} 🪙`, 'gold');
  launchConfetti(40);
  document.getElementById('challengeBtn').disabled = true;
  document.getElementById('challengeBtn').textContent = '✓ انجام شد';
}

// ── CLASS ─────────────────────────────
function selectClass(cls) {
  if (player.class && player.level < 10) {
    showToast('برای تغییر کلاس باید Level 10 باشی!', 'red'); return;
  }
  player.class = cls;
  save();
  closeModal('classModal');
  renderAll();
  showToast('✅ کلاس ' + DATA.CLASSES[cls].name + ' انتخاب شد!', 'gold');
}

// ── NAME SAVE ─────────────────────────
function saveName() {
  const val = document.getElementById('nameInput').value.trim();
  if (!val) { showToast('اسم خالیه!', 'red'); return; }
  player.name = val;
  save();
  renderAll();
  showToast('✅ نام ذخیره شد', 'green');
}

// ── CUSTOM QUEST ──────────────────────
function addCustomQuest() {
  const title = document.getElementById('qTitle').value.trim();
  const stat  = document.getElementById('qStat').value;
  const xp    = parseInt(document.getElementById('qXp').value)   || 20;
  const gold  = parseInt(document.getElementById('qGold').value) || 10;
  if (!title) { showToast('اسم مأموریت خالیه!', 'red'); return; }
  player.customQuests.push({ id: 'cq' + Date.now(), title, xp, gold, stat });
  save();
  closeModal('questModal');
  renderAll();
  showToast('✅ مأموریت اضافه شد!', 'green');
  document.getElementById('qTitle').value = '';
}

// ── RESET ─────────────────────────────
function confirmReset() {
  if (confirm('مطمئنی؟ همه داده‌ها پاک میشه! ❗')) {
    localStorage.removeItem('qlPlayer');
    location.reload();
  }
}

// ── HELPERS ───────────────────────────
function getTitle(level) {
  const t = DATA.TITLES.find(x => level >= x.min && level <= x.max);
  return t ? t.title : 'قهرمان';
}

function getStreakMult(streak) {
  if (streak >= 30) return 'x1.5';
  if (streak >= 7)  return 'x1.2';
  if (streak >= 3)  return 'x1.1';
  return 'x1.0';
}

// challenge timer countdown
function startChallengeTimer() {
  const el = document.getElementById('challengeTimer');
  if (!el) return;
  function tick() {
    const now   = new Date();
    const end   = new Date(); end.setHours(23,59,59,999);
    const diff  = end - now;
    const h     = String(Math.floor(diff/3600000)).padStart(2,'0');
    const m     = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
    const s     = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
    el.textContent = `⏰ ${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}
