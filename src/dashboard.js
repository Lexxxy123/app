document.getElementById('min-btn').addEventListener('click', () => window.windowControls.minimize());
document.getElementById('close-btn').addEventListener('click', () => window.windowControls.close());

// ---- Auth guard ----
const session = sessionStorage.getItem('botpanel_session');
if (!session) {
  window.location.href = 'login.html';
}
document.getElementById('admin-session').textContent = session || '—';

document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('botpanel_session');
  window.location.href = 'login.html';
});

// ---- Nav switching ----
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    views.forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + item.dataset.view).classList.add('active');
  });
});

// ---- Bot storage (local only — no network / join logic) ----
const BOTS_KEY = 'botpanel_bots';
function getBots() {
  try { return JSON.parse(localStorage.getItem(BOTS_KEY)) || []; }
  catch { return []; }
}
function saveBots(bots) {
  localStorage.setItem(BOTS_KEY, JSON.stringify(bots));
}

function renderBots() {
  const bots = getBots();
  const empty = document.getElementById('bots-empty');
  const table = document.getElementById('bots-table');
  const tbody = document.getElementById('bots-tbody');

  document.getElementById('stat-bots').textContent = bots.length;
  document.getElementById('stat-servers').textContent = new Set(bots.map(b => b.server)).size;

  if (bots.length === 0) {
    empty.style.display = 'block';
    table.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  table.style.display = 'table';

  tbody.innerHTML = bots.map((b, i) => `
    <tr>
      <td class="bot-name">${escapeHtml(b.name)}</td>
      <td class="bot-ip">${escapeHtml(b.server)}</td>
      <td>${b.token ? 'Token saved' : '—'}</td>
      <td><span class="badge idle"><span class="dot"></span>Idle</span></td>
      <td><button class="row-remove" data-idx="${i}" title="Remove">&#10005;</button></td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.row-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const list = getBots();
      list.splice(idx, 1);
      saveBots(list);
      renderBots();
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Modal ----
const backdrop = document.getElementById('modal-backdrop');
document.getElementById('add-bot-btn').addEventListener('click', () => {
  document.getElementById('bot-name').value = '';
  document.getElementById('bot-server').value = '';
  document.getElementById('bot-token').value = '';
  backdrop.classList.add('active');
});
document.getElementById('modal-cancel').addEventListener('click', () => backdrop.classList.remove('active'));
backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.classList.remove('active'); });

document.getElementById('modal-save').addEventListener('click', () => {
  const name = document.getElementById('bot-name').value.trim();
  const server = document.getElementById('bot-server').value.trim();
  const token = document.getElementById('bot-token').value.trim();
  if (!name || !server) return;

  const bots = getBots();
  bots.push({ name, server, token, createdAt: Date.now() });
  saveBots(bots);
  renderBots();
  backdrop.classList.remove('active');
});

renderBots();
