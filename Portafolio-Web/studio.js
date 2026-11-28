const demos = {
  arquitectura: {
    theme: "arch", name: "Terral Estudio", type: "Arquitectura",
    title: "Habitar el desierto.", intro: "Arquitectura que sigue la luz, el relieve y los materiales de Baja California.",
    link: "Explorar proyectos", section: "Proyectos conceptuales",
    image: "Concreto acanalado en un paisaje desértico",
    gallery: [["arquitectura-2", "Patio con agaves entre muros de concreto"], ["arquitectura-3", "Interior de concreto con luz rasante"]],
    items: [["Casa Umbral", "Patios que dan sombra y ventilación."], ["Pabellón de piedra", "Una cubierta ligera sobre roca local."], ["Patio del viento", "Un espacio abierto protegido por muros de concreto."]]
  },
  negocios: {
    theme: "business", name: "Casa Meridiano", type: "Negocios",
    title: "Un lugar para hacer negocios.", intro: "Un concepto de espacios de trabajo con oficinas privadas y salas de reunión en Los Cabos.",
    link: "Conocer los espacios", section: "Espacios y servicios",
    image: "Sala de reuniones con acabados de madera y vista al mar",
    gallery: [["negocios-2", "Salón de trabajo compartido con acabados de nogal"], ["negocios-3", "Sala ejecutiva con sillas de piel y vista al mar"]],
    items: [["Oficinas privadas", "Un espacio para el trabajo diario de tu equipo."], ["Salas de reunión", "Un punto de encuentro con clientes y socios."], ["Eventos corporativos", "Espacios para presentaciones y reuniones de equipo."]]
  },
  tecnologia: {
    theme: "tech", name: "LinkWich‑Monitor", type: "Tecnología",
    title: "Tu red a la vista.", intro: "Una presentación de LinkWich‑Monitor para equipos que administran infraestructura tecnológica.",
    link: "Explorar funciones", section: "Qué puedes monitorear",
    image: "Pasillo de racks de red con iluminación violeta",
    gallery: [["tecnologia-2", "Cableado de red al reverso de un rack"], ["tecnologia-3", "Centro de operaciones de red con pantallas de monitoreo"]],
    items: [["Disponibilidad", "Consulta el estado de tus dispositivos."], ["Alertas", "Recibe avisos de eventos en tu infraestructura."], ["Topología", "Visualiza las conexiones de tu red."]],
    url: "https://www.linkwich-it.com/LinkWich-Monitor-Presentacion/"
  },
  fotografia: {
    theme: "photo", name: "Luz de costa", type: "Fotografía",
    title: "A orillas del silencio.", intro: "Una galería conceptual sobre la luz, la piedra y el mar en Baja California.",
    link: "Explorar la serie", section: "La serie",
    image: "Costa rocosa con oleaje y neblina al anochecer",
    gallery: [["fotografia-2", "Olas de tormenta a la hora azul"], ["fotografia-3", "Costa arenosa envuelta en niebla al amanecer"], ["fotografia-4", "Acantilados costeros al anochecer"]],
    items: [["Marea", "El movimiento del agua sobre la roca."], ["Bruma", "La niebla borra la línea del horizonte."], ["Última luz", "Los tonos fríos que quedan al caer la tarde."]]
  },
  hoteleria: {
    theme: "hotel", name: "Bruma Baja", type: "Hotelería",
    title: "Despierta frente al mar.", intro: "Un hotel boutique conceptual donde la estadía empieza por descubrir el paisaje.",
    link: "Conocer la estancia", section: "La experiencia", kicker: "Hotel boutique · Baja California",
    image: "Alberca infinita de un hotel boutique al atardecer",
    gallery: [["hoteleria-2", "Recepción al aire libre con muros de piedra"], ["hoteleria-3", "Suite con textiles de lino y vista al océano"]],
    items: [["Estancia", "Suites con luz natural y espacios para descansar."], ["Piscina", "Una terraza abierta al horizonte."], ["Llegada", "Una recepción al aire libre entre piedra y vegetación."]]
  },
  gastronomia: {
    theme: "food", name: "Mesa Salina", type: "Gastronomía",
    title: "Cocina de costa.", intro: "Una propuesta web para un restaurante que cuenta su historia desde el salón hasta el plato.",
    link: "Descubrir la mesa", section: "Cocina y ambiente", kicker: "Restaurante de costa",
    image: "Restaurante de costa con iluminación tenue",
    gallery: [["gastronomia-2", "Plato de pescado de costa con cítricos"], ["gastronomia-3", "Mesa para cenar frente a una ventana con vista marina"]],
    items: [["Cocina", "Ingredientes de costa y preparaciones de temporada."], ["Salón", "Mesas para comidas largas frente al mar."], ["Reservas", "Una sección para consultar horarios y planear tu visita."]]
  },
  inmobiliaria: {
    theme: "estate", name: "Alto Marea", type: "Inmobiliaria",
    title: "Una casa abierta al horizonte.", intro: "Una vitrina conceptual para residencias que se entienden mejor recorriendo sus espacios.",
    link: "Recorrer la propiedad", section: "Espacios de la residencia", kicker: "Portafolio residencial · Los Cabos",
    image: "Villa contemporánea frente al mar con alberca",
    gallery: [["inmobiliaria-2", "Sala de una villa abierta al océano"], ["inmobiliaria-3", "Terraza residencial con palmeras al atardecer"]],
    items: [["Exterior", "Alberca y fachada orientadas hacia el mar."], ["Interior", "Una sala que se abre por completo a la terraza."], ["Terraza", "Espacio exterior para disfrutar la puesta de sol."]]
  }
};

const dialog = document.querySelector("#demo");
const body = document.querySelector("#demo-body");
const closeButton = document.querySelector("#close-demo");
const caption = document.querySelector("#demo-caption");

const contactUrl = "https://www.linkwich-it.com/#contact";
let gallery = [];
let activeImage = 0;

function showImage(index) {
  activeImage = (index + gallery.length) % gallery.length;
  const [file, description] = gallery[activeImage];
  const image = body.querySelector(".gallery-main img");
  const nextSrc = "media/" + file + ".webp";
  if (image.getAttribute("src") !== nextSrc) {
    image.src = nextSrc;
    image.alt = description;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      image.animate([{ opacity: .45 }, { opacity: 1 }], { duration: 360 });
    }
  }
  body.querySelector(".gallery-count").textContent = (activeImage + 1) + " / " + gallery.length;
  body.querySelector(".gallery-caption").textContent = description;
  body.querySelectorAll("[data-photo]").forEach((button, i) => {
    button.setAttribute("aria-pressed", String(i === activeImage));
  });
}

document.querySelectorAll("[data-demo]").forEach(button => {
  button.addEventListener("click", () => {
    const key = button.dataset.demo;
    const demo = demos[key];
    gallery = [[key, demo.image], ...demo.gallery];
    const official = demo.url
      ? '<a class="scene-action" href="' + demo.url + '">Ver presentación oficial ↗</a>'
      : "";
    caption.textContent = "Demo · " + demo.type;
    const selector = key === "negocios" ? `
      <div class="design-selector" role="group" aria-label="Diseño de Casa Meridiano">
        <span>Comparar diseños</span>
        <button type="button" data-design="classic" aria-pressed="true">Clásico</button>
        <button type="button" data-design="editorial" aria-pressed="false">Editorial</button>
      </div>` : "";
    body.innerHTML = `${selector}
      <article class="scene ${demo.theme}">
        <div class="scene-nav"><strong>${demo.name}</strong><a href="#demo-details">${demo.section}</a></div>
        <div class="scene-hero">
          <div class="scene-copy">${demo.kicker ? `<p class="scene-kicker">${demo.kicker}</p>` : ""}<h2 id="demo-title">${demo.title}</h2><p>${demo.intro}</p><a href="#demo-details">${demo.link} ↓</a></div>
          <figure><img src="media/${key}.webp" alt="${demo.image}"></figure>
        </div>
        <section class="scene-details" id="demo-details" tabindex="-1">
          <h3>${demo.section}</h3>
          <div class="scene-content">
          <div class="scene-gallery" role="group" aria-label="Galería de ${demo.type}">
            <figure class="gallery-main">
              <img src="media/${key}.webp" alt="${demo.image}" width="768" height="512">
              <figcaption class="gallery-overlay">
                <span class="gallery-count"></span>
                <button type="button" data-direction="-1" aria-label="Imagen anterior">←</button>
                <button type="button" data-direction="1" aria-label="Imagen siguiente">→</button>
              </figcaption>
            </figure>
            <p class="gallery-caption" aria-live="polite"></p>
            <div class="gallery-thumbs">
              ${gallery.map(([file, description], i) => `<button type="button" data-photo="${i}" aria-label="${description}" aria-pressed="false"><img src="media/${file}.webp" alt="" width="512" height="341" loading="lazy"></button>`).join("")}
            </div>
          </div>
          <ul>${demo.items.map(([name, description]) => `<li><strong>${name}</strong><span>${description}</span></li>`).join("")}</ul>
          </div>
          <div class="scene-actions"><a class="scene-action scene-primary" href="${contactUrl}">Quiero un sitio así ↗</a>${official}</div>
        </section>
      </article>`;
    showImage(0);
    dialog.showModal();
    dialog.scrollTop = 0;
    closeButton.focus();
  });
});

body.addEventListener("click", event => {
  const design = event.target.closest("[data-design]");
  if (design && design.getAttribute("aria-pressed") === "false") {
    body.querySelector(".scene").classList.toggle("business-editorial", design.dataset.design === "editorial");
    body.querySelectorAll("[data-design]").forEach(option => {
      option.setAttribute("aria-pressed", String(option === design));
    });
  }
  const photo = event.target.closest("[data-photo]");
  const arrow = event.target.closest("[data-direction]");
  if (photo) showImage(Number(photo.dataset.photo));
  if (arrow) showImage(activeImage + Number(arrow.dataset.direction));
  if (!event.target.closest('a[href="#demo-details"]')) return;
  event.preventDefault();
  const section = body.querySelector("#demo-details");
  section.focus({preventScroll: true});
  section.scrollIntoView({block: "start"});
});

body.addEventListener("keydown", event => {
  if (!event.target.closest(".scene-gallery")) return;
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  showImage(activeImage + (event.key === "ArrowRight" ? 1 : -1));
});
closeButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
