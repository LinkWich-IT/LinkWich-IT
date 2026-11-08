import {renderNotice,noticeElement} from './notices.js?v=visible-1';
import {matchesSearch,matchesSiteStatus,siteState} from './search.js?v=filters-1';
import {createManagement} from './management.js?v=visible-1';
import {icon,buttonIcon,setBusy,statusStyles,decorateStatic,renderChart,renderChartTable} from './visuals.js?v=filters-1';
import {createClient} from './vendor/supabase.js';
import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from './config.js?v=login-diagnostico-1';
import {renderLicense,renderSiteDetails} from './license.js?v=cards-2';
const $=id=>document.getElementById(id);
let manager;
let refreshAgain=false,historySite='',chartCache=null;
let db,factor,poll,lastActivity=Date.now(),loading=false,epoch=0;
let idleMinutes=15,activityKey='',lastTouch=0,lastWrite=0,signingOut=false;
const names={online:'En línea',unreachable:'Sin comunicación',app_down:'Aplicativo sin respuesta',pending:'Esperando primera señal',paused:'Monitoreo pausado'};
const storedTheme=localStorage.getItem('lw-theme');
document.documentElement.dataset.theme=storedTheme || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
$('theme').onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.setItem('lw-theme',t);};
function notice(message='',kind='info'){renderNotice($('notice'),message,kind);}
function screen(id){document.body.dataset.screen=id;for(const name of ['login','mfa','dashboard'])$(name).hidden=name!==id;}
function node(tag,text,cls){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;}
function date(value){return value?new Date(value).toLocaleString():'Sin señales';}
const state=siteState;
function readActivity(){try{return Number(localStorage.getItem(activityKey))||0;}catch{return 0;}}
function saveActivity(value){lastActivity=value;if(activityKey)try{localStorage.setItem(activityKey,String(value));}catch{}}
function setIdle(minutes){if(Number.isInteger(minutes)&&minutes>=5&&minutes<=1440)idleMinutes=minutes;$('session-policy').textContent='Cierre tras '+idleMinutes+' minutos sin actividad';}
async function logout(remote=true){
 if(signingOut)return;signingOut=true;
 const end=remote&&db&&!$('dashboard').hidden?manager?.end().catch(()=>{}):null;
 epoch++;chartCache=null;historySite='';refreshAgain=false;clearInterval(poll);manager?.clear();$('password').value='';$('otp').value='';$('qr').removeAttribute('src');$('totp-secret').textContent='';$('installations').replaceChildren();$('events').replaceChildren();$('incident-chart').replaceChildren();$('chart-data').replaceChildren();screen('login');
 if(activityKey)try{localStorage.removeItem(activityKey);}catch{}activityKey='';
 try{await end;if(remote&&db)await db.auth.signOut({scope:'local'});}finally{signingOut=false;}
}
for(const id of ['logout','mfa-cancel'])$(id).onclick=()=>logout();
window.addEventListener('lw-session-expired',()=>{logout();notice('Tu sesión terminó. Ingresa nuevamente con tu segundo factor.','warning');});
window.addEventListener('lw-idle-setting',e=>setIdle(e.detail));
function expired(){return Date.now()-Math.max(lastActivity,readActivity())>=idleMinutes*60000;}
async function inactivityCheck(){
 if($('dashboard').hidden)return;
 if(expired()){await logout();notice('Tu sesión se cerró por '+idleMinutes+' minutos de inactividad.','warning');}
}
function humanActivity(){
 if($('dashboard').hidden||signingOut)return;
 if(expired()){inactivityCheck();return;}
 const now=Date.now();lastActivity=now;
 if(now-lastWrite>=1000){lastWrite=now;saveActivity(now);}
 if(now-lastTouch>=30000){lastTouch=now;manager.touch().then(r=>setIdle(r.idle_minutes)).catch(()=>{});}
}
for(const event of ['pointerdown','keydown','touchstart','scroll','mousemove'])document.addEventListener(event,humanActivity,{passive:true});
window.addEventListener('storage',e=>{if(activityKey&&e.key===activityKey&&e.newValue)lastActivity=Math.max(lastActivity,Number(e.newValue)||0);});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)inactivityCheck();});
setInterval(inactivityCheck,5000);
async function openDashboard(){
 const {data:{user},error}=await db.auth.getUser();if(error)throw error;if(!user)throw Object.assign(Error('Tu sesión ya no es válida.'),{status:401});
 const context=await manager.init();if(!context)throw Error('No se pudo cargar tu perfil.');
 const {data:{session}}=await db.auth.getSession();
 let sid;try{sid=JSON.parse(atob(session.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).session_id;}catch{throw Error('Sesión inválida.');}
 activityKey='lw-monitor-activity-'+sid;setIdle(context.idle_minutes);
 lastActivity=Math.max(readActivity(),Date.parse(context.last_activity)||0);
 if(!lastActivity||expired()){await logout();notice('Tu sesión terminó por inactividad. Inicia sesión nuevamente.','warning');return;}
 saveActivity(lastActivity);lastTouch=Date.now();screen('dashboard');$('identity').textContent=user.email||'';
 await refresh();clearInterval(poll);poll=setInterval(refresh,30000);
}
$('retry-session').onclick=()=>restoreSession();
async function restoreSession(){
 $('retry-session').hidden=true;
 try{
  const {data:{session},error}=await db.auth.getSession();if(error)throw error;if(!session)return;
  const {data,error:ae}=await db.auth.mfa.getAuthenticatorAssuranceLevel();if(ae)throw ae;
  if(data.currentLevel!=='aal2'){await setupMfa();return;}
  await openDashboard();
 }catch(error){if(error.status===401){await logout();notice('Tu sesión terminó. Vuelve a ingresar.','warning');}else{screen('login');$('retry-session').hidden=false;notice('No se pudo comprobar tu sesión. Puedes reintentar sin cerrar la sesión guardada. '+(error.message||''),'error');}}
}
function mfaQrImage(value){
 // El SDK puede entregar una data URL; no envolverla por segunda vez.
 let svg=typeof value==='string'?value.trim():'';
 if(/^data:image\/svg\+xml(?:;[^,]*)?,/i.test(svg)){
  const comma=svg.indexOf(',');
  if(/;base64$/i.test(svg.slice(0,comma)))return svg;
  const payload=svg.slice(comma+1);
  svg=payload.trimStart().startsWith('<')?payload:decodeURIComponent(payload);
 }
 // Supabase usa SVGo: puede incluir declaración XML y comentarios antes de <svg>.
 if(!/^(?:<\?xml[\s\S]*?\?>\s*|<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(svg.trim()))throw new Error('invalid_qr_format');
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
async function setupMfa(){
 const {data,error}=await db.auth.mfa.listFactors();if(error)throw error;
 const verified=data.totp.find(f=>f.status==='verified');
 $('enrollment').hidden=!!verified;
 if(verified)factor=verified.id;
 else{
  // Retira factores incompletos propios antes de iniciar una nueva inscripción.
  for(const f of (data.all || []).filter(f=>f.factor_type==='totp'&&f.status==='unverified'&&f.friendly_name==='LinkWich-IT')){const {error}=await db.auth.mfa.unenroll({factorId:f.id});if(error)throw error;}
  const {data:enrolled,error}=await db.auth.mfa.enroll({factorType:'totp',friendlyName:'LinkWich-IT',issuer:'LinkWich-IT'});if(error)throw error;
  factor=enrolled.id;$('totp-secret').textContent=enrolled.totp.secret;
  try{$('qr').src=mfaQrImage(enrolled.totp.qr_code);$('qr').hidden=false;}
  catch{$('qr').removeAttribute('src');$('qr').hidden=true;}
 }
 $('mfa-help').textContent=verified?'Escribe el código de tu aplicación autenticadora.':($('qr').hidden?'Abre «Configurar manualmente», agrega la clave en tu autenticador y escribe el código.':'Escanea el QR con tu aplicación autenticadora y escribe el código para activar la protección.');
 screen('mfa');$('otp').focus();
}
function loginFailure(error,stage){
 const raw=typeof error?.code==='string'?error.code:'';
 const code=/^[a-z0-9_]{1,80}$/.test(raw)?raw:'';
 const messages={
  invalid_credentials:'Supabase rechazó el correo o la contraseña. Comprueba que sean los del usuario de este proyecto.',
  email_not_confirmed:'El correo de esta cuenta aún no está confirmado en Supabase.',
  email_provider_disabled:'El acceso por correo está deshabilitado en Supabase.',
  over_request_rate_limit:'Se alcanzó el límite de solicitudes. Espera antes de volver a intentar.',
  over_email_send_rate_limit:'Se alcanzó el límite de correo de Supabase. Espera antes de volver a intentar.',
  mfa_totp_enroll_not_enabled:'El correo y contraseña fueron aceptados, pero la inscripción TOTP está deshabilitada en Supabase.',
  mfa_factor_name_conflict:'El correo y contraseña fueron aceptados, pero ya existe una inscripción con el mismo nombre. Revisa los factores MFA de esta cuenta.',
  too_many_enrolled_mfa_factors:'El correo y contraseña fueron aceptados, pero esta cuenta alcanzó el límite de factores MFA.'
 };
 const base=messages[code] || (stage==='mfa'
  ? 'El correo y contraseña fueron aceptados, pero no se pudo preparar el segundo factor.'
  : 'No se pudo completar la conexión de acceso con Supabase. Revisa Red y Consola del navegador.');
 // Sólo código y estado; jamás registrar contraseñas, sesiones ni el objeto de error completo.
 const status=Number.isInteger(error?.status)?error.status:null;
 console.warn('[LinkWich acceso]',{etapa:stage,codigo:code||'sin_codigo',estado:status});
 return base+(code?' Código: '+code+'.':'');
}
$('login-form').onsubmit=async e=>{
 e.preventDefault();notice();const button=e.submitter;button.disabled=true;setBusy(button,true);
 let stage='login';
 try{
  if(!db){notice('El navegador no cargó una configuración válida de Supabase. Comprueba config.js y recarga con Ctrl + F5.','error');return;}
  notice('Conectando con Supabase…');
  const {error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});
  $('password').value='';if(error)throw error;
  stage='mfa';notice('Acceso aceptado. Preparando verificación en dos pasos…');
  await setupMfa();notice();
 }catch(error){notice(loginFailure(error,stage),'error');}
 finally{button.disabled=false;setBusy(button,false);}
};
$('mfa-form').onsubmit=async e=>{
 e.preventDefault();notice();e.submitter.disabled=true;setBusy(e.submitter,true);
 try{
  const {error}=await db.auth.mfa.challengeAndVerify({factorId:factor,code:$('otp').value});if(error)throw error;
  $('otp').value='';$('enrollment').hidden=true;$('qr').removeAttribute('src');$('totp-secret').textContent='';
  const {data,error:ae}=await db.auth.mfa.getAuthenticatorAssuranceLevel();if(ae||data.currentLevel!=='aal2')throw Error('MFA');
  await openDashboard();
 }catch(error){notice('No se pudo completar el acceso: '+(error.message||'revisa el código y la configuración de portal-admin.'),'error');}
 finally{e.submitter.disabled=false;setBusy(e.submitter,false);}
};
function setDashboardBusy(active){
 for(const id of ['refresh','metric-total','metric-online','metric-attention','installations','events','incident-chart'])setBusy($(id),active);
 for(const card of $('installations').querySelectorAll('.installation'))setBusy(card,active);
}
function historyOptions(rows){
 const filter=$('history-site-filter');filter.replaceChildren(new Option('Todos los sitios visibles',''));
 for(const row of rows)filter.add(new Option(row.name,row.id));
 if(!rows.some(row=>row.id===historySite))historySite='';filter.value=historySite;
}
async function updateChart(generation,visibleRows){
 const days=Number($('history-period').value)||30,tenant=manager.currentTenant(),ids=(historySite?visibleRows.filter(i=>i.id===historySite):visibleRows).map(i=>i.id).sort();const key=JSON.stringify([tenant,ids,days]);
 try{
  let rows;
  if(chartCache?.key===key&&Date.now()-chartCache.at<60000)rows=chartCache.rows;
  else{const result=await db.rpc('lw_incident_daily_filtered',{p_tenant:tenant||null,p_sites:ids,p_days:days});if(result.error)throw Error('No se pudo consultar la gráfica. Comprueba que instalaste el SQL 08 de búsqueda y filtros.');rows=result.data||[];if(generation===epoch)chartCache={key,at:Date.now(),rows};}
  if(generation!==epoch)return;renderChart($('incident-chart'),rows);renderChartTable($('chart-data'),rows);
 }catch(error){if(generation===epoch){$('incident-chart').replaceChildren(noticeElement(error.message));$('chart-data').replaceChildren();}}
 finally{if(generation===epoch)setBusy($('incident-chart'),false);}
}
async function refresh(){
 if($('dashboard').hidden||manager?.mustChange()||!manager?.isOverview())return;if(loading){refreshAgain=true;return;}
 loading=true;const generation=epoch;setDashboardBusy(true);$('refresh').disabled=true;
 try{
  const security=await manager.checkSession();setIdle(security.idle_minutes);if(generation!==epoch||$('dashboard').hidden)return;if(expired()){await inactivityCheck();return;}
  const a=await db.from('lw_installations').select('id,tenant_id,name,paused,created_at,last_seen,app_ok,license_ok,timeout_seconds,license_summary,license_received_at').order('name');
  if(generation!==epoch)return;if(a.error)throw Error('fetch');
  const clientRows=(a.data||[]).filter(i=>!manager.currentTenant()||i.tenant_id===manager.currentTenant());
  const rows=clientRows.filter(i=>matchesSiteStatus(i,$('site-status-filter').value)&&matchesSearch(manager.currentQuery(),i.name,i.id,manager.tenantName(i.tenant_id))),states=rows.map(state);historyOptions(rows);
  $('site-result-count').textContent=rows.length+' de '+clientRows.length+' sitios coinciden con los filtros';
  $('total').textContent=rows.length;$('online').textContent=states.filter(s=>s==='online').length;$('attention').textContent=states.filter(s=>['app_down','unreachable'].includes(s)).length;
  for(const id of ['metric-total','metric-online','metric-attention'])setBusy($(id),false);
  $('installations').replaceChildren();
  if(!rows.length)$('installations').append(node('p','No hay sitios que coincidan con los filtros. Prueba a limpiar la búsqueda.','muted'));
  for(const [ix,i]of rows.entries()){
   const status=states[ix],[cls,symbol]=statusStyles[status]||statusStyles.pending;
   const card=node('article','','panel installation status-'+status);card.append(node('p',manager.tenantName(i.tenant_id),'small muted'));
   const heading=node('div','','site-heading');heading.append(icon('server'),node('h3',i.name));const badge=node('span',names[status],'badge '+cls);badge.prepend(icon(symbol));
   card.append(heading,badge);renderSiteDetails(card,i,status,date);renderLicense(card,i,status);$('installations').append(card);
  }
  setBusy($('installations'),false);
  const scoped=historySite?rows.filter(i=>i.id===historySite):rows;
  const historyPromise=(async()=>{
   try{
    const b=scoped.length?await db.from('lw_events').select('id,installation_id,state,created_at').in('installation_id',scoped.map(i=>i.id)).gte('created_at',new Date(Date.now()-(Number($('history-period').value)||30)*86400000).toISOString()).order('created_at',{ascending:false}).limit(20):{data:[],error:null};
    if(generation!==epoch)return;if(b.error)throw Error('fetch');
    const lookup=Object.fromEntries(rows.map(i=>[i.id,i.name]));$('events').replaceChildren();
    for(const e of b.data||[]){const item=node('div','','event event-'+e.state),title=node('div','','event-title');title.append(icon((statusStyles[e.state]||statusStyles.pending)[1]),node('span',(lookup[e.installation_id]||'Instalación')+' · '+(names[e.state]||e.state)));item.append(title,node('time',date(e.created_at)));$('events').append(item);}
    if(!b.data?.length)$('events').append(node('p','Aún no hay cambios registrados en el periodo.','muted small'));
   }catch{if(generation===epoch)$('events').replaceChildren(noticeElement('No se pudo actualizar el historial.'));}
   finally{if(generation===epoch)setBusy($('events'),false);}
  })();
  await Promise.allSettled([historyPromise,updateChart(generation,rows)]);
  if(generation!==epoch)return;$('updated').textContent='Actualizado '+new Date().toLocaleTimeString();notice();
 }catch{
  if(generation!==epoch)return;$('installations').replaceChildren(noticeElement('No se puede confirmar el estado actual.'));$('events').replaceChildren();$('incident-chart').replaceChildren(noticeElement('Sin datos actualizados.'));
  for(const id of ['total','online','attention'])$(id).textContent='—';$('updated').textContent='Sin datos actualizados';notice('No fue posible consultar el servicio. Reintenta o vuelve a iniciar sesión.','error');
 }finally{loading=false;if(generation===epoch){setDashboardBusy(false);$('refresh').disabled=false;if(refreshAgain){refreshAgain=false;queueMicrotask(refresh);}}}
}
window.addEventListener('lw-filters-cleared',()=>{historySite='';chartCache=null;$('history-site-filter').value='';$('history-period').value='30';});
$('history-site-filter').onchange=()=>{historySite=$('history-site-filter').value;chartCache=null;refresh();};
$('history-period').onchange=()=>{chartCache=null;refresh();};
decorateStatic();for(const[id,name]of [['metric-total-icon','server'],['metric-online-icon','check'],['metric-attention-icon','alert'],['chart-icon','activity'],['events-icon','clock']])$(id).append(icon(name));
$('refresh').onclick=()=>manager?.refreshActive();
if(!/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(SUPABASE_URL)||SUPABASE_PUBLISHABLE_KEY.startsWith('REEMPLAZAR'))notice('El portal está pendiente de configuración por LinkWich-IT.','warning');
else {db=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,storageKey:'lw-monitor-'+SUPABASE_URL.split('//')[1].split('.')[0]+'-auth',autoRefreshToken:true,detectSessionInUrl:false}});manager=createManagement({db,baseUrl:SUPABASE_URL,publishableKey:SUPABASE_PUBLISHABLE_KEY,notice,logout,onTenantChange:refresh});db.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')setTimeout(()=>logout(false),0);});restoreSession();}
