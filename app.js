(() => {
  'use strict';
  const root=document.documentElement;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const safeGet=k=>{try{return localStorage.getItem(k)}catch{return null}};
  const safeSet=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
  let paused=reduced.matches||safeGet('mk-motion')==='paused';
  const motionButton=document.querySelector('#motion-toggle');
  function updateMotion(){root.classList.toggle('motion-paused',paused);[motionButton,...document.querySelectorAll('[data-motion-toggle]')].forEach(b=>{b.textContent=paused?'Enable motion':'Pause motion';b.setAttribute('aria-pressed',String(paused))});}
  updateMotion();
  if(!paused)root.classList.add('js-motion');
  motionButton.addEventListener('click',()=>{paused=!paused;safeSet('mk-motion',paused?'paused':'enabled');updateMotion()});
  document.querySelectorAll('[data-motion-toggle]').forEach(b=>b.addEventListener('click',()=>motionButton.click()));
  reduced.addEventListener('change',e=>{paused=e.matches;updateMotion()});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  let ticking=false;
  const progress=document.querySelector('.scroll-progress');
  function onScroll(){if(!ticking){requestAnimationFrame(()=>{const range=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(range?window.scrollY/range*100:0)+'%';ticking=false});ticking=true}}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  const menu=document.querySelector('.menu-toggle'),mobile=document.querySelector('.mobile-nav');
  function closeMenu(){document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');mobile.inert=true;}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';document.body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');mobile.inert=!open});
  mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  window.matchMedia('(min-width: 761px)').addEventListener('change',e=>{if(e.matches)closeMenu()});
  const theses=[
    {title:'The grid is becoming a platform.',description:'Physical infrastructure and digital services increasingly work as one. The value lies in connecting assets, information and decisions across the electricity system.',image:'visual-grid-platform.webp',alt:'Isometric connected electricity infrastructure with generation, networks and buildings'},
    {title:'Every asset can become a source of intelligence.',description:'Sensing only matters when it changes a decision. Engineering context, reliable data and useful analytics turn an electrical asset into a clearer view of risk and performance.',image:'visual-energy-intelligence.webp',alt:'Illustration of an intelligent electricity ecosystem connecting power, storage, industry and mobility'},
    {title:'The operating model makes innovation scalable.',description:'A successful pilot is a starting point. Repeatable installation, service, training, commercial terms and partner readiness make the difference between a demonstration and a deployable offer.',image:'visual-scale-system.webp',alt:'Illustration of connected technology platforms scaling across multiple locations'}
  ];
  const tabs=[...document.querySelectorAll('[data-thesis]')];
  function selectThesis(i){tabs.forEach((b,n)=>{b.setAttribute('aria-selected',String(n===i));b.tabIndex=n===i?0:-1});const t=theses[i];document.querySelector('#thesis-title').textContent=t.title;document.querySelector('#thesis-description').textContent=t.description;const img=document.querySelector('#thesis-image');img.src='assets/'+t.image;img.alt=t.alt;document.querySelector('#image-index').textContent=`0${i+1} / 03`;document.querySelector('#thesis-panel').setAttribute('aria-labelledby',tabs[i].id)}
  tabs.forEach((b,i)=>{b.addEventListener('click',()=>selectThesis(i));b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();selectThesis(n);tabs[n].focus()})});
  document.querySelectorAll('.expertise-list details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.expertise-list details').forEach(o=>{if(o!==d)o.open=false})}));
  const essays=[
    {category:'GRID MODERNIZATION',title:'What changes when infrastructure starts to think?',body:`<p>Electrification makes the performance of physical infrastructure more consequential. At the same time, generation and demand are becoming more distributed, more variable and harder to observe through traditional operating models.</p><h3>Start with the decision.</h3><p>The value of sensing is not the volume of data it produces. It is whether a utility or industrial operator can locate a problem sooner, prioritize an intervention more confidently, or understand the capacity of an existing asset.</p><p>That requires three things to work together: a physical measurement worth trusting, an analytical interpretation grounded in engineering, and a clear path from insight to action.</p><h3>Intelligence belongs inside the operating model.</h3><p>Monitoring becomes useful when it fits maintenance practices, control-room responsibilities and investment planning. The strongest proposition connects technology to the decisions customers already need to make.</p>`},
    {category:'PILOT TO SCALE',title:'The innovation is only half the equation.',body:`<p>A pilot answers an essential question: can a technology work in this environment? Scaling asks a much broader one: can it be delivered, supported and paid for repeatedly, across different sites and markets?</p><h3>Design the second deployment early.</h3><p>Installation methods, commissioning criteria, connectivity, training, support and ownership of data should be considered alongside the technical performance. Each is part of the product a customer experiences.</p><p>The same is true commercially. A compelling demonstration needs a clear buyer, a budget owner, a useful value proposition and a pricing model that reflects the cost to serve.</p><h3>The offer is the complete system.</h3><p>Engineering, operations, partners and commercial teams need a shared deployment model. That is how an innovation becomes something the organization can repeat with confidence.</p>`},
    {category:'RECURRING VALUE',title:'From owning an asset to enabling an outcome.',body:`<p>When a sensor continues to generate useful insight over time, the customer relationship can extend beyond the original hardware purchase. But a subscription is only credible when the continuing value is equally clear.</p><h3>Connect the price to the service.</h3><p>Hardware, connectivity, analytics, support and expert interpretation create different costs and different forms of value. A sustainable offer makes those responsibilities explicit and connects them to what the customer actually uses.</p><p>For critical infrastructure, trust also depends on service continuity, data access and the ability to integrate insight into existing processes. These are core design choices, not details to settle after the contract.</p><h3>Build a model both sides can sustain.</h3><p>The objective is a durable relationship: useful intelligence for the operator, and an economic model that funds dependable delivery over the asset’s operating life.</p>`}
  ];
  const dialog=document.querySelector('#essay-dialog');
  document.querySelectorAll('[data-essay]').forEach(b=>b.addEventListener('click',()=>{const e=essays[Number(b.dataset.essay)];document.querySelector('#essay-category').textContent=e.category;document.querySelector('#essay-title').textContent=e.title;document.querySelector('#essay-body').innerHTML=e.body;dialog.showModal();document.body.style.overflow='hidden'}));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});dialog.addEventListener('close',()=>document.body.style.overflow='');
  const quickNav=document.querySelector('#quick-nav');
  document.querySelector('#quick-nav-open').addEventListener('click',()=>quickNav.showModal());
  document.querySelector('#quick-nav-close').addEventListener('click',()=>quickNav.close());
  quickNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>quickNav.close()));
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(quickNav.open)quickNav.close();else if(!dialog.open)quickNav.showModal()}});
  const toast=document.querySelector('.toast');let toastTimer;
  function notify(text){toast.textContent=text;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2600)}
  document.querySelector('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('moussa.kafal@gmail.com');notify('Email address copied')}catch{notify('Email: moussa.kafal@gmail.com')}});
  document.querySelector('#year').textContent=new Date().getFullYear();
  const cookie=document.querySelector('#cookie-banner');const isPrimaryHost=['moussakafal.com','www.moussakafal.com'].includes(location.hostname);
  function startAnalytics(){if(!isPrimaryHost||window.__mkAnalytics)return;window.__mkAnalytics=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config','G-CCZRD9R3Z0',{anonymize_ip:true});const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-CCZRD9R3Z0';document.head.appendChild(s)}
  if(safeGet('mk-analytics-consent')==='accepted')startAnalytics();else if(isPrimaryHost&&!safeGet('mk-analytics-consent'))cookie.hidden=false;
  document.querySelector('#cookie-settings').addEventListener('click',()=>{cookie.hidden=false;cookie.querySelector('button').focus()});
  document.querySelectorAll('[data-consent]').forEach(b=>b.addEventListener('click',()=>{safeSet('mk-analytics-consent',b.dataset.consent);cookie.hidden=true;if(b.dataset.consent==='accepted'){window['ga-disable-G-CCZRD9R3Z0']=false;startAnalytics()}else{window['ga-disable-G-CCZRD9R3Z0']=true;document.cookie.split(';').forEach(c=>{const name=c.split('=')[0].trim();if(name.startsWith('_ga')){document.cookie=name+'=; Max-Age=0; path=/';document.cookie=name+'=; Max-Age=0; path=/; domain=.moussakafal.com'}})}notify('Privacy preference saved')}));
})();
