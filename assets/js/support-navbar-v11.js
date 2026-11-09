/* LinkWich-IT® | Menú Soporte v12: click, Escape, fuera de menú y móvil. */
(() => {
  'use strict';
  const item=document.getElementById('lwSupportNav');
  const toggle=document.getElementById('lwSupportMenuToggle');
  const panel=document.getElementById('lwSupportSubmenu');
  if (!item || !toggle || !panel) return;
  const close=()=>{
    item.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
  };
  const open=()=>{
    item.classList.add('is-open');
    toggle.setAttribute('aria-expanded','true');
  };
  toggle.addEventListener('click',(event)=>{
    event.preventDefault();
    event.stopPropagation();
    if(item.classList.contains('is-open')) close();
    else open();
  });
  document.addEventListener('click',(event)=>{
    if(!item.contains(event.target)) close();
  });
  document.addEventListener('keydown',(event)=>{
    if(event.key==='Escape' && item.classList.contains('is-open')) {
      close(); toggle.focus();
    }
  });
  panel.addEventListener('click',(event)=>{
    if(event.target.closest('a')) close();
  });
  document.querySelector('.mobile-nav-toggle')?.addEventListener('click',close);
  window.addEventListener('resize',close,{passive:true});
})();
