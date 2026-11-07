const NS='http://www.w3.org/2000/svg';
const paths={server:'M4 3h16v7H4z M4 14h16v7H4z M7 6h.01 M7 17h.01 M11 6h6 M11 17h6',check:'m5 12 4 4L19 6',alert:'m12 3 10 18H2z M12 9v5 M12 17h.01',offline:'M5 5l14 14 M19 5 5 19',clock:'M12 8v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',pause:'M8 5v14 M16 5v14',refresh:'M20 7v5h-5 M4 17v-5h5 M19 8a8 8 0 0 0-13-3L4 8 M5 16a8 8 0 0 0 13 3l2-3',users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 3a4 4 0 1 1 0 8 M22 21v-2a4 4 0 0 0-3-4 M10 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',shield:'m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6z m-4 10 3 3 5-6',user:'M20 21v-2a7 7 0 0 0-14 0v2 M17 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0',settings:'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M10 15v6',activity:'M2 12h5l3-9 4 18 3-9h5',logout:'M10 3H3v18h7 M8 12h14 m-4-4 4 4-4 4',key:'M14 8a6 6 0 1 1-3-5 M11 8l11-6 M18 4l2 4',arrow:'M4 12h16 m-6-6 6 6-6 6',moon:'M20 15A8 8 0 0 1 9 4a9 9 0 1 0 11 11'};
export function icon(name){const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','1.8');s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');s.setAttribute('aria-hidden','true');s.classList.add('icon');const p=document.createElementNS(NS,'path');p.setAttribute('d',paths[name]||paths.server);s.append(p);return s;}
export function buttonIcon(button,name){if(!button.querySelector(':scope > .icon'))button.prepend(icon(name));}
export function setBusy(target,active,label='Actualizando'){
 if(!target)return;target.setAttribute('aria-busy',String(active));target.classList.toggle('is-busy',active);
 if(target.tagName==='BUTTON')return;
 let overlay=target.querySelector(':scope > .busy-overlay');
 if(active&&!overlay){overlay=document.createElement('div');overlay.className='busy-overlay';overlay.setAttribute('role','status');const spin=document.createElement('span');spin.className='spinner';spin.setAttribute('aria-hidden','true');overlay.append(spin,document.createTextNode(label+'…'));target.append(overlay);}
 if(!active)overlay?.remove();
}
export const statusStyles={online:['good','check'],unreachable:['bad','offline'],app_down:['warn','alert'],pending:['warn','clock'],paused:['paused-badge','pause']};
export function decorateStatic(){for(const [id,name]of [['theme','moon'],['refresh','refresh'],['logout','logout']]){const n=document.getElementById(id);if(n)buttonIcon(n,name);}}
function svgEl(tag,attrs={},text){const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));if(text!==undefined)e.textContent=String(text);return e;}
export function renderChart(target,rows){
 target.replaceChildren();
 if(!rows.length){const p=document.createElement('p');p.className='muted small';p.textContent='Sin datos para los sitios seleccionados.';target.append(p);return;}
 const tooltip=document.createElement('div');tooltip.className='chart-tooltip';tooltip.id=target.id+'-tooltip';tooltip.setAttribute('role','tooltip');tooltip.hidden=true;target.append(tooltip);
 const width=960,height=230,left=36,right=12,top=15,bottom=34,plot=height-top-bottom;
 const max=Math.max(1,...rows.map(r=>Number(r.unreachable)+Number(r.app_down)+Number(r.recoveries)));const ceiling=Math.max(4,Math.ceil(max/4)*4);
 const svg=svgEl('svg',{viewBox:`0 0 ${width} ${height}`,role:'group','aria-label':'Eventos diarios. Usa Tab para consultar cada día; pulsa Escape para cerrar el detalle.'});
 svg.append(svgEl('title',{},'Eventos de disponibilidad por día (UTC)'));
 for(let n=0;n<=4;n++){const y=top+plot-plot*n/4;svg.append(svgEl('line',{x1:left,y1:y,x2:width-right,y2:y,class:'chart-grid'}),svgEl('text',{x:left-8,y:y+4,'text-anchor':'end',class:'chart-label'},ceiling*n/4));}
 const step=(width-left-right)/rows.length,bar=Math.max(3,Math.min(28,step*.6));
 rows.forEach((row,index)=>{
  const group=svgEl('g');const x=left+step*index+(step-bar)/2;let y=top+plot;
  for(const [key,cls]of [['unreachable','chart-red'],['app_down','chart-amber'],['recoveries','chart-green']]){
   const value=Number(row[key]);if(!value)continue;const h=value/ceiling*plot;y-=h;group.append(svgEl('rect',{x,y,width:bar,height:h,rx:2,class:cls}));
  }
  const label=`${row.day} (UTC) · Sin comunicación: ${row.unreachable} · Aplicativo sin respuesta: ${row.app_down} · Recuperaciones: ${row.recoveries}`;
  const hit=svgEl('rect',{x:left+step*index,y:top,width:step,height:plot,tabindex:0,role:'button',class:'chart-hit','aria-label':label,'aria-describedby':tooltip.id});
  const show=()=>{tooltip.textContent=label;tooltip.hidden=false;};const hide=()=>{tooltip.hidden=true;};
  hit.addEventListener('pointerenter',show);hit.addEventListener('pointerleave',()=>{if(document.activeElement!==hit)hide();});hit.addEventListener('focus',show);hit.addEventListener('blur',hide);hit.addEventListener('click',show);
  hit.addEventListener('keydown',event=>{if(event.key==='Escape')hide();if(event.key==='Enter'||event.key===' '){event.preventDefault();show();}});
  group.append(hit);svg.append(group);
  if(index%Math.max(1,Math.ceil(rows.length/8))===0||index===rows.length-1){const date=String(row.day).slice(5).split('-').reverse().join('/');svg.append(svgEl('text',{x:left+step*(index+.5),y:height-9,'text-anchor':'middle',class:'chart-label'},date));}
 });
 target.append(svg);const help=document.createElement('p');help.className='small muted';help.textContent='Pasa el cursor, toca un día o usa Tab para consultar los valores. Fechas agrupadas en UTC.';target.append(help);
}
export function renderChartTable(target,rows){target.replaceChildren();const table=document.createElement('table');const head=document.createElement('thead');const tr=document.createElement('tr');for(const title of ['Fecha UTC','Sin comunicación','Aplicativo','Recuperaciones']){const th=document.createElement('th');th.textContent=title;tr.append(th);}head.append(tr);table.append(head);const body=document.createElement('tbody');for(const r of rows){const tr=document.createElement('tr');for(const value of [r.day,r.unreachable,r.app_down,r.recoveries]){const td=document.createElement('td');td.textContent=value;tr.append(td);}body.append(tr);}table.append(body);target.append(table);}
