/* Preferencia de apariencia compartida con el portal. Sin llamadas de red. */
(()=>{
 const root=document.documentElement;
 let stored;try{stored=localStorage.getItem('lw-theme');}catch{}
 const preferred=typeof matchMedia==='function'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
 root.dataset.theme=stored==='dark'||stored==='light'?stored:preferred;
 const button=document.getElementById('privacy-theme');if(!button)return;
 button.hidden=false;
 button.addEventListener('click',()=>{
  const next=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=next;
  try{localStorage.setItem('lw-theme',next);}catch{}
 });
})();
