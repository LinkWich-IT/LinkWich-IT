import {mountPersonalHistory} from './personal-history.js?v=delete-1';
import {emailCopies} from './email-copies.js?v=copies-1';
import {renderNotice,noticeElement} from './notices.js?v=visible-1';
import {matchesSearch,matchesSiteStatus,monitoringBadge} from './search.js?v=filters-1';
import {icon,buttonIcon,setBusy} from './visuals.js?v=filters-1';
// No contiene claves privadas. Todas las operaciones se autorizan en portal-admin.
export function createManagement({db,baseUrl,publishableKey,notice,logout,onTenantChange}) {
 let securityPage=1;
 const $=id=>document.getElementById(id);
 const el=(tag,text='',cls='')=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;};
 let ctx=null,tenants=[],users=[],page=1,hasMore=false,version=0,selected='',view='overview',credentialTimer,adminTab='clients',query='',loadSeq=0,auditPage=1,userStatus='',userRole='',auditAction='',auditDays=90;
 const root=$('management-view'),profileRoot=$('profile-view');
 async function api(action,values={}){
  const {data:{session}}=await db.auth.getSession();if(!session)throw Error('Tu sesión terminó. Vuelve a ingresar.');
  const response=await fetch(baseUrl+'/functions/v1/portal-admin',{
   method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token,'apikey':publishableKey},
   body:JSON.stringify({action,...values}),cache:'no-store',signal:AbortSignal.timeout(30000),
  });
  const data=await response.json().catch(()=>({error:'Respuesta no válida. Comprueba que portal-admin esté desplegada.'}));
  if(!response.ok){const error=Error(data.error||'No fue posible completar la operación.');error.status=response.status;if(response.status===401&&action!=='session_end')window.dispatchEvent(new CustomEvent('lw-session-expired'));throw error;}return data;
 }
 const canManage=t=>ctx?.global_admin||ctx?.memberships?.some(m=>m.tenant_id===t&&m.role==='client_admin');
 const button=(text,action,cls='subtle')=>{const b=el('button',text,cls);b.type='button';const symbol=/autenticador/i.test(text)?'shield':/contraseña|credencial/i.test(text)?'key':/usuario|perfil/i.test(text)?'user':/cliente/i.test(text)?'users':/sitio/i.test(text)?'server':/inactividad|seguridad|administración/i.test(text)?'settings':/actividad|disponibilidad/i.test(text)?'activity':null;if(symbol)buttonIcon(b,symbol);b.onclick=async()=>{b.disabled=true;setBusy(b,true);try{await action();}catch(e){status(e.message);}finally{b.disabled=false;setBusy(b,false);}};return b;};
 function status(message='',kind='error'){notice(message,kind);}
 function setView(next){
  if(ctx?.profile.must_change_password)next='profile';
  view=next;$('portal-filters').hidden=next==='profile';updateFilterScope();for(const name of ['overview','management','profile'])$(name+'-view').hidden=name!==next;
  for(const b of $('portal-nav').querySelectorAll('button'))b.setAttribute('aria-current',String(b.dataset.view===next));
 }
 function syncFilter(){
  const filter=$('tenant-filter');filter.replaceChildren(new Option(ctx.global_admin?'Todos los clientes':'Todos mis sitios',''));
  for(const t of tenants)filter.add(new Option(t.name,t.id));
  if(!tenants.some(t=>t.id===selected))selected='';filter.value=selected;
  filter.onchange=()=>{selected=filter.value;filtersChanged();};
 }
 function nav(){
  const n=$('portal-nav');n.replaceChildren();
  const entries=[['overview','Disponibilidad'],...(ctx.global_admin||ctx.memberships.some(m=>m.role==='client_admin')?[['management',ctx.global_admin?'Administración':'Gestionar sitios']]:[]),['profile','Mi perfil']];
  for(const [id,label] of entries){const b=button(label,async()=>{setView(id);if(id==='management')await load();if(id==='profile')renderProfile();if(id==='overview')onTenantChange();});b.dataset.view=id;n.append(b);}
  const tutorial=el('a','','subtle portal-tutorial');
  tutorial.href='https://linkwich-it.github.io/LinkWich-Tutorial/';
  tutorial.target='_blank';tutorial.rel='noopener noreferrer';
  tutorial.setAttribute('aria-label','Base de conocimiento de LinkWich-Monitor (abre en otra pestaña)');
  const book=document.createElementNS('http://www.w3.org/2000/svg','svg');
  book.setAttribute('viewBox','0 0 24 24');book.setAttribute('fill','none');book.setAttribute('stroke','currentColor');book.setAttribute('stroke-width','1.8');book.setAttribute('stroke-linecap','round');book.setAttribute('stroke-linejoin','round');book.setAttribute('aria-hidden','true');book.classList.add('icon');
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M12 7v14M3 3h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v17h-5a4 4 0 0 0-4 1 4 4 0 0 0-4-1H3z');book.append(path);
  tutorial.title='Base de conocimiento — LinkWich-Monitor';
  tutorial.append(book,el('span','Base de conocimiento'));n.append(tutorial);
  setView(view);
 }
 function updateFilterScope(){
  const siteContext=view==='overview'||(view==='management'&&adminTab==='sites');
  $('global-site-status').hidden=!siteContext;
  $('filter-scope').textContent=view==='management'&&adminTab==='security'?'La seguridad es una configuración global. Los filtros se conservan para las otras pestañas.':'Cliente y búsqueda se aplican a la pestaña visible. El estado sólo filtra sitios; Usuarios y Actividad tienen filtros adicionales. Pulsa Aplicar filtros o Enter para buscar.';
 }
 function filtersChanged(){page=1;auditPage=1;securityPage=1;onTenantChange();if(view==='management')load();}
 $('portal-filters').onsubmit=event=>{event.preventDefault();query=$('portal-search').value.trim();filtersChanged();};
 $('site-status-filter').onchange=()=>filtersChanged();
 $('clear-portal-filters').onclick=()=>{query='';selected='';page=1;auditPage=1;userStatus='';userRole='';auditAction='';auditDays=90;$('portal-search').value='';$('tenant-filter').value='';$('site-status-filter').value='';window.dispatchEvent(new CustomEvent('lw-filters-cleared'));filtersChanged();};
 function control(panel,label,options,value,changed){const wrap=el('div');const l=el('label',label),select=el('select');select.id='filter-'+label.toLowerCase().replace(/[^a-z0-9]/g,'-');l.htmlFor=select.id;for(const[v,t]of options)select.add(new Option(t,v));select.value=value;select.onchange=()=>{changed(select.value);load();};wrap.append(l,select);panel.append(wrap);return select;}
 function count(panel,total,label='resultados'){panel.append(el('p',total+' '+label,'small muted result-count'));}
 function pager(panel,current,more,change,total){const n=el('div','','form-actions');if(current>1)n.append(button('Página anterior',()=>change(current-1)));n.append(el('span','Página '+current+(Number.isFinite(total)?' · '+total+' resultados':''),'small muted'));if(more)n.append(button('Página siguiente',()=>change(current+1)));panel.append(n);}
 async function init(){
  const generation=version;const fresh=await api('context');if(generation!==version)return;
  ctx=fresh;
  // Las cuentas temporales solo pueden cargar su perfil hasta cambiar la contraseña.
  tenants=ctx.profile.must_change_password?[]:(await api('tenants_list')).rows;if(generation!==version)return;
  nav();renderProfile();
  syncFilter();
  $('account-role').textContent=ctx.profile.must_change_password?'Cambio de contraseña requerido':ctx.global_admin?'Administrador general':ctx.memberships.some(m=>m.role==='client_admin')?'Administrador de cliente':'Usuario de consulta';
  if(ctx.profile.must_change_password){setView('profile');notice('Cambia tu contraseña temporal para acceder a tus instalaciones.','warning');}
  return ctx;
 }
 function form(title,fields,onSave,help='',danger=false){
  const dlg=el('dialog','','edit-dialog');const f=el('form');const h=el('h2',title);f.append(h);
  if(help)f.append(el('p',help,danger?'delete-confirmation':'muted'));
  const inputs={};
  for(const spec of fields){
   if(spec.type==='email-list'){const control=emailCopies(spec.value,inputs.alert_email);inputs[spec.name]=control.input;f.append(control.element);continue;}
   const label=el('label',spec.label);const input=el(spec.type==='select'?'select':spec.type==='textarea'?'textarea':'input');
   input.id='field-'+spec.name;label.htmlFor=input.id;input.name=spec.name;
   if(spec.type==='select'){for(const [value,text] of spec.options)input.add(new Option(text,value));}
   else if(spec.type!=='textarea')input.type=spec.type||'text';
   if(spec.type==='checkbox')input.checked=!!spec.value;else input.value=spec.value??'';
   if(spec.type==='password'){input.minLength=spec.name==='current_password'?1:12;input.maxLength=128;input.autocomplete=spec.name==='current_password'?'current-password':'new-password';}
   if(spec.min!==undefined)input.min=spec.min;if(spec.max!==undefined)input.max=spec.max;
   input.required=spec.required!==false&&spec.type!=='checkbox';
   if(spec.type==='textarea')input.rows=3;
   inputs[spec.name]=input;f.append(label,input);
  }
  const error=el('p','','form-error');error.setAttribute('role','alert');const actions=el('div','','form-actions');
  const save=el('button',danger?'Eliminar definitivamente':'Guardar',danger?'subtle danger-action':'primary');save.type='submit';
  const cancel=button('Cancelar',()=>dlg.close());actions.append(cancel,save);f.append(error,actions);dlg.append(f);document.body.append(dlg);
  dlg.addEventListener('close',()=>{for(const input of Object.values(inputs))input.value='';dlg.remove();},{once:true});
  f.onsubmit=async event=>{event.preventDefault();save.disabled=true;cancel.disabled=true;setBusy(save,true,'Guardando');renderNotice(error);const generation=version;
   try{
    const values=Object.fromEntries(fields.map(s=>[s.name,s.type==='checkbox'?inputs[s.name].checked:s.type==='number'?Number(inputs[s.name].value):inputs[s.name].value]));
    const output=await onSave(values);if(generation!==version)return;
    dlg.close();if(output?.relogin){await logout();notice('Contraseña actualizada. Ingresa de nuevo con tu nueva contraseña y segundo factor.','success');return;}
    if(output?.token)credentials(output);
    if(view==='management')await load();else if(view==='profile'){await init();renderProfile();}
   }catch(e){if(generation===version)renderNotice(error,e.message,'error');}finally{save.disabled=false;cancel.disabled=false;setBusy(save,false);}
  };
  dlg.addEventListener('cancel',event=>{if(save.disabled)event.preventDefault();});
  dlg.showModal();inputs[fields[0]?.name]?.focus();
 }
 function credentials(data){
  const dlg=el('dialog','','edit-dialog credential-dialog');dlg.append(el('h2','Credencial exclusiva del sitio'));
  dlg.append(el('p','Copia estos datos ahora. La credencial se muestra una sola vez; se oculta al cerrar esta ventana o después de dos minutos.','muted'));
  for(const [label,value] of [['Endpoint',data.endpoint],['ID de instalación',data.id],['Credencial del agente',data.token]]){
   const l=el('label',label);const input=el('input');input.readOnly=true;input.value=value;input.autocomplete='off';dlg.append(l,input);
  }
  dlg.append(el('p',data.paused?'El sitio se creó PAUSADO. Introduce los datos en Monitoreo externo de esa instalación, guarda la configuración y después activa el sitio desde este panel.':'La credencial anterior dejó de funcionar. Actualiza la configuración de Monitoreo externo del sitio con esta nueva credencial.','small'));
  dlg.append(button('Cerrar y ocultar',()=>dlg.close()));document.body.append(dlg);dlg.showModal();
  clearTimeout(credentialTimer);credentialTimer=setTimeout(()=>dlg.close(),120000);
  dlg.addEventListener('close',()=>{clearTimeout(credentialTimer);for(const i of dlg.querySelectorAll('input'))i.value='';data.token='';dlg.remove();},{once:true});
 }
 const tenantOptions=()=>tenants.map(t=>[t.id,t.name]);
 function editTenant(t){
  form(t?'Editar cliente y alertas':'Crear cliente',[
   {name:'name',label:'Nombre del cliente / ecosistema',value:t?.name},
   {name:'alert_email',label:'Destinatario principal de alertas',type:'email',value:t?.alert_email},
   {name:'alert_cc',label:'Copias de alertas',type:'email-list',required:false,value:t?.alert_cc?.join('\n')||''},
   {name:'alert_timezone',label:'Zona horaria',value:t?.alert_timezone||'America/Mazatlan'},
  ],v=>api('tenant_save',{...v,id:t?.id,alert_cc:v.alert_cc.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean)}),
  'Los avisos de todos los sitios de este cliente se enviarán al destinatario principal y a las copias que añadas. Máximo: 1 principal y 3 copias.');
 }
 function newSite(){form('Añadir sitio',[
  {name:'tenant_id',label:'Cliente / ecosistema',type:'select',options:tenantOptions().filter(([id])=>canManage(id))},
  {name:'name',label:'Nombre del sitio (ej. Oficina Los Cabos)'},
 ],v=>api('site_create',v),'Cada sitio corresponde a una instalación de LinkWich-Monitor. Se creará pausado con una credencial exclusiva.');}
 function editSite(s){form('Editar sitio',[
  {name:'name',label:'Nombre',value:s.name},
  {name:'timeout_seconds',label:'Detectar ausencia de señales después de (segundos)',type:'number',value:s.timeout_seconds,min:180,max:3600},
  {name:'paused',label:'Monitoreo pausado (no genera alertas de caída)',type:'checkbox',value:s.paused},
 ],v=>api('site_save',{id:s.id,...v}));}
 async function rotateSite(s){
  form('Renovar credencial del sitio',[{name:'confirm',label:'Escribe RENOVAR para confirmar'}],async v=>{
   if(v.confirm!=='RENOVAR')throw Error('Escribe RENOVAR exactamente.');return api('site_rotate',{id:s.id});
  },'La credencial anterior dejará de funcionar para '+s.name+'. Tendrás que actualizarla en la configuración on-premise de ese sitio.');
 }
 function membership(u,m){form('Asignar acceso a un cliente',[
  {name:'tenant_id',label:'Cliente',type:'select',options:tenantOptions(),value:m?.tenant_id},
  {name:'role',label:'Perfil dentro de ese cliente',type:'select',options:[['viewer','Consulta'],['client_admin','Administrador del cliente']],value:m?.role||'viewer'},
  {name:'active',label:'Acceso habilitado a este cliente',type:'checkbox',value:m?m.active:true},
 ],v=>api('membership_save',{user_id:u.id,...v}),'Un usuario puede pertenecer a varios clientes mediante asignaciones separadas.');}
 function newUser(){form('Crear usuario',[
  {name:'display_name',label:'Nombre de la persona'}, {name:'email',label:'Correo de acceso',type:'email'},
  {name:'password',label:'Contraseña temporal (mínimo 12 caracteres)',type:'password'},
  {name:'tenant_id',label:'Cliente',type:'select',options:tenantOptions()},
  {name:'role',label:'Perfil',type:'select',options:[['viewer','Consulta'],['client_admin','Administrador del cliente']]},
 ],v=>api('user_create',v),'No se envía un correo de invitación en esta versión. Entrega el acceso por un canal privado. Al entrar deberá configurar MFA y cambiar su contraseña temporal.');}
 function setLoginBlock(u,blocked){form(blocked?'Bloquear acceso':'Desbloquear acceso',[
  {name:'confirm',label:'Confirmo '+(blocked?'el bloqueo':'el desbloqueo')+' de esta cuenta',type:'checkbox'},
 ],async v=>{if(!v.confirm)throw Error('Marca la confirmación para continuar.');const r=await api('login_security_set',{id:u.id,blocked});notice(blocked?'Acceso bloqueado. Sus sitios seguirán siendo monitoreados.':'Acceso desbloqueado y contador reiniciado. El usuario puede iniciar sesión con su contraseña y MFA.','success');return r;},
 'Cuenta: '+u.email+'. Se cerrarán sus sesiones del portal. No cambia su contraseña, MFA ni el monitoreo de sus sitios. Para acceder, la cuenta también debe estar habilitada.');}
 async function renderLoginSecurity(panel,generation,loadId){
  const title=el('h3','Actividad de acceso');panel.append(title,el('p','Contraseñas incorrectas, accesos completados y bloqueos de los últimos 90 días. La contraseña aceptada aún requiere MFA.','small muted'));
  const history=await api('login_security_events',{query,page:securityPage});if(generation!==version||loadId!==loadSeq)return;
  const list=el('div','','audit-list');
  const labels={'password.failed':'Contraseña incorrecta','password.accepted':'Contraseña aceptada; MFA pendiente','access.completed':'Acceso al portal completado','access.auto_blocked':'Bloqueo automático por 3 fallos','access.manual_blocked':'Acceso bloqueado por administrador','access.unblocked':'Acceso desbloqueado por administrador','access.recovered':'Administrador recuperado desde Supabase','access.rejected_blocked':'Intento rechazado: cuenta bloqueada (registro agrupado por hora)'};
  for(const row of history.rows){const item=el('p','','audit-line');item.append(el('strong',labels[row.event]||row.event),el('span',' · '+(row.display_name||row.email||'Cuenta eliminada')+' · '+new Date(row.created_at).toLocaleString()+(row.failures?' · Intento '+row.failures+'/3':'')+(row.actor_email?' · Administrador: '+row.actor_email:'')));list.append(item);}
  if(!history.rows.length)list.append(el('p','No hay eventos de acceso que coincidan con la búsqueda.','muted'));
  panel.append(list);pager(panel,securityPage,history.has_more,async next=>{securityPage=next;await load();},history.total);
  panel.append(el('p','La búsqueda se aplica por nombre o correo a todos los clientes. El filtro de ecosistema no limita este registro global.','small muted'));
 }
 function deleteResource(kind,row){
  if(!ctx?.global_admin)throw Error('Solo el administrador global puede eliminar.');
  const expected=kind==='user'?row.email:row.name,generation=version;
  const titles={user:'Eliminar usuario',site:'Eliminar sitio',tenant:'Eliminar cliente'};
  const help={user:'Se eliminará la cuenta del portal y sus accesos. Los sitios y clientes se conservarán. La acción quedará en auditoría. No se puede deshacer.',site:'Se eliminarán este sitio, su credencial, su historial de disponibilidad y los correos asociados en la cola. El aplicativo on-premise seguirá funcionando, pero no podrá enviar señales con esta credencial. Los correos que ya estén en procesamiento podrían enviarse. No se puede deshacer.',tenant:'Solo puedes eliminarlo cuando no tenga sitios. Primero transfiérelos o elimínalos. Se retirarán las vinculaciones de usuarios a este cliente, conservando sus cuentas. La acción y el nombre del cliente quedarán en auditoría. No se puede deshacer.'};
  form(titles[kind],[
   {name:'confirmation',label:'Escribe exactamente '+(kind==='user'?'el correo: ':'el nombre: ')+expected,type:kind==='user'?'email':'text'},
   {name:'acknowledge',label:'Entiendo que esta eliminación es permanente',type:'checkbox'},
  ],async v=>{
   if(!v.acknowledge)throw Error('Debes confirmar que entiendes la eliminación.');
   const match=kind==='user'?v.confirmation.trim().toLowerCase()===expected.toLowerCase():v.confirmation.trim()===expected;
   if(!match)throw Error('La confirmación no coincide.');
   const r=await api(kind+'_delete',{id:row.id,confirmation:v.confirmation,confirmed:true});if(generation===version)notice(titles[kind]+': operación completada y registrada en auditoría.','success');return r;
  },help[kind],true);
 }
 function editUser(u){form('Editar usuario',[
  {name:'display_name',label:'Nombre',value:u.profile.display_name||u.email},
  {name:'active',label:'Cuenta habilitada en el portal',type:'checkbox',value:u.profile.active},
 ],v=>api('user_save',{id:u.id,...v}),'Deshabilitar la cuenta bloquea su acceso al portal, sin detener el monitoreo ni los correos del cliente.');}
 function resetUser(u){form('Establecer contraseña temporal',[
  {name:'password',label:'Nueva contraseña temporal',type:'password'},
 ],v=>api('password_admin',{id:u.id,...v}),'Cuenta: '+u.email+'. Entrega la contraseña por un canal privado. El usuario conservará su segundo factor y deberá cambiar esta contraseña al acceder.');}
 function transferSite(s){form('Transferir sitio a otro cliente',[
  {name:'tenant_id',label:'Cliente destino',type:'select',options:tenantOptions().filter(([id])=>id!==s.tenant_id)},
  {name:'confirm',label:'Confirmo que el nuevo cliente debe ver este sitio y TODO su historial',type:'checkbox',value:false},
  {name:'cancel_pending',label:'Cancelar avisos aún pendientes para los contactos del cliente anterior',type:'checkbox',value:false},
 ],v=>api('site_transfer',{id:s.id,...v}),'Sitio: '+s.name+'. Conserva ID y credencial; no debes cambiar on-premise. Los correos ya enviados no se pueden retirar. Si hay avisos en procesamiento, espera a que termine el envío.');}
 function resetMfa(u){form('Reiniciar autenticador del usuario',[
  {name:'confirm_email',label:'Escribe el correo del usuario para confirmar',type:'email'},
  {name:'reason',label:'Motivo de la recuperación'},
  {name:'identity_verified',label:'Verifiqué la identidad de la persona por un canal confiable',type:'checkbox',value:false},
  {name:'current_password',label:'Tu contraseña de administrador',type:'password'},
 ],async v=>{const r=await api('mfa_reset',{id:u.id,...v});notice(r.message,'success');return r;},
 'Cuenta: '+u.email+'. Se eliminará su autenticador TOTP y se cerrarán sus sesiones. Al ingresar con su correo y contraseña verá un QR NUEVO para registrar en su teléfono. No cambia su contraseña. El QR anterior no se recupera ni se muestra al administrador.');}
 function editIdle(){form('Tiempo de cierre por inactividad',[
  {name:'idle_minutes',label:'Minutos sin interacción (5 a 1440)',type:'number',value:ctx.idle_minutes||15,min:5,max:1440},
 ],async v=>{const r=await api('settings_save',v);ctx.idle_minutes=r.idle_minutes;window.dispatchEvent(new CustomEvent('lw-idle-setting',{detail:r.idle_minutes}));return r;},
 'Aplica a todos los usuarios. Recargar la página y actualizar datos automáticamente NO cuentan como actividad. Si reduces el tiempo, las sesiones que ya lo excedan finalizarán.');}
 function chooseAdminTab(key){adminTab=key;updateFilterScope();for(const panel of root.querySelectorAll('[data-admin-section]'))panel.hidden=panel.dataset.adminSection!==key;for(const b of root.querySelectorAll('[data-admin-tab]'))b.setAttribute('aria-current',String(b.dataset.adminTab===key));}
 function adminTabs(){const n=el('nav','','admin-subnav');n.setAttribute('aria-label','Administración');const tabs=[['clients','Clientes'],['sites','Sitios'],...(ctx.global_admin?[['users','Usuarios'],['security','Seguridad'],['audit','Actividad']]:[])];if(!tabs.some(([key])=>key===adminTab))adminTab='clients';for(const[key,label]of tabs){const b=button(label,async()=>{chooseAdminTab(key);await load();});b.dataset.adminTab=key;b.setAttribute('aria-current',String(key===adminTab));n.append(b);}root.append(n);}
 function section(title,help){const p=el('section','','panel admin-section');p.dataset.adminSection=title.startsWith('Clientes')?'clients':title.startsWith('Sitios')?'sites':title.startsWith('Usuarios')?'users':title.startsWith('Sesiones')?'security':'audit';p.hidden=p.dataset.adminSection!==adminTab;p.append(el('h2',title));if(help)p.append(el('p',help,'small muted'));root.append(p);return p;}
 function compactLists(){for(const p of root.querySelectorAll('.admin-section')){const rows=[...p.querySelectorAll(':scope > .admin-row')];if(rows.length){const list=el('div','','record-list');for(const row of rows)list.append(row);p.insertBefore(list,p.querySelector(':scope > .form-actions'));}}} 
 async function load(){
  status();const generation=version,loadId=++loadSeq;setBusy(root,true,'Cargando administración');for(const panel of root.querySelectorAll('.admin-section'))setBusy(panel,true);
  try{
   const fresh=await api('context');if(generation!==version||loadId!==loadSeq)return;ctx=fresh;nav();if(ctx.profile.must_change_password){renderProfile();return;}
   tenants=(await api('tenants_list')).rows;syncFilter();
   const sites=await db.from('lw_installations').select('id,tenant_id,name,paused,timeout_seconds,last_seen,created_at,app_ok').order('name');if(sites.error)throw Error('No se pudieron consultar los sitios.');
   if(generation!==version||loadId!==loadSeq)return;root.replaceChildren();
   const feedback=el('p','','form-error');feedback.id='management-notice';feedback.hidden=true;feedback.setAttribute('role','status');root.append(feedback);
   const heading=el('div','','section-label');heading.append(el('h2',ctx.global_admin?'Administración de LinkWich-IT':'Gestión de tu ecosistema'));root.append(heading);adminTabs();
   const tp=section('Clientes y destinatarios','Cada cliente tiene su propio conjunto de sitios y contactos de alertas. Los cambios de destinatarios aplican a eventos nuevos.');
   if(ctx.global_admin)tp.append(button('Crear cliente',()=>editTenant()));
   const filteredTenants=tenants.filter(t=>(!selected||t.id===selected)&&matchesSearch(query,t.name,t.id,t.alert_email,t.alert_cc||[],(sites.data||[]).filter(s=>s.tenant_id===t.id).map(s=>[s.name,s.id])));count(tp,filteredTenants.length,'clientes');
   for(const t of filteredTenants){
    const card=el('article','','admin-row');const info=el('div');info.append(el('strong',t.name),el('p','Alertas: '+t.alert_email,'small muted'),el('p','Copias: '+(t.alert_cc?.join(', ')||'Ninguna'),'small muted'));
    card.append(info);if(canManage(t.id))card.append(button('Editar cliente / correos',()=>editTenant(t)));if(ctx.global_admin)card.append(button('Eliminar cliente',()=>deleteResource('tenant',t),'subtle danger-action'));tp.append(card);
   }
   if(!filteredTenants.length)tp.append(el('p','No hay clientes que coincidan con los filtros.','muted'));
   const sp=section('Sitios de LinkWich-Monitor','Primero configura el agente del sitio; después quita la pausa para comenzar a recibir señales y alertas.');
   if(tenants.some(t=>canManage(t.id)))sp.append(button('Añadir sitio',()=>newSite()));
   const filteredSites=(sites.data||[]).filter(s=>(!selected||s.tenant_id===selected)&&matchesSiteStatus(s,$('site-status-filter').value)&&matchesSearch(query,s.name,s.id,tenants.find(t=>t.id===s.tenant_id)?.name));count(sp,filteredSites.length,'sitios');
   for(const s of filteredSites){
    const card=el('article','','admin-row');const info=el('div');info.append(el('strong',s.name),el('p',tenants.find(t=>t.id===s.tenant_id)?.name||'Cliente','small muted'),monitoringBadge(s.paused),el('code',s.id,'small'));card.append(info);
    if(canManage(s.tenant_id)){const actions=el('div','','row-actions');actions.append(button('Editar / activar',()=>editSite(s)),button('Renovar credencial',()=>rotateSite(s)));if(ctx.global_admin&&tenants.some(t=>t.id!==s.tenant_id))actions.append(button('Transferir a otro cliente',()=>transferSite(s)));if(ctx.global_admin)actions.append(button('Eliminar sitio',()=>deleteResource('site',s),'subtle danger-action'));card.append(actions);}sp.append(card);
   }
   if(!filteredSites.length)sp.append(el('p','No hay sitios que coincidan con los filtros.','muted'));
   if(ctx.global_admin){
    const settingsPanel=section('Sesiones y seguridad','Cierre por inactividad: '+(ctx.idle_minutes||15)+' minutos. La sesión se conserva al recargar mientras siga vigente.');settingsPanel.append(button('Configurar inactividad',()=>editIdle()));if(adminTab==='security')await renderLoginSecurity(settingsPanel,generation,loadId);
    const up=section('Usuarios y perfiles','Consulta: ve los sitios asignados. Administrador de cliente: también gestiona sus sitios y destinatarios.');setBusy(up,true,'Cargando usuarios');
    const userControls=el('div','','tab-filters');up.append(userControls);
    control(userControls,'Estado de cuenta',[['','Todos'],['active','Habilitada'],['disabled','Desactivada'],['temporary','Contraseña temporal'],['mfa_pending','Recuperación MFA pendiente']],userStatus,v=>{userStatus=v;page=1;});
    control(userControls,'Perfil de acceso',[['','Todos'],['global_admin','Administrador general'],['client_admin','Administrador de cliente'],['viewer','Consulta']],userRole,v=>{userRole=v;page=1;});
    const response=adminTab==='users'?await api('users_search',{page,query,tenant_id:selected||null,status:userStatus,role:userRole}):{rows:[],has_more:false,total:0};if(generation!==version||loadId!==loadSeq)return;users=response.rows;hasMore=response.has_more;
    if(tenants.length)up.append(button('Crear usuario',()=>newUser()));
    for(const u of users){
     const card=el('article','','admin-row');const info=el('div');info.append(el('strong',u.profile.display_name||u.email),el('p',u.email,'small muted'),el('span',u.login_security?.blocked?'Acceso bloqueado':u.global_admin?'Administrador general':u.profile.active?'Cuenta habilitada':'Cuenta desactivada','badge '+(u.login_security?.blocked?'bad':u.global_admin?'neutral':u.profile.active?'good':'bad')));
     if(u.login_security?.failures)info.append(el('p','Contraseñas incorrectas consecutivas: '+u.login_security.failures+'/3','small muted'));
     if(u.login_security?.blocked)info.append(el('p',u.login_security.reason==='attempts'?'Bloqueado por tres contraseñas incorrectas.':'Bloqueado por el administrador.','small muted'));
     if(u.profile.mfa_recovery_pending)info.append(noticeElement('Recuperación de autenticador pendiente: reintenta Reiniciar autenticador.','warning'));
     for(const m of u.memberships){const name=tenants.find(t=>t.id===m.tenant_id)?.name||m.tenant_id;info.append(el('p',name+' · '+(m.role==='client_admin'?'Administrador del cliente':'Consulta')+(m.active?'':' · Acceso desactivado'),'small muted'));}
     card.append(info);
     if(!u.global_admin&&u.id!==ctx.user.id){const acts=el('div','','row-actions');acts.append(button('Editar perfil',()=>editUser(u)),button('Asignar cliente',()=>membership(u)),button('Contraseña temporal',()=>resetUser(u)));
      acts.append(button('Reiniciar autenticador',()=>resetMfa(u)));
      acts.append(button(u.login_security?.blocked?'Desbloquear acceso':'Bloquear acceso',()=>setLoginBlock(u,!u.login_security?.blocked)));
      acts.append(button('Eliminar usuario',()=>deleteResource('user',u),'subtle danger-action'));
      for(const m of u.memberships)acts.append(button('Editar acceso: '+(tenants.find(t=>t.id===m.tenant_id)?.name||'cliente'),()=>membership(u,m)));card.append(acts);}up.append(card);
    }
    if(!users.length)up.append(el('p','No hay usuarios que coincidan con los filtros.','muted'));pager(up,page,hasMore,async next=>{page=next;await load();},response.total);setBusy(up,false);
    const ap=section('Actividad administrativa reciente','Acciones administrativas de los últimos 90 días. No almacena contraseñas ni credenciales.');setBusy(ap,true,'Cargando actividad');const auditControls=el('div','','tab-filters');ap.append(auditControls);
    control(auditControls,'Tipo de actividad',[['','Todas'],['tenant.','Clientes'],['site.','Sitios'],['user.','Usuarios'],['membership.','Accesos'],['password.','Contraseñas'],['mfa.','Autenticadores'],['settings.','Configuración'],['profile.','Perfiles']],auditAction,v=>{auditAction=v;auditPage=1;});
    control(auditControls,'Periodo de actividad',[['7','7 días'],['30','30 días'],['60','60 días'],['90','90 días']],String(auditDays),v=>{auditDays=Number(v);auditPage=1;});
    const history=adminTab==='audit'?await api('audit_search',{page:auditPage,query,tenant_id:selected||null,action_prefix:auditAction,days:auditDays}):{rows:[],has_more:false,total:0};if(generation!==version||loadId!==loadSeq)return;
    const auditList=el('div','','audit-list');ap.append(auditList);
    for(const a of history.rows){const actor=a.actor_email||a.actor_id||'Cuenta eliminada';auditList.append(el('p',new Date(a.created_at).toLocaleString()+' · '+actor+' · '+({'user.delete':'Usuario eliminado','user.delete.pending':'Eliminación de usuario pendiente de confirmar','user.delete.failed':'No se pudo eliminar el usuario','site.delete':'Sitio eliminado','tenant.delete':'Cliente eliminado'}[a.action]||a.action)+' · '+(a.deleted_name||a.tenant_name||a.target_id||''),'small audit-line'));}
    if(!history.rows.length)auditList.append(el('p','No hay actividad que coincida con los filtros.','muted'));
    pager(ap,auditPage,history.has_more,async next=>{auditPage=next;await load();},history.total);
   }
   compactLists();chooseAdminTab(adminTab);
  }catch(e){if(generation===version&&loadId===loadSeq)status(e.message);}finally{setBusy(root,false);for(const panel of root.querySelectorAll('.admin-section'))setBusy(panel,false);}
 }
 function renderProfile(){
  if(!ctx)return;profileRoot.replaceChildren();profileRoot.append(el('h2','Mi perfil'),el('p',ctx.user.email,'muted'),el('p',ctx.profile.display_name||'Sin nombre registrado'));
  if(ctx.profile.must_change_password)profileRoot.append(noticeElement('Tu contraseña es temporal. Cámbiala para acceder a tus sitios.','warning'));
  profileRoot.append(button('Editar mi nombre',()=>form('Mi nombre',[{name:'display_name',label:'Nombre',value:ctx.profile.display_name}],v=>api('profile_save',v))));
  profileRoot.append(button('Cambiar mi contraseña',()=>form('Cambiar contraseña',[
   {name:'current_password',label:'Contraseña actual',type:'password'},
   {name:'password',label:'Nueva contraseña (12 caracteres como mínimo)',type:'password'},
   {name:'confirmation',label:'Repetir nueva contraseña',type:'password'},
  ],v=>{if(v.password!==v.confirmation)throw Error('Las contraseñas no coinciden.');return api('password_self',v);},'Al terminar volverás a iniciar sesión. Tu segundo factor se conserva.')));
  if(!ctx.profile.must_change_password){const generation=version,owner=ctx.user.id;mountPersonalHistory(profileRoot,{api,isCurrent:()=>generation===version&&ctx?.user.id===owner,tenants:tenants.filter(t=>ctx.memberships.some(m=>m.tenant_id===t.id&&m.active===true&&m.role==='client_admin'))});}
 }
 function clear(){version++;clearTimeout(credentialTimer);for(const d of document.querySelectorAll('dialog'))d.close();ctx=null;tenants=[];users=[];selected='';query='';page=1;auditPage=1;securityPage=1;userStatus='';userRole='';auditAction='';auditDays=90;view='overview';adminTab='clients';$('portal-search').value='';$('site-status-filter').value='';root.replaceChildren();profileRoot.replaceChildren();$('portal-nav').replaceChildren();}
 return {init,clear,checkSession:()=>api('session_check'),touch:()=>api('activity'),end:()=>api('session_end'),currentTenant:()=>selected,currentQuery:()=>query,refreshActive:()=>view==='management'?load():view==='profile'?renderProfile():onTenantChange(),isOverview:()=>view==='overview',tenantName:id=>tenants.find(t=>t.id===id)?.name||'',mustChange:()=>!!ctx?.profile.must_change_password};
}
