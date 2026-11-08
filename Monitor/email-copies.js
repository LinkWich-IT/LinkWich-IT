export function emailCopies(value,mainInput){
 const root=document.createElement('fieldset');root.className='email-copies';
 const legend=document.createElement('legend');legend.textContent='Copias de alertas (opcional)';
 const help=document.createElement('p');help.className='small muted';help.textContent='Añade hasta 3 personas que también recibirán las alertas de este cliente. Los correos de copia son visibles para los destinatarios.';
 const hidden=document.createElement('input');hidden.type='hidden';hidden.name='alert_cc';
 const list=document.createElement('div');list.className='email-copies-list';
 const cap=document.createElement('p');cap.className='form-error small';cap.setAttribute('role','status');cap.hidden=true;
 const footer=document.createElement('div');footer.className='email-copies-footer';
 const add=document.createElement('button');add.type='button';add.className='subtle add-email-copy';add.textContent='+ Añadir copia';
 const counter=document.createElement('span');counter.className='small muted';counter.setAttribute('aria-live','polite');
 footer.append(add,counter);root.append(legend,help,hidden,list,cap,footer);
 const items=[];
 function update(){
  const addresses=items.map(item=>item.input.value.trim()).filter(Boolean);
  hidden.value=addresses.join('\n');add.disabled=items.length>=3;
  counter.textContent=items.length+' de 3 copias';
  cap.hidden=items.length<=3;cap.textContent=items.length>3?'Este cliente tiene más de 3 copias guardadas. Quita las que no necesites antes de guardar.':'';
  const seen=new Set();const main=String(mainInput?.value||'').trim().toLowerCase();
  items.forEach((item,index)=>{
   item.label.textContent='Copia '+(index+1);item.remove.setAttribute('aria-label','Quitar copia '+(index+1));
   const normalized=item.input.value.trim().toLowerCase();
   let error='';
   if(items.length>3&&index===0)error='Solo se permiten hasta 3 copias. Quita las adicionales para continuar.';
   else if(normalized&&normalized===main)error='Este correo ya es el destinatario principal.';
   else if(normalized&&seen.has(normalized))error='Esta dirección ya está incluida en otra copia.';
   if(normalized)seen.add(normalized);
   item.input.setCustomValidity(error);item.error.textContent=error;item.error.hidden=!error;
  });
 }
 function append(address='',focus=false){
  const row=document.createElement('div');row.className='email-copy-row';
  const label=document.createElement('label');const input=document.createElement('input');input.type='email';input.autocomplete='email';input.maxLength=254;input.placeholder='persona@empresa.com';
  const id='email-copy-'+(globalThis.crypto?.randomUUID?.()||Math.random().toString(36).slice(2));input.id=id;label.htmlFor=id;
  const remove=document.createElement('button');remove.type='button';remove.className='subtle remove-email-copy';remove.textContent='Quitar';
  const error=document.createElement('p');error.className='form-error small';error.id=id+'-error';error.hidden=true;error.setAttribute('aria-live','polite');input.setAttribute('aria-describedby',error.id);
  const item={row,label,input,remove,error};items.push(item);input.value=address;
  row.append(label,input,remove,error);list.append(row);
  input.addEventListener('input',update);input.addEventListener('change',update);
  remove.addEventListener('click',()=>{const index=items.indexOf(item);if(index<0)return;items.splice(index,1);row.remove();update();(items[Math.min(index,items.length-1)]?.input||add).focus();});
  update();if(focus)input.focus();
 }
 add.addEventListener('click',()=>{if(items.length<3)append('',true);});
 mainInput?.addEventListener('input',update);mainInput?.addEventListener('change',update);
 const initial=Array.isArray(value)?value:String(value||'').split(/[\n,;]+/);
 initial.map(v=>String(v).trim()).filter(Boolean).forEach(address=>append(address));
 update();return {element:root,input:hidden};
}
