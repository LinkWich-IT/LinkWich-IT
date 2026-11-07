const NOTICE_NS='http://www.w3.org/2000/svg';
export function renderNotice(target,message='',kind='info'){
 if(!target)return;
 const text=String(message||'');const type=['error','warning','success','info'].includes(kind)?kind:'info';
 target.replaceChildren();target.classList.add('notice-box');target.dataset.kind=type;target.hidden=!text;
 target.setAttribute('role',type==='error'?'alert':'status');target.setAttribute('aria-live',type==='error'?'assertive':'polite');target.setAttribute('aria-atomic','true');
 if(!text)return;
 const svg=document.createElementNS(NOTICE_NS,'svg');svg.classList.add('notice-icon');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');
 const path=document.createElementNS(NOTICE_NS,'path');
 const paths={error:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M9 9l6 6 M15 9l-6 6',warning:'m12 3 10 18H2z M12 9v5 M12 17h.01',success:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 m-13 0 3 3 5-6',info:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 11v6 M12 7h.01'};
 path.setAttribute('d',paths[type]);svg.append(path);const label=document.createElement('span');label.textContent=text;target.append(svg,label);
}
export function noticeElement(message,kind='error'){const p=document.createElement('p');renderNotice(p,message,kind);return p;}
