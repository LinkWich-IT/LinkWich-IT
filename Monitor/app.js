import {createClient} from './vendor/supabase.js';
import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from './config.js';
const $=id=>document.getElementById(id);
let db,factor,poll,lastActivity=Date.now(),loading=false,epoch=0;
const names={online:'En línea',unreachable:'Sin comunicación',app_down:'Aplicativo sin respuesta',pending:'Esperando primera señal',paused:'Monitoreo pausado'};
const storedTheme=localStorage.getItem('lw-theme');
document.documentElement.dataset.theme=storedTheme || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
$('theme').onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.setItem('lw-theme',t);};
function notice(message=''){$('notice').textContent=message;$('notice').hidden=!message;}
function screen(id){for(const name of ['login','mfa','dashboard'])$(name).hidden=name!==id;}
function node(tag,text,cls){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;}
function date(value){return value?new Date(value).toLocaleString():'Sin señales';}
function state(i){if(i.paused)return 'paused';if(!i.last_seen)return Date.now()-Date.parse(i.created_at)>i.timeout_seconds*1000?'unreachable':'pending';return Date.now()-Date.parse(i.last_seen)>i.timeout_seconds*1000?'unreachable':i.app_ok?'online':'app_down';}
async function logout(){epoch++;clearInterval(poll);$('password').value='';$('otp').value='';$('qr').removeAttribute('src');$('totp-secret').textContent='';$('installations').replaceChildren();$('events').replaceChildren();screen('login');if(db)await db.auth.signOut({scope:'local'});}
for(const id of ['logout','mfa-cancel'])$(id).onclick=()=>logout();
for(const event of ['pointerdown','keydown','touchstart'])document.addEventListener(event,()=>lastActivity=Date.now(),{passive:true});
setInterval(()=>{if(!$('dashboard').hidden&&Date.now()-lastActivity>15*60000){logout();notice('Tu sesión se cerró por inactividad.');}},15000);
async function setupMfa(){
 const {data,error}=await db.auth.mfa.listFactors();if(error)throw error;
 const verified=data.totp.find(f=>f.status==='verified');
 $('enrollment').hidden=!!verified;
 if(verified)factor=verified.id;
 else{
  // Retira factores incompletos propios antes de iniciar una nueva inscripción.
  for(const f of data.totp.filter(f=>f.status!=='verified')){const {error}=await db.auth.mfa.unenroll({factorId:f.id});if(error)throw error;}
  const {data:enrolled,error}=await db.auth.mfa.enroll({factorType:'totp',friendlyName:'LinkWich-IT'});if(error)throw error;
  factor=enrolled.id;$('qr').src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(enrolled.totp.qr_code);$('totp-secret').textContent=enrolled.totp.secret;
 }
 $('mfa-help').textContent=verified?'Escribe el código de tu aplicación autenticadora.':'Escanea el QR con tu aplicación autenticadora y escribe el código para activar la protección.';
 screen('mfa');$('otp').focus();
}
$('login-form').onsubmit=async e=>{
 e.preventDefault();notice();const button=e.submitter;button.disabled=true;
 try{
  if(!db)throw Error('configuration');
  const {error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});
  $('password').value='';if(error)throw error;await setupMfa();
 }catch{notice('No fue posible iniciar sesión. Revisa tus credenciales o contacta a LinkWich-IT.');}
 finally{button.disabled=false;}
};
$('mfa-form').onsubmit=async e=>{
 e.preventDefault();notice();e.submitter.disabled=true;
 try{
  const {error}=await db.auth.mfa.challengeAndVerify({factorId:factor,code:$('otp').value});if(error)throw error;
  $('otp').value='';$('qr').removeAttribute('src');$('totp-secret').textContent='';
  const {data,error:ae}=await db.auth.mfa.getAuthenticatorAssuranceLevel();if(ae||data.currentLevel!=='aal2')throw Error('MFA');
  lastActivity=Date.now();screen('dashboard');const {data:{user}}=await db.auth.getUser();$('identity').textContent=user?.email || '';
  await refresh();clearInterval(poll);poll=setInterval(refresh,30000);
 }catch{notice('No fue posible verificar el acceso. Revisa el código e inténtalo de nuevo.');}
 finally{e.submitter.disabled=false;}
};
async function refresh(){
 if(loading||$('dashboard').hidden)return;loading=true;const generation=epoch;$('refresh').disabled=true;
 try{
  const [a,b]=await Promise.all([db.from('lw_installations').select('id,name,paused,created_at,last_seen,app_ok,license_ok,timeout_seconds').order('name'),db.from('lw_events').select('id,installation_id,state,created_at').order('created_at',{ascending:false}).limit(20)]);
  if(generation!==epoch)return;
  if(a.error||b.error)throw Error('fetch');
  const rows=a.data || [],states=rows.map(state);$('installations').replaceChildren();
  $('total').textContent=rows.length;$('online').textContent=states.filter(s=>s==='online').length;$('attention').textContent=states.filter(s=>['app_down','unreachable'].includes(s)).length;
  if(!rows.length)$('installations').append(node('p','No hay instalaciones asignadas a esta cuenta. Contacta a LinkWich-IT.','muted'));
  for(const [ix,i] of rows.entries()){
   const s=states[ix],card=node('article','','panel installation');card.append(node('h3',i.name),node('span',names[s],'badge '+(s==='online'?'good':['unreachable','app_down'].includes(s)?'bad':'')),node('p','Última señal: '+date(i.last_seen)),node('p','Licencia al recibir señal: '+(i.license_ok===null?'Sin dato':i.license_ok?'Vigente':'Sin validación vigente')));$('installations').append(card);
  }
  const lookup=Object.fromEntries(rows.map(i=>[i.id,i.name]));$('events').replaceChildren();
  for(const e of b.data || []){const item=node('div',(lookup[e.installation_id]||'Instalación')+' · '+(names[e.state]||e.state),'event');item.append(node('time',date(e.created_at)));$('events').append(item);}
  if(!b.data?.length)$('events').append(node('p','Aún no hay cambios registrados.','muted'));
  $('updated').textContent='Actualizado '+new Date().toLocaleTimeString();notice();
 }catch{
  if(generation!==epoch)return;
  $('installations').replaceChildren(node('p','No se puede confirmar el estado actual.','muted'));$('events').replaceChildren();
  for(const id of ['total','online','attention'])$(id).textContent='—';
  $('updated').textContent='Sin datos actualizados';notice('No fue posible consultar el servicio. Reintenta o vuelve a iniciar sesión.');
 }finally{loading=false;$('refresh').disabled=false;}
}
$('refresh').onclick=refresh;
if(!/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(SUPABASE_URL)||SUPABASE_PUBLISHABLE_KEY.startsWith('REEMPLAZAR'))notice('El portal está pendiente de configuración por LinkWich-IT.');
else db=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:true,detectSessionInUrl:false}});
