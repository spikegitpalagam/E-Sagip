function setVolTab(btn) {
  // toggle active tab button
  document.querySelectorAll('#vol-filter-row .vfilter-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // toggle active panel
  document.querySelectorAll('#vol-panels .vol-panel')
    .forEach(p => p.classList.remove('active'));
  document.getElementById('vpanel-' + btn.dataset.key).classList.add('active');
}
