(function(){
  'use strict';

  function ready(fn){
    if(document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function(){
    // Filtros de módulos: sin botón "Todos". Por defecto se muestran todos los módulos.
    var buttons = document.querySelectorAll('.lw-filter-btn');
    var cards = document.querySelectorAll('.lw-module-col');
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        var filter = btn.getAttribute('data-filter');
        var isActive = btn.classList.contains('active');
        buttons.forEach(function(b){ b.classList.remove('active'); });

        // Si vuelves a tocar el mismo filtro, se limpian filtros y aparecen todos.
        if(isActive){
          cards.forEach(function(card){ card.classList.remove('is-hidden'); });
          return;
        }

        btn.classList.add('active');
        cards.forEach(function(card){
          var cat = card.getAttribute('data-cat');
          if(cat === filter){ card.classList.remove('is-hidden'); }
          else{ card.classList.add('is-hidden'); }
        });
      });
    });

    var header = document.getElementById('header');
    function onScroll(){
      if(!header) return;
      header.classList.toggle('lw-scrolled', window.scrollY > 35);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});

    /* Integración no destructiva del cotizador profesional.
       Se carga bajo demanda dentro de un iframe para mantener aislados sus estilos,
       dependencias y variables respecto de la landing principal. */
    var professionalModalEl = document.getElementById('lwProfessionalQuoteModal');
    var professionalFrame = document.getElementById('lwProfessionalQuoteFrame');
    var professionalLoading = document.getElementById('lwProfessionalQuoteLoading');
    var quickModalEl = document.getElementById('lwQuoteModal');
    var transferButton = document.getElementById('lwq_to_professional');
    var logoutButton = document.getElementById('lwPartnerLogout');
    var loginModalEl = document.getElementById('lwPartnerLoginModal');
    var prefillStorageKey = 'linkwich_professional_quote_prefill_v1';
    var pendingPrefill = null;

    function isPartnerAuthorized(){
      return sessionStorage.getItem('lwPartnerAuthorized') === '1';
    }

    function setProfessionalLoading(isLoading){
      if(!professionalLoading) return;
      professionalLoading.classList.toggle('is-hidden', !isLoading);
    }

    function ensureProfessionalFrame(){
      if(!professionalFrame || professionalFrame.getAttribute('src')) return;
      setProfessionalLoading(true);
      professionalFrame.setAttribute('src', professionalFrame.getAttribute('data-src') || '../Cotizaciones/index.html');
    }

    function sendPendingPrefill(){
      if(!pendingPrefill || !professionalFrame || !professionalFrame.contentWindow) return;
      professionalFrame.contentWindow.postMessage({
        type: 'LINKWICH_PRO_QUOTE_PREFILL',
        payload: pendingPrefill
      }, window.location.origin === 'null' ? '*' : window.location.origin);
    }

    function buildProfessionalPrefill(data){
      var packageLabel = data.packageLabel || 'Personalizado';
      var description = 'Licencia LinkWich-Monitor — Paquete ' + packageLabel +
        ' (' + data.nodes + ' nodos por ' + data.months + ' meses)';

      return {
        id: 'lwq-' + Date.now(),
        createdAt: new Date().toISOString(),
        source: data.source || 'linkwich-monitor-quick-quote',
        tipoServicio: 'Monitoreo de red',
        proyecto: 'Licenciamiento LinkWich-Monitor — ' + packageLabel,
        iva: Number(data.ivaRate || 0),
        notas: 'Base generada desde el cálculo rápido partner. ' +
          data.nodes + ' nodos, ' + data.months + ' meses, precio final ' +
          Number(data.finalNode || 0).toLocaleString('es-MX', {style:'currency', currency:'MXN'}) +
          ' por nodo/mes. ' + (data.note || ''),
        conceptos: [{
          concepto: description,
          cantidad: 1,
          precio: Number(data.subtotal || 0),
          descuento: 0
        }]
      };
    }

    if(professionalFrame){
      professionalFrame.addEventListener('load', function(){
        professionalFrame.dataset.loaded = '1';
        setProfessionalLoading(false);
        window.setTimeout(sendPendingPrefill, 80);
      });
    }

    if(professionalModalEl){
      professionalModalEl.addEventListener('show.bs.modal', function(event){
        if(!isPartnerAuthorized()){
          event.preventDefault();
          if(loginModalEl && window.bootstrap){
            bootstrap.Modal.getOrCreateInstance(loginModalEl).show();
          }
          return;
        }
        document.body.classList.add('lw-professional-modal-open');
        ensureProfessionalFrame();
      });

      professionalModalEl.addEventListener('hidden.bs.modal', function(){
        document.body.classList.remove('lw-professional-modal-open');
      });
    }

    if(transferButton){
      transferButton.addEventListener('click', function(){
        if(typeof window.recompute === 'function') window.recompute();
        if(!window.__LWQ_DATA__) return;

        pendingPrefill = buildProfessionalPrefill(window.__LWQ_DATA__);
        try {
          localStorage.setItem(prefillStorageKey, JSON.stringify(pendingPrefill));
        } catch(error) {
          /* El postMessage directo seguirá funcionando si el navegador bloquea storage. */
        }

        var showProfessional = function(){
          if(!professionalModalEl || !window.bootstrap) return;
          bootstrap.Modal.getOrCreateInstance(professionalModalEl).show();
          if(professionalFrame && professionalFrame.dataset.loaded === '1'){
            window.setTimeout(sendPendingPrefill, 100);
          }
        };

        if(quickModalEl && window.bootstrap){
          quickModalEl.addEventListener('hidden.bs.modal', showProfessional, {once:true});
          bootstrap.Modal.getOrCreateInstance(quickModalEl).hide();
        } else {
          showProfessional();
        }
      });
    }

    window.addEventListener('message', function(event){
      if(event.source !== (professionalFrame && professionalFrame.contentWindow)) return;
      if(window.location.origin !== 'null' && event.origin !== window.location.origin) return;
      if(!event.data || event.data.type !== 'LINKWICH_PRO_QUOTE_READY') return;

      if(!pendingPrefill){
        try {
          var storedPrefill = localStorage.getItem(prefillStorageKey);
          pendingPrefill = storedPrefill ? JSON.parse(storedPrefill) : null;
        } catch(error) {
          pendingPrefill = null;
        }
      }
      sendPendingPrefill();
    });

    if(logoutButton){
      logoutButton.addEventListener('click', function(){
        pendingPrefill = null;
        try { localStorage.removeItem(prefillStorageKey); } catch(error) {}
        if(professionalModalEl && window.bootstrap){
          bootstrap.Modal.getInstance(professionalModalEl)?.hide();
        }
        if(professionalFrame){
          professionalFrame.removeAttribute('src');
          delete professionalFrame.dataset.loaded;
          setProfessionalLoading(true);
        }
      });
    }
  });
})();
