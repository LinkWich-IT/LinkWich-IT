const DEFAULT_EMPRESA = "LinkWich-IT System & Networking Solution";
const DEFAULT_CORREO_EMPRESA = "jhernandez@linkwich-it.com";
const DEFAULT_TELEFONO_EMPRESA = "+52 624 185 6134";
const DEFAULT_SITIO_EMPRESA = "www.linkwich-it.com";
const DEFAULT_CIUDAD_EMPRESA = "San José del Cabo, B.C.S.";
const DEFAULT_MONEDA = "MXN";
const DEFAULT_ANTICIPO = 60;
const DEFAULT_METODO_PAGO_PARCIALIDADES = "PPD";
const DEFAULT_METODO_PAGO_UNICO = "PUE";


const I18N = {
  es: {
    pageTitle: "LinkWich-IT | Cotizador Profesional",
    actions: "Acciones", new: "Nuevo", addItem: "Agregar concepto", generatePdf: "Generar PDF",
    pdfLanguage: "Idioma del PDF", pdfCurrent: "Igual que la interfaz", pdfSpanish: "Español",
    pdfEnglish: "English", pdfBoth: "Ambos (2 archivos)",
    exportExcel: "Exportar Excel", saveDraft: "Guardar borrador", loadDraft: "Cargar borrador",
    importExcel: "Importar Excel", summary: "Resumen", items: "Conceptos", netSubtotal: "Subtotal neto",
    itemDiscountShort: "Desc. conceptos", vat: "IVA", total: "Total", professionalQuoter: "Cotizador Profesional",
    subtitle: "Genera cotizaciones ejecutivas para tus clientes", language: "Idioma", webVersion: "Versión Web",
    companyData: "Datos de la empresa", company: "Empresa", email: "Correo", phone: "Teléfono",
    website: "Sitio web", city: "Ciudad", currency: "Moneda", quoteData: "Datos de la cotización",
    folio: "Folio", date: "Fecha", validityDays: "Vigencia (días)", serviceType: "Tipo de servicio",
    serviceNetworkMonitoring: "Monitoreo de red", serviceVideoSurveillance: "Videovigilancia",
    serviceNetworking: "Networking", serviceImplementation: "Implementación",
    serviceTechnicalSupport: "Soporte técnico", serviceConsulting: "Consultoría", serviceOther: "Otro",
    clientData: "Datos del cliente", clientCompany: "Cliente / Empresa", contact: "Contacto",
    clientCompanyPlaceholder: "Nombre del cliente o empresa", contactPlaceholder: "Nombre del contacto",
    clientEmailPlaceholder: "correo@cliente.com", phonePlaceholder: "+52 ...",
    projectSubject: "Proyecto / Asunto", projectPlaceholder: "Ej. Implementación de videovigilancia",
    projectLocation: "Ubicación del proyecto", locationPlaceholder: "Ej. Los Cabos, B.C.S.",
    item: "Concepto", quantity: "Cantidad", unitPrice: "Precio Unitario", discountShortPct: "Desc. %",
    amount: "Importe", action: "Acción", commercialTerms: "Condiciones comerciales", vatPct: "IVA (%)",
    generalDiscountPct: "Descuento general (%)", automaticResicoPct: "RESICO automático (%)",
    resicoHelp: "Se calcula sobre la base antes de IVA y se integra al precio. No aparece como impuesto en el PDF.",
    resicoTable: "Tabla RESICO", monthly: "Mensual", annual: "Anual",
    applyResicoToItem: "Cargar RESICO en concepto",
    resicoItemHelp: "Si hay varios conceptos, aquí eliges dónde se integrará internamente antes de imprimir.",
    suggestedDepositPct: "Anticipo sugerido (%)",
    depositHelp: "Por defecto 60%. Si colocas 100%, se considera pago único.",
    paymentMethod: "Método de pago", paymentTerms: "Forma de pago", notes: "Notas",
    notesPlaceholder: "Escribe observaciones, alcances, restricciones o notas importantes.",
    termsConditions: "Términos y condiciones", subtotalBeforeDiscounts: "Subtotal antes de descuentos",
    itemDiscount: "Descuento por conceptos", generalDiscount: "Descuento general",
    estimatedTotalDiscount: "Descuento total estimado", integratedResico: "RESICO estimado integrado",
    appliedTo: "Cargado en", clientTotal: "Total cliente", estimatedNetAfterResico: "Neto estimado después RESICO",
    defaultPaymentTerms: "Únicamente mediante transferencia bancaria.",
    defaultTerms: "La presente cotización tiene vigencia conforme al periodo indicado. Los tiempos de entrega pueden variar según disponibilidad. No incluye trabajos adicionales no especificados.",
    defaultProfessionalService: "Servicio profesional", descriptionPlaceholder: "Descripción del concepto o servicio",
    delete: "Eliminar", itemN: "Concepto #{n}", noItems: "Sin conceptos", noDescription: "Sin descripción",
    currencyUSD: "dólares estadounidenses (USD)", currencyMXN: "pesos mexicanos (MXN)",
    singlePayment100: "Pago único 100%", depositOf: "Anticipo del {percent}%",
    paymentSingleDescription: "Pago en una sola exhibición", paymentInstallmentsDescription: "Pago en parcialidades o diferido",
    with100Single: "Con 100%, se considera pago único por {total}.",
    depositBalanceDetail: "{deposit}; saldo pendiente estimado: {balance}.",
    monthlyTable: "tabla mensual", annualTable: "tabla anual", baseBeforeVat: "Base sin IVA",
    rate: "tasa", integratedInto: "se integra en", importantResico: " Importante: el monto excede el límite de RESICO; valida con tu contador.",
    approxItemDiscount: "equivale aprox. al {percent}% del subtotal", approxGlobalDiscount: "aprox. {percent}% global",
    draftSaved: "Borrador guardado correctamente.", noDraft: "No hay borrador guardado.", draftLoaded: "Borrador cargado correctamente.",
    importMissingSheets: "El archivo no contiene hojas 'Resumen'/'Summary' o 'Conceptos'/'Items'. Usa el mismo formato exportado por el cotizador.",
    importSuccess: "Excel importado correctamente. Los datos existentes se conservaron y los conceptos se agregaron a la cotización actual.",
    excelReadError: "No se pudo leer el archivo Excel.", logoLoadError: "No se pudo cargar la imagen del logo: {src}",
    beforePrint: "Antes de imprimir:", resicoWillIntegrate: "El RESICO estimado de {amount} se integrará internamente al concepto #{number}:",
    resicoNotSeparate: "No aparecerá como impuesto separado en el PDF. ¿Deseas continuar?",
    pdfError: "Ocurrió un error al generar el PDF. Revisa que exista assets/logo-pdf.png",
    clearConfirm: "¿Deseas limpiar la cotización actual?", page: "Página", of: "de",
    quoteTitle: "COTIZACIÓN", expires: "Expira", days: "días", clientInfoTitle: "DATOS DEL CLIENTE",
    client: "Cliente", project: "Proyecto", location: "Ubicación", serviceTypePdf: "Tipo de servicio",
    suggestedDeposit: "ANTICIPO SUGERIDO", balanceDue: "Saldo pendiente", fullQuotePayment: "Pago total de la cotización",
    method: "Método", financialSummary: "RESUMEN FINANCIERO", grossSubtotal: "Subtotal bruto",
    itemDiscountPdf: "Desc. conceptos", generalDiscountShort: "Desc. general", totalDiscountPdf: "Desc. total",
    paymentTermsTitle: "FORMA DE PAGO", termsTitle: "TÉRMINOS Y CONDICIONES", notesTitle: "NOTAS",
    allPricesClause: "Todos los precios están expresados en {currency} e incluyen IVA, salvo que se indique lo contrario.",
    quoteFilePrefix: "Cotizacion", noFolio: "sin_folio", summarySheet: "Resumen", itemsSheet: "Conceptos",
    taxableNone: "Sin base gravable", resicoExceeds: "Excede $3,500,000; validar RESICO con contador",
    limitMonthly25: "Hasta $25,000 mensual", limitMonthly50: "Hasta $50,000 mensual",
    limitMonthly83333: "Hasta $83,333.33 mensual", limitMonthly208333: "Hasta $208,333.33 mensual",
    limitMonthly3500000: "Hasta $3,500,000 mensual", limitAnnual300: "Hasta $300,000 anual",
    limitAnnual600: "Hasta $600,000 anual", limitAnnual1000: "Hasta $1,000,000 anual",
    limitAnnual2500: "Hasta $2,500,000 anual", limitAnnual3500: "Hasta $3,500,000 anual"
  },
  en: {
    pageTitle: "LinkWich-IT | Professional Quoter",
    actions: "Actions", new: "New", addItem: "Add item", generatePdf: "Generate PDF",
    pdfLanguage: "PDF language", pdfCurrent: "Same as interface", pdfSpanish: "Spanish",
    pdfEnglish: "English", pdfBoth: "Both (2 files)",
    exportExcel: "Export Excel", saveDraft: "Save draft", loadDraft: "Load draft",
    importExcel: "Import Excel", summary: "Summary", items: "Items", netSubtotal: "Net subtotal",
    itemDiscountShort: "Item discounts", vat: "VAT", total: "Total", professionalQuoter: "Professional Quoter",
    subtitle: "Create professional quotations for your clients", language: "Language", webVersion: "Web Version",
    companyData: "Company information", company: "Company", email: "Email", phone: "Phone",
    website: "Website", city: "City", currency: "Currency", quoteData: "Quotation information",
    folio: "Quote No.", date: "Date", validityDays: "Validity (days)", serviceType: "Service type",
    serviceNetworkMonitoring: "Network monitoring", serviceVideoSurveillance: "Video surveillance",
    serviceNetworking: "Networking", serviceImplementation: "Implementation",
    serviceTechnicalSupport: "Technical support", serviceConsulting: "Consulting", serviceOther: "Other",
    clientData: "Client information", clientCompany: "Client / Company", contact: "Contact",
    clientCompanyPlaceholder: "Client or company name", contactPlaceholder: "Contact name",
    clientEmailPlaceholder: "email@client.com", phonePlaceholder: "+1 ...",
    projectSubject: "Project / Subject", projectPlaceholder: "E.g. Video surveillance implementation",
    projectLocation: "Project location", locationPlaceholder: "E.g. Los Cabos, B.C.S.",
    item: "Item", quantity: "Quantity", unitPrice: "Unit Price", discountShortPct: "Disc. %",
    amount: "Amount", action: "Action", commercialTerms: "Commercial terms", vatPct: "VAT (%)",
    generalDiscountPct: "General discount (%)", automaticResicoPct: "Automatic RESICO (%)",
    resicoHelp: "Calculated on the amount before VAT and included in the price. It is not shown as a separate tax in the PDF.",
    resicoTable: "RESICO table", monthly: "Monthly", annual: "Annual",
    applyResicoToItem: "Apply RESICO to item",
    resicoItemHelp: "When there are multiple items, select where RESICO will be included internally before printing.",
    suggestedDepositPct: "Suggested deposit (%)",
    depositHelp: "Default is 60%. If set to 100%, it is treated as a single payment.",
    paymentMethod: "Payment method", paymentTerms: "Payment terms", notes: "Notes",
    notesPlaceholder: "Enter observations, scope, restrictions, or important notes.",
    termsConditions: "Terms and conditions", subtotalBeforeDiscounts: "Subtotal before discounts",
    itemDiscount: "Item discounts", generalDiscount: "General discount",
    estimatedTotalDiscount: "Estimated total discount", integratedResico: "Estimated RESICO included",
    appliedTo: "Applied to", clientTotal: "Client total", estimatedNetAfterResico: "Estimated net after RESICO",
    defaultPaymentTerms: "Bank transfer only.",
    defaultTerms: "This quotation is valid for the indicated period. Delivery times may vary depending on availability. Additional work not specifically listed is not included.",
    defaultProfessionalService: "Professional service", descriptionPlaceholder: "Description of the item or service",
    delete: "Delete", itemN: "Item #{n}", noItems: "No items", noDescription: "No description",
    currencyUSD: "U.S. dollars (USD)", currencyMXN: "Mexican pesos (MXN)",
    singlePayment100: "Single payment 100%", depositOf: "{percent}% deposit",
    paymentSingleDescription: "Payment in a single installment", paymentInstallmentsDescription: "Payment in installments or deferred",
    with100Single: "At 100%, this is treated as a single payment of {total}.",
    depositBalanceDetail: "{deposit}; estimated outstanding balance: {balance}.",
    monthlyTable: "monthly table", annualTable: "annual table", baseBeforeVat: "Base before VAT",
    rate: "rate", integratedInto: "included in", importantResico: " Important: the amount exceeds the RESICO limit; confirm it with your accountant.",
    approxItemDiscount: "approximately {percent}% of the subtotal", approxGlobalDiscount: "approximately {percent}% overall",
    draftSaved: "Draft saved successfully.", noDraft: "There is no saved draft.", draftLoaded: "Draft loaded successfully.",
    importMissingSheets: "The file does not contain 'Resumen'/'Summary' or 'Conceptos'/'Items' sheets. Use the format exported by this quoter.",
    importSuccess: "Excel imported successfully. Existing data was preserved and the imported items were added to the current quotation.",
    excelReadError: "The Excel file could not be read.", logoLoadError: "The logo image could not be loaded: {src}",
    beforePrint: "Before printing:", resicoWillIntegrate: "The estimated RESICO of {amount} will be included internally in item #{number}:",
    resicoNotSeparate: "It will not appear as a separate tax in the PDF. Do you want to continue?",
    pdfError: "An error occurred while generating the PDF. Confirm that assets/logo-pdf.png exists.",
    clearConfirm: "Do you want to clear the current quotation?", page: "Page", of: "of",
    quoteTitle: "QUOTATION", expires: "Expires", days: "days", clientInfoTitle: "CLIENT INFORMATION",
    client: "Client", project: "Project", location: "Location", serviceTypePdf: "Service type",
    suggestedDeposit: "SUGGESTED DEPOSIT", balanceDue: "Outstanding balance", fullQuotePayment: "Full quotation payment",
    method: "Method", financialSummary: "FINANCIAL SUMMARY", grossSubtotal: "Gross subtotal",
    itemDiscountPdf: "Item discounts", generalDiscountShort: "General discount", totalDiscountPdf: "Total discount",
    paymentTermsTitle: "PAYMENT TERMS", termsTitle: "TERMS AND CONDITIONS", notesTitle: "NOTES",
    allPricesClause: "All prices are stated in {currency} and include VAT unless otherwise indicated.",
    quoteFilePrefix: "Quotation", noFolio: "no_number", summarySheet: "Summary", itemsSheet: "Items",
    taxableNone: "No taxable base", resicoExceeds: "Exceeds $3,500,000; confirm RESICO with an accountant",
    limitMonthly25: "Up to $25,000 monthly", limitMonthly50: "Up to $50,000 monthly",
    limitMonthly83333: "Up to $83,333.33 monthly", limitMonthly208333: "Up to $208,333.33 monthly",
    limitMonthly3500000: "Up to $3,500,000 monthly", limitAnnual300: "Up to $300,000 annually",
    limitAnnual600: "Up to $600,000 annually", limitAnnual1000: "Up to $1,000,000 annually",
    limitAnnual2500: "Up to $2,500,000 annually", limitAnnual3500: "Up to $3,500,000 annually"
  }
};

const SERVICE_TYPE_KEYS = {
  "Monitoreo de red": "serviceNetworkMonitoring",
  "Videovigilancia": "serviceVideoSurveillance",
  "Networking": "serviceNetworking",
  "Implementación": "serviceImplementation",
  "Soporte técnico": "serviceTechnicalSupport",
  "Consultoría": "serviceConsulting",
  "Otro": "serviceOther"
};

let currentLanguage = localStorage.getItem("linkwich_cotizador_idioma") === "en" ? "en" : "es";

function t(key, vars = {}, lang = currentLanguage) {
  const dictionary = I18N[lang] || I18N.es;
  let value = dictionary[key] ?? I18N.es[key] ?? key;
  Object.entries(vars).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, String(replacement));
  });
  return value;
}

function getCurrentLocale() {
  return currentLanguage === "en" ? "en-US" : "es-MX";
}

function getServiceTypeLabel(value) {
  return t(SERVICE_TYPE_KEYS[value] || "serviceOther");
}

function normalizeServiceType(value) {
  const normalized = String(value || "").trim().toLowerCase();
  const aliases = {
    "monitoreo de red": "Monitoreo de red", "network monitoring": "Monitoreo de red",
    "videovigilancia": "Videovigilancia", "video surveillance": "Videovigilancia",
    "networking": "Networking", "implementación": "Implementación", "implementacion": "Implementación",
    "implementation": "Implementación", "soporte técnico": "Soporte técnico", "soporte tecnico": "Soporte técnico",
    "technical support": "Soporte técnico", "consultoría": "Consultoría", "consultoria": "Consultoría",
    "consulting": "Consultoría", "otro": "Otro", "other": "Otro"
  };
  return aliases[normalized] || value || "Monitoreo de red";
}

function translateUntouchedDefault(id, key, oldLanguage, newLanguage) {
  const el = document.getElementById(id);
  if (!el) return;
  const oldDefault = t(key, {}, oldLanguage);
  if (String(el.value || "").trim() === oldDefault) {
    el.value = t(key, {}, newLanguage);
  }
}

function refreshDynamicTranslations() {
  document.querySelectorAll("#conceptosBody .concepto").forEach(input => {
    input.placeholder = t("descriptionPlaceholder");
  });
  document.querySelectorAll("#conceptosBody .btn-delete").forEach(button => {
    button.textContent = t("delete");
  });
}

function applyLanguage(language, options = {}) {
  const nextLanguage = language === "en" ? "en" : "es";
  const previousLanguage = currentLanguage;
  const translateDefaults = options.translateDefaults !== false;
  const persist = options.persist !== false;
  const recalculate = options.recalculate !== false;

  if (translateDefaults) {
    const sourceLanguages = [...new Set([previousLanguage, nextLanguage === "en" ? "es" : "en"])];

    [
      ["formaPago", "defaultPaymentTerms"],
      ["terminos", "defaultTerms"]
    ].forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const currentValue = String(el.value || "").trim();
      if (sourceLanguages.some(lang => currentValue === t(key, {}, lang))) {
        el.value = t(key, {}, nextLanguage);
      }
    });

    document.querySelectorAll("#conceptosBody .concepto").forEach(input => {
      const currentValue = String(input.value || "").trim();
      if (sourceLanguages.some(lang => currentValue === t("defaultProfessionalService", {}, lang))) {
        input.value = t("defaultProfessionalService", {}, nextLanguage);
      }
    });
  }

  currentLanguage = nextLanguage;
  document.documentElement.lang = nextLanguage;
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  const languageSelect = document.getElementById("idioma");
  if (languageSelect) languageSelect.value = nextLanguage;

  refreshDynamicTranslations();
  if (persist) localStorage.setItem("linkwich_cotizador_idioma", nextLanguage);
  if (recalculate && typeof recalcularTodo === "function") recalcularTodo();
}

const conceptosBody = document.getElementById("conceptosBody");

const btnAgregarFila = document.getElementById("btnAgregarFila");
const btnAgregarFilaTop = document.getElementById("btnAgregarFilaTop");
const btnPDF = document.getElementById("btnPDF");
const idiomaPDFSelect = document.getElementById("idiomaPDF");
const btnExcel = document.getElementById("btnExcel");
const btnNuevo = document.getElementById("btnNuevo");
const btnGuardar = document.getElementById("btnGuardar");
const btnCargar = document.getElementById("btnCargar");
const btnImportarExcel = document.getElementById("btnImportarExcel");
const inputImportarExcel = document.getElementById("inputImportarExcel");

const subtotalEl = document.getElementById("subtotal");
const subtotalBrutoEl = document.getElementById("subtotalBruto");
const descuentoConceptosMontoEl = document.getElementById("descuentoConceptosMonto");
const descuentoConceptosPorcentajeEl = document.getElementById("descuentoConceptosPorcentaje");
const descuentoTotalMontoEl = document.getElementById("descuentoTotalMonto");
const descuentoTotalPorcentajeEl = document.getElementById("descuentoTotalPorcentaje");
const descuentoMontoEl = document.getElementById("descuentoMonto");
const ivaMontoEl = document.getElementById("ivaMonto");
const totalEl = document.getElementById("total");
const anticipoMontoEl = document.getElementById("anticipoMonto");

const isrResicoMontoEl = document.getElementById("isrResicoMonto");
const netoResicoEl = document.getElementById("netoResico");

const resConceptos = document.getElementById("resConceptos");
const resSubtotal = document.getElementById("resSubtotal");
const resDescuentoConceptos = document.getElementById("resDescuentoConceptos");
const resIVA = document.getElementById("resIVA");
const resTotal = document.getElementById("resTotal");

const ivaInput = document.getElementById("iva");
const descuentoGeneralInput = document.getElementById("descuentoGeneral");
const anticipoInput = document.getElementById("anticipo");
const isrResicoInput = document.getElementById("isrResico");

document.getElementById("fecha").valueAsDate = new Date();

function aplicarDatosEmpresaPorDefecto(options = {}) {
  const overwrite = options.overwrite === true;

  const campos = [
    { id: "empresa", value: DEFAULT_EMPRESA },
    { id: "correoEmpresa", value: DEFAULT_CORREO_EMPRESA },
    { id: "telefonoEmpresa", value: DEFAULT_TELEFONO_EMPRESA },
    { id: "sitioEmpresa", value: DEFAULT_SITIO_EMPRESA },
    { id: "ciudadEmpresa", value: DEFAULT_CIUDAD_EMPRESA },
    { id: "moneda", value: DEFAULT_MONEDA }
  ];

  campos.forEach(item => {
    const el = document.getElementById(item.id);
    if (!el) return;

    if (overwrite || !String(el.value || "").trim()) {
      el.value = item.value;
    }
  });
}

function formatMoney(value) {
  const moneda = document.getElementById("moneda").value || "MXN";
  return new Intl.NumberFormat(getCurrentLocale(), {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
}

function getCurrencyLabel() {
  const moneda = document.getElementById("moneda").value || "MXN";
  return moneda === "USD" ? t("currencyUSD") : t("currencyMXN");
}

function formatPercent(value) {
  const numero = parseFloat(value);
  const safeNumber = isNaN(numero) ? 0 : Math.max(0, Math.min(100, numero));

  if (Number.isInteger(safeNumber)) {
    return String(safeNumber);
  }

  return safeNumber.toFixed(2).replace(/\.?0+$/, "");
}

function getAnticipoComercialLabel(anticipo) {
  const porcentaje = Math.max(0, Math.min(100, parseFloat(anticipo) || 0));

  if (porcentaje >= 100) {
    return t("singlePayment100");
  }

  return t("depositOf", { percent: formatPercent(porcentaje) });
}

function getMetodoPagoInfo(anticipo) {
  const porcentaje = Math.max(0, Math.min(100, parseFloat(anticipo) || 0));

  if (porcentaje >= 100) {
    return {
      clave: "PUE",
      descripcion: t("paymentSingleDescription"),
      label: DEFAULT_METODO_PAGO_UNICO
    };
  }

  return {
    clave: "PPD",
    descripcion: t("paymentInstallmentsDescription"),
    label: DEFAULT_METODO_PAGO_PARCIALIDADES
  };
}

function actualizarResumenPago(anticipo, total, anticipoMonto) {
  const pagoInfo = getMetodoPagoInfo(anticipo);
  const anticipoLabel = getAnticipoComercialLabel(anticipo);
  const saldoPendiente = Math.max((Number(total) || 0) - (Number(anticipoMonto) || 0), 0);

  const anticipoLabelEl = document.getElementById("anticipoLabel");
  const metodoPagoEl = document.getElementById("metodoPago");
  const metodoPagoDetalleEl = document.getElementById("metodoPagoDetalle");

  if (anticipoLabelEl) anticipoLabelEl.textContent = anticipoLabel;
  if (metodoPagoEl) metodoPagoEl.value = pagoInfo.label;

  if (metodoPagoDetalleEl) {
    metodoPagoDetalleEl.textContent = pagoInfo.clave === "PUE"
      ? t("with100Single", { total: formatMoney(total) })
      : t("depositBalanceDetail", { deposit: anticipoLabel, balance: formatMoney(saldoPendiente) });
  }

  return {
    ...pagoInfo,
    anticipoLabel,
    saldoPendiente
  };
}

function parsePercentValue(value) {
  if (value === undefined || value === null) return null;

  const rawValue = String(value).replace(",", ".").trim();
  if (!rawValue) return null;

  const match = rawValue.match(/-?\d+(\.\d+)?/);
  if (!match) return null;

  const parsed = parseFloat(match[0]);
  if (isNaN(parsed)) return null;

  return parsed;
}

function setPercentFieldIfExists(id, value, options = {}) {
  const parsed = parsePercentValue(value);

  if (parsed === null) return;
  if (parsed < 0 || parsed > 100) return;

  setFieldIfExists(id, parsed, options);
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
  return currentLanguage === "en" ? `${mm}/${dd}/${yyyy}` : `${dd}/${mm}/${yyyy}`;
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

  return currentLanguage === "en" ? `${mm}/${dd}/${yyyy}` : `${dd}/${mm}/${yyyy}`;
}

function getResicoTablaMode() {
  const el = document.getElementById("resicoTabla");
  return el ? (el.value || "mensual") : "mensual";
}

function getResicoRateInfo(baseAntesIVA, mode = getResicoTablaMode()) {
  const base = Number(baseAntesIVA) || 0;

  const tablas = {
    mensual: [
      { limite: 25000.00, tasa: 1.00, etiqueta: t("limitMonthly25") },
      { limite: 50000.00, tasa: 1.10, etiqueta: t("limitMonthly50") },
      { limite: 83333.33, tasa: 1.50, etiqueta: t("limitMonthly83333") },
      { limite: 208333.33, tasa: 2.00, etiqueta: t("limitMonthly208333") },
      { limite: 3500000.00, tasa: 2.50, etiqueta: t("limitMonthly3500000") }
    ],
    anual: [
      { limite: 300000.00, tasa: 1.00, etiqueta: t("limitAnnual300") },
      { limite: 600000.00, tasa: 1.10, etiqueta: t("limitAnnual600") },
      { limite: 1000000.00, tasa: 1.50, etiqueta: t("limitAnnual1000") },
      { limite: 2500000.00, tasa: 2.00, etiqueta: t("limitAnnual2500") },
      { limite: 3500000.00, tasa: 2.50, etiqueta: t("limitAnnual3500") }
    ]
  };

  if (base <= 0) {
    return { mode, tasa: 0, tasaDecimal: 0, etiqueta: t("taxableNone"), excedeLimite: false };
  }

  const tabla = tablas[mode] || tablas.mensual;
  const tramo = tabla.find(item => base <= item.limite);

  if (!tramo) {
    return { mode, tasa: 2.50, tasaDecimal: 0.025, etiqueta: t("resicoExceeds"), excedeLimite: true };
  }

  return {
    mode,
    tasa: tramo.tasa,
    tasaDecimal: tramo.tasa / 100,
    etiqueta: tramo.etiqueta,
    excedeLimite: false
  };
}

function leerConceptosDesdeTabla() {
  const rows = [...conceptosBody.querySelectorAll("tr")];

  return rows.map((row, i) => {
    const cantidad = parseFloat(row.querySelector(".cantidad").value) || 0;
    const precio = parseFloat(row.querySelector(".precio").value) || 0;
    const descuentoCapturado = parseFloat(row.querySelector(".descuento").value) || 0;
    const descuento = Math.max(0, Math.min(100, descuentoCapturado));

    const importeBruto = cantidad * precio;
    const descuentoMonto = importeBruto * (descuento / 100);
    const importe = importeBruto - descuentoMonto;

    return {
      no: i + 1,
      concepto: row.querySelector(".concepto").value.trim(),
      cantidad,
      precio,
      descuento,
      importeBruto,
      descuentoMonto,
      importe
    };
  });
}

function calcularResumenDescuentosPorConcepto(conceptos) {
  const subtotalBruto = conceptos.reduce((acc, item) => {
    const cantidad = Number(item.cantidad) || 0;
    const precio = Number(item.precio) || 0;
    return acc + (cantidad * precio);
  }, 0);

  const descuentoMonto = conceptos.reduce((acc, item) => {
    const cantidad = Number(item.cantidad) || 0;
    const precio = Number(item.precio) || 0;
    const descuento = Math.max(0, Math.min(100, Number(item.descuento) || 0));
    return acc + ((cantidad * precio) * (descuento / 100));
  }, 0);

  const subtotalNeto = subtotalBruto - descuentoMonto;
  const porcentaje = subtotalBruto > 0 ? (descuentoMonto / subtotalBruto) * 100 : 0;

  return {
    subtotalBruto,
    descuentoMonto,
    subtotalNeto,
    porcentaje
  };
}

function actualizarSelectorConceptoResico(conceptos) {
  const select = document.getElementById("resicoConceptoIndex");
  if (!select) return 0;

  const previousValue = select.value;
  select.innerHTML = "";

  conceptos.forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = String(index);
    const nombre = item.concepto || t("itemN", { n: index + 1 });
    opt.textContent = `#${index + 1} - ${nombre.substring(0, 55)}${nombre.length > 55 ? "..." : ""}`;
    select.appendChild(opt);
  });

  if (!conceptos.length) {
    const opt = document.createElement("option");
    opt.value = "0";
    opt.textContent = t("noItems");
    select.appendChild(opt);
    select.disabled = true;
    return 0;
  }

  const previousIndex = parseInt(previousValue, 10);
  const nextIndex = !isNaN(previousIndex) && previousIndex >= 0 && previousIndex < conceptos.length
    ? previousIndex
    : 0;

  select.value = String(nextIndex);
  select.disabled = conceptos.length <= 1;
  return nextIndex;
}

function getSelectedResicoConceptIndex(conceptosLength) {
  const select = document.getElementById("resicoConceptoIndex");
  if (!select || !conceptosLength) return 0;

  const selected = parseInt(select.value, 10);
  if (isNaN(selected) || selected < 0 || selected >= conceptosLength) return 0;

  return selected;
}

function aplicarCargoResicoAConceptos(conceptos, cargoAntesDescuentoGeneral, selectedIndex) {
  const adjusted = conceptos.map(item => ({ ...item }));
  const cargo = Number(cargoAntesDescuentoGeneral) || 0;

  if (!adjusted.length || cargo <= 0) return adjusted;

  const index = selectedIndex >= 0 && selectedIndex < adjusted.length ? selectedIndex : 0;
  const item = adjusted[index];

  const cantidadSegura = item.cantidad > 0 ? item.cantidad : 1;
  const factorDescuentoConcepto = Math.max(0.0001, 1 - ((Number(item.descuento) || 0) / 100));
  const incrementoPrecioUnitario = cargo / cantidadSegura / factorDescuentoConcepto;

  item.cantidad = cantidadSegura;
  item.precio = (Number(item.precio) || 0) + incrementoPrecioUnitario;

  const importeBruto = item.cantidad * item.precio;
  const descuentoSeguro = Math.max(0, Math.min(100, Number(item.descuento) || 0));
  const descuentoMonto = importeBruto * (descuentoSeguro / 100);

  item.descuento = descuentoSeguro;
  item.importeBruto = importeBruto;
  item.descuentoMonto = descuentoMonto;
  item.importe = importeBruto - descuentoMonto;

  adjusted[index] = item;
  return adjusted;
}

function calcularDatosFinancieros(options = {}) {
  const actualizarUI = options.actualizarUI === true;
  const rows = [...conceptosBody.querySelectorAll("tr")];

  const conceptosBase = leerConceptosDesdeTabla();

  if (actualizarUI) {
    rows.forEach((row, index) => {
      row.querySelector(".row-number").textContent = index + 1;
      row.querySelector(".importe-cell").textContent = formatMoney(conceptosBase[index]?.importe || 0);
    });
  }

  actualizarSelectorConceptoResico(conceptosBase);
  const resicoConceptoIndex = getSelectedResicoConceptIndex(conceptosBase.length || 0);

  const resumenConceptosBase = calcularResumenDescuentosPorConcepto(conceptosBase);
  const subtotalBrutoBase = resumenConceptosBase.subtotalBruto;
  const descuentoConceptosBase = resumenConceptosBase.descuentoMonto;
  const descuentoConceptosPorcentajeBase = resumenConceptosBase.porcentaje;
  const subtotalBase = resumenConceptosBase.subtotalNeto;

  const descuentoGeneral = parseFloat(descuentoGeneralInput.value) || 0;
  const iva = parseFloat(ivaInput.value) || 0;
  const anticipo = parseFloat(anticipoInput.value) || 0;

  const factorDescuentoGeneral = Math.max(0, 1 - (descuentoGeneral / 100));
  const descuentoMontoBase = subtotalBase * (descuentoGeneral / 100);
  const subtotalConDescuentoBase = subtotalBase - descuentoMontoBase;
  const descuentoTotalBase = descuentoConceptosBase + descuentoMontoBase;
  const descuentoTotalPorcentajeBase = subtotalBrutoBase > 0
    ? (descuentoTotalBase / subtotalBrutoBase) * 100
    : 0;

  const resicoInfo = getResicoRateInfo(subtotalConDescuentoBase);

  /*
    RESICO AUTOMÁTICO INTERNO:
    - Base: subtotal antes de IVA, después de descuentos.
    - No aparece como impuesto en el PDF.
    - Se integra al concepto seleccionado para que el total del cliente ya lo contemple.
    - Se usa gross-up para que el impuesto estimado quede cubierto al subir el precio.
  */
  const isrResicoMonto = subtotalConDescuentoBase > 0 && resicoInfo.tasaDecimal > 0 && resicoInfo.tasaDecimal < 1
    ? subtotalConDescuentoBase * (resicoInfo.tasaDecimal / (1 - resicoInfo.tasaDecimal))
    : 0;

  const cargoResicoAntesDescuentoGeneral = factorDescuentoGeneral > 0
    ? isrResicoMonto / factorDescuentoGeneral
    : isrResicoMonto;

  const conceptosCliente = aplicarCargoResicoAConceptos(
    conceptosBase,
    cargoResicoAntesDescuentoGeneral,
    resicoConceptoIndex
  );

  const resumenConceptosCliente = calcularResumenDescuentosPorConcepto(conceptosCliente);
  const subtotalBruto = resumenConceptosCliente.subtotalBruto;
  const descuentoConceptosMonto = resumenConceptosCliente.descuentoMonto;
  const descuentoConceptosPorcentaje = resumenConceptosCliente.porcentaje;
  const subtotal = resumenConceptosCliente.subtotalNeto;

  const descuentoMonto = subtotal * (descuentoGeneral / 100);
  const subtotalConDescuento = subtotal - descuentoMonto;
  const descuentoTotalMonto = descuentoConceptosMonto + descuentoMonto;
  const descuentoTotalPorcentaje = subtotalBruto > 0
    ? (descuentoTotalMonto / subtotalBruto) * 100
    : 0;

  const ivaMonto = subtotalConDescuento * (iva / 100);
  const total = subtotalConDescuento + ivaMonto;
  const netoEstimadoResico = total - isrResicoMonto;
  const anticipoMonto = total * (anticipo / 100);
  const pagoInfoDetalle = actualizarResumenPago(anticipo, total, anticipoMonto);
  const saldoPendiente = Math.max(total - anticipoMonto, 0);

  if (actualizarUI) {
    if (isrResicoInput) {
      isrResicoInput.value = formatPercent(resicoInfo.tasa);
    }

    const resicoDetalleEl = document.getElementById("resicoDetalle");
    if (resicoDetalleEl) {
      const modoLabel = resicoInfo.mode === "anual" ? t("annualTable") : t("monthlyTable");
      const concepto = conceptosBase[resicoConceptoIndex]?.concepto || t("itemN", { n: resicoConceptoIndex + 1 });
      const extra = resicoInfo.excedeLimite ? t("importantResico") : "";
      resicoDetalleEl.textContent = `${t("baseBeforeVat")}: ${formatMoney(subtotalConDescuentoBase)} | ${modoLabel} | ${t("rate")} ${formatPercent(resicoInfo.tasa)}% | ${t("integratedInto")} #${resicoConceptoIndex + 1}: ${concepto || t("noDescription")}.${extra}`;
    }

    const resicoConceptoResumenEl = document.getElementById("resicoConceptoResumen");
    if (resicoConceptoResumenEl) {
      resicoConceptoResumenEl.textContent = conceptosBase.length
        ? t("itemN", { n: resicoConceptoIndex + 1 })
        : t("noItems");
    }
  }

  return {
    conceptosBase,
    conceptos: conceptosCliente,
    resicoConceptoIndex,
    resicoTabla: resicoInfo.mode,
    resicoTasa: resicoInfo.tasa,
    resicoEtiqueta: resicoInfo.etiqueta,
    resicoExcedeLimite: resicoInfo.excedeLimite,

    subtotalBrutoBase,
    descuentoConceptosBase,
    descuentoConceptosPorcentajeBase,
    subtotalBase,
    descuentoMontoBase,
    subtotalConDescuentoBase,
    descuentoTotalBase,
    descuentoTotalPorcentajeBase,
    cargoResicoAntesDescuentoGeneral,

    subtotalBruto,
    descuentoConceptosMonto,
    descuentoConceptosPorcentaje,
    subtotal,
    descuentoGeneral,
    descuentoMonto,
    descuentoTotalMonto,
    descuentoTotalPorcentaje,
    iva,
    ivaMonto,
    isrResico: resicoInfo.tasa,
    isrResicoMonto,
    total,
    netoEstimadoResico,
    anticipo,
    anticipoMonto,
    metodoPagoClave: pagoInfoDetalle.clave,
    metodoPagoDescripcion: pagoInfoDetalle.descripcion,
    metodoPago: pagoInfoDetalle.label,
    anticipoLabel: pagoInfoDetalle.anticipoLabel,
    saldoPendiente
  };
}

function crearFila(data = {}) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td class="row-number"></td>
    <td>
      <input class="concept-input concepto" type="text" placeholder="${t("descriptionPlaceholder")}" value="${data.concepto || ""}">
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
      <button class="btn-delete" type="button">${t("delete")}</button>
    </td>
  `;

  const inputs = tr.querySelectorAll("input");
  inputs.forEach(input => input.addEventListener("input", recalcularTodo));

  tr.querySelector(".btn-delete").addEventListener("click", () => {
    tr.remove();
    recalcularTodo();
  });

  conceptosBody.appendChild(tr);
  recalcularTodo();
}

function recalcularTodo() {
  const financieros = calcularDatosFinancieros({ actualizarUI: true });

  if (subtotalBrutoEl) subtotalBrutoEl.textContent = formatMoney(financieros.subtotalBruto);
  subtotalEl.textContent = formatMoney(financieros.subtotal);

  if (descuentoConceptosMontoEl) descuentoConceptosMontoEl.textContent = formatMoney(financieros.descuentoConceptosMonto);
  if (descuentoConceptosPorcentajeEl) {
    descuentoConceptosPorcentajeEl.textContent = t("approxItemDiscount", {
      percent: formatPercent(financieros.descuentoConceptosPorcentaje)
    });
  }

  if (descuentoTotalMontoEl) descuentoTotalMontoEl.textContent = formatMoney(financieros.descuentoTotalMonto);
  if (descuentoTotalPorcentajeEl) {
    descuentoTotalPorcentajeEl.textContent = t("approxGlobalDiscount", {
      percent: formatPercent(financieros.descuentoTotalPorcentaje)
    });
  }

  descuentoMontoEl.textContent = formatMoney(financieros.descuentoMonto);
  ivaMontoEl.textContent = formatMoney(financieros.ivaMonto);
  totalEl.textContent = formatMoney(financieros.total);
  anticipoMontoEl.textContent = formatMoney(financieros.anticipoMonto);

  if (isrResicoMontoEl) isrResicoMontoEl.textContent = formatMoney(financieros.isrResicoMonto);
  if (netoResicoEl) netoResicoEl.textContent = formatMoney(financieros.netoEstimadoResico);

  resConceptos.textContent = financieros.conceptosBase.length;
  resSubtotal.textContent = formatMoney(financieros.subtotal);
  if (resDescuentoConceptos) resDescuentoConceptos.textContent = formatMoney(financieros.descuentoConceptosMonto);
  resIVA.textContent = formatMoney(financieros.ivaMonto);
  resTotal.textContent = formatMoney(financieros.total);
}

function obtenerDatosFormulario() {
  const financieros = calcularDatosFinancieros({ actualizarUI: false });

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
    idioma: currentLanguage,
    tipoServicio: document.getElementById("tipoServicio").value,
    tipoServicioLabel: getServiceTypeLabel(document.getElementById("tipoServicio").value),

    cliente: document.getElementById("cliente").value,
    contacto: document.getElementById("contacto").value,
    correoCliente: document.getElementById("correoCliente").value,
    telefonoCliente: document.getElementById("telefonoCliente").value,
    proyecto: document.getElementById("proyecto").value,
    ubicacionProyecto: document.getElementById("ubicacionProyecto").value,

    iva: financieros.iva,
    descuentoGeneral: financieros.descuentoGeneral,
    anticipo: financieros.anticipo,
    isrResico: financieros.isrResico,
    resicoTabla: financieros.resicoTabla,
    resicoTasa: financieros.resicoTasa,
    resicoEtiqueta: financieros.resicoEtiqueta,
    resicoExcedeLimite: financieros.resicoExcedeLimite,
    resicoConceptoIndex: financieros.resicoConceptoIndex,

    formaPago: document.getElementById("formaPago")
      ? document.getElementById("formaPago").value
      : t("defaultPaymentTerms"),

    metodoPagoClave: financieros.metodoPagoClave,
    metodoPagoDescripcion: financieros.metodoPagoDescripcion,
    metodoPago: financieros.metodoPago,
    anticipoLabel: financieros.anticipoLabel,
    saldoPendiente: financieros.saldoPendiente,

    notas: document.getElementById("notas").value,
    terminos: document.getElementById("terminos").value,
    monedaDescripcion: getCurrencyLabel(),

    conceptosBase: financieros.conceptosBase,
    conceptos: financieros.conceptos,
    subtotalBrutoBase: financieros.subtotalBrutoBase,
    descuentoConceptosBase: financieros.descuentoConceptosBase,
    descuentoConceptosPorcentajeBase: financieros.descuentoConceptosPorcentajeBase,
    subtotalBase: financieros.subtotalBase,
    descuentoMontoBase: financieros.descuentoMontoBase,
    subtotalConDescuentoBase: financieros.subtotalConDescuentoBase,
    descuentoTotalBase: financieros.descuentoTotalBase,
    descuentoTotalPorcentajeBase: financieros.descuentoTotalPorcentajeBase,
    cargoResicoAntesDescuentoGeneral: financieros.cargoResicoAntesDescuentoGeneral,
    subtotalBruto: financieros.subtotalBruto,
    descuentoConceptosMonto: financieros.descuentoConceptosMonto,
    descuentoConceptosPorcentaje: financieros.descuentoConceptosPorcentaje,
    subtotal: financieros.subtotal,
    descuentoMonto: financieros.descuentoMonto,
    descuentoTotalMonto: financieros.descuentoTotalMonto,
    descuentoTotalPorcentaje: financieros.descuentoTotalPorcentaje,
    ivaMonto: financieros.ivaMonto,
    isrResicoMonto: financieros.isrResicoMonto,
    total: financieros.total,
    netoEstimadoResico: financieros.netoEstimadoResico,
    anticipoMonto: financieros.anticipoMonto
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

  aplicarDatosEmpresaPorDefecto({ overwrite: true });

  if (document.getElementById("formaPago")) {
    document.getElementById("formaPago").value = t("defaultPaymentTerms");
  }

  document.getElementById("terminos").value = t("defaultTerms");
  document.getElementById("vigencia").value = 15;
  document.getElementById("tipoServicio").value = "Monitoreo de red";
  document.getElementById("iva").value = 16;
  document.getElementById("descuentoGeneral").value = 0;

  if (document.getElementById("resicoTabla")) document.getElementById("resicoTabla").value = "mensual";
  if (document.getElementById("isrResico")) document.getElementById("isrResico").value = 0;

  document.getElementById("anticipo").value = DEFAULT_ANTICIPO;
  document.getElementById("fecha").valueAsDate = new Date();

  generarNuevoFolio();
  conceptosBody.innerHTML = "";
  crearFila({ concepto: t("defaultProfessionalService"), cantidad: 1, precio: 0, descuento: 0 });
}

function guardarBorrador() {
  const data = obtenerDatosFormulario();

  const borrador = {
    ...data,
    idioma: currentLanguage,
    conceptos: data.conceptosBase
  };

  localStorage.setItem("linkwich_cotizador_borrador", JSON.stringify(borrador));
  alert(t("draftSaved"));
}

function cargarBorrador() {
  const raw = localStorage.getItem("linkwich_cotizador_borrador");
  if (!raw) {
    alert(t("noDraft"));
    return;
  }

  const data = JSON.parse(raw);
  if (data.idioma === "en" || data.idioma === "es") {
    applyLanguage(data.idioma, { translateDefaults: false, recalculate: false });
  }

  document.getElementById("empresa").value = data.empresa || DEFAULT_EMPRESA;
  document.getElementById("correoEmpresa").value = data.correoEmpresa || DEFAULT_CORREO_EMPRESA;
  document.getElementById("telefonoEmpresa").value = data.telefonoEmpresa || DEFAULT_TELEFONO_EMPRESA;
  document.getElementById("sitioEmpresa").value = data.sitioEmpresa || DEFAULT_SITIO_EMPRESA;
  document.getElementById("ciudadEmpresa").value = data.ciudadEmpresa || DEFAULT_CIUDAD_EMPRESA;
  document.getElementById("moneda").value = data.moneda || DEFAULT_MONEDA;

  document.getElementById("folio").value = data.folio || "";
  document.getElementById("fecha").value = data.fecha || "";
  document.getElementById("vigencia").value = data.vigencia || 15;
  document.getElementById("tipoServicio").value = normalizeServiceType(data.tipoServicio || "Monitoreo de red");

  document.getElementById("cliente").value = data.cliente || "";
  document.getElementById("contacto").value = data.contacto || "";
  document.getElementById("correoCliente").value = data.correoCliente || "";
  document.getElementById("telefonoCliente").value = data.telefonoCliente || "";
  document.getElementById("proyecto").value = data.proyecto || "";
  document.getElementById("ubicacionProyecto").value = data.ubicacionProyecto || "";

  document.getElementById("iva").value = data.iva ?? 16;
  document.getElementById("descuentoGeneral").value = data.descuentoGeneral ?? 0;

  if (document.getElementById("resicoTabla")) document.getElementById("resicoTabla").value = data.resicoTabla || "mensual";
  if (document.getElementById("isrResico")) document.getElementById("isrResico").value = data.isrResico ?? 0;

  document.getElementById("anticipo").value = data.anticipo ?? DEFAULT_ANTICIPO;
  if (document.getElementById("formaPago")) {
    document.getElementById("formaPago").value = data.formaPago || t("defaultPaymentTerms");
  }

  document.getElementById("notas").value = data.notas || "";
  document.getElementById("terminos").value = data.terminos || t("defaultTerms");

  conceptosBody.innerHTML = "";
  const conceptosBorrador = data.conceptosBase || data.conceptos || [];
  conceptosBorrador.forEach(item => crearFila(item));

  if (!conceptosBorrador.length) crearFila();

  const resicoSelect = document.getElementById("resicoConceptoIndex");
  if (resicoSelect && data.resicoConceptoIndex !== undefined && data.resicoConceptoIndex !== null) {
    resicoSelect.value = String(data.resicoConceptoIndex);
  }

  recalcularTodo();
  alert(t("draftLoaded"));
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
      reject(new Error(t("logoLoadError", { src })));
    };

    img.src = src;
  });
}

/*
  FUNCIÓN SEGURA:
  - Si el campo ya tiene información, NO lo sobrescribe.
  - Esto evita que al importar Excel se borre lo que ya llenaste manualmente.
  - Si algún día quieres forzar sobrescritura, puedes usar:
    setFieldIfExists("cliente", valor, { overwrite: true });
*/
function setFieldIfExists(id, value, options = {}) {
  const el = document.getElementById(id);
  if (!el || value === undefined || value === null) return;

  const overwrite = options.overwrite === true;
  const currentValue = String(el.value || "").trim();
  const newValue = String(value || "").trim();

  if (!newValue) return;

  if (!overwrite && currentValue) return;

  el.value = value;
}

/*
  IMPORTACIÓN NO DESTRUCTIVA:
  - No borra campos llenados manualmente.
  - Solo llena campos vacíos.
  - No borra conceptos actuales.
  - Agrega conceptos del Excel debajo de los existentes.
*/
function importarDesdeWorkbook(workbook) {
  const findSheet = names => {
    const target = workbook.SheetNames.find(sheetName =>
      names.some(name => sheetName.trim().toLowerCase() === name.toLowerCase())
    );
    return target ? workbook.Sheets[target] : null;
  };

  const normalizeKey = value => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

  const resumenSheet = findSheet(["Resumen", "Summary"]);
  const conceptosSheet = findSheet(["Conceptos", "Items"]);

  if (!resumenSheet && !conceptosSheet) {
    alert(t("importMissingSheets"));
    return;
  }

  if (resumenSheet) {
    const resumenRows = XLSX.utils.sheet_to_json(resumenSheet, { header: 1, defval: "" });
    const mapa = {};

    resumenRows.forEach(row => {
      const key = normalizeKey(row[0]);
      if (key) mapa[key] = row[1];
    });

    const getValue = (...keys) => {
      for (const key of keys) {
        const normalized = normalizeKey(key);
        if (Object.prototype.hasOwnProperty.call(mapa, normalized)) return mapa[normalized];
      }
      return undefined;
    };

    setFieldIfExists("empresa", getValue("EMPRESA", "COMPANY"));
    setFieldIfExists("correoEmpresa", getValue("CORREO EMPRESA", "COMPANY EMAIL"));
    setFieldIfExists("telefonoEmpresa", getValue("TELÉFONO EMPRESA", "COMPANY PHONE"));
    setFieldIfExists("sitioEmpresa", getValue("SITIO WEB", "WEBSITE"));
    setFieldIfExists("ciudadEmpresa", getValue("CIUDAD", "CITY"));

    setFieldIfExists("folio", getValue("FOLIO", "QUOTE NUMBER"));
    setFieldIfExists("fecha", getValue("FECHA", "DATE"));

    const tipoServicioImportado = getValue("TIPO DE SERVICIO", "SERVICE TYPE");
    if (tipoServicioImportado !== undefined) {
      setFieldIfExists("tipoServicio", normalizeServiceType(tipoServicioImportado));
    }

    setFieldIfExists("cliente", getValue("CLIENTE", "CLIENT"));
    setFieldIfExists("contacto", getValue("CONTACTO", "CONTACT"));
    setFieldIfExists("correoCliente", getValue("CORREO CLIENTE", "CLIENT EMAIL"));
    setFieldIfExists("telefonoCliente", getValue("TELÉFONO CLIENTE", "CLIENT PHONE"));
    setFieldIfExists("proyecto", getValue("PROYECTO", "PROJECT"));
    setFieldIfExists("ubicacionProyecto", getValue("UBICACIÓN", "LOCATION"));

    setFieldIfExists("notas", getValue("NOTAS", "NOTES"));
    setFieldIfExists("terminos", getValue("TÉRMINOS", "TERMS"));
    setFieldIfExists("formaPago", getValue("FORMA DE PAGO", "PAYMENT TERMS"));

    const moneda = getValue("MONEDA", "CURRENCY");
    if (moneda === "MXN" || moneda === "USD") setFieldIfExists("moneda", moneda);

    const modoResicoRaw = getValue("RESICO TABLA", "RESICO TABLE");
    if (modoResicoRaw !== undefined) {
      const modo = String(modoResicoRaw || "").trim().toLowerCase();
      const modoResico = modo === "annual" ? "anual" : modo === "monthly" ? "mensual" : modo;
      if (modoResico === "mensual" || modoResico === "anual") {
        setFieldIfExists("resicoTabla", modoResico, { overwrite: true });
      }
    }

    const anticipoImportado = getValue(
      "ANTICIPO (%)", "ANTICIPO PORCENTAJE", "PORCENTAJE ANTICIPO", "ANTICIPO SUGERIDO",
      "DEPOSIT (%)", "DEPOSIT PERCENTAGE", "SUGGESTED DEPOSIT"
    );
    if (anticipoImportado !== undefined) setPercentFieldIfExists("anticipo", anticipoImportado);

    const vigenciaImportada = getValue("VIGENCIA", "VALIDITY");
    if (typeof vigenciaImportada === "string") {
      const match = vigenciaImportada.match(/\d+/);
      if (match) setFieldIfExists("vigencia", match[0]);
    } else if (typeof vigenciaImportada === "number") {
      setFieldIfExists("vigencia", vigenciaImportada);
    }
  }

  if (conceptosSheet) {
    const conceptos = XLSX.utils.sheet_to_json(conceptosSheet, { defval: "" });
    const filasActuales = [...conceptosBody.querySelectorAll("tr")];

    if (filasActuales.length === 1) {
      const row = filasActuales[0];
      const concepto = row.querySelector(".concepto")?.value.trim() || "";
      const cantidad = parseFloat(row.querySelector(".cantidad")?.value) || 0;
      const precio = parseFloat(row.querySelector(".precio")?.value) || 0;
      const descuento = parseFloat(row.querySelector(".descuento")?.value) || 0;
      const defaultConcepts = [I18N.es.defaultProfessionalService, I18N.en.defaultProfessionalService];

      if (defaultConcepts.includes(concepto) && cantidad === 1 && precio === 0 && descuento === 0) {
        row.remove();
      }
    }

    conceptos.forEach(item => {
      const normalizedItem = {};
      Object.entries(item).forEach(([key, value]) => {
        normalizedItem[normalizeKey(key)] = value;
      });

      const getItemValue = (...keys) => {
        for (const key of keys) {
          const normalized = normalizeKey(key);
          if (Object.prototype.hasOwnProperty.call(normalizedItem, normalized)) return normalizedItem[normalized];
        }
        return undefined;
      };

      const concepto = getItemValue("CONCEPTO", "ITEM", "DESCRIPTION") || "";
      const cantidad = getItemValue("CANTIDAD", "QUANTITY") ?? 1;
      const precio = getItemValue("PRECIO_UNITARIO", "PRECIO UNITARIO", "UNIT_PRICE", "UNIT PRICE") ?? 0;
      const descuento = getItemValue("DESCUENTO_PORCENTAJE", "DESC. %", "DISCOUNT_PERCENTAGE", "DISC. %") ?? 0;

      const conceptoLimpio = String(concepto || "").trim();
      const precioNumerico = parseFloat(precio) || 0;
      if (!conceptoLimpio && !precioNumerico) return;

      crearFila({ concepto: conceptoLimpio, cantidad, precio, descuento });
    });

    if (!conceptosBody.querySelectorAll("tr").length) crearFila();
  }

  recalcularTodo();
  alert(t("importSuccess"));
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
      alert(t("excelReadError"));
    }
  };

  reader.readAsArrayBuffer(file);
}

function traducirValorPredeterminadoParaExportar(value, key, targetLanguage) {
  const currentValue = String(value || "").trim();
  if (!currentValue) return value;

  const isKnownDefault = ["es", "en"].some(language =>
    currentValue === String(t(key, {}, language) || "").trim()
  );

  return isKnownDefault ? t(key, {}, targetLanguage) : value;
}

function prepararDatosParaIdiomaPDF(data, targetLanguage) {
  const result = { ...data };
  result.formaPago = traducirValorPredeterminadoParaExportar(
    data.formaPago,
    "defaultPaymentTerms",
    targetLanguage
  );
  result.terminos = traducirValorPredeterminadoParaExportar(
    data.terminos,
    "defaultTerms",
    targetLanguage
  );

  const translateItems = items => (items || []).map(item => ({
    ...item,
    concepto: traducirValorPredeterminadoParaExportar(
      item.concepto,
      "defaultProfessionalService",
      targetLanguage
    )
  }));

  result.conceptosBase = translateItems(data.conceptosBase);
  result.conceptos = translateItems(data.conceptos);
  return result;
}

function confirmarExportacionPDF() {
  const data = obtenerDatosFormulario();

  if (data.conceptosBase.length > 1 && data.isrResicoMonto > 0) {
    const conceptoSeleccionado =
      data.conceptosBase[data.resicoConceptoIndex]?.concepto ||
      t("itemN", { n: data.resicoConceptoIndex + 1 });

    return confirm(
      `${t("beforePrint")}

` +
      `${t("resicoWillIntegrate", {
        amount: formatMoney(data.isrResicoMonto),
        number: data.resicoConceptoIndex + 1
      })}
` +
      `"${conceptoSeleccionado}"

` +
      t("resicoNotSeparate")
    );
  }

  return true;
}

async function generarPDFEnIdioma(languageOverride = currentLanguage) {
  const previousLanguage = currentLanguage;
  const targetLanguage = languageOverride === "en" ? "en" : "es";
  currentLanguage = targetLanguage;

  try {
    const data = prepararDatosParaIdiomaPDF(
      obtenerDatosFormulario(),
      targetLanguage
    );

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
      doc.text(`${data.empresa || DEFAULT_EMPRESA} | ${data.sitioEmpresa || DEFAULT_SITIO_EMPRESA}`, margin, footerY);
      doc.text(`${t("page")} ${pageNumber} ${t("of")} ${doc.getNumberOfPages()}`, pageWidth - margin, footerY, { align: "right" });
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
        drawInfoLineMeasure(t("client"), data.cliente, colWidth),
        drawInfoLineMeasure(t("contact"), data.contacto, colWidth),
        drawInfoLineMeasure(t("email"), data.correoCliente, colWidth)
      ];

      const rightHeights = [
        drawInfoLineMeasure(t("phone"), data.telefonoCliente, colWidth),
        drawInfoLineMeasure(t("project"), data.proyecto, colWidth),
        drawInfoLineMeasure(t("location"), data.ubicacionProyecto, colWidth)
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
      doc.text(t("clientInfoTitle"), boxX + innerPadding, currentY + 7);

      let leftY = currentY + 14;
      let rightY = currentY + 14;

      leftY += drawInfoLine(t("client"), data.cliente || "-", leftX, leftY, colWidth);
      leftY += drawInfoLine(t("contact"), data.contacto || "-", leftX, leftY, colWidth);
      leftY += drawInfoLine(t("email"), data.correoCliente || "-", leftX, leftY, colWidth);

      rightY += drawInfoLine(t("phone"), data.telefonoCliente || "-", rightX, rightY, colWidth);
      rightY += drawInfoLine(t("project"), data.proyecto || "-", rightX, rightY, colWidth);
      rightY += drawInfoLine(t("location"), data.ubicacionProyecto || "-", rightX, rightY, colWidth);

      return currentY + boxH + 6;
    }

    function drawServiceTypeBox(y) {
      const label = `${t("serviceTypePdf")}:`;
      const labelWidth = 34;
      const textWidth = contentWidth - 8 - labelWidth;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      const valueLines = doc.splitTextToSize(data.tipoServicioLabel || getServiceTypeLabel(data.tipoServicio) || "-", textWidth);
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
      const rightBoxW = 82;
      const gap = 8;

      const leftX = margin;
      const rightX = margin + leftBoxW + gap;

      // Altura ampliada para mostrar descuentos por concepto sin duplicar el descuento en el total.
      const leftH = 50;
      const rightH = 50;
      const rowH = Math.max(leftH, rightH);

      let currentY = ensureSpace(y, rowH + 10);

      doc.setFillColor(236, 244, 255);
      doc.roundedRect(leftX, currentY, leftBoxW, leftH, 3, 3, "F");
      doc.setDrawColor(205, 223, 245);
      doc.roundedRect(leftX, currentY, leftBoxW, leftH, 3, 3, "S");

      const anticipoLabelPdf = data.anticipoLabel || getAnticipoComercialLabel(data.anticipo);
      const metodoPagoPdf = data.metodoPagoClave || getMetodoPagoInfo(data.anticipo).clave;
      const saldoTextoPdf = (data.saldoPendiente || 0) > 0
        ? `${t("balanceDue")}: ${formatMoney(data.saldoPendiente)}`
        : t("fullQuotePayment");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accentBlue);
      doc.setFontSize(8.2);
      doc.text(t("suggestedDeposit"), leftX + 4, currentY + 6);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryBlue);
      doc.setFontSize(9.4);
      doc.text(anticipoLabelPdf, leftX + 4, currentY + 11.5);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryBlue);
      doc.setFontSize(12);
      doc.text(formatMoney(data.anticipoMonto), leftX + 4, currentY + 18.5);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(205, 223, 245);
      doc.roundedRect(leftX + 4, currentY + 22, leftBoxW - 8, 7, 2, 2, "FD");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.1);
      doc.setTextColor(...textGray);
      const metodoPagoText = `${t("method")}: ${metodoPagoPdf}`;
      const metodoPagoLines = doc.splitTextToSize(metodoPagoText, leftBoxW - 12);
      doc.text(metodoPagoLines.slice(0, 1), leftX + 6, currentY + 26.6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...textGray);
      const saldoLines = doc.splitTextToSize(saldoTextoPdf, leftBoxW - 8);
      doc.text(saldoLines.slice(0, 2), leftX + 4, currentY + 35);

      doc.setFillColor(...softGray);
      doc.roundedRect(rightX, currentY, rightBoxW, rightH, 3, 3, "F");
      doc.setDrawColor(...borderGray);
      doc.roundedRect(rightX, currentY, rightBoxW, rightH, 3, 3, "S");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accentBlue);
      doc.setFontSize(9.4);
      doc.text(t("financialSummary"), rightX + rightBoxW / 2, currentY + 6.5, { align: "center" });

      const descuentoConceptosLabel = `${t("itemDiscountPdf")} (${formatPercent(data.descuentoConceptosPorcentaje)}%):`;
      const descuentoTotalLabel = `${t("totalDiscountPdf")} (${formatPercent(data.descuentoTotalPorcentaje)}%):`;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.8);
      doc.setTextColor(...textGray);
      doc.text(`${t("grossSubtotal")}:`, rightX + 4, currentY + 14);
      doc.text(descuentoConceptosLabel, rightX + 4, currentY + 20);
      doc.text(`${t("netSubtotal")}:`, rightX + 4, currentY + 26);
      doc.text(`${t("generalDiscountShort")}:`, rightX + 4, currentY + 32);
      doc.text(descuentoTotalLabel, rightX + 4, currentY + 38);
      doc.text(`${t("vat")}:`, rightX + 4, currentY + 44);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(...darkText);
      doc.text(formatMoney(data.subtotalBruto), rightX + rightBoxW - 4, currentY + 14, { align: "right" });
      doc.text(formatMoney(data.descuentoConceptosMonto), rightX + rightBoxW - 4, currentY + 20, { align: "right" });
      doc.text(formatMoney(data.subtotal), rightX + rightBoxW - 4, currentY + 26, { align: "right" });
      doc.text(formatMoney(data.descuentoMonto), rightX + rightBoxW - 4, currentY + 32, { align: "right" });
      doc.text(formatMoney(data.descuentoTotalMonto), rightX + rightBoxW - 4, currentY + 38, { align: "right" });
      doc.text(formatMoney(data.ivaMonto), rightX + rightBoxW - 4, currentY + 44, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryBlue);
      doc.setFontSize(9.2);
      doc.text(`${t("total")}:`, rightX + 4, currentY + 49);
      doc.text(formatMoney(data.total), rightX + rightBoxW - 4, currentY + 49, { align: "right" });

      return currentY + rowH + 8;
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
      const lines = doc.splitTextToSize(data.empresa || DEFAULT_EMPRESA, infoW);
      if (lines.length <= 2) break;
      empresaFontSize -= 1;
    }

    doc.setFontSize(empresaFontSize);
    const empresaLines = doc.splitTextToSize(data.empresa || DEFAULT_EMPRESA, infoW);
    doc.text(empresaLines, infoX, infoY);

    const empresaTextHeight = empresaLines.length * (empresaFontSize * 0.42);
    let lineY = infoY + empresaTextHeight + 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);

    const contactoLines = [
      data.correoEmpresa || DEFAULT_CORREO_EMPRESA,
      data.telefonoEmpresa || DEFAULT_TELEFONO_EMPRESA,
      data.sitioEmpresa || DEFAULT_SITIO_EMPRESA
    ];

    contactoLines.forEach(line => {
      const wrapped = doc.splitTextToSize(line, infoW);
      doc.text(wrapped, infoX, lineY);
      lineY += wrapped.length * 4.2;
    });

    doc.setTextColor(...primaryBlue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(t("quoteTitle"), quoteBoxX + quoteBoxW / 2, quoteBoxY + 6.8, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.text(`${t("folio")}: ${data.folio || "-"}`, quoteBoxX + 4, quoteBoxY + 12);
    doc.text(`${t("date")}: ${fechaCotizacionVisual || "-"}`, quoteBoxX + 4, quoteBoxY + 17);
    doc.text(`${t("validityDays").replace(" (días)", "").replace(" (days)", "")}: ${data.vigencia || "-"} ${t("days")}`, quoteBoxX + 4, quoteBoxY + 22);
    doc.text(`${t("expires")}: ${fechaExpiracion || "-"}`, quoteBoxX + 4, quoteBoxY + 27);

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
      head: [["#", t("item"), t("quantity"), t("unitPrice"), t("discountShortPct"), t("amount")]],
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
      didDrawPage: function () {}
    });

    let finalY = doc.lastAutoTable.finalY + 8;

    y = drawFinancialSummary(finalY);

    const formaPagoTexto = data.formaPago || t("defaultPaymentTerms");
    y = drawWrappedTextBlock({
      title: t("paymentTermsTitle"),
      text: formaPagoTexto,
      y: y,
      width: contentWidth
    });

    if (data.terminos && data.terminos.trim()) {
      const terminosCompletos =
        `${t("allPricesClause", { currency: data.monedaDescripcion })} ${data.terminos.trim()}`;

      y = drawWrappedTextBlock({
        title: t("termsTitle"),
        text: terminosCompletos,
        y: y,
        width: contentWidth
      });
    }

    if (data.notas && data.notas.trim()) {
      y = drawWrappedTextBlock({
        title: t("notesTitle"),
        text: data.notas.trim(),
        y: y,
        width: contentWidth
      });
    }

    addFooterToAllPages();

    const languageSuffix = targetLanguage === "en" ? "EN" : "ES";
    const nombreArchivo = `${t("quoteFilePrefix")}_${(data.folio || t("noFolio")).replace(/\s+/g, "_")}_${languageSuffix}.pdf`;
    doc.save(nombreArchivo);
    return true;

  } catch (error) {
    console.error(error);
    alert(t("pdfError", {}, previousLanguage));
    return false;
  } finally {
    currentLanguage = previousLanguage;
    recalcularTodo();
  }
}

async function exportarPDF() {
  if (!confirmarExportacionPDF()) return;

  const selectedMode = idiomaPDFSelect?.value || "current";
  const interfaceLanguage = currentLanguage;
  const languages = selectedMode === "both"
    ? ["es", "en"]
    : [selectedMode === "current" ? interfaceLanguage : selectedMode];

  const originalButtonText = btnPDF.textContent;
  btnPDF.disabled = true;

  try {
    for (const language of languages) {
      const generated = await generarPDFEnIdioma(language);
      if (!generated) break;
    }
  } finally {
    currentLanguage = interfaceLanguage;
    btnPDF.disabled = false;
    btnPDF.textContent = t("generatePdf", {}, interfaceLanguage) || originalButtonText;
    recalcularTodo();
  }
}

function exportarExcel() {
  const data = obtenerDatosFormulario();
  const wb = XLSX.utils.book_new();
  const isEnglish = currentLanguage === "en";

  const labels = isEnglish ? {
    company: "COMPANY", companyEmail: "COMPANY EMAIL", companyPhone: "COMPANY PHONE", website: "WEBSITE", city: "CITY",
    folio: "QUOTE NUMBER", date: "DATE", visualDate: "FORMATTED DATE", expires: "EXPIRES", validity: "VALIDITY", serviceType: "SERVICE TYPE",
    client: "CLIENT", contact: "CONTACT", clientEmail: "CLIENT EMAIL", clientPhone: "CLIENT PHONE", project: "PROJECT", location: "LOCATION",
    paymentTerms: "PAYMENT TERMS", paymentMethod: "PAYMENT METHOD", depositPct: "DEPOSIT (%)", resicoTable: "RESICO TABLE",
    resicoRate: "RESICO RATE (%)", resicoItem: "RESICO ITEM", currency: "CURRENCY", currencyDescription: "CURRENCY DESCRIPTION",
    grossBaseSubtotal: "GROSS BASE SUBTOTAL", baseItemDiscount: "BASE ITEM DISCOUNT", baseItemDiscountPct: "BASE ITEM DISCOUNT (%)",
    originalBaseSubtotal: "ORIGINAL BASE SUBTOTAL", originalBaseBeforeVat: "ORIGINAL BASE BEFORE VAT", integratedResico: "RESICO INCLUDED IN PRICE",
    clientGrossSubtotal: "CLIENT GROSS SUBTOTAL", clientItemDiscount: "CLIENT ITEM DISCOUNT", clientItemDiscountPct: "CLIENT ITEM DISCOUNT (%)",
    clientSubtotal: "CLIENT SUBTOTAL", generalDiscount: "GENERAL DISCOUNT", totalDiscount: "TOTAL DISCOUNT", totalDiscountPct: "TOTAL DISCOUNT (%)",
    vat: "VAT", total: "TOTAL", estimatedNetResico: "ESTIMATED NET AFTER RESICO", suggestedDeposit: "SUGGESTED DEPOSIT",
    outstandingBalance: "OUTSTANDING BALANCE", notes: "NOTES", terms: "TERMS", language: "LANGUAGE"
  } : {
    company: "EMPRESA", companyEmail: "CORREO EMPRESA", companyPhone: "TELÉFONO EMPRESA", website: "SITIO WEB", city: "CIUDAD",
    folio: "FOLIO", date: "FECHA", visualDate: "FECHA VISUAL", expires: "EXPIRA", validity: "VIGENCIA", serviceType: "TIPO DE SERVICIO",
    client: "CLIENTE", contact: "CONTACTO", clientEmail: "CORREO CLIENTE", clientPhone: "TELÉFONO CLIENTE", project: "PROYECTO", location: "UBICACIÓN",
    paymentTerms: "FORMA DE PAGO", paymentMethod: "MÉTODO DE PAGO", depositPct: "ANTICIPO (%)", resicoTable: "RESICO TABLA",
    resicoRate: "RESICO TASA (%)", resicoItem: "RESICO CONCEPTO", currency: "MONEDA", currencyDescription: "DESCRIPCIÓN MONEDA",
    grossBaseSubtotal: "SUBTOTAL BRUTO BASE", baseItemDiscount: "DESCUENTO POR CONCEPTOS BASE", baseItemDiscountPct: "DESCUENTO POR CONCEPTOS BASE (%)",
    originalBaseSubtotal: "SUBTOTAL BASE ORIGINAL", originalBaseBeforeVat: "BASE ORIGINAL SIN IVA", integratedResico: "RESICO INTEGRADO AL PRECIO",
    clientGrossSubtotal: "SUBTOTAL BRUTO CLIENTE", clientItemDiscount: "DESCUENTO POR CONCEPTOS CLIENTE", clientItemDiscountPct: "DESCUENTO POR CONCEPTOS CLIENTE (%)",
    clientSubtotal: "SUBTOTAL CLIENTE", generalDiscount: "DESCUENTO GENERAL", totalDiscount: "DESCUENTO TOTAL", totalDiscountPct: "DESCUENTO TOTAL (%)",
    vat: "IVA", total: "TOTAL", estimatedNetResico: "NETO ESTIMADO RESICO", suggestedDeposit: "ANTICIPO SUGERIDO",
    outstandingBalance: "SALDO PENDIENTE", notes: "NOTAS", terms: "TÉRMINOS", language: "IDIOMA"
  };

  const resicoTableLabel = data.resicoTabla === "anual"
    ? (isEnglish ? "annual" : "anual")
    : (isEnglish ? "monthly" : "mensual");

  const hojaResumen = [
    [labels.company, data.empresa],
    [labels.companyEmail, data.correoEmpresa],
    [labels.companyPhone, data.telefonoEmpresa],
    [labels.website, data.sitioEmpresa],
    [labels.city, data.ciudadEmpresa],
    [],
    [labels.folio, data.folio],
    [labels.date, data.fecha],
    [labels.visualDate, data.fechaVisual],
    [labels.expires, data.fechaExpiracion],
    [labels.validity, `${data.vigencia} ${t("days")}`],
    [labels.serviceType, data.tipoServicioLabel],
    [labels.language, isEnglish ? "English" : "Español"],
    [],
    [labels.client, data.cliente],
    [labels.contact, data.contacto],
    [labels.clientEmail, data.correoCliente],
    [labels.clientPhone, data.telefonoCliente],
    [labels.project, data.proyecto],
    [labels.location, data.ubicacionProyecto],
    [],
    [labels.paymentTerms, data.formaPago],
    [labels.paymentMethod, data.metodoPagoClave],
    [labels.depositPct, data.anticipo],
    [labels.resicoTable, resicoTableLabel],
    [labels.resicoRate, data.resicoTasa],
    [labels.resicoItem, `#${(data.resicoConceptoIndex || 0) + 1}`],
    [labels.currency, data.moneda],
    [labels.currencyDescription, data.monedaDescripcion],
    [],
    [labels.grossBaseSubtotal, data.subtotalBrutoBase],
    [labels.baseItemDiscount, data.descuentoConceptosBase],
    [labels.baseItemDiscountPct, data.descuentoConceptosPorcentajeBase],
    [labels.originalBaseSubtotal, data.subtotalBase],
    [labels.originalBaseBeforeVat, data.subtotalConDescuentoBase],
    [labels.integratedResico, data.isrResicoMonto],
    [labels.clientGrossSubtotal, data.subtotalBruto],
    [labels.clientItemDiscount, data.descuentoConceptosMonto],
    [labels.clientItemDiscountPct, data.descuentoConceptosPorcentaje],
    [labels.clientSubtotal, data.subtotal],
    [labels.generalDiscount, data.descuentoMonto],
    [labels.totalDiscount, data.descuentoTotalMonto],
    [labels.totalDiscountPct, data.descuentoTotalPorcentaje],
    [labels.vat, data.ivaMonto],
    [labels.total, data.total],
    [labels.estimatedNetResico, data.netoEstimadoResico],
    [labels.suggestedDeposit, data.anticipoMonto],
    [labels.outstandingBalance, data.saldoPendiente],
    [],
    [labels.notes, data.notas],
    [labels.terms, data.terminos]
  ];

  const hojaConceptos = data.conceptos.map(item => isEnglish ? {
    No: item.no,
    Item: item.concepto,
    Quantity: item.cantidad,
    Unit_Price: item.precio,
    Discount_Percentage: item.descuento,
    Amount: item.importe
  } : {
    No: item.no,
    Concepto: item.concepto,
    Cantidad: item.cantidad,
    Precio_Unitario: item.precio,
    Descuento_Porcentaje: item.descuento,
    Importe: item.importe
  });

  const wsResumen = XLSX.utils.aoa_to_sheet(hojaResumen);
  const wsConceptos = XLSX.utils.json_to_sheet(hojaConceptos);

  XLSX.utils.book_append_sheet(wb, wsResumen, t("summarySheet"));
  XLSX.utils.book_append_sheet(wb, wsConceptos, t("itemsSheet"));

  const nombreArchivo = `${t("quoteFilePrefix")}_${(data.folio || t("noFolio")).replace(/\s+/g, "_")}.xlsx`;
  XLSX.writeFile(wb, nombreArchivo);
}

btnAgregarFila.addEventListener("click", () => crearFila());
btnAgregarFilaTop.addEventListener("click", () => crearFila());
btnPDF.addEventListener("click", exportarPDF);
btnExcel.addEventListener("click", exportarExcel);

btnNuevo.addEventListener("click", () => {
  if (confirm(t("clearConfirm"))) {
    limpiarFormulario();
  }
});

btnGuardar.addEventListener("click", guardarBorrador);
btnCargar.addEventListener("click", cargarBorrador);

if (btnImportarExcel && inputImportarExcel) {
  btnImportarExcel.addEventListener("click", () => inputImportarExcel.click());
  inputImportarExcel.addEventListener("change", e => {
    const file = e.target.files?.[0];
    importarExcel(file);
    e.target.value = "";
  });
}

const idiomaSelect = document.getElementById("idioma");
if (idiomaSelect) {
  idiomaSelect.addEventListener("change", event => applyLanguage(event.target.value));
}

[
  ivaInput,
  descuentoGeneralInput,
  anticipoInput,
  document.getElementById("resicoTabla"),
  document.getElementById("resicoConceptoIndex"),
  document.getElementById("moneda")
]
  .filter(Boolean)
  .forEach(el => {
    el.addEventListener("input", recalcularTodo);
    el.addEventListener("change", recalcularTodo);
  });

aplicarDatosEmpresaPorDefecto({ overwrite: false });

if (anticipoInput && !String(anticipoInput.value || "").trim()) {
  anticipoInput.value = DEFAULT_ANTICIPO;
}

if (!document.getElementById("folio").value.trim()) {
  generarNuevoFolio();
}

applyLanguage(currentLanguage, { translateDefaults: true, recalculate: false, persist: false });

crearFila({
  concepto: t("defaultProfessionalService"),
  cantidad: 1,
  precio: 0,
  descuento: 0
});

recalcularTodo();
