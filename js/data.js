/* ═══════════════════════════════════════
   QUESTLIFE — DATA / CONSTANTS
   ═══════════════════════════════════════ */

const DATA = {

  XP_PER_LEVEL: (lvl) => lvl * 100,

  TITLES: [
    { min:1,  max:2,  title:'تازه‌کار' },
    { min:3,  max:4,  title:'مبارز' },
    { min:5,  max:7,  title:'قهرمان' },
    { min:8,  max:10, title:'شوالیه' },
    { min:11, max:15, title:'اسطوره' },
    { min:16, max:20, title:'افسانه' },
    { min:21, max:99, title:'خدای جنگ' },
  ],

  CLASSES: {
    warrior:  { name:'Warrior',  icon:'⚔️', avatar:'⚔️', bonusStat:'str', bonusLabel:'ورزش' },
    scholar:  { name:'Scholar',  icon:'📚', avatar:'🧙‍♂️', bonusStat:'int', bonusLabel:'مطالعه' },
    monk:     { name:'Monk',     icon:'🔮', avatar:'🧘',  bonusStat:'wis', bonusLabel:'مدیتیشن' },
    engineer: { name:'Engineer', icon:'⚙️', avatar:'🤖', bonusStat:'eng', bonusLabel:'کدنویسی' },
  },

  BOSSES: [
    { name:'Procrastination', icon:'👾', hp:500,  reward:{ gold:100 } },
    { name:'Distraction',     icon:'📱', hp:700,  reward:{ gold:150 } },
    { name:'Self-Doubt',      icon:'😰', hp:900,  reward:{ gold:200 } },
    { name:'Laziness',        icon:'🛋️', hp:1100, reward:{ gold:250 } },
    { name:'The Dragon',      icon:'🐉', hp:1500, reward:{ gold:500 } },
  ],

  DEFAULT_QUESTS: [
    { id:'q1', title:'ورزش ۳۰ دقیقه 🏃', xp:25, gold:12, stat:'str' },
    { id:'q2', title:'مطالعه ۲۰ صفحه 📚', xp:20, gold:10, stat:'int' },
    { id:'q3', title:'۸ لیوان آب 💧',      xp:10, gold:5,  stat:'vit' },
    { id:'q4', title:'۱۵ دقیقه زبان 🌍',   xp:15, gold:8,  stat:'com' },
    { id:'q5', title:'مدیتیشن ۲۰ دقیقه 🧘', xp:18, gold:9, stat:'wis' },
    { id:'q6', title:'کدنویسی ۱ ساعت 💻',  xp:30, gold:15, stat:'eng' },
  ],

  DAILY_CHALLENGES: [
    { title:'همه مأموریت‌ها رو انجام بده!', reward:{ xp:80, gold:50 }, icon:'🏆' },
    { title:'۵ مأموریت متوالی انجام بده', reward:{ xp:50, gold:30 }, icon:'⚡' },
    { title:'مأموریت ورزش رو دوبار انجام بده', reward:{ xp:40, gold:20 }, icon:'💪' },
    { title:'بدون گوشی ۲ ساعت مطالعه کن', reward:{ xp:60, gold:35 }, icon:'📵' },
    { title:'زودتر از ساعت ۷ بیدار شو', reward:{ xp:45, gold:25 }, icon:'🌅' },
    { title:'همه آب‌های روزانه رو بنوش', reward:{ xp:30, gold:15 }, icon:'💧' },
    { title:'یک مهارت جدید برنامه‌نویسی یاد بگیر', reward:{ xp:70, gold:40 }, icon:'🚀' },
  ],

  SHOP_ITEMS: [
    { id:'sword',   name:'Iron Sword',     icon:'⚔️', bonus:'+10% XP ورزش',     price:80,  stat:'str', bonusPct:0.10, category:'items' },
    { id:'book',    name:'Ancient Book',   icon:'📖', bonus:'+10% XP مطالعه',    price:80,  stat:'int', bonusPct:0.10, category:'items' },
    { id:'hat',     name:'Wizard Hat',     icon:'🎩', bonus:'+10% XP مدیتیشن',  price:80,  stat:'wis', bonusPct:0.10, category:'items' },
    { id:'shoes',   name:'Running Shoes',  icon:'👟', bonus:'+15% XP ورزش',     price:120, stat:'str', bonusPct:0.15, category:'items' },
    { id:'laptop',  name:'Magic Laptop',   icon:'💻', bonus:'+15% XP کدنویسی',  price:120, stat:'eng', bonusPct:0.15, category:'items' },
    { id:'wolf',    name:'Wolf Pet',       icon:'🐺', bonus:'+5 Gold هر مأموریت',price:200, stat:'gold',bonusPct:0.05, category:'items' },
    { id:'crown',   name:'Gold Crown',     icon:'👑', bonus:'+20% همه XP',       price:300, stat:'all', bonusPct:0.20, category:'items' },
    { id:'shield',  name:'Dragon Shield',  icon:'🛡️', bonus:'+30 Max HP',        price:150, stat:'hp',  bonusPct:0,    category:'items' },
    { id:'boost_xp2', name:'XP x2 (1 day)', icon:'⭐', bonus:'XP دوبرابر امروز', price:50,  stat:'boost_xp', bonusPct:1.0, category:'boosts' },
    { id:'boost_gold2',name:'Gold x2 (1 day)',icon:'🪙', bonus:'Gold دوبرابر امروز',price:50, stat:'boost_gold',bonusPct:1.0,category:'boosts' },
    { id:'hp_potion', name:'HP Potion',    icon:'🧪', bonus:'+50 HP الان',        price:30,  stat:'hp_potion', bonusPct:0, category:'boosts' },
  ],

  SKILL_TREES: {
    str: {
      color: '#e85d5d',
      nodes: [
        { id:'st1', name:'Push-Up Master', desc:'تسلط بر شنا', icon:'💪', req: 5,  bonus:'+5% XP ورزش' },
        { id:'st2', name:'Iron Will',      desc:'اراده آهنین',  icon:'🏋️', req: 15, bonus:'+10% XP ورزش' },
        { id:'st3', name:'Berserker',      desc:'جنگجوی بی‌رحم', icon:'⚔️', req: 30, bonus:'+20% XP ورزش' },
        { id:'st4', name:'Titan',          desc:'غول بدنساز',  icon:'👑', req: 50, bonus:'x2 STR هر روز' },
      ]
    },
    int: {
      color: '#5b8dee',
      nodes: [
        { id:'it1', name:'Speed Reader',  desc:'خواندن سریع', icon:'📖', req: 5,  bonus:'+5% XP مطالعه' },
        { id:'it2', name:'Analyst',       desc:'تحلیلگر',     icon:'🔍', req: 15, bonus:'+10% XP مطالعه' },
        { id:'it3', name:'Philosopher',   desc:'فیلسوف',      icon:'💭', req: 30, bonus:'+20% XP مطالعه' },
        { id:'it4', name:'Sage',          desc:'حکیم',         icon:'🌟', req: 50, bonus:'x2 INT هر روز' },
      ]
    },
    wis: {
      color: '#9b6dff',
      nodes: [
        { id:'wt1', name:'Mindful',       desc:'ذهن آگاه',     icon:'🧘', req: 5,  bonus:'+5% XP مدیتیشن' },
        { id:'wt2', name:'Calm Heart',    desc:'قلب آرام',    icon:'☮️', req: 15, bonus:'+10% XP مدیتیشن' },
        { id:'wt3', name:'Oracle',        desc:'پیشگو',        icon:'🔮', req: 30, bonus:'+20% XP مدیتیشن' },
        { id:'wt4', name:'Enlightened',   desc:'روشن‌شده',    icon:'✨', req: 50, bonus:'x2 WIS هر روز' },
      ]
    },
    eng: {
      color: '#ff8c42',
      nodes: [
        { id:'et1', name:'Coder',         desc:'برنامه‌نویس',  icon:'💻', req: 5,  bonus:'+5% XP کدنویسی' },
        { id:'et2', name:'Architect',     desc:'معمار سیستم', icon:'🏗️', req: 15, bonus:'+10% XP کدنویسی' },
        { id:'et3', name:'Hacker',        desc:'هکر',          icon:'🔓', req: 30, bonus:'+20% XP کدنویسی' },
        { id:'et4', name:'Tech God',      desc:'خدای تکنولوژی',icon:'🤖', req: 50, bonus:'x2 ENG هر روز' },
      ]
    }
  },

  WORLD_ZONES: [
    { name:'Village',     icon:'🏘️', req:null,           reqLabel:'شروع' },
    { name:'Forest',      icon:'🌲', req:{ type:'level', val:3  }, reqLabel:'Level 3' },
    { name:'Mountain',    icon:'⛰️', req:{ type:'level', val:5  }, reqLabel:'Level 5' },
    { name:'Dark Castle', icon:'🏰', req:{ type:'level', val:8  }, reqLabel:'Level 8' },
    { name:'Dragon Land', icon:'🐉', req:{ type:'level', val:12 }, reqLabel:'Level 12' },
  ],

  ACHIEVEMENTS: [
    { id:'first_step',  name:'اولین قدم',    desc:'اولین مأموریت',       icon:'🌱', condition: p => Object.values(p.stats).some(v=>v>0) },
    { id:'streak3',     name:'آتش!',          desc:'۳ روز streak',        icon:'🔥', condition: p => p.streak >= 3 },
    { id:'streak7',     name:'یک هفته',       desc:'۷ روز streak',        icon:'🌟', condition: p => p.streak >= 7 },
    { id:'streak30',    name:'یک ماه',        desc:'۳۰ روز streak',       icon:'💎', condition: p => p.streak >= 30 },
    { id:'level5',      name:'قهرمان',        desc:'Level 5',             icon:'⚔️', condition: p => p.level >= 5 },
    { id:'level10',     name:'افسانه',        desc:'Level 10',            icon:'👑', condition: p => p.level >= 10 },
    { id:'level20',     name:'خدا',           desc:'Level 20',            icon:'🌌', condition: p => p.level >= 20 },
    { id:'gold100',     name:'ثروتمند',       desc:'100 Gold جمع کردی',   icon:'🪙', condition: p => p.gold >= 100 },
    { id:'gold1000',    name:'میلیونر',       desc:'1000 Gold جمع کردی',  icon:'💰', condition: p => p.gold >= 1000 },
    { id:'boss1',       name:'قاتل باس',      desc:'اولین باس',           icon:'💀', condition: p => p.bossesKilled >= 1 },
    { id:'boss5',       name:'شکارچی باس',    desc:'5 باس کشتی',          icon:'🏹', condition: p => p.bossesKilled >= 5 },
    { id:'allquests',   name:'کامل',          desc:'همه مأموریت‌ها در یک روز',icon:'✅', condition: p => p.allQuestsInDay >= 1 },
    { id:'shop5',       name:'خریدار',        desc:'5 آیتم خریدی',        icon:'🛒', condition: p => p.inventory.length >= 5 },
    { id:'str50',       name:'غول',           desc:'STR به 50 رسید',      icon:'💪', condition: p => p.stats.str >= 50 },
    { id:'int50',       name:'نابغه',         desc:'INT به 50 رسید',      icon:'🧠', condition: p => p.stats.int >= 50 },
  ],

  STAT_INFO: {
    str: { name:'Strength', color:'#e85d5d', desc:'از طریق ورزش و فعالیت بدنی افزایش پیدا می‌کنه.', tip:'روزی ۳۰ دقیقه ورزش = +2 STR' },
    int: { name:'Intelligence', color:'#5b8dee', desc:'از طریق مطالعه و یادگیری بالا میره.', tip:'هر ۲۰ صفحه مطالعه = +2 INT' },
    wis: { name:'Wisdom', color:'#9b6dff', desc:'از طریق مدیتیشن و تفکر عمیق تقویت میشه.', tip:'مدیتیشن روزانه = +2 WIS' },
    com: { name:'Communication', color:'#3dd9c5', desc:'از طریق یادگیری زبان و ارتباط بالا میره.', tip:'۱۵ دقیقه زبان = +2 COM' },
    eng: { name:'Engineering', color:'#ff8c42', desc:'از طریق کدنویسی و حل مسئله تقویت میشه.', tip:'۱ ساعت کد = +2 ENG' },
    vit: { name:'Vitality', color:'#4caf7d', desc:'از طریق نوشیدن آب و مراقبت از سلامتی.', tip:'۸ لیوان آب = +2 VIT' },
  },

  DEFAULT_PLAYER: {
    name: 'Hero',
    class: null,
    level: 1,
    xp: 0,
    gold: 0,
    hp: 100,
    maxHp: 100,
    streak: 0,
    lastCompleteDate: null,
    stats: { str:0, int:0, wis:0, com:0, eng:0, vit:0 },
    inventory: [],
    achievements: [],
    bossHp: 500,
    bossMaxHp: 500,
    bossIndex: 0,
    bossesKilled: 0,
    customQuests: [],
    completedToday: [],
    allQuestsInDay: 0,
    activityLog: [],      // last 30 days quest counts
    challengeDate: null,
    challengeDone: false,
    boosts: {},           // active boosts {id: expiryTimestamp}
    totalXpEarned: 0,
    totalGoldEarned: 0,
    totalQuestsDone: 0,
  }
};
