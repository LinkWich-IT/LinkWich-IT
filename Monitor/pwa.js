const pwaButton=document.getElementById('pwa-install');
let dialog=null;
let installPrompt=null,registration=null,reloading=false,requestedUpdate=false;
const display=matchMedia('(display-mode: standalone)');
const standalone=()=>display.matches||navigator.standalone===true;
function syncInstall(){pwaButton.hidden=standalone();}
function connection(){document.getElementById('pwa-offline').hidden=navigator.onLine!==false;}
function closeHelp(){if(!dialog)return;const current=dialog;if(typeof current.close==='function')current.close();else{current.remove();dialog=null;}}
function showHelp(text){
 if(dialog){dialog.querySelector('#pwa-help-text').textContent=text;return;}
 const current=document.createElement('dialog');current.id='pwa-install-help';current.className='edit-dialog';current.setAttribute('aria-labelledby','pwa-help-title');
 const title=document.createElement('h2');title.id='pwa-help-title';title.textContent='Instalar LinkWich';
 const help=document.createElement('p');help.id='pwa-help-text';help.textContent=text;
 const note=document.createElement('p');note.className='small muted';note.textContent='La consulta del monitoreo requiere conexión a Internet. El acceso conserva la contraseña y la verificación en dos pasos.';
 const actions=document.createElement('div');actions.className='form-actions';const close=document.createElement('button');close.id='pwa-help-close';close.type='button';close.className='subtle';close.textContent='Entendido';close.addEventListener('click',closeHelp);actions.append(close);
 current.append(title,help,note,actions);document.body.append(current);dialog=current;
 current.addEventListener('close',()=>{current.remove();if(dialog===current)dialog=null;},{once:true});
 if(typeof current.showModal==='function')current.showModal();else current.setAttribute('open','');
}
function showUpdate(){if(registration?.waiting)document.getElementById('pwa-update').hidden=false;}
syncInstall();connection();display.addEventListener?.('change',syncInstall);
window.addEventListener('offline',connection);window.addEventListener('online',connection);
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;syncInstall();});
window.addEventListener('appinstalled',()=>{installPrompt=null;pwaButton.hidden=true;if(dialog?.open)closeHelp();});
pwaButton.addEventListener('click',async()=>{
 if(standalone())return;
 if(installPrompt){
  const prompt=installPrompt;installPrompt=null;
  try{await prompt.prompt();await prompt.userChoice;}catch{showHelp('Abre el menú del navegador y busca «Instalar aplicación» o «Agregar a la pantalla principal».');}
  return;
 }
 const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 showHelp(ios?'En tu iPhone o iPad:\n1. Abre este portal en Safari.\n2. Toca Compartir.\n3. Selecciona «Añadir a pantalla de inicio».\n4. Si aparece «Abrir como app web», actívalo y toca Añadir.':'Abre el menú de este navegador y busca «Instalar aplicación» o «Agregar a la pantalla principal».\nSi no aparece, prueba con Chrome o Edge y vuelve a abrir el portal con conexión a Internet.');
});
document.getElementById('pwa-update-now').addEventListener('click',()=>{if(registration?.waiting){requestedUpdate=true;registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});}});
if('serviceWorker' in navigator&&window.isSecureContext){
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(requestedUpdate&&!reloading){reloading=true;location.reload();}});
 navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(reg=>{
  registration=reg;showUpdate();
  reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdate();});});
 }).catch(()=>{console.warn('[LinkWich PWA] No se pudo activar la pantalla sin conexión. El portal puede seguir utilizándose en línea.');});
}
