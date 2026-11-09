/* LinkWich-IT | Efecto sutil de profundidad, únicamente en el nuevo hero.
   No interfiere con el catálogo, las cotizaciones ni los modales existentes. */
(() => {
  'use strict';
  const showcase = document.getElementById('lw-network-showcase');
  if (!showcase || !window.matchMedia || !window.requestAnimationFrame) return;

  // Una animación 3D discreta en equipos con puntero; en móviles o
  // con movimiento reducido permanece estático y completamente funcional.
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!canTilt.matches || reduceMotion.matches) return;
  let nextFrame = null;
  let position = null;

  function applyTilt() {
    nextFrame = null;
    if (!position) return;
    const {x, y} = position;
    showcase.style.setProperty('--lw-rotate-y', `${(x * 5).toFixed(2)}deg`);
    showcase.style.setProperty('--lw-rotate-x', `${(-y * 4).toFixed(2)}deg`);
  }
  showcase.addEventListener('pointermove', (event) => {
    const bounds = showcase.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    position = {
      x: Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)),
      y: Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
    };
    if (nextFrame === null) nextFrame = window.requestAnimationFrame(applyTilt);
  }, {passive: true});
  showcase.addEventListener('pointerleave', () => {
    position = null;
    if (nextFrame !== null) window.cancelAnimationFrame(nextFrame);
    nextFrame = null;
    showcase.style.setProperty('--lw-rotate-y', '0deg');
    showcase.style.setProperty('--lw-rotate-x', '0deg');
  });
})();
