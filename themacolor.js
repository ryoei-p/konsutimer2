/* ===== themacolor.js — テーマカラー管理 ===== */

const THEMES = {
  default:    { label:'Default',     dot:'#e8b800',  dotB:null,      bg:'#faf6e8', surface:'#ffffff', accent:'#e8b800', accentD:'#c49a00', ring:'#e8b80040', text:'#1c1a12', sub:'#8a7e52', border:'#e8d98a', btn:'#ffffff', memoBg:'#ffffff', memoText:'#1c1a12' },
  red:        { label:'Red',         dot:'#d63030',  dotB:null,      bg:'#fff4f4', surface:'#ffffff', accent:'#d63030', accentD:'#b02020', ring:'#d6303025', text:'#200a0a', sub:'#906060', border:'#f0b0b0', btn:'#ffffff', memoBg:'#ffffff', memoText:'#200a0a' },
  orange:     { label:'Orange',      dot:'#f07020',  dotB:null,      bg:'#fff7f0', surface:'#ffffff', accent:'#f07020', accentD:'#c85010', ring:'#f0702025', text:'#281408', sub:'#906040', border:'#f0c098', btn:'#ffffff', memoBg:'#ffffff', memoText:'#281408' },
  turquoise:  { label:'Turquoise',   dot:'#00a8bc',  dotB:null,      bg:'#eafafa', surface:'#ffffff', accent:'#00a8bc', accentD:'#008090', ring:'#00a8bc25', text:'#032a30', sub:'#407880', border:'#90dde8', btn:'#ffffff', memoBg:'#ffffff', memoText:'#032a30' },
  lightblue:  { label:'Light Blue',  dot:'#3a8fd4',  dotB:null,      bg:'#edf5fb', surface:'#ffffff', accent:'#3a8fd4', accentD:'#2070b0', ring:'#3a8fd425', text:'#0a1e30', sub:'#4a708a', border:'#a0cce8', btn:'#ffffff', memoBg:'#ffffff', memoText:'#0a1e30' },
  lightgreen: { label:'Light Green', dot:'#3a9e4a',  dotB:null,      bg:'#edfaed', surface:'#ffffff', accent:'#3a9e4a', accentD:'#2a7a36', ring:'#3a9e4a25', text:'#0a200e', sub:'#487850', border:'#98dca0', btn:'#ffffff', memoBg:'#ffffff', memoText:'#0a200e' },
  purple:     { label:'Purple',      dot:'#8840c0',  dotB:null,      bg:'#f4eeff', surface:'#ffffff', accent:'#8840c0', accentD:'#6a2aa0', ring:'#8840c025', text:'#180a28', sub:'#705088', border:'#c8a0e0', btn:'#ffffff', memoBg:'#ffffff', memoText:'#180a28' },
  pink:       { label:'Pink',        dot:'#e84080',  dotB:null,      bg:'#fff0f6', surface:'#ffffff', accent:'#e84080', accentD:'#c02060', ring:'#e8408025', text:'#280818', sub:'#906070', border:'#f0a0c0', btn:'#ffffff', memoBg:'#ffffff', memoText:'#280818' },
  dark:       { label:'Dark',        dot:'#e8b800',  dotB:'#10121e', bg:'#10121e', surface:'#1e2235', accent:'#e8b800', accentD:'#c49a00', ring:'#e8b80030', text:'#e8e0c8', sub:'#a09070', border:'#2e3450', btn:'#252a40', memoBg:'#ffffff', memoText:'#1c1a12' },
  midnight:   { label:'Midnight',    dot:'#4488ff',  dotB:'#0a0a1a', bg:'#0a0a1a', surface:'#12143a', accent:'#4488ff', accentD:'#2266dd', ring:'#4488ff30', text:'#c8d8ff', sub:'#6878a8', border:'#1e2460', btn:'#1a1e50', memoBg:'#ffffff', memoText:'#1c1a12' },
  white:      { label:'White',       dot:'#aaaaaa',  dotB:null,      bg:'#f8f8f8', surface:'#ffffff', accent:'#555555', accentD:'#333333', ring:'#55555520', text:'#222222', sub:'#888888', border:'#dddddd', btn:'#ffffff', memoBg:'#ffffff', memoText:'#222222' },
};

function applyTheme(key) {
  const t = THEMES[key] || THEMES.default;
  const s = document.documentElement.style;
  s.setProperty('--bg',        t.bg);
  s.setProperty('--surface',   t.surface);
  s.setProperty('--accent',    t.accent);
  s.setProperty('--accent-d',  t.accentD);
  s.setProperty('--ring',      t.ring);
  s.setProperty('--text',      t.text);
  s.setProperty('--sub',       t.sub);
  s.setProperty('--border',    t.border);
  s.setProperty('--btn',       t.btn);
  s.setProperty('--memo-bg',   t.memoBg);
  s.setProperty('--memo-text', t.memoText);
  localStorage.setItem('kon-theme', key);
  document.querySelectorAll('.theme-row').forEach(r =>
    r.classList.toggle('active', r.dataset.key === key)
  );
}

// テーマリスト生成
const themeList = document.getElementById('theme-list');
Object.entries(THEMES).forEach(([key, t]) => {
  const row = document.createElement('div');
  row.className = 'theme-row';
  row.dataset.key = key;
  // dotB がある場合は左半分：dotB色、右半分：dot色 のグラデーションドット
  const dotStyle = t.dotB
    ? `background: linear-gradient(90deg, ${t.dotB} 50%, ${t.dot} 50%); border-color: rgba(255,255,255,0.25);`
    : `background: ${t.dot};`;
  row.innerHTML = `<span class="theme-dot" style="${dotStyle}"></span>${t.label}`;
  row.addEventListener('click', () => applyTheme(key));
  themeList.appendChild(row);
});

// 保存済みテーマを復元
applyTheme(localStorage.getItem('kon-theme') || 'default');

// パネル開閉（左からスライド）
const overlay    = document.getElementById('overlay');
const themePanel = document.getElementById('theme-panel');

document.getElementById('theme-btn').addEventListener('click', () => {
  themePanel.classList.add('open');
  overlay.classList.add('show');
});
document.getElementById('panel-close').addEventListener('click', closeThemePanel);
overlay.addEventListener('click', closeThemePanel);

function closeThemePanel() {
  themePanel.classList.remove('open');
  overlay.classList.remove('show');
}
