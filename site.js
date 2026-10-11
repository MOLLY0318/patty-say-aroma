
  const mainNav = document.querySelector('nav');
  const activeNavLink = mainNav.querySelector('[aria-current="page"]');
  if (activeNavLink) {
    const navRow = mainNav.querySelector('.nav-links');
    navRow.scrollLeft = Math.max(0, activeNavLink.offsetLeft - navRow.offsetLeft - (navRow.clientWidth - activeNavLink.offsetWidth) / 2);
  }
  const navToggle = mainNav.querySelector('.nav-toggle');
  function closeMainNav() { mainNav.classList.remove('menu-open'); navToggle.setAttribute('aria-expanded', 'false'); }
  navToggle.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMainNav); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && mainNav.classList.contains('menu-open')) { closeMainNav(); navToggle.focus(); } });


  // 預覽取自原文；原始段落完整保留在原生 details，無腳本時仍顯示全文。
  document.querySelectorAll('.card-bio, .testimonial-text').forEach(function (paragraph) {
    const isFeedback = paragraph.classList.contains('testimonial-text');
    const text = paragraph.innerText.replace(/\s+/g, ' ').trim();
    const limit = isFeedback ? 160 : 110;
    if (text.length <= limit) return;
    const preview = document.createElement('p');
    preview.className = 'card-preview';
    preview.textContent = text.slice(0, limit) + '…';
    const details = document.createElement('details');
    details.className = 'reading-details';
    const summary = document.createElement('summary');
    const label = isFeedback ? '閱讀完整回饋' : '查看完整介紹';
    summary.textContent = label;
    paragraph.before(preview, details);
    details.append(summary, paragraph);
    details.addEventListener('toggle', function () {
      preview.hidden = details.open;
      summary.textContent = details.open ? '收合' + (isFeedback ? '回饋' : '介紹') : label;
    });
  });

document.querySelectorAll('[data-page-link]').forEach(el => {
  el.addEventListener('click', () => { location.href = el.dataset.pageLink; });
  el.addEventListener('keydown', event => { if(event.key === 'Enter') location.href = el.dataset.pageLink; });
});
// Preserve existing QR previews while making their controls keyboard accessible.
document.querySelectorAll('span[onclick], .qr-close').forEach(el => {
  const button = document.createElement('button');
  for(const attr of el.attributes) button.setAttribute(attr.name, attr.value);
  button.type = 'button'; button.innerHTML = el.innerHTML; el.replaceWith(button);
});
let qrOpener;
document.addEventListener('click', event => {
  const trigger = event.target.closest('[onclick]');
  if(trigger && trigger.getAttribute('onclick').includes("classList.add('active')")) {
    qrOpener=trigger;
    const modal=document.querySelector('.qr-modal.active');
    if(modal) { modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-label',modal.querySelector('p')?.textContent || '聯絡方式'); modal.querySelector('button,a')?.focus(); }
  }
});
document.addEventListener('keydown', event => {
  const modal=document.querySelector('.qr-modal.active'); if(!modal)return;
  if(event.key==='Escape'){modal.classList.remove('active');qrOpener?.focus();}
  if(event.key==='Tab'){
    const nodes=[...modal.querySelectorAll('button,a[href]')]; const first=nodes[0],last=nodes[nodes.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});

if(document.body.classList.contains("home-page")){const old={"hero": "index.html", "founder": "about.html#founder", "brand-philosophy": "about.html#brand-philosophy", "what": "profiling.html#what", "testimonials": "team.html#testimonials", "team": "team.html#team", "lecture-entry": "profiling.html#lecture-entry", "courses": "courses.html", "faq": "faq.html"};if(old[location.hash.slice(1)]&&location.hash!=="#hero")location.replace(old[location.hash.slice(1)]);}
