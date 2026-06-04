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
  });
})();
