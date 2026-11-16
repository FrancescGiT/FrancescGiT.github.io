import { translations, projects, career, education } from './content.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const langRoot = $('#language');
const langTrigger = $('#langTrigger');
const langMenu = $('#langMenu');
const menuToggle = $('#menuToggle');
const mobileNav = $('#mobileNav');
const grid = $('#projectGrid');
const timeline = $('#careerTimeline');
const educationList = $('#educationItems');
const dialog = $('#projectDialog');
let currentLang = 'es';
let currentFilter = 'all';
let currentProject = null;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealObserver = !reducedMotion && 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in');revealObserver.unobserve(entry.target)}},{threshold:.08,rootMargin:'0px 0px 50px 0px'}):null;
function watchReveal(node){if(!revealObserver)return;node.classList.add('reveal-on-scroll');revealObserver.observe(node)}
if(revealObserver)document.documentElement.classList.add('motion-ready');
const LANG_KEY = 'francesc-benach-language';
const getCopy = () => translations[currentLang];

function artwork(type) {
  switch (type) {
    case 'circuit': return `<div class="art-piece art-circuit"><div class="orbit"></div><div class="orbit"></div><div class="module"><div class="chip">F/B</div><i class="led"></i><i class="led led2"></i><span class="microtext">CONTROL SYSTEM / PCB_01</span></div></div>`;
    case 'digital': return `<div class="art-piece art-digital"><div class="app-frame"><div class="app-toolbar"><span></span><span></span><span></span></div><div class="app-main"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div></div>`;
    case 'gateway': return `<div class="art-piece art-gateway"><div class="frequency"><div class="fcore">RF</div></div><div class="freqlabel">868 ↔ 915</div></div>`;
    case 'boxes': return `<div class="art-piece art-boxes"><div class="box-plane"></div><div class="parcel second"></div><div class="parcel"></div></div>`;
    case 'dashboard': return `<div class="art-piece art-dashboard"><div class="dash-window"><div class="dash-top">OPERATIONS / OVERVIEW</div><div class="dash-sidebar"><span></span><span></span><span></span><span></span></div><div class="dash-content"><div class="dash-metrics"><span>32</span><span>08</span><span>96%</span></div><div class="chart-bars"><i style="--h:35%"></i><i style="--h:48%"></i><i style="--h:59%"></i><i style="--h:44%"></i><i style="--h:68%"></i><i style="--h:78%"></i><i style="--h:85%"></i><i style="--h:96%"></i></div></div></div></div>`;
    case 'agents': return `<div class="art-piece art-agents"><div class="flow-line"></div><div class="flow-path"></div><div class="flow-node">INPUT</div><div class="flow-node">PROCESS</div><div class="flow-node">DONE ✓</div></div>`;
    case 'lumina': return `<div class="art-piece art-lumina"><div class="phone"><div class="screen">LUMINA / TODAY<div class="orb"></div>HOW ARE YOU FEELING?</div></div></div>`;
    case 'serial': return `<div class="art-piece art-serial"><div class="wire"></div><div class="device"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`;
    default: return '';
  }
}
function textNode(tag, text, className) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}
function makeProject(project) {
  const p = project[currentLang];
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'project-card' + (project.number === '01' ? ' project-wide' : '');
  card.dataset.art = project.art;
  card.dataset.type = project.type;
  const typeName = getCopy()['projectKind' + ({ product: 'Product', digital: 'Digital', ai: 'AI' })[project.type]];
  card.setAttribute('aria-label', `${getCopy().viewProject}: ${p.name}`);
  card.innerHTML = `<div class="project-art"><span class="project-no">${project.number} / 08</span><span class="project-top-label">F / B — SELECTED WORK</span>${artwork(project.art)}<span class="project-open" aria-hidden="true">↗</span></div>`;
  const info = textNode('div', '', 'project-info');
  const main = textNode('div', '', 'project-info-main');
  main.append(textNode('h3', p.name), textNode('p', p.caption));
  info.append(main, textNode('span', typeName, 'project-kind'));
  card.append(info);
  card.addEventListener('click', () => showProject(project.id));
  watchReveal(card);
  return card;
}
function renderProjects() {
  const cards = projects.filter(p => currentFilter === 'all' || p.type === currentFilter).map(makeProject);
  grid.replaceChildren(...cards);
  const filters = $$('.filter');
  filters.forEach(b => { b.classList.toggle('is-active', b.dataset.filter === currentFilter); b.setAttribute('aria-pressed', String(b.dataset.filter === currentFilter)); });
}
function renderCareer() {
  timeline.replaceChildren(...career.map(item => {
    const row = textNode('article', '', 'career-item');
    const role = textNode('div', '', 'career-position');
    role.append(textNode('div', item[currentLang].role, 'career-role'), textNode('span', item[currentLang].company, 'career-company'));
    row.append(textNode('span', item.year, 'career-year'), role, textNode('p', item[currentLang].description, 'career-description'));
    watchReveal(row);
    return row;
  }));
  educationList.replaceChildren(...education.map(item => {
    const article = textNode('article', '', 'education-item');
    const details = textNode('div', '', 'education-copy');
    details.append(textNode('h4', item[currentLang].name), textNode('p', item[currentLang].detail));
    article.append(textNode('span', item.year, 'education-date'), details);
    watchReveal(article);
    return article;
  }));
}
function updateCopy() {
  const t = getCopy();
  $$('[data-t]').forEach(el => {
    const key = el.dataset.t;
    if (Object.hasOwn(t, key)) el.textContent = t[key];
  });
  document.documentElement.lang = currentLang;
  document.title = currentLang === 'es' ? 'Francesc Benach — Ingeniería con propósito' : 'Francesc Benach — Engineering with purpose';
  $('meta[name="description"]').content = currentLang === 'es' ? 'Francesc Benach Garcia. Ingeniería electrónica, sistemas embebidos, dirección técnica y transformación digital.' : 'Francesc Benach Garcia. Electronics engineering, embedded systems, technical leadership and digital transformation.';
  $('meta[property="og:description"]').content = currentLang === 'es' ? 'Del hardware al sistema. Ingeniería electrónica, firmware, producto y dirección de proyectos.' : 'From hardware to systems. Electronic engineering, firmware, product development and project leadership.';
  $('meta[property="og:title"]').content = document.title;
  $('#langFlag').textContent = currentLang === 'es' ? '🇪🇸' : '🇺🇸';
  $('#langCode').textContent = currentLang.toUpperCase();
  langTrigger.setAttribute('aria-label', t.langSelect);
  $('#menuToggle').setAttribute('aria-label', menuToggle.getAttribute('aria-expanded') === 'true' ? t.menuClose : t.menuOpen);
  $$('[data-lang]', langMenu).forEach(b => b.setAttribute('aria-checked', String(b.dataset.lang === currentLang)));
  const cv = currentLang === 'es' ? './files/Francesc_Benach_CV_ES.pdf' : './files/Francesc_Benach_CV_EN.pdf';
  $('#heroCv').href = cv;
  $('#footerCv').href = cv;
  $('#projectFilters').setAttribute('aria-label', currentLang === 'es' ? 'Filtrar proyectos' : 'Filter projects');
  $('#mobileNav').setAttribute('aria-label', currentLang === 'es' ? 'Navegación móvil' : 'Mobile navigation');
  $('#dialogClose').setAttribute('aria-label', currentLang === 'es' ? 'Cerrar detalle' : 'Close details');
  renderProjects(); renderCareer();
  if (dialog.open && currentProject) populateDialog(currentProject);
}
function closeLanguageMenu(restoreFocus = false) {
  langMenu.hidden = true; langTrigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) langTrigger.focus();
}
function openLanguageMenu() {
  langMenu.hidden = false; langTrigger.setAttribute('aria-expanded', 'true');
  ($('[aria-checked="true"]', langMenu) || $('[data-lang]', langMenu)).focus();
}
function setLanguage(lang) {
  if (lang !== 'es' && lang !== 'en') return;
  currentLang = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
  updateCopy(); closeLanguageMenu(true);
}
langTrigger.addEventListener('click', () => langMenu.hidden ? openLanguageMenu() : closeLanguageMenu(true));
$$('[data-lang]', langMenu).forEach(option => option.addEventListener('click', () => setLanguage(option.dataset.lang)));
langRoot.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !langMenu.hidden) { e.stopPropagation(); closeLanguageMenu(true); }
  if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
    e.preventDefault(); if (langMenu.hidden) openLanguageMenu(); else {
      const options = $$('[data-lang]', langMenu);
      const i = options.indexOf(document.activeElement);
      options[(i + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length].focus();
    }
  }
});
document.addEventListener('pointerdown', e => { if (!langRoot.contains(e.target)) closeLanguageMenu(); });
document.addEventListener('focusin', e => { if (!langRoot.contains(e.target)) closeLanguageMenu(); });

function closeMobile() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label',getCopy().menuOpen);
  document.body.classList.remove('menu-open');
}
menuToggle.addEventListener('click', () => {
  const expand = menuToggle.getAttribute('aria-expanded') !== 'true';
  mobileNav.hidden = !expand;
  menuToggle.setAttribute('aria-expanded',String(expand));
  menuToggle.setAttribute('aria-label',expand ? getCopy().menuClose : getCopy().menuOpen);
  document.body.classList.toggle('menu-open',expand);
});
$$('a',mobileNav).forEach(link => link.addEventListener('click',closeMobile));
document.addEventListener('keydown',e=>{if(e.key === 'Escape')closeMobile()});

$$('.filter').forEach(b => b.addEventListener('click', () => { currentFilter = b.dataset.filter; renderProjects(); }));
function populateDialog(project) {
  const p = project[currentLang];
  const typeName = getCopy()['projectKind' + ({product:'Product',digital:'Digital',ai:'AI'})[project.type]];
  $('#dialogVisual').dataset.art = project.art;
  $('#dialogVisual').className = 'dialog-visual';
  $('#dialogVisual').style.background = getComputedStyle($(`.project-card[data-art="${project.art}"] .project-art`) || document.body).backgroundColor;
  $('#dialogVisual').innerHTML = artwork(project.art);
  $('#dialogCategory').textContent = `${project.number} / ${typeName}`;
  $('#dialogTitle').textContent = p.name;
  $('#dialogDescription').textContent = p.description;
  $('#dialogOutcome').textContent = p.outcome;
  $('#dialogTags').replaceChildren(...p.tags.map(tag => textNode('span',tag)));
}
function showProject(id) {
  const project = projects.find(p=>p.id===id);
  if (!project) return;
  currentProject = project;
  populateDialog(project);
  dialog.showModal();
}
$('#dialogClose').addEventListener('click',()=>dialog.close());
$('#dialogBack').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{currentProject=null});

let restored = 'es';
try { restored = localStorage.getItem(LANG_KEY) || (navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es'); } catch { restored = navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es'; }
currentLang = restored === 'en' ? 'en' : 'es';
updateCopy();
$$('.disciplines > div, .portrait-group, .about-title').forEach(watchReveal);

let latestScroll = 0, ticking = false;
function onScroll() {
  latestScroll = window.scrollY;
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const offset = latestScroll + 95;
    const manifesto = $('#manifesto'), careerSection = $('#career');
    const inDark = [manifesto, careerSection].some(section => offset >= section.offsetTop && offset < section.offsetTop + section.offsetHeight);
    $('#header').classList.toggle('on-dark', inDark);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    $('#progress').style.width = (max > 0 ? 100 * latestScroll/max : 0) + '%';
    const visible = latestScroll < $('#about').offsetTop - window.innerHeight*0.36;
    $('#cinema').classList.toggle('visible',visible);
    $('#cinema').classList.toggle('is-story',latestScroll > manifesto.offsetTop - window.innerHeight*0.3);
    window.dispatchEvent(new CustomEvent('portfolio-scroll', {detail:{scroll: latestScroll, heroHeight: $('#hero').offsetHeight, storyHeight: manifesto.offsetHeight}}));
    ticking = false;
  });
}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll,{passive:true});
onScroll();