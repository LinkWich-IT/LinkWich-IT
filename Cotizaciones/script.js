const conceptosBody = document.getElementById("conceptosBody");

const btnAgregarFila = document.getElementById("btnAgregarFila");
const btnAgregarFilaTop = document.getElementById("btnAgregarFilaTop");
const btnPDF = document.getElementById("btnPDF");
const btnExcel = document.getElementById("btnExcel");
const btnNuevo = document.getElementById("btnNuevo");
const btnGuardar = document.getElementById("btnGuardar");
const btnCargar = document.getElementById("btnCargar");
const btnImportarExcel = document.getElementById("btnImportarExcel");
const inputImportarExcel = document.getElementById("inputImportarExcel");

const subtotalEl = document.getElementById("subtotal");
const descuentoMontoEl = document.getElementById("descuentoMonto");
const ivaMontoEl = document.getElementById("ivaMonto");
const totalEl = document.getElementById("total");
const anticipoMontoEl = document.getElementById("anticipoMonto");

const resConceptos = document.getElementById("resConceptos");
const resSubtotal = document.getElementById("resSubtotal");
const resIVA = document.getElementById("resIVA");
const resTotal = document.getElementById("resTotal");

const ivaInput = document.getElementById("iva");
const descuentoGeneralInput = document.getElementById("descuentoGeneral");
const anticipoInput = document.getElementById("anticipo");

document.getElementById("fecha").valueAsDate = new Date();

function formatMoney(value) {
  const moneda = document.getElementById("moneda").value || "MXN";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
}

function getCurrencyLabel() {
  const moneda = document.getElementById("moneda").value || "MXN";
  return moneda === "USD"
    ? "dólares estadounidenses (USD)"
    : "pesos mexicanos (MXN)";
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function getNextFolioNumber(year) {
  const key = `linkwich_folio_counter_${year}`;
  const current = parseInt(localStorage.getItem(key) || "1014", 10);
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return next;
}

function buildFolio(year, sequence) {
  return `COT-${year}.${sequence}`;
}

function generarNuevoFolio() {
  const year = getCurrentYear();
  const nextNumber = getNextFolioNumber(year);
  const folio = buildFolio(year, nextNumber);
  document.getElementById("folio").value = folio;
  return folio;
}

function formatearFechaVisual(fechaStr) {
  if (!fechaStr) return "-";

  const partes = String(fechaStr).split("-");
  if (partes.length !== 3) return fechaStr;

  const [yyyy, mm, dd] = partes;
  return `${dd}/${mm}/${yyyy}`;
}

function calcularFechaExpiracion(fechaStr, vigenciaDias) {
  if (!fechaStr) return "-";

  const partes = String(fechaStr).split("-");
  if (partes.length !== 3) return "-";

  const anio = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const dia = parseInt(partes[2], 10);
  const dias = parseInt(vigenciaDias, 10) || 0;

  const fecha = new Date(anio, mes, dia);
  if (isNaN(fecha.getTime())) return "-";

  fecha.setDate(fecha.getDate() + dias);

  const dd = String(fecha.getDate()).padStart(2, "0");
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const yyyy = fecha.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

function crearFila(data = {}) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td class="row-number"></td>
    <td>
      <input class="concept-input concepto" type="text" placeholder="Descripción del concepto o servicio" value="${data.concepto || ""}">
    </td>
    <td>
      <input class="concept-input cantidad" type="number" min="0" step="0.01" value="${data.cantidad ?? 1}">
    </td>
    <td>
      <input class="concept-input precio" type="number" min="0" step="0.01" value="${data.precio ?? 0}">
    </td>
    <td>
      <input class="concept-input descuento" type="number" min="0" step="0.01" value="${data.descuento ?? 0}">
    </td>
    <td class="importe-cell">$0.00</td>
    <td>
      <button class="btn-delete" type="button">Eliminar</button>
    </td>
  `;

  const inputs = tr.querySelectorAll("input");
  inputs.forEach(input => {
    input.addEventListener("input", recalcularTodo);
  });

  tr.querySelector(".btn-delete").addEventListener("click", () => {
    tr.remove();
    recalcularTodo();
  });

  conceptosBody.appendChild(tr);
  recalcularTodo();
}

function recalcularTodo() {
  const rows = [...conceptosBody.querySelectorAll("tr")];
  let subtotal = 0;

  rows.forEach((row, index) => {
    row.querySelector(".row-number").textContent = index + 1;

    const cantidad = parseFloat(row.querySelector(".cantidad").value) || 0;
    const precio = parseFloat(row.querySelector(".precio").value) || 0;
    const descuento = parseFloat(row.querySelector(".descuento").value) || 0;

    let importe = cantidad * precio;
    importe -= importe * (descuento / 100);

    row.querySelector(".importe-cell").textContent = formatMoney(importe);
    subtotal += importe;
  });

  const descuentoGeneral = parseFloat(descuentoGeneralInput.value) || 0;
  const iva = parseFloat(ivaInput.value) || 0;
  const anticipo = parseFloat(anticipoInput.value) || 0;

  const descuentoMonto = subtotal * (descuentoGeneral / 100);
  const subtotalConDescuento = subtotal - descuentoMonto;
  const ivaMonto = subtotalConDescuento * (iva / 100);
  const total = subtotalConDescuento + ivaMonto;
  const anticipoMonto = total * (anticipo / 100);

  subtotalEl.textContent = formatMoney(subtotal);
  descuentoMontoEl.textContent = formatMoney(descuentoMonto);
  ivaMontoEl.textContent = formatMoney(ivaMonto);
  totalEl.textContent = formatMoney(total);
  anticipoMontoEl.textContent = formatMoney(anticipoMonto);

  resConceptos.textContent = rows.length;
  resSubtotal.textContent = formatMoney(subtotal);
  resIVA.textContent = formatMoney(ivaMonto);
  resTotal.textContent = formatMoney(total);
}

function obtenerDatosFormulario() {
  const rows = [...conceptosBody.querySelectorAll("tr")];

  const conceptos = rows.map((row, i) => {
    const cantidad = parseFloat(row.querySelector(".cantidad").value) || 0;
    const precio = parseFloat(row.querySelector(".precio").value) || 0;
    const descuento = parseFloat(row.querySelector(".descuento").value) || 0;

    let importe = cantidad * precio;
    importe -= importe * (descuento / 100);

    return {
      no: i + 1,
      concepto: row.querySelector(".concepto").value.trim(),
      cantidad,
      precio,
      descuento,
      importe
    };
  });

  const subtotal = conceptos.reduce((acc, item) => acc + item.importe, 0);
  const descuentoGeneral = parseFloat(descuentoGeneralInput.value) || 0;
  const descuentoMonto = subtotal * (descuentoGeneral / 100);
  const subtotalConDescuento = subtotal - descuentoMonto;
  const iva = parseFloat(ivaInput.value) || 0;
  const ivaMonto = subtotalConDescuento * (iva / 100);
  const total = subtotalConDescuento + ivaMonto;
  const anticipo = parseFloat(anticipoInput.value) || 0;
  const anticipoMonto = total * (anticipo / 100);

  return {
    empresa: document.getElementById("empresa").value,
    correoEmpresa: document.getElementById("correoEmpresa").value,
    telefonoEmpresa: document.getElementById("telefonoEmpresa").value,
    sitioEmpresa: document.getElementById("sitioEmpresa").value,
    ciudadEmpresa: document.getElementById("ciudadEmpresa").value,
    moneda: document.getElementById("moneda").value,

    folio: document.getElementById("folio").value,
    fecha: document.getElementById("fecha").value,
    fechaVisual: formatearFechaVisual(document.getElementById("fecha").value),
    fechaExpiracion: calcularFechaExpiracion(
      document.getElementById("fecha").value,
      document.getElementById("vigencia").value
    ),
    vigencia: document.getElementById("vigencia").value,
    tipoServicio: document.getElementById("tipoServicio").value,

    cliente: document.getElementById("cliente").value,
    contacto: document.getElementById("contacto").value,
    correoCliente: document.getElementById("correoCliente").value,
    telefonoCliente: document.getElementById("telefonoCliente").value,
    proyecto: document.getElementById("proyecto").value,
    ubicacionProyecto: document.getElementById("ubicacionProyecto").value,

    iva,
    descuentoGeneral,
    anticipo,
    formaPago: document.getElementById("formaPago") ? document.getElementById("formaPago").value : "Únicamente mediante transferencia bancaria.",
    notas: document.getElementById("notas").value,
    terminos: document.getElementById("terminos").value,
    monedaDescripcion: getCurrencyLabel(),

    conceptos,
    subtotal,
    descuentoMonto,
    ivaMonto,
    total,
    anticipoMonto
  };
}

function limpiarFormulario() {
  const ids = [
    "cliente", "contacto", "correoCliente", "telefonoCliente",
    "proyecto", "ubicacionProyecto", "notas"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  if (document.getElementById("formaPago")) {
    document.getElementById("formaPago").value = "Únicamente mediante transferencia bancaria.";
  }

  document.getElementById("terminos").value =
    "La presente cotización tiene vigencia conforme al periodo indicado. Los tiempos de entrega pueden variar según disponibilidad. No incluye trabajos adicionales no especificados.";

  document.getElementById("vigencia").value = 15;
  document.getElementById("tipoServicio").selectedIndex = 0;
  document.getElementById("iva").value = 16;
  document.getElementById("descuentoGeneral").value = 0;
  document.getElementById("anticipo").value = 50;
  document.getElementById("fecha").valueAsDate = new Date();

  generarNuevoFolio();

  conceptosBody.innerHTML = "";
  crearFila();
}

function guardarBorrador() {
  const data = obtenerDatosFormulario();
  localStorage.setItem("linkwich_cotizador_borrador", JSON.stringify(data));
  alert("Borrador guardado correctamente.");
}

function cargarBorrador() {
  const raw = localStorage.getItem("linkwich_cotizador_borrador");
  if (!raw) {
    alert("No hay borrador guardado.");
    return;
  }

  const data = JSON.parse(raw);

  document.getElementById("empresa").value = data.empresa || "";
  document.getElementById("correoEmpresa").value = data.correoEmpresa || "";
  document.getElementById("telefonoEmpresa").value = data.telefonoEmpresa || "";
  document.getElementById("sitioEmpresa").value = data.sitioEmpresa || "";
  document.getElementById("ciudadEmpresa").value = data.ciudadEmpresa || "";
  document.getElementById("moneda").value = data.moneda || "MXN";

  document.getElementById("folio").value = data.folio || "";
  document.getElementById("fecha").value = data.fecha || "";
  document.getElementById("vigencia").value = data.vigencia || 15;
  document.getElementById("tipoServicio").value = data.tipoServicio || "Monitoreo de red";

  document.getElementById("cliente").value = data.cliente || "";
  document.getElementById("contacto").value = data.contacto || "";
  document.getElementById("correoCliente").value = data.correoCliente || "";
  document.getElementById("telefonoCliente").value = data.telefonoCliente || "";
  document.getElementById("proyecto").value = data.proyecto || "";
  document.getElementById("ubicacionProyecto").value = data.ubicacionProyecto || "";

  document.getElementById("iva").value = data.iva ?? 16;
  document.getElementById("descuentoGeneral").value = data.descuentoGeneral ?? 0;
  document.getElementById("anticipo").value = data.anticipo ?? 50;

  if (document.getElementById("formaPago")) {
    document.getElementById("formaPago").value = data.formaPago || "Únicamente mediante transferencia bancaria.";
  }

  document.getElementById("notas").value = data.notas || "";
  document.getElementById("terminos").value = data.terminos || "";

  conceptosBody.innerHTML = "";
  (data.conceptos || []).forEach(item => crearFila(item));

  if (!data.conceptos || !data.conceptos.length) {
    crearFila();
  }

  recalcularTodo();
  alert("Borrador cargado correctamente.");
}

function loadImageAsDataURL(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      resolve({
        dataUrl: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height
      });
    };

    img.onerror = function () {
      reject(new Error("No se pudo cargar la imagen del logo: " + src));
    };

    img.src = src;
  });
}

function setFieldIfExists(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) {
    el.value = value;
  }
}

function importarDesdeWorkbook(workbook) {
  const resumenSheet = workbook.Sheets["Resumen"];
  const conceptosSheet = workbook.Sheets["Conceptos"];

  if (!resumenSheet && !conceptosSheet) {
    alert("El archivo no contiene hojas 'Resumen' o 'Conceptos'. Usa el mismo formato exportado por el cotizador.");
    return;
  }

  if (resumenSheet) {
    const resumenRows = XLSX.utils.sheet_to_json(resumenSheet, { header: 1, defval: "" });
    const mapa = {};

    resumenRows.forEach(row => {
      const key = String(row[0] || "").trim().toUpperCase();
      const value = row[1];
      if (key) mapa[key] = value;
    });

    setFieldIfExists("empresa", mapa["EMPRESA"]);
    setFieldIfExists("correoEmpresa", mapa["CORREO EMPRESA"]);
    setFieldIfExists("telefonoEmpresa", mapa["TELÉFONO EMPRESA"]);
    setFieldIfExists("sitioEmpresa", mapa["SITIO WEB"]);
    setFieldIfExists("ciudadEmpresa", mapa["CIUDAD"]);
    setFieldIfExists("folio", mapa["FOLIO"]);
    setFieldIfExists("fecha", mapa["FECHA"]);
    setFieldIfExists("tipoServicio", mapa["TIPO DE SERVICIO"]);
    setFieldIfExists("cliente", mapa["CLIENTE"]);
    setFieldIfExists("contacto", mapa["CONTACTO"]);
    setFieldIfExists("correoCliente", mapa["CORREO CLIENTE"]);
    setFieldIfExists("telefonoCliente", mapa["TELÉFONO CLIENTE"]);
    setFieldIfExists("proyecto", mapa["PROYECTO"]);
    setFieldIfExists("ubicacionProyecto", mapa["UBICACIÓN"]);
    setFieldIfExists("notas", mapa["NOTAS"]);
    setFieldIfExists("terminos", mapa["TÉRMINOS"]);
    setFieldIfExists("formaPago", mapa["FORMA DE PAGO"]);

    if (mapa["MONEDA"] === "MXN" || mapa["MONEDA"] === "USD") {
      setFieldIfExists("moneda", mapa["MONEDA"]);
    }

    if (typeof mapa["VIGENCIA"] === "string") {
      const m = mapa["VIGENCIA"].match(/\d+/);
      if (m) setFieldIfExists("vigencia", m[0]);
    } else if (typeof mapa["VIGENCIA"] === "number") {
      setFieldIfExists("vigencia", mapa["VIGENCIA"]);
    }
  }

  if (conceptosSheet) {
    const conceptos = XLSX.utils.sheet_to_json(conceptosSheet, { defval: "" });

    conceptosBody.innerHTML = "";

    conceptos.forEach(item => {
      crearFila({
        concepto: item.Concepto || item.CONCEPTO || "",
        cantidad: item.Cantidad || item.CANTIDAD || 1,
        precio: item.Precio_Unitario || item.PRECIO_UNITARIO || item["Precio Unitario"] || 0,
        descuento: item.Descuento_Porcentaje || item.DESCUENTO_PORCENTAJE || item["Desc. %"] || 0
      });
    });

    if (!conceptos.length) {
      crearFila();
    }
  }

  recalcularTodo();
  alert("Excel importado correctamente.");
}

function importarExcel(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      importarDesdeWorkbook(workbook);
    } catch (error) {
      console.error(error);
      alert("No se pudo leer el archivo Excel.");
    }
  };
  reader.readAsArrayBuffer(file);
}

async function exportarPDF() {
  try {
    const data = obtenerDatosFormulario();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const footerHeight = 12;

    const primaryBlue = [18, 70, 140];
    const accentBlue = [35, 95, 170];
    const softGray = [245, 247, 250];
    const borderGray = [220, 226, 234];
    const textGray = [95, 105, 120];
    const darkText = [30, 35, 45];

    const contentWidth = pageWidth - (margin * 2);
    const usablePageBottom = pageHeight - footerHeight - 6;

    const fechaCotizacionVisual = formatearFechaVisual(data.fecha);
    const fechaExpiracion = calcularFechaExpiracion(data.fecha, data.vigencia);

    function addFooterToPage(pageNumber) {
      doc.setPage(pageNumber);

      const footerY = pageHeight - 10;
      doc.setDrawColor(...borderGray);
      doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`${data.empresa || "LinkWich-IT"} | ${data.sitioEmpresa || ""}`, margin, footerY);
      doc.text(`Página ${pageNumber} de ${doc.getNumberOfPages()}`, pageWidth - margin, footerY, { align: "right" });
    }

    function addFooterToAllPages() {
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        addFooterToPage(i);
      }
    }

    function ensureSpace(currentY, neededHeight) {
      if (currentY + neededHeight > usablePageBottom) {
        doc.addPage();
        return 20;
      }
      return currentY;
    }

    function drawWrappedTextBlock({
      title,
      text,
      x = margin,
      y,
      width = contentWidth,
      titleColor = accentBlue,
      textColor = darkText,
      titleFontSize = 10,
      textFontSize = 9.2,
      lineHeight = 4.5,
      beforeGap = 0,
      afterGap = 6
    }) {
      let currentY = y + beforeGap;

      const safeText = (text || "").trim();
      if (!safeText) return currentY;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(titleFontSize);
      const titleHeight = 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(textFontSize);
      const lines = doc.splitTextToSize(safeText, width);
      const bodyHeight = Math.max(4.5, lines.length * lineHeight);

      currentY = ensureSpace(currentY, titleHeight + bodyHeight + afterGap);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(titleFontSize);
      doc.setTextColor(...titleColor);
      doc.text(title, x, currentY);

      currentY += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(textFontSize);
      doc.setTextColor(...textColor);
      doc.text(lines, x, currentY);

      currentY += bodyHeight + afterGap;
      return currentY;
    }

    function getWrappedLines(text, width, fontSize = 9.2, fontStyle = "normal") {
      doc.setFont("helvetica", fontStyle);
      doc.setFontSize(fontSize);
      return doc.splitTextToSize(text || "-", width);
    }

    function drawInfoLine(label, value, x, y, width) {
      const labelText = `${label}: `;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      const labelWidth = doc.getTextWidth(labelText);

      const availableWidth = Math.max(20, width - labelWidth);
      const valueLines = getWrappedLines(value || "-", availableWidth, 9.2, "normal");

      doc.setTextColor(...darkText);
      doc.setFont("helvetica", "bold");
      doc.text(labelText, x, y);

      doc.setFont("helvetica", "normal");
      doc.text(valueLines, x + labelWidth, y);

      return Math.max(1, valueLines.length) * 4.5;
    }

    function drawInfoLineMeasure(label, value, width) {
      const labelText = `${label}: `;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      const labelWidth = doc.getTextWidth(labelText);

      const availableWidth = Math.max(20, width - labelWidth);
      const valueLines = getWrappedLines(value || "-", availableWidth, 9.2, "normal");
      return Math.max(1, valueLines.length) * 4.5;
    }

    function drawClientBox(y) {
      const boxX = margin;
      const boxW = contentWidth;
      const innerPadding = 4;
      const titleHeight = 7;
      const leftX = boxX + innerPadding;
      const rightX = boxX + boxW / 2 + 2;
      const colWidth = (boxW / 2) - innerPadding - 6;

      const leftHeights = [
        drawInfoLineMeasure("Cliente", data.cliente, colWidth),
        drawInfoLineMeasure("Contacto", data.contacto, colWidth),
        drawInfoLineMeasure("Correo", data.correoCliente, colWidth)
      ];

      const rightHeights = [
        drawInfoLineMeasure("Teléfono", data.telefonoCliente, colWidth),
        drawInfoLineMeasure("Proyecto", data.proyecto, colWidth),
        drawInfoLineMeasure("Ubicación", data.ubicacionProyecto, colWidth)
      ];

      const leftTotal = leftHeights.reduce((a, b) => a + b, 0);
      const rightTotal = rightHeights.reduce((a, b) => a + b, 0);
      const contentHeight = Math.max(leftTotal, rightTotal);
      const boxH = titleHeight + contentHeight + 8;

      let currentY = ensureSpace(y, boxH + 6);

      doc.setFillColor(...softGray);
      doc.roundedRect(boxX, currentY, boxW, boxH, 3, 3, "F");
      doc.setDrawColor(...borderGray);
      doc.roundedRect(boxX, currentY, boxW, boxH, 3, 3, "S");

      doc.setTextColor(...accentBlue);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("DATOS DEL CLIENTE", boxX + innerPadding, currentY + 7);

      let leftY = currentY + 14;
      let rightY = currentY + 14;

      leftY += drawInfoLine("Cliente", data.cliente || "-", leftX, leftY, colWidth);
      leftY += drawInfoLine("Contacto", data.contacto || "-", leftX, leftY, colWidth);
      leftY += drawInfoLine("Correo", data.correoCliente || "-", leftX, leftY, colWidth);

      rightY += drawInfoLine("Teléfono", data.telefonoCliente || "-", rightX, rightY, colWidth);
      rightY += drawInfoLine("Proyecto", data.proyecto || "-", rightX, rightY, colWidth);
      rightY += drawInfoLine("Ubicación", data.ubicacionProyecto || "-", rightX, rightY, colWidth);

      return currentY + boxH + 6;
    }

    function drawServiceTypeBox(y) {
      const label = "Tipo de servicio:";
      const labelWidth = 34;
      const textWidth = contentWidth - 8 - labelWidth;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      const valueLines = doc.splitTextToSize(data.tipoServicio || "-", textWidth);
      const boxH = Math.max(12, 8 + (valueLines.length * 4.5));

      let currentY = ensureSpace(y, boxH + 6);

      doc.setFillColor(250, 251, 253);
      doc.roundedRect(margin, currentY, contentWidth, boxH, 2, 2, "F");
      doc.setDrawColor(...borderGray);
      doc.roundedRect(margin, currentY, contentWidth, boxH, 2, 2, "S");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accentBlue);
      doc.setFontSize(10);
      doc.text(label, margin + 4, currentY + 7);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(...darkText);
      doc.setFontSize(9.5);
      doc.text(valueLines, margin + 4 + labelWidth, currentY + 7);

      return currentY + boxH + 6;
    }

    function drawFinancialSummary(y) {
      const leftBoxW = 92;
      const rightBoxW = 74;
      const gap = 12;

      const leftX = margin;
      const rightX = margin + leftBoxW + gap;

      const leftH = 17;
      const rightH = 38;
      const rowH = Math.max(leftH, rightH);

      let currentY = ensureSpace(y, rowH + 10);

      doc.setFillColor(236, 244, 255);
      doc.roundedRect(leftX, currentY, leftBoxW, leftH, 3, 3, "F");
      doc.setDrawColor(205, 223, 245);
      doc.roundedRect(leftX, currentY, leftBoxW, leftH, 3, 3, "S");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accentBlue);
      doc.setFontSize(9.4);
      doc.text("ANTICIPO SUGERIDO", leftX + 4, currentY + 6.5);

      doc.setFontSize(12);
      doc.setTextColor(...primaryBlue);
      doc.text(formatMoney(data.anticipoMonto), leftX + 4, currentY + 13);

      doc.setFillColor(...softGray);
      doc.roundedRect(rightX, currentY, rightBoxW, rightH, 3, 3, "F");
      doc.setDrawColor(...borderGray);
      doc.roundedRect(rightX, currentY, rightBoxW, rightH, 3, 3, "S");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accentBlue);
      doc.setFontSize(10);
      doc.text("RESUMEN FINANCIERO", rightX + rightBoxW / 2, currentY + 7, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...textGray);
      doc.text("Subtotal:", rightX + 4, currentY + 15);
      doc.text("Descuento:", rightX + 4, currentY + 21);
      doc.text("IVA:", rightX + 4, currentY + 27);

      doc.setFont("helvetica", "bold");
      doc.text("Total:", rightX + 4, currentY + 34);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(...darkText);
      doc.text(formatMoney(data.subtotal), rightX + rightBoxW - 4, currentY + 15, { align: "right" });
      doc.text(formatMoney(data.descuentoMonto), rightX + rightBoxW - 4, currentY + 21, { align: "right" });
      doc.text(formatMoney(data.ivaMonto), rightX + rightBoxW - 4, currentY + 27, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryBlue);
      doc.text(formatMoney(data.total), rightX + rightBoxW - 4, currentY + 34, { align: "right" });

      return currentY + rightH + 8;
    }

    const headerX = margin;
    const headerY = 10;
    const headerW = contentWidth;
    const headerH = 38;

    doc.setFillColor(...primaryBlue);
    doc.roundedRect(headerX, headerY, headerW, headerH, 4, 4, "F");

    const logoBoxX = headerX + 6;
    const logoBoxY = headerY + 5;
    const logoBoxW = 30;
    const logoBoxH = 28;

    const quoteBoxW = 50;
    const quoteBoxH = 31;
    const quoteBoxX = headerX + headerW - quoteBoxW - 4;
    const quoteBoxY = headerY + 4;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(quoteBoxX, quoteBoxY, quoteBoxW, quoteBoxH, 3, 3, "F");

    try {
      const logo = await loadImageAsDataURL(`assets/logo-pdf.png?v=${Date.now()}`);

      const maxW = logoBoxW;
      const maxH = logoBoxH;
      const ratio = Math.min(maxW / logo.width, maxH / logo.height);
      const drawW = logo.width * ratio;
      const drawH = logo.height * ratio;
      const drawX = logoBoxX + (logoBoxW - drawW) / 2;
      const drawY = logoBoxY + (logoBoxH - drawH) / 2;

      doc.addImage(logo.dataUrl, "PNG", drawX, drawY, drawW, drawH);
    } catch (e) {
      console.warn(e.message);
    }

    const infoX = headerX + 44;
    const infoY = headerY + 8;
    const infoW = quoteBoxX - infoX - 6;

    doc.setTextColor(255, 255, 255);

    let empresaFontSize = 15;
    doc.setFont("helvetica", "bold");

    while (empresaFontSize >= 10) {
      doc.setFontSize(empresaFontSize);
      const lines = doc.splitTextToSize(data.empresa || "LinkWich-IT", infoW);
      if (lines.length <= 2) break;
      empresaFontSize -= 1;
    }

    doc.setFontSize(empresaFontSize);
    const empresaLines = doc.splitTextToSize(data.empresa || "LinkWich-IT", infoW);
    doc.text(empresaLines, infoX, infoY);

    const empresaTextHeight = empresaLines.length * (empresaFontSize * 0.42);
    let lineY = infoY + empresaTextHeight + 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);

    const contactoLines = [
      data.correoEmpresa || "-",
      data.telefonoEmpresa || "-",
      data.sitioEmpresa || "-"
    ];

    contactoLines.forEach(line => {
      const wrapped = doc.splitTextToSize(line, infoW);
      doc.text(wrapped, infoX, lineY);
      lineY += wrapped.length * 4.2;
    });

    doc.setTextColor(...primaryBlue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("COTIZACIÓN", quoteBoxX + quoteBoxW / 2, quoteBoxY + 6.8, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.text(`Folio: ${data.folio || "-"}`, quoteBoxX + 4, quoteBoxY + 12);
    doc.text(`Fecha: ${fechaCotizacionVisual || "-"}`, quoteBoxX + 4, quoteBoxY + 17);
    doc.text(`Vigencia: ${data.vigencia || "-"} días`, quoteBoxX + 4, quoteBoxY + 22);
    doc.text(`Expira: ${fechaExpiracion || "-"}`, quoteBoxX + 4, quoteBoxY + 27);

    let y = headerY + headerH + 8;

    y = drawClientBox(y);
    y = drawServiceTypeBox(y);

    const tableData = data.conceptos.map(item => [
      item.no,
      item.concepto || "-",
      item.cantidad,
      formatMoney(item.precio),
      `${item.descuento}%`,
      formatMoney(item.importe)
    ]);

    doc.autoTable({
      startY: y,
      head: [["#", "Concepto", "Cantidad", "P. Unitario", "Desc.", "Importe"]],
      body: tableData,
      theme: "grid",
      margin: { left: margin, right: margin, bottom: footerHeight + 4 },
      styles: {
        fontSize: 8.8,
        cellPadding: 3,
        textColor: darkText,
        lineColor: borderGray,
        lineWidth: 0.2,
        overflow: "linebreak",
        valign: "middle"
      },
      headStyles: {
        fillColor: primaryBlue,
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252]
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { cellWidth: 82 },
        2: { halign: "center", cellWidth: 18 },
        3: { halign: "right", cellWidth: 26 },
        4: { halign: "center", cellWidth: 18 },
        5: { halign: "right", cellWidth: 28 }
      },
      didDrawPage: function () {
      }
    });

    let finalY = doc.lastAutoTable.finalY + 8;

    y = drawFinancialSummary(finalY);

    const formaPagoTexto = data.formaPago || "Únicamente mediante transferencia bancaria.";
    y = drawWrappedTextBlock({
      title: "FORMA DE PAGO",
      text: formaPagoTexto,
      y: y,
      width: contentWidth
    });

    if (data.terminos && data.terminos.trim()) {
      const terminosCompletos =
        `Todos los precios están expresados en ${data.monedaDescripcion} e incluyen IVA, salvo que se indique lo contrario. ${data.terminos.trim()}`;

      y = drawWrappedTextBlock({
        title: "TÉRMINOS Y CONDICIONES",
        text: terminosCompletos,
        y: y,
        width: contentWidth
      });
    }

    if (data.notas && data.notas.trim()) {
      y = drawWrappedTextBlock({
        title: "NOTAS",
        text: data.notas.trim(),
        y: y,
        width: contentWidth
      });
    }

    addFooterToAllPages();

    const nombreArchivo = `Cotizacion_${(data.folio || "sin_folio").replace(/\s+/g, "_")}.pdf`;
    doc.save(nombreArchivo);

  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al generar el PDF. Revisa que exista assets/logo-pdf.png");
  }
}

function exportarExcel() {
  const data = obtenerDatosFormulario();

  const wb = XLSX.utils.book_new();

  const hojaResumen = [
    ["EMPRESA", data.empresa],
    ["CORREO EMPRESA", data.correoEmpresa],
    ["TELÉFONO EMPRESA", data.telefonoEmpresa],
    ["SITIO WEB", data.sitioEmpresa],
    ["CIUDAD", data.ciudadEmpresa],
    [],
    ["FOLIO", data.folio],
    ["FECHA", data.fecha],
    ["FECHA VISUAL", data.fechaVisual],
    ["EXPIRA", data.fechaExpiracion],
    ["VIGENCIA", `${data.vigencia} días`],
    ["TIPO DE SERVICIO", data.tipoServicio],
    [],
    ["CLIENTE", data.cliente],
    ["CONTACTO", data.contacto],
    ["CORREO CLIENTE", data.correoCliente],
    ["TELÉFONO CLIENTE", data.telefonoCliente],
    ["PROYECTO", data.proyecto],
    ["UBICACIÓN", data.ubicacionProyecto],
    [],
    ["FORMA DE PAGO", data.formaPago],
    ["MONEDA", data.moneda],
    ["DESCRIPCIÓN MONEDA", data.monedaDescripcion],
    [],
    ["SUBTOTAL", data.subtotal],
    ["DESCUENTO GENERAL", data.descuentoMonto],
    ["IVA", data.ivaMonto],
    ["TOTAL", data.total],
    ["ANTICIPO SUGERIDO", data.anticipoMonto],
    [],
    ["NOTAS", data.notas],
    ["TÉRMINOS", data.terminos]
  ];

  const hojaConceptos = data.conceptos.map(item => ({
    No: item.no,
    Concepto: item.concepto,
    Cantidad: item.cantidad,
    Precio_Unitario: item.precio,
    Descuento_Porcentaje: item.descuento,
    Importe: item.importe
  }));

  const wsResumen = XLSX.utils.aoa_to_sheet(hojaResumen);
  const wsConceptos = XLSX.utils.json_to_sheet(hojaConceptos);

  XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");
  XLSX.utils.book_append_sheet(wb, wsConceptos, "Conceptos");

  const nombreArchivo = `Cotizacion_${(data.folio || "sin_folio").replace(/\s+/g, "_")}.xlsx`;
  XLSX.writeFile(wb, nombreArchivo);
}

btnAgregarFila.addEventListener("click", () => crearFila());
btnAgregarFilaTop.addEventListener("click", () => crearFila());
btnPDF.addEventListener("click", exportarPDF);
btnExcel.addEventListener("click", exportarExcel);

btnNuevo.addEventListener("click", () => {
  if (confirm("¿Deseas limpiar la cotización actual?")) {
    limpiarFormulario();
  }
});

btnGuardar.addEventListener("click", guardarBorrador);
btnCargar.addEventListener("click", cargarBorrador);

if (btnImportarExcel && inputImportarExcel) {
  btnImportarExcel.addEventListener("click", () => inputImportarExcel.click());
  inputImportarExcel.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    importarExcel(file);
    e.target.value = "";
  });
}

[ivaInput, descuentoGeneralInput, anticipoInput, document.getElementById("moneda")].forEach(el => {
  el.addEventListener("input", recalcularTodo);
  el.addEventListener("change", recalcularTodo);
});

if (!document.getElementById("folio").value.trim()) {
  generarNuevoFolio();
}

crearFila({
  concepto: "Servicio profesional",
  cantidad: 1,
  precio: 0,
  descuento: 0
});
