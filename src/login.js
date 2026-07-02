document.getElementById('min-btn').addEventListener('click', () => window.windowControls.minimize());
document.getElementById('close-btn').addEventListener('click', () => window.windowControls.close());

// ---- Tabs ----
const tabs = document.querySelectorAll('.tab');
const panelAccount = document.getElementById('panel-account');
const panelLicense = document.getElementById('panel-license');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const isAccount = tab.dataset.tab === 'account';
    panelAccount.style.display = isAccount ? 'block' : 'none';
    panelLicense.style.display = isAccount ? 'none' : 'block';
    clearError();
  });
});

const errorEl = document.getElementById('error-msg');
function showError(msg) { errorEl.textContent = msg; }
function clearError() { errorEl.textContent = ''; }

// ---- License generation (local, cosmetic — for demo/testing only) ----
const VALID_LICENSES_KEY = 'botpanel_valid_licenses';

function getValidLicenses() {
  try { return JSON.parse(localStorage.getItem(VALID_LICENSES_KEY)) || []; }
  catch { return []; }
}
function saveValidLicense(key) {
  const list = getValidLicenses();
  list.push(key);
  localStorage.setItem(VALID_LICENSES_KEY, JSON.stringify(list));
}
function randomBlock() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}
function generateLicenseKey() {
  return `${randomBlock()}-${randomBlock()}-${randomBlock()}-${randomBlock()}`;
}

document.getElementById('generate-btn').addEventListener('click', () => {
  const key = generateLicenseKey();
  saveValidLicense(key);
  document.getElementById('license-input').value = key;
  document.getElementById('generated-note').style.display = 'block';
  clearError();
});

// ---- Account login ----
document.getElementById('account-login-btn').addEventListener('click', () => {
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value;
  if (u === 'admin' && p === 'admin123') {
    enterDashboard('admin');
  } else {
    showError('Invalid username or password.');
  }
});

// ---- License login ----
document.getElementById('license-login-btn').addEventListener('click', () => {
  const key = document.getElementById('license-input').value.trim();
  const valid = getValidLicenses();
  if (key && valid.includes(key)) {
    enterDashboard(key);
  } else {
    showError('Unrecognized license key. Generate a new one or check for typos.');
  }
});

// Enter key submits active panel
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const accountVisible = panelAccount.style.display !== 'none';
  if (accountVisible) document.getElementById('account-login-btn').click();
  else document.getElementById('license-login-btn').click();
});

function enterDashboard(sessionLabel) {
  sessionStorage.setItem('botpanel_session', sessionLabel);
  window.location.href = 'dashboard.html';
}
