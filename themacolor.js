/* ===== themacolor.js — テーマカラー管理 ===== */

const THEMES = {
  /* ── 単色テーマ ── */
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
  /* ── グラデーションテーマ ── */
  asagohan:    { label:'さわやか朝',  dot:'#f5c400', dotB:null, bg:'linear-gradient(135deg,#fff9e6 0%,#ffe4b5 50%,#ffd0a0 100%)', surface:'#fffdf5', accent:'#e8a800', accentD:'#c49000', ring:'#e8a80040', text:'#3a2800', sub:'#8a6a30', border:'#f0d080', btn:'#fffdf5', memoBg:'#fffdf5', memoText:'#3a2800' },
  sakura:      { label:'お花見',      dot:'#f080a0', dotB:null, bg:'linear-gradient(135deg,#ffe4ec 0%,#ffc8d8 50%,#ffb0c8 100%)', surface:'#fff5f8', accent:'#e84080', accentD:'#c02060', ring:'#e8408025', text:'#3a0018', sub:'#906060', border:'#f0a0c0', btn:'#fff5f8', memoBg:'#fff5f8', memoText:'#3a0018' },
  yugure:      { label:'夕暮れ',      dot:'#f08040', dotB:null, bg:'linear-gradient(135deg,#fff3e0 0%,#ffe0b0 40%,#ffb870 70%,#ff8c40 100%)', surface:'#fffaf5', accent:'#e06010', accentD:'#c04800', ring:'#e0601025', text:'#3a1000', sub:'#906040', border:'#f0a060', btn:'#fffaf5', memoBg:'#fffaf5', memoText:'#3a1000' },
  aozora:      { label:'青空',        dot:'#80c8f8', dotB:null, bg:'linear-gradient(180deg,#c8e8ff 0%,#e8f5ff 60%,#f5f0e8 100%)', surface:'#f8fcff', accent:'#4a9ad4', accentD:'#2a78b0', ring:'#4a9ad425', text:'#0a1828', sub:'#4a7090', border:'#90c8e8', btn:'#f8fcff', memoBg:'#f8fcff', memoText:'#0a1828' },
  fuyubare:    { label:'冬晴れ',      dot:'#6898e8', dotB:null, bg:'linear-gradient(135deg,#e8f0ff 0%,#c8d8ff 50%,#a8c0ff 100%)', surface:'#f5f8ff', accent:'#3a6fd4', accentD:'#2050b0', ring:'#3a6fd425', text:'#0a1e40', sub:'#4a6090', border:'#90b0e0', btn:'#f5f8ff', memoBg:'#f5f8ff', memoText:'#0a1e40' },
  suizokukan:  { label:'水族館',      dot:'#40b0d8', dotB:null, bg:'linear-gradient(135deg,#e0f4ff 0%,#b8e4ff 50%,#90d0f8 100%)', surface:'#f0faff', accent:'#2a80c0', accentD:'#1a60a0', ring:'#2a80c025', text:'#022030', sub:'#306080', border:'#70c0e8', btn:'#f0faff', memoBg:'#f0faff', memoText:'#022030' },
  shinrinyoku: { label:'森林浴',      dot:'#60c060', dotB:null, bg:'linear-gradient(135deg,#e8f8e0 0%,#c8edb0 50%,#a8e090 100%)', surface:'#f4fff0', accent:'#2a8e3a', accentD:'#1a6e28', ring:'#2a8e3a25', text:'#0a200e', sub:'#407840', border:'#80d080', btn:'#f4fff0', memoBg:'#f4fff0', memoText:'#0a200e' },
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
  /* グラデーション背景は body に直接適用 */
  if (t.bg.startsWith('linear-gradient')) {
    document.body.style.background = t.bg;
    document.body.style.backgroundAttachment = 'fixed';
  } else {
    document.body.style.background = t.bg;
    document.body.style.backgroundAttachment = '';
  }
  localStorage.setItem('kon-theme', key);
  document.querySelectorAll('.theme-row').forEach(r =>
    r.classList.toggle('active', r.dataset.key === key)
  );
}

/* テーマを2セクションに分けて表示 */
const themeList = document.getElementById('theme-list');

const sections = [
  { title: 'シンプル',      keys: ['default','red','orange','turquoise','lightblue','lightgreen','purple','pink','dark','midnight','white'] },
  { title: 'グラデーション', keys: ['asagohan','sakura','yugure','aozora','fuyubare','suizokukan','shinrinyoku'] },
];

sections.forEach(sec => {
  const heading = document.createElement('p');
  heading.textContent = sec.title;
  heading.style.cssText = 'font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--sub);margin:12px 0 6px;';
  themeList.appendChild(heading);

  sec.keys.forEach(key => {
    const t = THEMES[key];
    if (!t) return;
    const row = document.createElement('div');
    row.className = 'theme-row';
    row.dataset.key = key;
    const dotStyle = t.dotB
      ? `background:linear-gradient(90deg,${t.dotB} 50%,${t.dot} 50%);border-color:rgba(255,255,255,0.25);`
      : `background:${t.dot};`;
    row.innerHTML = `<span class="theme-dot" style="${dotStyle}"></span>${t.label}`;
    row.addEventListener('click', () => applyTheme(key));
    themeList.appendChild(row);
  });
});

/* 保存済みテーマを復元 */
applyTheme(localStorage.getItem('kon-theme') || 'default');

/* パネル開閉 */
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
