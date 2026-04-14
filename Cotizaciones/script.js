const conceptosBody = document.getElementById("conceptosBody");

const btnAgregarFila = document.getElementById("btnAgregarFila");
const btnAgregarFilaTop = document.getElementById("btnAgregarFilaTop");
const btnPDF = document.getElementById("btnPDF");
const btnExcel = document.getElementById("btnExcel");
const btnNuevo = document.getElementById("btnNuevo");
const btnGuardar = document.getElementById("btnGuardar");
const btnCargar = document.getElementById("btnCargar");

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
    notas: document.getElementById("notas").value,
    terminos: document.getElementById("terminos").value,

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
    "folio", "cliente", "contacto", "correoCliente", "telefonoCliente",
    "proyecto", "ubicacionProyecto", "notas"
  ];

  ids.forEach(id => {
    document.getElementById(id).value = "";
  });

  document.getElementById("vigencia").value = 15;
  document.getElementById("tipoServicio").selectedIndex = 0;
  document.getElementById("iva").value = 16;
  document.getElementById("descuentoGeneral").value = 0;
  document.getElementById("anticipo").value = 50;
  document.getElementById("fecha").valueAsDate = new Date();

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
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = function () {
      reject(new Error("No se pudo cargar la imagen del logo: " + src));
    };
    img.src = src;
  });
}

async function exportarPDF() {
  try {
    const data = obtenerDatosFormulario();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    const primaryBlue = [16, 64, 120];
    const accentBlue = [33, 99, 180];
    const lightGray = [245, 247, 250];
    const lineGray = [220, 226, 234];
    const textGray = [90, 98, 110];

    // Fondo encabezado
    doc.setFillColor(...primaryBlue);
    doc.roundedRect(margin, 10, pageWidth - (margin * 2), 32, 3, 3, "F");

    // Logo
    try {
      const logoData = await loadImageAsDataURL("assets/logo-pdf.png");
      doc.addImage(logoData, "PNG", 18, 14, 28, 24);
    } catch (e) {
      console.warn(e.message);
    }

    // Datos empresa en header
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text(data.empresa || "LinkWich-IT", 52, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(data.correoEmpresa || "-", 52, 26);
    doc.text(data.telefonoEmpresa || "-", 52, 31);
    doc.text(data.sitioEmpresa || "-", 52, 36);

    // Bloque cotización
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(148, 14, 44, 23, 2, 2, "F");

    doc.setTextColor(...primaryBlue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("COTIZACIÓN", 170, 21, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.text(`Folio: ${data.folio || "-"}`, 152, 27);
    doc.text(`Fecha: ${data.fecha || "-"}`, 152, 31.5);
    doc.text(`Vigencia: ${data.vigencia || "-"} días`, 152, 36);

    let y = 50;

    // Cliente
    doc.setFillColor(...lightGray);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 30, 2, 2, "F");
    doc.setDrawColor(...lineGray);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 30, 2, 2, "S");

    doc.setTextColor(...accentBlue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("DATOS DEL CLIENTE", margin + 4, y + 6);

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.2);

    doc.text(`Cliente: ${data.cliente || "-"}`, margin + 4, y + 12);
    doc.text(`Contacto: ${data.contacto || "-"}`, margin + 4, y + 17);
    doc.text(`Correo: ${data.correoCliente || "-"}`, margin + 4, y + 22);
    doc.text(`Teléfono: ${data.telefonoCliente || "-"}`, margin + 100, y + 12);
    doc.text(`Proyecto: ${data.proyecto || "-"}`, margin + 100, y + 17);
    doc.text(`Ubicación: ${data.ubicacionProyecto || "-"}`, margin + 100, y + 22);

    y += 38;

    // Tipo de servicio
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 12, 2, 2, "F");
    doc.setDrawColor(...lineGray);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 12, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accentBlue);
    doc.setFontSize(10);
    doc.text("Tipo de servicio:", margin + 4, y + 7.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(data.tipoServicio || "-", margin + 38, y + 7.5);

    y += 18;

    // Tabla conceptos
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
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [30, 30, 30],
        lineColor: lineGray,
        lineWidth: 0.2
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
        2: { halign: "center", cellWidth: 22 },
        3: { halign: "right", cellWidth: 28 },
        4: { halign: "center", cellWidth: 20 },
        5: { halign: "right", cellWidth: 30 }
      }
    });

    let finalY = doc.lastAutoTable.finalY + 8;

    // Resumen financiero
    doc.setFillColor(...lightGray);
    doc.roundedRect(120, finalY, 72, 36, 2, 2, "F");
    doc.setDrawColor(...lineGray);
    doc.roundedRect(120, finalY, 72, 36, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accentBlue);
    doc.setFontSize(10);
    doc.text("RESUMEN FINANCIERO", 156, finalY + 6, { align: "center" });

    doc.setTextColor(...textGray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.2);
    doc.text("Subtotal:", 124, finalY + 13);
    doc.text("Descuento:", 124, finalY + 18);
    doc.text("IVA:", 124, finalY + 23);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 124, finalY + 30);

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "normal");
    doc.text(formatMoney(data.subtotal), 188, finalY + 13, { align: "right" });
    doc.text(formatMoney(data.descuentoMonto), 188, finalY + 18, { align: "right" });
    doc.text(formatMoney(data.ivaMonto), 188, finalY + 23, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryBlue);
    doc.text(formatMoney(data.total), 188, finalY + 30, { align: "right" });

    // Anticipo
    doc.setFillColor(237, 247, 255);
    doc.roundedRect(margin, finalY, 92, 16, 2, 2, "F");
    doc.setDrawColor(200, 223, 245);
    doc.roundedRect(margin, finalY, 92, 16, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accentBlue);
    doc.setFontSize(9.5);
    doc.text("ANTICIPO SUGERIDO", margin + 4, finalY + 6);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryBlue);
    doc.setFontSize(12);
    doc.text(formatMoney(data.anticipoMonto), margin + 4, finalY + 12);

    finalY += 44;

    // Notas
    if (data.notas && data.notas.trim()) {
      const notasText = doc.splitTextToSize(data.notas, 180);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accentBlue);
      doc.setFontSize(10);
      doc.text("NOTAS", margin, finalY);

      finalY += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(9.2);
      doc.text(notasText, margin, finalY);

      finalY += (notasText.length * 4.5) + 6;
    }

    // Términos
    if (data.terminos && data.terminos.trim()) {
      const terminosText = doc.splitTextToSize(data.terminos, 180);

      if (finalY > pageHeight - 35) {
        doc.addPage();
        finalY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accentBlue);
      doc.setFontSize(10);
      doc.text("TÉRMINOS Y CONDICIONES", margin, finalY);

      finalY += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(9.2);
      doc.text(terminosText, margin, finalY);
    }

    // Footer
    const footerY = pageHeight - 10;
    doc.setDrawColor(...lineGray);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`${data.empresa || "LinkWich-IT"} | ${data.sitioEmpresa || ""}`, margin, footerY);
    doc.text(`Documento generado automáticamente`, pageWidth - margin, footerY, { align: "right" });

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

[ivaInput, descuentoGeneralInput, anticipoInput, document.getElementById("moneda")].forEach(el => {
  el.addEventListener("input", recalcularTodo);
  el.addEventListener("change", recalcularTodo);
});

crearFila({
  concepto: "Servicio profesional",
  cantidad: 1,
  precio: 0,
  descuento: 0
});
