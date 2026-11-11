import {icon} from './visuals.js?v=filters-1';
const labels={online:'En línea',offline:'Sin respuesta',paused:'En pausa',unknown:'Sin evaluar'};
const kinds={INTERFAZ:'Estado de interfaz',SERVICIO:'Estado de servicio',ALMACENAMIENTO:'Uso de almacenamiento',CPU:'Uso de CPU',MEMORIA:'Uso de memoria',SYSLOG:'Evento del sistema',CABLE_SWITCH:'Cable o puerto',SERVER_MONITORING:'Monitoreo de servidor',OLT_OPTICAL:'Estado óptico',INTERNET:'Conectividad a Internet',PING:'Comprobación de respuesta',TRACEROUTE:'Ruta de comunicación',OTHER:'Alerta del aplicativo'};
const el=(tag,text='',cls='')=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;};
const date=v=>v?new Date(v).toLocaleString():'Sin fecha confirmada';
function action(text,symbol,fn,cls='subtle'){const b=el('button','',cls);b.type='button';b.append(icon(symbol),el('span',text));b.onclick=fn;return b;}
function chart(counts){
 const wrap=el('div','','snapshot-chart');const heading=el('h3','Distribución actual');wrap.append(heading);
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 600 44');svg.setAttribute('role','img');svg.setAttribute('aria-label','Distribución de equipos del último reporte');
 let x=0;const total=counts.total;for(const key of ['online','offline','paused','unknown']){
  const width=total?counts[key]/total*600:0;if(width){const rect=document.createElementNS(svg.namespaceURI,'rect');rect.setAttribute('x',String(x));rect.setAttribute('width',String(width));rect.setAttribute('height','32');rect.setAttribute('y','6');rect.setAttribute('class','snapshot-fill-'+key);const title=document.createElementNS(svg.namespaceURI,'title');title.textContent=labels[key]+': '+counts[key]+' ('+Math.round(counts[key]/total*100)+' %)';rect.append(title);svg.append(rect);x+=width;}
 }
 wrap.append(svg);const legend=el('div','','snapshot-legend');for(const key of ['online','offline','paused','unknown']){const item=el('span','','snapshot-legend-item'),dot=el('i','','snapshot-dot snapshot-fill-'+key);item.append(dot,el('span',labels[key]+' · '+counts[key]));legend.append(item);}wrap.append(legend);if(!total)wrap.append(el('p','No hay equipos registrados en el último reporte.','muted small'));return wrap;
}
function listSection(title,symbol,rows,total,columns,empty){
 const section=el('section','','snapshot-section');const h=el('h3');h.append(icon(symbol),el('span',title));section.append(h);
 section.append(el('p',rows.length<total?'Mostrando una lista limitada de '+rows.length+' de '+total+'. Consulta el aplicativo local para ver todos los detalles.':total+' registros en el último reporte.','small muted'));
 const search=el('input');search.type='search';search.placeholder='Buscar en esta lista';search.setAttribute('aria-label','Buscar en '+title.toLowerCase());section.append(search);
 const host=el('div','','snapshot-table-wrap'),pagination=el('div','','snapshot-pagination');let page=1;
 function render(){
  host.replaceChildren();pagination.replaceChildren();const term=search.value.trim().toLocaleLowerCase();const filtered=rows.filter(r=>Object.values(r).some(v=>typeof v==='string'&&v.toLocaleLowerCase().includes(term)));const pages=Math.max(1,Math.ceil(filtered.length/20));page=Math.min(page,pages);
  if(!filtered.length){host.append(el('p',term?'No hay coincidencias en la lista recibida.':empty,'small muted'));return;}
  const table=el('table'),thead=el('thead'),tr=el('tr');for(const c of columns){const th=el('th',c.label);th.scope='col';tr.append(th);}thead.append(tr);const tbody=el('tbody');for(const row of filtered.slice((page-1)*20,page*20)){const tr=el('tr');for(const c of columns){const td=el('td');const value=c.value(row);if(value instanceof Node)td.append(value);else td.textContent=value;tr.append(td);}tbody.append(tr);}table.append(thead,tbody);host.append(table);
  const previous=action('Anterior','arrow',()=>{page--;render()}),next=action('Siguiente','arrow',()=>{page++;render()});previous.disabled=page<=1;next.disabled=page>=pages;pagination.append(previous,el('span','Página '+page+' de '+pages,'small muted'),next);
 }
 search.addEventListener('input',()=>{page=1;render()});section.append(host,pagination);render();return section;
}
export function openSiteSnapshot({db,site,isCurrent=()=>true}){
 for(const open of document.querySelectorAll('dialog.snapshot-dialog'))open.close();
 const dialog=el('dialog','','snapshot-dialog');dialog.setAttribute('aria-labelledby','snapshot-title');
 const header=el('div','','snapshot-header'),titles=el('div');titles.append(el('p','SUPERVISIÓN DEL SITIO · SOLO CONSULTA','eyebrow'));const h=el('h2',site.name);h.id='snapshot-title';titles.append(h);
 const close=action('Cerrar','offline',()=>dialog.close());close.setAttribute('aria-label','Cerrar dashboard del sitio');header.append(titles,close);
 const tools=el('div','','snapshot-tools'),updated=el('p','','small muted'),body=el('div','','snapshot-body');
 let serial=0,busy=false,timer;const refresh=action('Actualizar','refresh',()=>load());tools.append(updated,refresh);dialog.append(header,tools,body);document.body.append(dialog);
 dialog.addEventListener('close',()=>{serial++;clearInterval(timer);dialog.replaceChildren();dialog.remove();},{once:true});
 function paint(data,currentSite){
  body.replaceChildren();if(!data){updated.textContent='Sin resumen operativo disponible';body.append(el('p','Aún no se ha recibido información, no tienes acceso o el último resumen superó 60 días. Revisa la actualización y autorización del monitor local.','snapshot-message'));return;}
  const p=data.snapshot,c=p.counts;const age=Date.now()-Date.parse(data.received_at),collectedAge=Date.now()-Date.parse(p.collected_at);const timeout=(currentSite.timeout_seconds||180)*1000;
  const fresh=!currentSite.paused&&currentSite.app_ok===true&&currentSite.last_seen&&Date.now()-Date.parse(currentSite.last_seen)<=timeout&&age<=180000&&collectedAge<=180000&&collectedAge>=-300000;
  updated.textContent='Recibido: '+date(data.received_at)+' · Medido en el sitio: '+date(p.collected_at);
  const banner=el('p',fresh?'Último reporte recibido. Vista de consulta; no realiza comprobaciones desde tu navegador.':currentSite.paused?'Monitoreo del sitio pausado. Los valores corresponden al último reporte, no a una comprobación actual.':'Datos desactualizados o aplicativo sin respuesta. Los valores corresponden al último reporte; no se asume que todos los equipos estén caídos.','snapshot-message '+(fresh?'snapshot-current':'snapshot-stale'));banner.setAttribute('role','status');body.append(banner);
  const metrics=el('div','','snapshot-metrics');for(const [key,title,symbol]of [['total','Total de equipos','server'],['online','En línea','check'],['offline','Sin respuesta','offline'],['paused','En pausa','pause']]){const card=el('div','','snapshot-metric snapshot-'+key),top=el('div');top.append(icon(symbol),el('span',title));card.append(top,el('strong',String(c[key])));metrics.append(card);}body.append(metrics);
  if(c.unknown)body.append(el('p',c.unknown+' equipos están sin evaluar; se incluyen en el total y no se consideran en línea ni sin respuesta.','small muted'));
  body.append(chart(c));
  const deviceColumns=[{label:'Equipo',value:r=>r.name},{label:'IP o DNS',value:r=>r.address||'Sin dirección'}];
  body.append(listSection('Equipos sin respuesta','offline',p.offline_devices,c.offline,[...deviceColumns,{label:'Sin respuesta desde',value:r=>date(r.since)}],'No hay equipos sin respuesta en el último reporte.'));
  const paused=el('details','','snapshot-paused');paused.append(el('summary','Equipos con monitoreo en pausa · '+c.paused));paused.append(listSection('Equipos en pausa','pause',p.paused_devices,c.paused,deviceColumns,'No hay equipos pausados en el último reporte.'));body.append(paused);
  if(!p.alerts_available){body.append(el('p','Las alertas no pudieron consultarse en el aplicativo local. No se interpreta esta ausencia como cero alertas.','snapshot-message snapshot-stale'));}
  else body.append(listSection('Alertas activas','alert',p.alerts,p.alerts_total,[{label:'Prioridad',value:r=>{const b=el('span',r.severity==='critical'?'Crítica':r.severity==='warning'?'Advertencia':'Informativa','badge '+(r.severity==='critical'?'bad':r.severity==='warning'?'warn':'neutral'));return b;}},{label:'Equipo',value:r=>r.device_name},{label:'IP o DNS',value:r=>r.address||'—'},{label:'Categoría',value:r=>kinds[r.kind]||'Alerta del aplicativo'},{label:'Fecha',value:r=>date(r.since)}],'No hay alertas activas en el último reporte.'));
  body.append(el('p','Las alertas se muestran por categoría, sin mensajes libres ni configuración técnica. Esta vista no permite reiniciar equipos, ejecutar comandos ni resolver alertas. El historial y el detalle completo permanecen en el aplicativo local.','small muted snapshot-footnote'));
 }
 async function load(){
  if(busy||!dialog.open)return;if(!isCurrent()){dialog.close();return;}
  busy=true;refresh.disabled=true;const generation=++serial;
  try{
   const [report,current]=await Promise.all([db.from('lw_site_snapshots').select('received_at,snapshot').eq('installation_id',site.id).maybeSingle(),db.from('lw_installations').select('name,paused,last_seen,app_ok,timeout_seconds').eq('id',site.id).maybeSingle()]);
   if(!dialog.open||generation!==serial||!isCurrent())return;
   if(report.error||current.error)throw Error('No se pudo consultar');if(!current.data){body.replaceChildren(el('p','El sitio ya no está disponible para tu cuenta.','snapshot-message'));updated.textContent='Acceso no disponible';return;}
   h.textContent=current.data.name;paint(report.data,current.data);
  }catch{if(dialog.open&&generation===serial&&isCurrent()){updated.textContent='Información no confirmada';body.replaceChildren(el('p','No se pudo verificar el acceso o actualizar el resumen. Reintenta; no se muestran datos anteriores como actuales.','snapshot-message snapshot-stale'));}}
  finally{busy=false;if(dialog.open)refresh.disabled=false;}
 }
 body.append(el('p','Consultando el resumen del sitio…','small muted'));dialog.showModal();load();timer=setInterval(()=>{if(!document.hidden)load();},30000);return dialog;
}
export function siteSnapshotButton(options){return action('Ver dashboard del sitio','activity',()=>openSiteSnapshot(options),'subtle snapshot-open');}
