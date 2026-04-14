/* ===== main.js — タイマー・メモ・終了エフェクト ===== */

/* ─── DOM参照 ─── */
const minSelect      = document.getElementById('min-select');
const clock          = document.getElementById('clock');
const progFill       = document.getElementById('prog-fill');
const statusEl       = document.getElementById('status');
const startBtn       = document.getElementById('start-btn');
const stopBtn        = document.getElementById('stop-btn');
const resetBtn       = document.getElementById('reset-btn');
const confettiCanvas = document.getElementById('confetti-canvas');
const flash          = document.getElementById('flash');
const endBanner      = document.getElementById('end-banner');
const memo           = document.getElementById('memo');
const charCount      = document.getElementById('char-count');

/* ─── タイマー状態 ─── */
let intervalId = null;
let targetTime = null;
let totalMs    = 0;
let restMs     = null;

/* ─── ユーティリティ ─── */
function pad(n) { return String(n).padStart(2, '0'); }

function fmtMs(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

function setProgress(ratio) {
  progFill.style.width = (Math.max(0, Math.min(1, ratio)) * 100) + '%';
}

/* ─── ドロップダウン生成（1〜60分） ─── */
for (let i = 1; i <= 60; i++) {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = pad(i);
  if (i === 5) opt.selected = true;
  minSelect.appendChild(opt);
}

/* ─── 表示リセット ─── */
function syncDisplay() {
  if (intervalId) return;
  const m = parseInt(minSelect.value) || 5;
  clock.textContent  = `${pad(m)}:00`;
  clock.className    = '';
  progFill.className = '';
  setProgress(1);
  statusEl.textContent = '';
  restMs = null; totalMs = 0;
}
minSelect.addEventListener('change', syncDisplay);

/* ─── スタート ─── */
startBtn.addEventListener('click', () => {
  if (restMs === null) {
    const m = parseInt(minSelect.value) || 5;
    totalMs = m * 60 * 1000;
    restMs  = totalMs;
  }
  targetTime = Date.now() + restMs;

  statusEl.textContent = '頑張りましょう！';
  statusEl.style.color = 'var(--accent-d)';
  startBtn.classList.add('hidden');
  stopBtn.classList.remove('hidden');
  resetBtn.classList.add('hidden');

  startMascotAnim();
  intervalId = setInterval(() => {
    const remain = targetTime - Date.now();
    if (remain <= 0) {
      clearInterval(intervalId); intervalId = null;
      restMs = null; totalMs = 0;
      clock.textContent  = '00:00';
      clock.className    = 'end';
      progFill.className = 'end';
      setProgress(0);
      statusEl.textContent = '終了です！';
      statusEl.style.color = 'var(--danger)';
      stopBtn.classList.add('hidden');
      startBtn.classList.remove('hidden');
      resetBtn.classList.remove('hidden');
      showMascotFinish();
      fireEndEffect();
    } else {
      restMs = remain;
      clock.textContent = fmtMs(remain);
      setProgress(totalMs > 0 ? remain / totalMs : 1);
      if (remain <= 30000) {
        clock.className    = 'warn';
        progFill.className = 'warn';
        statusEl.textContent = 'もうすぐ終了！';
        statusEl.style.color = 'var(--warn)';
      } else {
        clock.className    = '';
        progFill.className = '';
      }
    }
  }, 200);
});

/* ─── 一時停止 ─── */
stopBtn.addEventListener('click', () => {
  clearInterval(intervalId); intervalId = null;
  pauseMascotAnim();
  stopBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');
  resetBtn.classList.remove('hidden');
  statusEl.textContent = '一時停止中';
  statusEl.style.color = 'var(--sub)';
});

/* ─── リセット ─── */
resetBtn.addEventListener('click', () => {
  clearInterval(intervalId); intervalId = null;
  stopMascotAnim();
  stopConfetti();
  endBanner.classList.remove('pop', 'hide');
  restMs = null; totalMs = 0;
  const m = parseInt(minSelect.value) || 5;
  clock.textContent  = `${pad(m)}:00`;
  clock.className    = '';
  progFill.className = '';
  setProgress(1);
  statusEl.textContent = '';
  resetBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');
  stopBtn.classList.add('hidden');
});

/* ─── 終了エフェクト ─── */
const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiRaf    = null;

const CONFETTI_COLORS = [
  '#e8b800','#f0603a','#3a8fd4',
  '#3a9e4a','#8840c0','#e84097','#00a8bc','#ffffff'
];

function launchConfetti() {
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCanvas.classList.add('show');
  confettiPieces = [];
  for (let i = 0; i < 180; i++) {
    confettiPieces.push({
      x:     Math.random() * confettiCanvas.width,
      y:    -20 - Math.random() * confettiCanvas.height * 0.5,
      w:     8 + Math.random() * 10,
      h:     4 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      r:     Math.random() * Math.PI * 2,
      dr:    (Math.random() - 0.5) * 0.25,
      vx:    (Math.random() - 0.5) * 4,
      vy:    2 + Math.random() * 5,
      alpha: 1,
    });
  }
  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;
    confettiPieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.r += p.dr; p.vy += 0.07;
      if (p.y > confettiCanvas.height * 0.85) p.alpha -= 0.025;
      if (p.alpha > 0) alive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive) confettiRaf = requestAnimationFrame(draw);
    else stopConfetti();
  }
  if (confettiRaf) cancelAnimationFrame(confettiRaf);
  confettiRaf = requestAnimationFrame(draw);
}

function stopConfetti() {
  if (confettiRaf) { cancelAnimationFrame(confettiRaf); confettiRaf = null; }
  confettiCanvas.classList.remove('show');
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

function fireEndEffect() {
  flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
  endBanner.classList.remove('pop', 'hide'); void endBanner.offsetWidth;
  endBanner.classList.add('pop');
  setTimeout(() => endBanner.classList.add('hide'), 2400);
  launchConfetti();
}

/* ═══════════════════════════════
   メモ（contenteditable）＋ B・U
   ═══════════════════════════════ */

// クリア
document.getElementById('clear-btn').addEventListener('click', () => {
  if (!memo.innerText.trim() || confirm('このシートのメモをクリアしますか？')) {
    memo.innerHTML = '';
    const current = sheets.find(s => s.id === activeId);
    if (current) current.html = '';
    saveSheets();
    updateCharCount();
  }
});

/* ── ドロップダウン開閉 ── */
function setupDropdown(triggerId, panelId) {
  const trigger = document.getElementById(triggerId);
  const panel   = document.getElementById(panelId);
  if (!trigger || !panel) return;
  trigger.addEventListener('mousedown', e => e.preventDefault());
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // 他のパネルを閉じる
    document.querySelectorAll('.dd-panel').forEach(p => {
      if (p !== panel) p.classList.remove('open');
    });
    panel.classList.toggle('open');
  });
}

setupDropdown('color-trigger', 'color-panel');
setupDropdown('hl-trigger',    'hl-panel');
setupDropdown('lh-trigger',    'lh-panel');

// 外クリックで全パネルを閉じる
document.addEventListener('click', () => {
  document.querySelectorAll('.dd-panel').forEach(p => p.classList.remove('open'));
});

// ── B / U ── */
const fmtBold      = document.getElementById('fmt-bold');
const fmtUnderline = document.getElementById('fmt-underline');

function updateActiveStates() {
  fmtBold.classList.toggle('active',      document.queryCommandState('bold'));
  fmtUnderline.classList.toggle('active', document.queryCommandState('underline'));
}

fmtBold.addEventListener('mousedown', e => e.preventDefault());
fmtBold.addEventListener('click', () => {
  document.execCommand('bold');
  updateActiveStates(); autoSave();
});
fmtUnderline.addEventListener('mousedown', e => e.preventDefault());
fmtUnderline.addEventListener('click', () => {
  document.execCommand('underline');
  updateActiveStates(); autoSave();
});
memo.addEventListener('keyup',   updateActiveStates);
memo.addEventListener('mouseup', updateActiveStates);

/* ── フォントサイズ（小・中・大） ── */
document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('mousedown', e => e.preventDefault());
  btn.addEventListener('click', () => {
    const size = btn.dataset.size;
    const sel  = window.getSelection();

    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      // 選択範囲あり → 既存のfont-sizeを全て除去してから新しいspanを適用
      const range = sel.getRangeAt(0);
      // 選択範囲内の既存font-size spanを解除
      const frag = range.cloneContents();
      const walker = document.createTreeWalker(frag, NodeFilter.SHOW_ELEMENT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.style && node.style.fontSize) node.style.fontSize = '';
      }
      // 新しいspanで包む
      const span = document.createElement('span');
      span.style.fontSize = size;
      try {
        range.surroundContents(span);
      } catch(e) {
        const extracted = range.extractContents();
        // extracted内のfont-size除去
        extracted.querySelectorAll('[style]').forEach(el => {
          el.style.fontSize = '';
        });
        span.appendChild(extracted);
        range.insertNode(span);
      }
      // 選択を新しいspanに合わせる
      const newR = document.createRange();
      newR.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newR);
    } else {
      // 選択なし → カーソル位置にゼロ幅spanを挿入（以降の入力に適用）
      const span = document.createElement('span');
      span.style.fontSize = size;
      span.innerHTML = '​'; // ゼロ幅スペース
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.insertNode(span);
        range.setStartAfter(span); range.collapse(true);
        sel.removeAllRanges(); sel.addRange(range);
      }
    }

    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    autoSave();
  });
});

/* ── 文字色 ── */
document.querySelectorAll('.color-btn:not(.hl-btn)').forEach(btn => {
  btn.addEventListener('mousedown', e => e.preventDefault());
  btn.addEventListener('click', () => {
    document.execCommand('foreColor', false, btn.dataset.color);
    document.querySelectorAll('.color-btn:not(.hl-btn)').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // dd-bar（トリガーの色バー）を更新
    const bar = document.getElementById('color-bar');
    if (bar) bar.style.background = btn.dataset.color;
    // パネルを閉じる
    document.getElementById('color-panel')?.classList.remove('open');
    autoSave();
  });
});

/* ── 蛍光ペン ── */
document.querySelectorAll('.hl-btn').forEach(btn => {
  btn.addEventListener('mousedown', e => e.preventDefault());
  btn.addEventListener('click', () => {
    const color = btn.dataset.hl;
    if (color === 'transparent') {
      document.execCommand('hiliteColor', false, 'transparent');
      document.execCommand('backColor',   false, 'transparent');
    } else {
      document.execCommand('hiliteColor', false, color);
    }
    document.querySelectorAll('.hl-btn').forEach(b => b.classList.remove('active'));
    if (color !== 'transparent') {
      btn.classList.add('active');
      const bar = document.getElementById('hl-bar');
      if (bar) bar.style.background = color;
    }
    document.getElementById('hl-panel')?.classList.remove('open');
    autoSave();
  });
});

/* ── スタイルをspanで適用するヘルパー ── */
function applyInlineStyle(prop, value) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  if (sel.isCollapsed) {
    // カーソルのみ（選択なし）→ 以降の入力に適用するためdocument.execCommandを使う
    // font-sizeは execCommand('fontSize') が使えないので span を挿入
    const span = document.createElement('span');
    span.style[prop === 'fontSize' ? 'fontSize' : prop] = value;
    span.innerHTML = '&#8203;'; // ゼロ幅スペース
    const range = sel.getRangeAt(0);
    range.insertNode(span);
    range.setStart(span, 1); range.collapse(true);
    sel.removeAllRanges(); sel.addRange(range);
  } else {
    // 選択範囲に適用
    const range = sel.getRangeAt(0);
    const span  = document.createElement('span');
    span.style[prop === 'fontSize' ? 'fontSize' : prop] = value;
    try { range.surroundContents(span); } catch(e) {
      // 複数ノードにまたがる場合はフラグメントで処理
      const frag = range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    }
    sel.removeAllRanges();
    const newR = document.createRange();
    newR.selectNodeContents(span);
    sel.addRange(newR);
  }
}

/* ── 行間：1.2固定 ── */
memo.style.lineHeight = '1.2';

/* ── 自動保存ヘルパー ── */
function autoSave() {
  const current = sheets.find(s => s.id === activeId);
  if (current) {
    current.html = memo.innerHTML;

  }
  saveSheets();
}

/* ─── マスコットアニメーション（タイマー動作中のみ） ─── */
const mascotCorner  = document.getElementById('mascot-corner');
const mascotSlides  = mascotCorner ? Array.from(mascotCorner.querySelectorAll('.mascot-slide')) : [];
let mascotIdx       = 0;
let mascotTimer     = null;

// タイマー動作中の3枚（finish除く）
const mascotRunSlides = mascotSlides.filter(s => s.id !== 'mascot-finish');
const mascotFinishImg = document.getElementById('mascot-finish');

function startMascotAnim() {
  if (!mascotCorner) return;
  // finishを非表示にして通常アニメ開始
  if (mascotFinishImg) mascotFinishImg.classList.remove('active');
  mascotCorner.classList.add('running');
  mascotRunSlides.forEach(s => s.classList.remove('active'));
  mascotIdx = 0;
  mascotRunSlides[0].classList.add('active');
  if (mascotTimer) clearInterval(mascotTimer);
  mascotTimer = setInterval(() => {
    mascotRunSlides[mascotIdx].classList.remove('active');
    mascotIdx = (mascotIdx + 1) % mascotRunSlides.length;
    mascotRunSlides[mascotIdx].classList.add('active');
  }, 3000);
}

function pauseMascotAnim() {
  // 一時停止中はアニメーションを止めるだけ（表示は維持）
  clearInterval(mascotTimer);
  mascotTimer = null;
}

function showMascotFinish() {
  if (!mascotCorner) return;
  clearInterval(mascotTimer);
  mascotTimer = null;
  // 通常スライドを非表示にしてfinishを表示
  mascotRunSlides.forEach(s => s.classList.remove('active'));
  if (mascotFinishImg) mascotFinishImg.classList.add('active');
  mascotCorner.classList.add('running');
}

function stopMascotAnim() {
  if (!mascotCorner) return;
  clearInterval(mascotTimer);
  mascotTimer = null;
  mascotRunSlides.forEach(s => s.classList.remove('active'));
  if (mascotFinishImg) mascotFinishImg.classList.remove('active');
  mascotCorner.classList.remove('running');
}

/* ─── 初期表示 ─── */
syncDisplay();

/* ═══════════════════════════════════════
   シートタブ管理
   ═══════════════════════════════════════ */

const tabList        = document.getElementById('tab-list');
const tabAddBtn      = document.getElementById('tab-add');
const tabOverflowBtn = document.getElementById('tab-overflow-btn');
const overflowMenu   = document.getElementById('overflow-menu');
const SHEETS_KEY     = 'kon-sheets';

// シートデータ: [{id, name, html}, ...]
let sheets    = [];
let activeId  = null;

/* ── 永続化 ── */
function saveSheets() {
  // アクティブシートのメモ内容を先に同期
  if (activeId) {
    const sheet = sheets.find(s => s.id === activeId);
    if (sheet) sheet.html = memo.innerHTML;
  }
  localStorage.setItem(SHEETS_KEY, JSON.stringify(sheets));
  localStorage.setItem('kon-active-sheet', activeId);
}

function loadSheets() {
  try {
    const raw = localStorage.getItem(SHEETS_KEY);
    if (raw) {
      sheets = JSON.parse(raw);
    }
  } catch(e) {
    sheets = [];
  }
  // 旧データ（kon-memo-html）を移行
  if (sheets.length === 0) {
    const legacy = localStorage.getItem('kon-memo-html') || '';
    sheets = [{ id: uid(), name: 'Sheet 1', html: legacy }];
  }
  activeId = localStorage.getItem('kon-active-sheet') || sheets[0].id;
  // 存在チェック
  if (!sheets.find(s => s.id === activeId)) activeId = sheets[0].id;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── タブ描画 ── */
function renderTabs() {
  tabList.innerHTML = '';
  sheets.forEach(sheet => {
    const tab = document.createElement('div');
    const isActive = sheet.id === activeId;
    tab.className = 'sheet-tab' + (isActive ? ' active' : '');
    tab.dataset.id = sheet.id;

    // ラベルテキスト（通常表示）
    const labelText = document.createElement('span');
    labelText.className = 'tab-label-text';
    labelText.textContent = sheet.name;

    // 非アクティブタブ：クリックで切り替え
    if (!isActive) {
      tab.addEventListener('click', () => switchTab(sheet.id));
      tab.appendChild(labelText);
    } else {
      // アクティブタブ：クリックで編集input表示
      tab.appendChild(labelText);

      tab.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close')) return;
        // すでにinputが出ていたら何もしない
        if (tab.querySelector('.tab-input')) return;
        // input を挿入
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'tab-input';
        input.value = sheet.name;
        // 文字数に合わせてinputの幅を動的調整
        const updateInputWidth = () => {
          input.style.width = Math.max(60, input.value.length * 14) + 'px';
        };
        updateInputWidth();
        input.addEventListener('input', updateInputWidth);
        labelText.replaceWith(input);
        input.focus();
        input.select();

        function commitRename() {
          const newName = input.value.trim() || sheet.name;
          sheet.name = newName;
          saveSheets();
          renderTabs();
        }
        input.addEventListener('blur', commitRename);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter')  { e.preventDefault(); input.blur(); }
          if (e.key === 'Escape') { input.value = sheet.name; input.blur(); }
        });
      });
    }

    // 削除ボタン（2枚以上のとき表示）
    if (sheets.length > 1) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'tab-close';
      closeBtn.textContent = '×';
      closeBtn.title = 'このシートを削除';
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTab(sheet.id);
      });
      tab.appendChild(closeBtn);
    }

    tabList.appendChild(tab);
  });

  // 溢れタブ検出（描画後に計算）
  requestAnimationFrame(updateOverflow);
}

/* ── 溢れ検出 & … メニュー更新 ──
   表示戦略：tabStartIdx 以降のタブを先頭から詰めて表示。
   アクティブタブが見えない場合は tabStartIdx を調整して必ず見えるようにする。
── */
let tabStartIdx = 0;  // 表示を開始するシートのインデックス

function updateOverflow() {
  const allTabs   = Array.from(tabList.querySelectorAll('.sheet-tab'));
  const activeIdx = sheets.findIndex(s => s.id === activeId);

  // アクティブタブが tabStartIdx より前なら先頭を戻す
  if (activeIdx < tabStartIdx) tabStartIdx = activeIdx;

  // 全タブを一旦表示して幅を計測
  allTabs.forEach(t => { t.style.display = ''; });

  const addBtnW   = tabAddBtn.offsetWidth + 4;
  const overflowW = 48;
  const barW      = tabList.parentElement.clientWidth;

  // 全部収まるか確認
  const totalW = allTabs.reduce((sum, t) => sum + t.offsetWidth + 2, 0);
  if (totalW <= barW - addBtnW) {
    tabStartIdx = 0;
    allTabs.forEach(t => { t.style.display = ''; });
    tabOverflowBtn.classList.remove('visible');
    overflowMenu.classList.remove('open');
    return;
  }

  // 収まらない → tabStartIdx から表示、…ボタン分の幅を引く
  const avail = barW - addBtnW - overflowW;
  let consumed = 0;
  let lastVisible = tabStartIdx;

  // tabStartIdx より前は非表示
  allTabs.forEach((t, i) => {
    if (i < tabStartIdx) { t.style.display = 'none'; return; }
    const tw = t.offsetWidth + 2;
    if (consumed + tw <= avail) {
      t.style.display = '';
      consumed += tw;
      lastVisible = i;
    } else {
      t.style.display = 'none';
    }
  });

  // アクティブタブが非表示なら tabStartIdx を進めて再帰
  if (activeIdx > lastVisible) {
    tabStartIdx = activeIdx - (lastVisible - tabStartIdx);
    if (tabStartIdx < 0) tabStartIdx = 0;
    updateOverflow();
    return;
  }

  // 隠れているシートを収集（前後両方）
  const hiddenSheets = sheets.filter((_, i) => allTabs[i]?.style.display === 'none');

  tabOverflowBtn.classList.add('visible');
  overflowMenu.innerHTML = '';
  hiddenSheets.forEach(sheet => {
    const item = document.createElement('div');
    item.className = 'overflow-item' + (sheet.id === activeId ? ' active' : '');
    item.textContent = sheet.name;
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      overflowMenu.classList.remove('open');
      // クリックされたシートが見えるよう tabStartIdx を調整
      const clickedIdx = sheets.findIndex(s => s.id === sheet.id);
      tabStartIdx = clickedIdx;
      switchTab(sheet.id);
    });
    overflowMenu.appendChild(item);
  });
}

// … ボタンクリックでメニュー開閉
tabOverflowBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  overflowMenu.classList.toggle('open');
});

// 外クリックでメニューを閉じる
document.addEventListener('click', () => {
  overflowMenu.classList.remove('open');
});

// リサイズ時にも溢れを再計算
window.addEventListener('resize', () => requestAnimationFrame(updateOverflow));

/* ── タブ切り替え ── */
function switchTab(id) {
  const current = sheets.find(s => s.id === activeId);
  if (current) {
    current.html = memo.innerHTML;
    current.lineHeight = memo.style.lineHeight;
  }
  activeId = id;
  const next = sheets.find(s => s.id === id);
  if (next) {
    memo.innerHTML   = next.html || '';
    memo.style.lineHeight = '1.2';
  }
  renderTabs();
  updateCharCount();
  saveSheets();
}

/* ── タブ追加 ── */
tabAddBtn.addEventListener('click', () => {
  const current = sheets.find(s => s.id === activeId);
  if (current) current.html = memo.innerHTML;

  const newSheet = { id: uid(), name: `Sheet ${sheets.length + 1}`, html: '' };
  sheets.push(newSheet);
  activeId = newSheet.id;
  // 新しいタブ（末尾）が必ず見えるよう tabStartIdx を末尾寄りに設定
  tabStartIdx = sheets.length - 1;
  memo.innerHTML = '';
  renderTabs();
  updateCharCount();
  saveSheets();
  memo.focus();
});

/* ── タブ削除 ── */
function deleteTab(id) {
  if (sheets.length <= 1) return;
  const target = sheets.find(s => s.id === id);
  // メモが空でない場合だけ確認ダイアログを出す
  const isEmpty = !target?.html || target.html.replace(/<[^>]*>/g, '').trim() === '';
  if (!isEmpty && !confirm(`「${target?.name}」を削除しますか？`)) return;

  const idx = sheets.findIndex(s => s.id === id);
  sheets.splice(idx, 1);

  // アクティブが削除されたら隣を選ぶ
  if (activeId === id) {
    activeId = sheets[Math.min(idx, sheets.length - 1)].id;
    const next = sheets.find(s => s.id === activeId);
    memo.innerHTML = next ? (next.html || '') : '';
  }
  renderTabs();
  updateCharCount();
  saveSheets();
}

/* ── 文字数更新 ── */
function updateCharCount() {
  const text = memo.innerText || '';
  charCount.textContent = text.trim().length ? `${text.length}文字` : '';
}

/* ── 初期化 ── */
loadSheets();
const initSheet = sheets.find(s => s.id === activeId);
if (initSheet) {
  memo.innerHTML = initSheet.html || '';
  memo.style.lineHeight = '1.2';
}
renderTabs();
updateCharCount();

// メモ入力時に文字数更新 + 自動保存
memo.addEventListener('input', () => {
  updateCharCount();
  const current = sheets.find(s => s.id === activeId);
  if (current) current.html = memo.innerHTML;
  saveSheets();
});
