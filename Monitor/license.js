function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function calendar(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return 'Sin dato';const[y,m,d]=value.split('-');return `${d}/${m}/${y}`;}
export function renderLicense(card,installation,status){
 const s=installation.license_summary,box=el('section',undefined,'license-summary');box.append(el('h4','Licencia y capacidad'));
 if(!s){box.append(el('p','Resumen aún no recibido. Actualiza el monitor local para enviar estos datos.','small muted'));card.append(box);return;}
 const received=Date.parse(installation.license_received_at),stale=!Number.isFinite(received)||Date.now()-received>Math.max(180,installation.timeout_seconds||180)*1000||['unreachable','app_down','paused'].includes(status);
 box.append(el('p','Última información recibida: '+(Number.isFinite(received)?new Date(received).toLocaleString():'Sin fecha'),'small muted'));
 if(stale)box.append(el('p','Información histórica: no se puede confirmar la vigencia actual sin una nueva señal.','license-warning small'));
 const active=s.status==='active',missing=s.status==='missing';
 box.append(el('span',(stale?'Al recibir datos: ':'')+(missing?'Sin licencia':active?'Licencia activa':'Licencia vencida'),'badge '+(stale?'warn':active?'good':'bad')));
 const grid=el('dl',undefined,'license-grid');
 for(const[label,value]of [['Activación',calendar(s.activated_on)],['Vencimiento',calendar(s.expires_on)],['Días restantes al recibir datos',`${s.days_remaining} días`],['Dispositivos utilizados',`${s.devices_used} / ${s.device_limit}`],['Disponibles',String(Math.max(0,s.device_limit-s.devices_used))]]){const cell=el('div');cell.append(el('dt',label),el('dd',value));grid.append(cell);}box.append(grid);
 if(s.device_limit>0){const meter=el('progress');meter.max=s.device_limit;meter.value=Math.min(s.devices_used,s.device_limit);meter.setAttribute('aria-label','Capacidad de dispositivos utilizada');box.append(meter);if(s.devices_used>s.device_limit)box.append(el('p','Capacidad contratada excedida','license-warning small'));}
 const modules=el('div',undefined,'license-modules');
 for(const[key,label]of [['sniffer','Sniffer de red'],['servidores','Servidores y estaciones de trabajo']])modules.append(el('span',label+' · '+(missing?'Sin licencia':s.modules?.[key]?'Activado':'Sin vigencia'),'license-module'));
 box.append(modules,el('p','Módulos incluidos con la misma vigencia de la licencia principal.','small muted'));card.append(box);
}
