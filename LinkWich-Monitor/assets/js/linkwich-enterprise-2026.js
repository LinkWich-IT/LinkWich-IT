
(function(){
  'use strict';

  function ready(fn){
    if(document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function(){
    // Filtro visual de módulos. Si JS falla, todos los módulos quedan visibles por defecto.
    var buttons = document.querySelectorAll('.lw-filter-btn');
    var cards = document.querySelectorAll('.lw-module-col');
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        var filter = btn.getAttribute('data-filter') || 'all';
        buttons.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        cards.forEach(function(card){
          var cat = card.getAttribute('data-cat');
          if(filter === 'all' || cat === filter){ card.classList.remove('is-hidden'); }
          else{ card.classList.add('is-hidden'); }
        });
      });
    });

    // Header con sombra al hacer scroll sin interferir con main.js.
    var header = document.getElementById('header');
    function onScroll(){
      if(!header) return;
      header.classList.toggle('lw-scrolled', window.scrollY > 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  });
})();
