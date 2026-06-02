/* ═══════════════════════════════════════
   QUESTLIFE — APP (init)
   ═══════════════════════════════════════ */

// close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', function(e) {
    if (e.target === this) {
      const safe = ['levelUpModal', 'bossModal'];
      if (!safe.includes(this.id)) closeModal(this.id);
    }
  });
});

// init
checkDailyReset();
renderAll();
startChallengeTimer();

// PWA install hint (if not standalone)
if (!window.matchMedia('(display-mode: standalone)').matches) {
  setTimeout(() => {
    showToast('💡 برای نصب: Safari → Share → Add to Home Screen', 'purple');
  }, 3000);
}
