"use strict";

const chapters = [...document.querySelectorAll(".chapter")];
const navLinks = [...document.querySelectorAll("nav a")];
const present = document.querySelector("#present");
const controls = document.querySelector("#present-controls");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const exit = document.querySelector("#exit");
const pageNumber = document.querySelector("#page-number");
const progress = document.querySelector("#progress");
const header = document.querySelector(".site-header");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let currentChapter = 0;
let presentationActive = false;
let scrollScheduled = false;

function updateNavigation() {
  const page = document.documentElement;
  const available = page.scrollHeight - innerHeight;
  const atBottom = available > 0 && scrollY >= available - 2;
  const marker = header.offsetHeight + Math.min(150, innerHeight * .2);
  currentChapter = atBottom ? chapters.length - 1 : chapters.reduce(
    (active, section, index) => section.getBoundingClientRect().top <= marker ? index : active, 0
  );

  previous.disabled = currentChapter === 0;
  next.disabled = currentChapter === chapters.length - 1;
  const count = (currentChapter + 1) + " / " + chapters.length;
  if (pageNumber.textContent !== count) pageNumber.textContent = count;
  progress.style.transform = "scaleX(" + (available > 0 ? scrollY / available : 0) + ")";
  for (const link of navLinks) {
    if (link.hash === "#" + chapters[currentChapter].id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  scrollScheduled = false;
}

function scheduleNavigation() {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(updateNavigation);
}

function goToChapter(index, immediate = false) {
  chapters[index]?.scrollIntoView({ behavior: immediate || reducedMotion.matches ? "instant" : "smooth" });
  scheduleNavigation();
}

function setPresentation(active) {
  presentationActive = active;
  document.body.classList.toggle("presenting", active);
  controls.hidden = !active;
  present.setAttribute("aria-pressed", String(active));
  goToChapter(currentChapter, true);
  (active ? controls.querySelector("button:not(:disabled)") : present)?.focus({ preventScroll: true });
}

present.addEventListener("click", async () => {
  if (presentationActive) {
    exit.click();
    return;
  }
  setPresentation(true);
  try {
    await document.documentElement.requestFullscreen?.();
  } catch {
    // On browsers that restrict fullscreen, the chapter controls remain available.
  }
});
exit.addEventListener("click", () => {
  setPresentation(false);
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
});
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && presentationActive) setPresentation(false);
});
previous.addEventListener("click", () => goToChapter(currentChapter - 1));
next.addEventListener("click", () => goToChapter(currentChapter + 1));
document.addEventListener("keydown", (event) => {
  if (!presentationActive || event.defaultPrevented || document.querySelector("dialog[open]")) return;
  if (event.key === "Escape") {
    exit.click();
    return;
  }
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest("[role=tablist]")) return;
  const moves = { ArrowLeft: -1, ArrowRight: 1, PageUp: -1, PageDown: 1 };
  if (Object.hasOwn(moves, event.key)) {
    event.preventDefault();
    goToChapter(currentChapter + moves[event.key]);
  }
});
window.addEventListener("scroll", scheduleNavigation, { passive: true });
window.addEventListener("resize", scheduleNavigation);
updateNavigation();

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const reveals = new IntersectionObserver((entries, observer) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.classList.replace("waiting", "shown");
      observer.unobserve(target);
    }
  }, { threshold: .1 });
  for (const target of document.querySelectorAll(".reveal")) {
    target.classList.add("waiting");
    reveals.observe(target);
  }
}

const graph = document.querySelector("#traffic");
const ctx = graph.getContext("2d");
const values = [1.5,2.1,1.9,2.8,2.55,3.5,3,4.55,3.75,5.3,4.6,4.9,4.35,5.5,5.05,6.2,5.65,6.65,6.4,9.1,7.7,8.15,6.85,7.5,6.7,7.15,6.1,6.6,5.9,6.35];
function drawTraffic() {
  if (!ctx) return;
  const width = graph.clientWidth;
  const height = graph.clientHeight;
  if (!width || !height) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  graph.width = Math.round(width * ratio);
  graph.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.strokeStyle = "#b28be62e";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = 3 + (height - 6) * i / 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.beginPath();
  values.forEach((value, index) => {
    const x = width * index / (values.length - 1);
    const y = height - 3 - value * (height - 6) / 10;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#c09aff";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  const fill = ctx.createLinearGradient(0, 0, 0, height);
  fill.addColorStop(0, "#ac72fd70");
  fill.addColorStop(1, "#ac72fd05");
  ctx.fillStyle = fill;
  ctx.fill();
}
if ("ResizeObserver" in window) new ResizeObserver(drawTraffic).observe(graph);
else window.addEventListener("resize", drawTraffic);
drawTraffic();

const siteMarkers = [...document.querySelectorAll(".site-marker")];
const siteName = document.getElementById("dash-site-name");
const siteDevices = document.getElementById("dash-site-devices");

for (const marker of siteMarkers) {
  marker.addEventListener("click", () => {
    for (const option of siteMarkers) option.setAttribute("aria-pressed", String(option === marker));
    siteName.textContent = marker.dataset.site;
    siteDevices.textContent = marker.dataset.devices;
  });
}

const demo = document.querySelector("#demo");
const tabs = [...demo.querySelectorAll("[role=tab]")];
const incidentButtons = [...demo.querySelectorAll("[data-incident]")];
const linkButtons = [...demo.querySelectorAll("[data-link]")];
const activeIncidents = new Set();
const events = [];
const alerts = [];
let selectedLink = "access";
let demoMinute = 40;

const links = {
  access: ["Core principal ↔ Switch de acceso", "Te1/1/1 ↔ Te1/0/48", "10 (Datos), 20 (Voz)", "10 Gbps", "3.2 Gbps", "1.4 Gbps"],
  servers: ["Core principal ↔ Switch de servidores", "Te1/1/2 ↔ Te1/0/48", "30 (Servidores)", "10 Gbps", "2.6 Gbps", "1.1 Gbps"],
  wan: ["Core principal ↔ Router perimetral", "Gi1/0/24 ↔ Gi0/1", "99 (Tránsito)", "1 Gbps", "415 Mbps", "108 Mbps"],
  pc1: ["Switch de acceso ↔ PC-01", "Gi1/0/12 ↔ eth0", "10 (Datos)", "1 Gbps", "38 Mbps", "7 Mbps"],
  pc2: ["Switch de acceso ↔ PC-02", "Gi1/0/18 ↔ eth0", "10 (Datos)", "1 Gbps", "24 Mbps", "4 Mbps"],
  server: ["Switch de servidores ↔ SRV-01", "Te1/0/1 ↔ eth0", "30 (Servidores)", "10 Gbps", "1.1 Gbps", "780 Mbps"],
  nas: ["Switch de servidores ↔ NAS-01", "Te1/0/2 ↔ eth0", "30 (Servidores)", "10 Gbps", "940 Mbps", "310 Mbps"]
};
const linkMacs = {
  access: ["02:00:00:01:01:01", "02:00:00:10:00:48"],
  servers: ["02:00:00:01:01:02", "02:00:00:30:00:48"],
  wan: ["02:00:00:01:00:24", "02:00:00:99:00:01"],
  pc1: ["02:00:00:20:00:12", "02:00:00:10:00:12"],
  pc2: ["02:00:00:20:00:18", "02:00:00:10:00:18"],
  server: ["02:00:00:30:00:01", "02:00:00:30:10:01"],
  nas: ["02:00:00:30:00:02", "02:00:00:30:10:02"]
};
const accessLinks = new Set(["access", "pc1", "pc2"]);

const incidents = {
  outage: {
    source: "Core principal", severity: "Crítico",
    message: "Enlace de acceso caído · Te1/1/1 sin señal",
    recovery: "Enlace de acceso restablecido · Te1/1/1 operativo",
    link: "access"
  },
  cpu: {
    source: "SRV-01", severity: "Alto",
    message: "CPU de SRV-01 al 90 % · Umbral configurado: 85 %",
    recovery: "CPU de SRV-01 normalizada al 32 %",
    link: "server"
  },
  duplicate: {
    source: "Switch de acceso", severity: "Advertencia",
    message: "IP duplicada 192.0.2.42 · VLAN 10 (Datos)",
    recovery: "Conflicto de IP resuelto · VLAN 10 (Datos)",
    link: "pc2"
  }
};

function showStage(index) {
  hideTooltip();
  tabs.forEach((tab, position) => {
    const selected = index === position;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
  });
}

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener("click", () => showStage(index));
  tab.addEventListener("keydown", (event) => {
    const indices = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1
    };
    if (!Object.hasOwn(indices, event.key)) return;
    event.preventDefault();
    showStage(indices[event.key]);
    tabs[indices[event.key]].focus();
  });
}

function demoText(id, value) {
  document.getElementById(id).textContent = value;
}

function demoTime() {
  return String(10 + Math.floor(demoMinute / 60)).padStart(2, "0") + ":" +
    String(demoMinute++ % 60).padStart(2, "0");
}

function showRows(id, rows) {
  const body = document.getElementById(id);
  body.replaceChildren();
  for (const values of rows) {
    const row = body.insertRow();
    for (const value of values) row.insertCell().textContent = value;
  }
}

function linkData(key) {
  const [name, interfaces, vlans, speed, rx, tx] = links[key];
  const [macA, macB] = linkMacs[key];
  const down = activeIncidents.has("outage") && accessLinks.has(key);
  const conflict = activeIncidents.has("duplicate") && ["pc1", "pc2"].includes(key);
  return {
    name, interfaces: interfaces + " · VLAN " + vlans, speed,
    rx: down ? "0 Mbps" : rx, tx: down ? "0 Mbps" : tx,
    status: down ? "Sin conexión" : conflict ? "Conflicto de IP" : "Operativo",
    "mac-a": macA, "mac-b": macB
  };
}

function renderLinkDetails(prefix, key) {
  for (const [field, value] of Object.entries(linkData(key))) {
    demoText(prefix + "-" + field, value);
  }
}

function renderMap() {
  const outage = activeIncidents.has("outage");
  const duplicate = activeIncidents.has("duplicate");
  const cpu = activeIncidents.has("cpu");

  for (const button of linkButtons) {
    const key = button.dataset.link;
    button.setAttribute("aria-pressed", String(key === selectedLink));
    button.classList.toggle("link-down", outage && accessLinks.has(key));
  }
  document.getElementById("node-access").classList.toggle("node-down", outage);
  document.getElementById("node-server").classList.toggle("node-warning", cpu);
  for (const device of ["pc1", "pc2"]) {
    const node = document.getElementById("node-" + device);
    node.classList.toggle("node-warning", duplicate);
    node.classList.toggle("node-down", outage);
    node.querySelector("small").textContent = outage ? "Sin conexión" : duplicate ? "Conflicto de IP" : "Datos";
  }
  demoText("state-access", outage ? "Sin conexión con el core" : "Operativo · Datos / Voz");
  demoText("state-server", "Servidor · CPU " + (cpu ? "90 %" : "32 %"));
  renderLinkDetails("link", selectedLink);
  if (tooltipAnchor) {
    renderLinkDetails("tooltip", tooltipAnchor.dataset.link);
    positionTooltip();
  }
}

function renderDemo() {
  const cpu = activeIncidents.has("cpu");
  const duplicate = activeIncidents.has("duplicate");
  demoText("demo-cpu", cpu ? "90 %" : "32 %");
  demoText("demo-count", activeIncidents.size);
  document.getElementById("demo-cpu").classList.toggle("gold", cpu);
  document.getElementById("demo-count").classList.toggle("gold", activeIncidents.size > 0);
  for (const button of incidentButtons) {
    button.setAttribute("aria-pressed", String(activeIncidents.has(button.dataset.incident)));
  }
  renderMap();
  demoText("alert-summary", alerts.length ? "Último aviso de ejemplo: " + alerts[0][1] : "Activa un escenario para ver sus avisos de ejemplo.");
  showRows("alert-log", alerts.length ? alerts : [["—", "Sin avisos registrados", "—"]]);
  showRows("event-log", events);
  demoText("capture-notice", duplicate
    ? "Conflicto detectado: dos equipos anuncian 192.0.2.42 con MAC distintas en VLAN 10. Revisa los puertos Gi1/0/12 y Gi1/0/18."
    : "La muestra ARP ilustra cómo se ve el tráfico cuando cada IP corresponde a una sola MAC.");
  showRows("capture-log", [
    ["10:40:12", "ARP", "192.0.2.42", "02:00:00:10:00:12", "Gi1/0/12"],
    ["10:40:13", "ARP", duplicate ? "192.0.2.42" : "192.0.2.43", "02:00:00:10:00:18", "Gi1/0/18"]
  ]);
}

function resetDemo() {
  activeIncidents.clear();
  events.length = 0;
  alerts.length = 0;
  selectedLink = "access";
  demoMinute = 40;
  events.push([demoTime(), "Monitor", "Info", "Sitio operativo al inicio de la simulación"]);
  showStage(0);
  hideTooltip();
  renderDemo();
}

const mapPanel = document.getElementById("panel-mapa");
const mapContent = document.getElementById("map-content");
const mapFrame = mapContent.querySelector(".map-frame");
const tooltip = document.getElementById("map-tooltip");
const mapDialog = document.getElementById("map-dialog");
const dialogBody = document.getElementById("map-dialog-body");
const expandMap = document.getElementById("expand-map");
let tooltipAnchor = null;

function positionTooltip() {
  if (!tooltipAnchor || tooltip.hidden) return;
  const frame = mapFrame.getBoundingClientRect();
  const anchor = tooltipAnchor.getBoundingClientRect();
  const { width, height } = tooltip.getBoundingClientRect();
  const center = anchor.left + anchor.width / 2 - frame.left;
  const left = Math.max(7, Math.min(center - width / 2, frame.width - width - 7));
  const viewportBottom = mapDialog.open ? mapDialog.getBoundingClientRect().bottom : window.innerHeight;
  const showsAbove = anchor.bottom + height + 4 > viewportBottom && anchor.top - height >= 0;
  tooltip.style.left = left + "px";
  tooltip.style.top = (showsAbove ? anchor.top - height : anchor.bottom) - frame.top + "px";
}

function hideTooltip() {
  tooltipAnchor?.removeAttribute("aria-describedby");
  tooltipAnchor = null;
  tooltip.hidden = true;
}

function showTooltip(button) {
  if (tooltipAnchor !== button) hideTooltip();
  tooltipAnchor = button;
  renderLinkDetails("tooltip", button.dataset.link);
  tooltip.hidden = false;
  button.setAttribute("aria-describedby", tooltip.id);
  positionTooltip();
}

for (const button of linkButtons) {
  button.addEventListener("pointerenter", ({ pointerType }) => {
    if (pointerType !== "touch") showTooltip(button);
  });
  button.addEventListener("pointerleave", ({ relatedTarget }) => {
    if (tooltipAnchor === button && !tooltip.contains(relatedTarget) && !button.matches(":focus-visible")) {
      hideTooltip();
    }
  });
  button.addEventListener("focus", () => showTooltip(button));
  button.addEventListener("blur", () => {
    if (tooltipAnchor === button) hideTooltip();
  });
  button.addEventListener("click", () => {
    selectedLink = button.dataset.link;
    showTooltip(button);
    renderMap();
  });
}

tooltip.addEventListener("pointerleave", ({ relatedTarget }) => {
  if (tooltipAnchor && !tooltipAnchor.contains(relatedTarget) && !tooltipAnchor.matches(":focus-visible")) {
    hideTooltip();
  }
});
document.addEventListener("pointerdown", ({ target }) => {
  if (tooltipAnchor && !tooltip.contains(target) && !tooltipAnchor.contains(target)) hideTooltip();
});
mapContent.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && tooltipAnchor) {
    event.preventDefault();
    hideTooltip();
  }
});
window.addEventListener("resize", positionTooltip);
window.addEventListener("scroll", positionTooltip, { passive: true });
mapDialog.addEventListener("scroll", positionTooltip, { passive: true });

expandMap.addEventListener("click", () => {
  hideTooltip();
  dialogBody.append(mapContent);
  mapDialog.showModal();
});
document.getElementById("close-map").addEventListener("click", () => mapDialog.close());
mapDialog.addEventListener("close", () => {
  hideTooltip();
  mapPanel.insertBefore(mapContent, mapDialog);
  expandMap.focus({ preventScroll: true });
});

for (const button of incidentButtons) {
  button.addEventListener("click", () => {
    const key = button.dataset.incident;
    const scenario = incidents[key];
    const starting = !activeIncidents.has(key);
    const message = starting ? scenario.message : scenario.recovery;
    const time = demoTime();
    if (starting) {
      activeIncidents.add(key);
      alerts.unshift([time, message, "Correo · WhatsApp · Interfaz web (simulado)"]);
    } else {
      activeIncidents.delete(key);
    }
    selectedLink = scenario.link;
    events.unshift([time, scenario.source, starting ? scenario.severity : "Info", message]);
    renderDemo();
    demoText("demo-announcement", message);
  });
}

document.getElementById("emit-syslog").addEventListener("click", () => {
  const message = "Syslog de prueba · Gi1/0/12 cambió a estado operativo";
  events.unshift([demoTime(), "Switch de acceso", "Info", message]);
  showRows("event-log", events);
  demoText("demo-announcement", message);
});

document.getElementById("reset-demo").addEventListener("click", () => {
  resetDemo();
  demoText("demo-announcement", "Demostración reiniciada.");
});
resetDemo();
