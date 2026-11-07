function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function calendar(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return 'Sin dato';const[y,m,d]=value.split('-');return `${d}/${m}/${y}`;}
function count(value){return typeof value==='number'&&Number.isFinite(value)&&value>=0?value:null;}
function help(label,text){
 const box=el('details',undefined,'help-tip'),toggle=el('summary','?'),body=el('span',text,'help-text');
 toggle.setAttribute('aria-label','Ayuda: '+label);toggle.title=text;body.setAttribute('role','note');box.append(toggle,body);
 box.addEventListener('toggle',()=>{if(box.open)document.querySelectorAll('.help-tip[open]').forEach(other=>{if(other!==box)other.open=false;});});
 box.addEventListener('keydown',e=>{if(e.key==='Escape'){box.open=false;toggle.focus();e.stopPropagation();}});
 return box;
}
function line(label,value,explanation){const row=el('div',undefined,'site-info-line'),title=el('span',label,'muted');title.append(help(label,explanation));row.append(title,el('strong',value));return row;}
function field(label,value,explanation){const cell=el('div',undefined,'license-field'),title=el('dt',label);title.append(help(label,explanation));cell.append(title,el('dd',value));return cell;}
export function renderSiteDetails(card,installation,status,date){
 const descriptions={online:'El servidor se comunica y LinkWich-Monitor responde.',app_down:'El servidor se comunica, pero LinkWich-Monitor no responde.',unreachable:'No se han recibido señales recientes. Revisa la energía, Internet y el servidor.',pending:'Estamos esperando la primera señal de esta instalación.',paused:'La supervisión y las alertas de comunicación están pausadas para este sitio.'};
 card.append(el('p',descriptions[status]||'Consulta la última información de este sitio.','site-status-description'));
 const info=el('div',undefined,'site-info');
 info.append(line('Última comunicación',date(installation.last_seen),'Última vez que este servidor se comunicó con el portal. Si deja de enviar señales, este dato no se actualiza.'));
 const details=el('details',undefined,'site-technical-details');details.append(el('summary','Ver datos de supervisión'));
 details.append(line('Licencia reportada por el servidor',installation.license_ok==null?'Sin información':installation.license_ok?'Vigente':'Sin validación vigente','Resultado de la comprobación de licencia enviada con la última señal. No confirma un cambio posterior ni sustituye el resumen de licencia de abajo.'));
 info.append(details);card.append(info);
}
export function renderLicense(card,installation,status){
 const s=installation.license_summary,box=el('section',undefined,'license-summary');box.append(el('h4','Tu licencia'));
 if(!s){box.append(el('p','Todavía no recibimos los datos de licencia y capacidad de este servidor. Si persiste, contacta a soporte.','small muted'));card.append(box);return;}
 const received=Date.parse(installation.license_received_at),stale=!Number.isFinite(received)||Date.now()-received>Math.max(180,installation.timeout_seconds||180)*1000||['unreachable','app_down','paused'].includes(status);
 const active=s.status==='active',missing=s.status==='missing';
 box.append(el('span',(stale?'Último estado recibido: ':'')+(missing?'Sin licencia':active?'Licencia activa':'Licencia vencida'),'badge '+(stale?'warn':active?'good':'bad')));
 if(stale)box.append(el('p','Estos son los últimos datos recibidos. Esperamos una nueva señal para confirmar el estado actual.','license-warning small'));
 const used=count(s.devices_used),limit=count(s.device_limit),remaining=typeof s.days_remaining==='number'&&Number.isFinite(s.days_remaining)?s.days_remaining:null,available=used!==null&&limit!==null?Math.max(0,limit-used):null;
 const grid=el('dl',undefined,'license-grid');
 grid.append(
  field('Inicio de tu licencia',calendar(s.activated_on),'Fecha de activación de la licencia de LinkWich-Monitor para esta instalación.'),
  field('Tu licencia vence el',calendar(s.expires_on),'Última fecha de vigencia reportada por el servidor. Consulta a tu representante de LinkWich-IT para renovar.'),
  field('Tiempo restante',remaining===null?'Sin dato':`${remaining<0?'Vencida hace '+Math.abs(remaining):remaining} días${stale?' al reportar':''}`,'Días restantes que calculó el servidor al enviar estos datos. No es un contador en tiempo real; se actualiza al recibir nuevos datos.'),
  field('Equipos registrados',used===null||limit===null?'Sin dato':`${used} de ${limit}`,'Cantidad de dispositivos registrados en LinkWich-Monitor frente al máximo de tu licencia. No es la cantidad de equipos conectados en este momento.'),
  field('Puedes agregar',available===null?'Sin dato':`${available} equipos más`,'Espacios disponibles dentro de tu licencia. Se calculan restando los equipos registrados al límite contratado.')
 );box.append(grid);
 if(limit!==null&&limit>0&&used!==null){
  const capacity=el('div',undefined,'license-capacity'),label=el('div',undefined,'capacity-label');
  const percent=Math.round(used/limit*100);
  label.append(el('span','Uso de tu capacidad'),el('strong',`${percent}%`),help('Uso de tu capacidad',`${used} equipos registrados de ${limit} permitidos. La barra representa uso de licencia, no tráfico de red ni disponibilidad.`));
  const meter=el('progress');meter.max=limit;meter.value=Math.min(used,limit);meter.setAttribute('aria-label','Capacidad de licencia utilizada');meter.setAttribute('aria-valuetext',`${used} de ${limit} equipos; ${percent}% de capacidad utilizada`);meter.title=`${used} de ${limit} equipos (${percent}%)`;
  capacity.append(label,meter);box.append(capacity);
  if(used>limit)box.append(el('p','Hay más equipos registrados que los permitidos por tu licencia. Contacta a soporte.','license-warning small'));
 }
 const modules=el('div',undefined,'license-modules');modules.append(el('h5','Funciones incluidas'));
 for(const[key,label,description]of [['sniffer','Monitoreo de red','Módulo Sniffer de red: permite supervisar los dispositivos de red dentro del alcance contratado.'],['servidores','Servidores y computadoras','Módulo Servidores y estaciones de trabajo: permite supervisar los equipos incluidos en tu servicio.']]){
  const module=el('div',undefined,'license-module'),enabled=!missing&&Boolean(s.modules?.[key]);
  const name=el('span',label);name.append(help(label,description+' Comparte la fecha de vencimiento de la licencia principal. “Incluido” indica autorización de uso, no que el módulo esté ejecutándose ahora.'));
  module.append(name,el('span',missing?'Sin licencia':enabled?'Incluido':'Sin vigencia','badge '+(stale?'warn':enabled?'good':'bad')));modules.append(module);
 }
 box.append(modules,el('p','Todas las funciones comparten la fecha de vencimiento de tu licencia.','small muted'));
 const update=el('p',undefined,'small muted license-received');update.append('Información actualizada: '+(Number.isFinite(received)?new Date(received).toLocaleString():'Fecha no disponible'),help('Fecha de actualización','Fecha de recepción de estos datos en el portal. Si el monitoreo está pausado o el servidor no se comunica, seguirás viendo la última información recibida.'));box.append(update);
 card.append(box);
}
