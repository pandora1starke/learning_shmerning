import { elapsed, earned, settle } from './earnings.js';
const key = 'payclock-session-v1';
const defaults = { rate: 25, currency: 'USD', startedAt: null, elapsedMs: 0, earnedAmount: 0 };
let state = { ...defaults };
try {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved && Number.isFinite(saved.rate) && saved.rate >= 0 && saved.rate <= 1000000 && Number.isFinite(saved.elapsedMs) && saved.elapsedMs >= 0 && Number.isFinite(saved.earnedAmount) && saved.earnedAmount >= 0 && (saved.startedAt === null || Number.isFinite(saved.startedAt)) && ['USD','EUR','GBP','CAD','AUD','INR'].includes(saved.currency)) state = saved;
} catch {}
const $ = id => document.getElementById(id);
function save() {
  try { localStorage.setItem(key, JSON.stringify(state)); }
  catch { $('save-note').textContent = 'Storage unavailable. Keep this tab open to retain your session.'; }
}
function money(value, digits = 2) { return new Intl.NumberFormat(undefined, { style: 'currency', currency: state.currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value); }
function render() {
  $('amount').textContent = money(earned(state));
  const seconds = Math.floor(elapsed(state) / 1000);
  $('timer').textContent = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
  const running = state.startedAt !== null;
  $('status').textContent = running ? '● Earning live' : elapsed(state) > 0 ? 'Session paused' : 'Ready when you are';
  $('status').classList.toggle('running', running);
  $('toggle').textContent = running ? 'Ⅱ Pause session' : elapsed(state) > 0 ? '▶ Resume earning' : '▶ Start earning';
  $('per-minute').textContent = money(state.rate / 60);
  $('per-second').textContent = money(state.rate / 3600, 4);
  $('per-hour').textContent = money(state.rate);
  $('per-day').textContent = money(state.rate * 8);
  $('rate-symbol').textContent = new Intl.NumberFormat(undefined, { style:'currency', currency:state.currency, currencyDisplay:'narrowSymbol' }).formatToParts(0).find(p => p.type === 'currency').value;
}
$('rate').value = state.rate;
$('currency').value = state.currency;
$('date').textContent = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
$('toggle').addEventListener('click', () => {
  if (!$('rate').checkValidity() || $('rate').value === '') { $('rate').reportValidity(); return; }
  state = state.startedAt === null ? { ...state, startedAt: Date.now() } : settle(state);
  save(); render();
});
$('reset').addEventListener('click', () => {
  if (elapsed(state) > 0 && !confirm('Reset your session earnings and time worked? Your pay settings will stay saved.')) return;
  state = { ...state, elapsedMs: 0, earnedAmount: 0, startedAt: null }; save(); render();
});
$('rate').addEventListener('change', () => {
  if (!$('rate').checkValidity() || $('rate').value === '') { $('error').textContent = 'Enter a valid hourly rate between 0 and 1,000,000.'; return; }
  $('error').textContent = '';
  const running = state.startedAt !== null;
  const now = Date.now();
  state = { ...settle(state, now), rate: Number($('rate').value), startedAt: running ? now : null };
  save(); render();
});
$('currency').addEventListener('change', () => {
  if (elapsed(state) > 0 && !confirm('Changing currency resets this session. No exchange-rate conversion is applied. Continue?')) { $('currency').value = state.currency; return; }
  state = { ...state, currency: $('currency').value, startedAt: null, elapsedMs: 0, earnedAmount: 0 }; save(); render();
});
render(); setInterval(render, 100);
