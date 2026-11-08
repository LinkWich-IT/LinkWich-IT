import {icon} from './visuals.js?v=filters-1';
const labels={
 'password.failed':'Contraseña incorrecta','password.accepted':'Contraseña aceptada; verificación en dos pasos pendiente',
 'access.completed':'Acceso al portal completado','access.auto_blocked':'Cuenta bloqueada tras 3 fallos',
 'access.manual_blocked':'Acceso bloqueado por administración','access.unblocked':'Acceso desbloqueado',
 'access.recovered':'Acceso recuperado desde administración','access.rejected_blocked':'Intento rechazado: la cuenta estaba bloqueada',
 'profile.self':'Actualizaste tu nombre','password.self':'Cambiaste tu contraseña',
 'tenant.update':'Se actualizaron los datos o destinatarios del ecosistema','tenant.create':'Se creó el ecosistema',
 'site.delete':'Se eliminó un sitio','site.create':'Se añadió un sitio','site.update':'Se actualizó un sitio','site.transfer':'Se transfirió un sitio',
 'site.rotate':'Se renovó la credencial de un sitio','site.token_rotate':'Se renovó la credencial de un sitio',
 'membership.update':'Se actualizaron permisos de acceso del ecosistema'
};
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
export function mountPersonalHistory(root,{api,isCurrent,tenants=[]}){
 const wrapper=el('section',undefined,'personal-history');wrapper.append(el('h3','Mi actividad y seguridad'));
 function panel(kind,title,description){
  const details=el('details',undefined,'personal-history-panel'),summary=el('summary',title);summary.prepend(icon(kind==='security'?'shield':'activity'));details.append(summary,el('p',description,'small muted'));
  const controls=el('div',undefined,'personal-history-controls');const suffix=kind;
  function select(label,values){const group=el('div'),l=el('label',label),s=el('select');s.id='personal-history-'+suffix+'-'+controls.children.length;l.htmlFor=s.id;for(const[value,text]of values){const opt=el('option',text);opt.value=value;s.append(opt);}group.append(l,s);controls.append(group);return s;}
  const period=select('Periodo',[['90','90 días'],['30','30 días'],['7','7 días']]);
  const tenant=kind==='ecosystem'?select('Ecosistema',[['','Todos los que administras'],...tenants.map(t=>[t.id,t.name])]):null;
  const refresh=el('button','Actualizar','subtle');refresh.type='button';refresh.prepend(icon('refresh'));controls.append(refresh);
  const list=el('div',undefined,'personal-history-list');list.setAttribute('aria-live','polite');
  const navigation=el('div',undefined,'form-actions');const previous=el('button','Anterior','subtle'),next=el('button','Siguiente','subtle'),counter=el('span','','small muted');previous.type=next.type='button';navigation.append(previous,counter,next);
  details.append(controls,list,navigation);wrapper.append(details);
  let page=1,sequence=0,loaded=false,busy=false;
  async function load(){
   if(!isCurrent()||!wrapper.isConnected)return;
   const request=++sequence;busy=true;refresh.disabled=previous.disabled=next.disabled=true;period.disabled=true;if(tenant)tenant.disabled=true;
   const loading=el('p','Cargando actividad…','small muted'),spinner=el('span',undefined,'spinner');spinner.setAttribute('aria-hidden','true');loading.prepend(spinner,' ');list.replaceChildren(loading);list.setAttribute('aria-busy','true');
   try{
    const response=await api('my_history',{kind,days:Number(period.value),page,...(tenant?.value?{tenant_id:tenant.value}:{})});
    if(request!==sequence||!isCurrent()||!wrapper.isConnected)return;
    list.replaceChildren();
    for(const row of response.rows||[]){
     const item=el('article',undefined,'personal-history-event');const heading=el('strong',labels[row.action]||(kind==='security'?'Actividad de tu cuenta':'Actividad del ecosistema'));
     const symbol=/failed|blocked/.test(row.action)?'alert':/completed|unblocked/.test(row.action)?'check':'clock';heading.prepend(icon(symbol));
     const time=el('time',new Date(row.created_at).toLocaleString());time.dateTime=row.created_at;
     item.append(heading,time);
     if(kind==='security'&&row.action==='password.failed'&&Number.isInteger(row.attempts))item.append(el('p','Intento '+row.attempts+' de 3','small muted'));
     if(kind==='ecosystem')item.append(el('p',[row.tenant_name,row.site_name].filter(Boolean).join(' · '),'small muted'));
     list.append(item);
    }
    if(!(response.rows||[]).length)list.append(el('p','No hay eventos en este periodo.','small muted'));
    counter.textContent='Página '+page+' · '+(response.total||0)+' eventos';previous.disabled=page<=1;next.disabled=!response.has_more;loaded=true;
   }catch(error){if(request===sequence&&isCurrent()&&wrapper.isConnected){list.replaceChildren(el('p',error.message||'No se pudo consultar tu actividad.','form-error'));counter.textContent='';previous.disabled=next.disabled=true;}}
   finally{if(request===sequence&&isCurrent()&&wrapper.isConnected){busy=false;refresh.disabled=false;period.disabled=false;if(tenant)tenant.disabled=false;list.setAttribute('aria-busy','false');}}
  }
  details.addEventListener('toggle',()=>{if(details.open&&!loaded&&!busy)load();});
  refresh.addEventListener('click',()=>load());period.addEventListener('change',()=>{page=1;load();});tenant?.addEventListener('change',()=>{page=1;load();});
  previous.addEventListener('click',()=>{if(page>1){page--;load();}});next.addEventListener('click',()=>{page++;load();});
 }
 panel('security','Mi seguridad','Solo muestra intentos y accesos de tu cuenta, bloqueos y tus cambios de perfil o contraseña. Los intentos contra una cuenta bloqueada se agrupan por hora.');
 if(tenants.length)panel('ecosystem','Actividad de mis ecosistemas','Cambios administrativos de los ecosistemas que administras. No incluye la seguridad de otras cuentas. Los eventos de disponibilidad siguen en Disponibilidad.');
 wrapper.append(el('p','Historial disponible: últimos 90 días.','small muted'));root.append(wrapper);return wrapper;
}
