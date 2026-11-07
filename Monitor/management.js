// No contiene claves privadas. Todas las operaciones se autorizan en portal-admin.
export function createManagement({db,baseUrl,publishableKey,notice,logout,onTenantChange}) {
 const $=id=>document.getElementById(id);
 const el=(tag,text='',cls='')=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;};
 let ctx=null,tenants=[],users=[],page=1,hasMore=false,version=0,selected='',view='overview',credentialTimer;
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
 const button=(text,action,cls='subtle')=>{const b=el('button',text,cls);b.type='button';b.onclick=async()=>{b.disabled=true;try{await action();}catch(e){status(e.message);}finally{b.disabled=false;}};return b;};
 function status(message=''){const target=$('management-notice');if(target){target.textContent=message;target.hidden=!message;}else notice(message);}
 function setView(next){
  if(ctx?.profile.must_change_password)next='profile';
  view=next;for(const name of ['overview','management','profile'])$(name+'-view').hidden=name!==next;
  for(const b of $('portal-nav').querySelectorAll('button'))b.setAttribute('aria-current',String(b.dataset.view===next));
 }
 function syncFilter(){
  const filter=$('tenant-filter');filter.replaceChildren(new Option(ctx.global_admin?'Todos los clientes':'Todos mis sitios',''));
  for(const t of tenants)filter.add(new Option(t.name,t.id));
  if(!tenants.some(t=>t.id===selected))selected='';filter.value=selected;
  filter.onchange=()=>{selected=filter.value;onTenantChange();};
 }
 function nav(){
  const n=$('portal-nav');n.replaceChildren();
  const entries=[['overview','Disponibilidad'],...(ctx.global_admin||ctx.memberships.some(m=>m.role==='client_admin')?[['management',ctx.global_admin?'Administración':'Gestionar sitios']]:[]),['profile','Mi perfil']];
  for(const [id,label] of entries){const b=button(label,async()=>{setView(id);if(id==='management')await load();if(id==='profile')renderProfile();});b.dataset.view=id;n.append(b);}
  setView(view);
 }
 async function init(){
  const generation=version;const fresh=await api('context');if(generation!==version)return;
  ctx=fresh;
  tenants=(await api('tenants_list')).rows;if(generation!==version)return;
  nav();renderProfile();
  syncFilter();
  $('account-role').textContent=ctx.profile.must_change_password?'Cambio de contraseña requerido':ctx.global_admin?'Administrador general':ctx.memberships.some(m=>m.role==='client_admin')?'Administrador de cliente':'Usuario de consulta';
  if(ctx.profile.must_change_password){setView('profile');notice('Cambia tu contraseña temporal para acceder a tus instalaciones.');}
  return ctx;
 }
 function form(title,fields,onSave,help=''){
  const dlg=el('dialog','','edit-dialog');const f=el('form');const h=el('h2',title);f.append(h);
  if(help)f.append(el('p',help,'small muted'));
  const inputs={};
  for(const spec of fields){
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
  const save=el('button','Guardar','primary');save.type='submit';
  const cancel=button('Cancelar',()=>dlg.close());actions.append(cancel,save);f.append(error,actions);dlg.append(f);document.body.append(dlg);
  dlg.addEventListener('close',()=>{for(const input of Object.values(inputs))input.value='';dlg.remove();},{once:true});
  f.onsubmit=async event=>{event.preventDefault();save.disabled=true;cancel.disabled=true;error.textContent='';const generation=version;
   try{
    const values=Object.fromEntries(fields.map(s=>[s.name,s.type==='checkbox'?inputs[s.name].checked:s.type==='number'?Number(inputs[s.name].value):inputs[s.name].value]));
    const output=await onSave(values);if(generation!==version)return;
    dlg.close();if(output?.relogin){await logout();notice('Contraseña actualizada. Ingresa de nuevo con tu nueva contraseña y segundo factor.');return;}
    if(output?.token)credentials(output);
    if(view==='management')await load();else if(view==='profile'){await init();renderProfile();}
   }catch(e){if(generation===version)error.textContent=e.message;}finally{save.disabled=false;cancel.disabled=false;}
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
   {name:'alert_email',label:'Correo principal de alertas',type:'email',value:t?.alert_email},
   {name:'alert_cc',label:'Copias del mismo cliente (una dirección por línea)',type:'textarea',required:false,value:t?.alert_cc?.join('\n')||''},
   {name:'alert_timezone',label:'Zona horaria',value:t?.alert_timezone||'America/Mazatlan'},
  ],v=>api('tenant_save',{...v,id:t?.id,alert_cc:v.alert_cc.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean)}),
  'Las copias son visibles. Usa únicamente contactos de este cliente y de tu soporte. Para enviar a clientes, verifica tu dominio en Resend.');
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
 ],async v=>{const r=await api('mfa_reset',{id:u.id,...v});notice(r.message);return r;},
 'Cuenta: '+u.email+'. Se eliminará su autenticador TOTP y se cerrarán sus sesiones. Al ingresar con su correo y contraseña verá un QR NUEVO para registrar en su teléfono. No cambia su contraseña. El QR anterior no se recupera ni se muestra al administrador.');}
 function editIdle(){form('Tiempo de cierre por inactividad',[
  {name:'idle_minutes',label:'Minutos sin interacción (5 a 1440)',type:'number',value:ctx.idle_minutes||15,min:5,max:1440},
 ],async v=>{const r=await api('settings_save',v);ctx.idle_minutes=r.idle_minutes;window.dispatchEvent(new CustomEvent('lw-idle-setting',{detail:r.idle_minutes}));return r;},
 'Aplica a todos los usuarios. Recargar la página y actualizar datos automáticamente NO cuentan como actividad. Si reduces el tiempo, las sesiones que ya lo excedan finalizarán.');}
 function section(title,help){const p=el('section','','panel admin-section');p.append(el('h2',title));if(help)p.append(el('p',help,'small muted'));root.append(p);return p;}
 async function load(){
  status();const generation=version;root.setAttribute('aria-busy','true');
  try{
   const fresh=await api('context');if(generation!==version)return;ctx=fresh;nav();if(ctx.profile.must_change_password){renderProfile();return;}
   tenants=(await api('tenants_list')).rows;syncFilter();
   const sites=await db.from('lw_installations').select('id,tenant_id,name,paused,timeout_seconds,last_seen').order('name');if(sites.error)throw Error('No se pudieron consultar los sitios.');
   if(generation!==version)return;root.replaceChildren();
   const feedback=el('p','','form-error');feedback.id='management-notice';feedback.hidden=true;feedback.setAttribute('role','status');root.append(feedback);
   const heading=el('div','','section-label');heading.append(el('h2',ctx.global_admin?'Administración de LinkWich-IT':'Gestión de tu ecosistema'));root.append(heading);
   const tp=section('Clientes y destinatarios','Cada cliente tiene su propio conjunto de sitios y contactos de alertas. Los cambios de destinatarios aplican a eventos nuevos.');
   if(ctx.global_admin)tp.append(button('Crear cliente',()=>editTenant()));
   for(const t of tenants){
    const card=el('article','','admin-row');const info=el('div');info.append(el('strong',t.name),el('p','Alertas: '+t.alert_email,'small muted'),el('p','Copias: '+(t.alert_cc?.join(', ')||'Ninguna'),'small muted'));
    card.append(info);if(canManage(t.id))card.append(button('Editar cliente / correos',()=>editTenant(t)));tp.append(card);
   }
   if(!tenants.length)tp.append(el('p','Aún no hay clientes asignados.','muted'));
   const sp=section('Sitios de LinkWich-Monitor','Primero configura el agente del sitio; después quita la pausa para comenzar a recibir señales y alertas.');
   if(tenants.some(t=>canManage(t.id)))sp.append(button('Añadir sitio',()=>newSite()));
   for(const s of sites.data||[]){
    const card=el('article','','admin-row');const info=el('div');info.append(el('strong',s.name),el('p',tenants.find(t=>t.id===s.tenant_id)?.name||'Cliente','small muted'),el('p',s.paused?'Pausado':'Monitoreo habilitado','small'),el('code',s.id,'small'));card.append(info);
    if(canManage(s.tenant_id)){const actions=el('div','','row-actions');actions.append(button('Editar / activar',()=>editSite(s)),button('Renovar credencial',()=>rotateSite(s)));if(ctx.global_admin&&tenants.some(t=>t.id!==s.tenant_id))actions.append(button('Transferir a otro cliente',()=>transferSite(s)));card.append(actions);}sp.append(card);
   }
   if(ctx.global_admin){
    const settingsPanel=section('Sesiones y seguridad','Cierre por inactividad: '+(ctx.idle_minutes||15)+' minutos. La sesión se conserva al recargar mientras siga vigente.');settingsPanel.append(button('Configurar inactividad',()=>editIdle()));
    const response=await api('users_list',{page});if(generation!==version)return;users=response.rows;hasMore=response.has_more;
    const up=section('Usuarios y perfiles','Consulta: ve los sitios asignados. Administrador de cliente: también gestiona sus sitios y destinatarios. Administrador general: gestiona todos los clientes y usuarios.');
    if(tenants.length)up.append(button('Crear usuario',()=>newUser()));
    for(const u of users){
     const card=el('article','','admin-row');const info=el('div');info.append(el('strong',u.profile.display_name||u.email),el('p',u.email,'small muted'),el('p',u.global_admin?'Administrador general':u.profile.active?'Cuenta habilitada':'Cuenta desactivada','small'));
     if(u.profile.mfa_recovery_pending)info.append(el('p','Recuperación de autenticador pendiente: reintenta Reiniciar autenticador.','form-error small'));
     for(const m of u.memberships){const name=tenants.find(t=>t.id===m.tenant_id)?.name||m.tenant_id;info.append(el('p',name+' · '+(m.role==='client_admin'?'Administrador del cliente':'Consulta')+(m.active?'':' · Acceso desactivado'),'small muted'));}
     card.append(info);
     if(!u.global_admin&&u.id!==ctx.user.id){const acts=el('div','','row-actions');acts.append(button('Editar perfil',()=>editUser(u)),button('Asignar cliente',()=>membership(u)),button('Contraseña temporal',()=>resetUser(u)));
      acts.append(button('Reiniciar autenticador',()=>resetMfa(u)));
      for(const m of u.memberships)acts.append(button('Editar acceso: '+(tenants.find(t=>t.id===m.tenant_id)?.name||'cliente'),()=>membership(u,m)));card.append(acts);}up.append(card);
    }
    const pager=el('div','','form-actions');if(page>1)pager.append(button('Usuarios anteriores',async()=>{page--;await load();}));pager.append(el('span','Página '+page,'small muted'));if(hasMore)pager.append(button('Usuarios siguientes',async()=>{page++;await load();}));up.append(pager);
    const history=await api('audit_list');if(generation!==version)return;const ap=section('Actividad administrativa reciente','Registra acciones y sus identificadores. No almacena contraseñas ni credenciales del agente.');
    for(const a of history.rows){const actor=users.find(u=>u.id===a.actor_id)?.email||a.actor_id||'Cuenta eliminada';ap.append(el('p',new Date(a.created_at).toLocaleString()+' · '+actor+' · '+a.action+' · '+(tenants.find(t=>t.id===a.tenant_id)?.name||a.target_id||''),'small audit-line'));}
   }
  }catch(e){if(generation===version)status(e.message);}finally{root.removeAttribute('aria-busy');}
 }
 function renderProfile(){
  if(!ctx)return;profileRoot.replaceChildren();profileRoot.append(el('h2','Mi perfil'),el('p',ctx.user.email,'muted'),el('p',ctx.profile.display_name||'Sin nombre registrado'));
  if(ctx.profile.must_change_password)profileRoot.append(el('p','Tu contraseña es temporal. Cámbiala para acceder a tus sitios.','form-error'));
  profileRoot.append(button('Editar mi nombre',()=>form('Mi nombre',[{name:'display_name',label:'Nombre',value:ctx.profile.display_name}],v=>api('profile_save',v))));
  profileRoot.append(button('Cambiar mi contraseña',()=>form('Cambiar contraseña',[
   {name:'current_password',label:'Contraseña actual',type:'password'},
   {name:'password',label:'Nueva contraseña (12 caracteres como mínimo)',type:'password'},
   {name:'confirmation',label:'Repetir nueva contraseña',type:'password'},
  ],v=>{if(v.password!==v.confirmation)throw Error('Las contraseñas no coinciden.');return api('password_self',v);},'Al terminar volverás a iniciar sesión. Tu segundo factor se conserva.')));
 }
 function clear(){version++;clearTimeout(credentialTimer);for(const d of document.querySelectorAll('dialog'))d.close();ctx=null;tenants=[];users=[];selected='';page=1;view='overview';root.replaceChildren();profileRoot.replaceChildren();$('portal-nav').replaceChildren();}
 return {init,clear,checkSession:()=>api('session_check'),touch:()=>api('activity'),end:()=>api('session_end'),currentTenant:()=>selected,tenantName:id=>tenants.find(t=>t.id===id)?.name||'',mustChange:()=>!!ctx?.profile.must_change_password};
}
