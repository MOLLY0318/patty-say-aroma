// 2026 精油側寫培訓｜學員專區共用設定
// 後台網址（Google Apps Script 網頁應用程式）。空字串＝本機測試模式（資料只存在這台瀏覽器）。
const API_URL = 'https://script.google.com/macros/s/AKfycbzEkFLR0-CD8u9pTHLzwaxZSVYb9EQOGz3f7WTWS8RWsPzYDxv-wzIT-VrtSau0-kH3wg/exec';

const SESSIONS = [
  { key: '第1堂', wed: '2026-11-18', sat: '2026-11-21', modes: ['實體', '線上'] },
  { key: '第2堂', wed: '2026-11-25', sat: '2026-11-28', modes: ['實體', '線上'] },
  { key: '第3堂', wed: '2026-12-02', sat: '2026-12-05', modes: ['實體', '線上'] },
  { key: '第4堂', wed: '2026-12-09', sat: '2026-12-12', modes: ['實體', '線上'], suggest: '實體',
    note: '這堂會在現場抽精油，建議到教室上課；真的不方便到場，也可以選線上。' },
  { key: '成果發表會', wed: '2027-01-06', sat: '2027-01-09', modes: ['實體'],
    noReplay: true,
    note: '成果發表會有同學的個人分享，為了保護大家的隱私，只有實體，不開 Google Meet，也不錄影、沒有回放。真的無法到場的同學，請選「請假」並私訊小馨子，我們再跟你說分享方式。' },
];

function md(iso) { const [, m, d] = iso.split('-'); return `${+m}/${+d}`; }
function todayISO() {
  const t = new Date(Date.now() + 8 * 3600 * 1000); // 台灣時間
  return t.toISOString().slice(0, 10);
}
// 這週對應的堂次：週六上課日還沒過的第一堂
function currentIndex() {
  const t = todayISO();
  const i = SESSIONS.findIndex(s => s.sat >= t);
  return i < 0 ? SESSIONS.length - 1 : i;
}
// 截止：上課前一天晚上 8 點（台灣時間）；請假跟週六同一個截止時間
function deadlineOf(s, day) {
  const iso = day === '週三' ? s.wed : s.sat;
  return new Date(iso + 'T20:00:00+08:00').getTime() - 24 * 3600 * 1000;
}
function deadlineText(s, day) {
  const d = new Date(deadlineOf(s, day) + 8 * 3600 * 1000);
  const w = '日一二三四五六'[d.getUTCDay()];
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}（${w}）晚上 8 點`;
}
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// 學習保證書（改內容時，version 要跟後台 AGREE_VERSION 一起換，大家會被要求重新同意）
const AGREEMENT = {
  version: 'v1',
  title: '學習保證書',
  intro: '本人參加「2026 精油側寫培訓」（講師：張珮嫚老師），下載講義前承諾：',
  items: [
    '課程講義、投影片與上課內容，僅供本人學習使用。',
    '上課錄影回放僅供本人學習使用，不側錄、不公開，也不分享或傳閱給他人。',
    '不轉傳、不複製、不公開上傳，也不提供給沒有參加課程的人。',
    '不把講義內容改成自己的課程、文章或商品對外使用。',
    '課堂上同學分享的個案與個人故事，不對外透露。',
    '我了解講義印有我的名字，若外流可以追溯來源；如有違反，願意負相關責任。',
  ],
};

async function api(body) {
  if (!API_URL) return mockApi(body);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('連線失敗（' + res.status + '）');
  return res.json();
}

// ---- 本機測試模式：模擬後台，資料存在這台瀏覽器 ----
function mockApi(r) {
  const get = (k, d) => JSON.parse(localStorage.getItem(k) || d);
  const STUDENTS = ['測試學員A', '測試學員B', '測試學員C'];
  const rows = get('mock_rows', '[]');
  const pins = get('mock_pins', '{}');
  const handouts = n => [{ id: 'h1-' + n, session: '第1堂', title: '構面與單方精油', size: 1 }];
  const latest = () => {
    const m = {};
    rows.forEach(x => { (m[x.name] = m[x.name] || {})[x.session] = { day: x.day, mode: x.mode, note: x.note, time: x.time }; });
    return m;
  };
  if (r.action === 'stats') return r.key === 'test' ? { ok: true, students: STUDENTS, latest: latest() } : { ok: false, error: 'key' };
  if (r.action === 'roster') return { ok: true, students: STUDENTS.map(n => ({ name: n, claimed: !!pins[n] })) };
  if (!STUDENTS.includes(r.name)) return { ok: false, error: 'name' };
  if (!/^\d{4}$/.test(r.pin || '')) return { ok: false, error: 'pinformat' };
  if (r.action === 'claim') {
    if (pins[r.name]) return { ok: false, error: 'claimed' };
    pins[r.name] = r.pin; localStorage.setItem('mock_pins', JSON.stringify(pins)); return { ok: true };
  }
  if (!pins[r.name]) return { ok: false, error: 'unclaimed' };
  if (pins[r.name] !== r.pin) return { ok: false, error: 'pin' };
  if (r.action === 'login' || r.action === 'mine') return { ok: true, latest: latest()[r.name] || {}, handouts: handouts(r.name), agreed: !!get('mock_agree', '{}')[r.name] };
  if (r.action === 'agree') { const a = get('mock_agree', '{}'); a[r.name] = r.sign; localStorage.setItem('mock_agree', JSON.stringify(a)); return { ok: true, agreed: true }; }
  if (r.action === 'submit') {
    const d = new Date();
    rows.push({ ...r, mode: r.day === '請假' ? '' : r.mode, time: `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` });
    localStorage.setItem('mock_rows', JSON.stringify(rows));
    return { ok: true, latest: latest()[r.name] || {}, handouts: handouts(r.name) };
  }
  if (r.action === 'download' && !get('mock_agree', '{}')[r.name]) return { ok: false, error: 'agree' };
  if (r.action === 'download') return { ok: true, filename: 'test.txt', mime: 'text/plain', data: btoa('test') };
  return { ok: false, error: 'action' };
}
