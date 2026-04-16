document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ticketForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");
  const folioInput = document.getElementById("folio_ticket");
  const fechaInput = document.getElementById("fecha_ticket");
  const preview = document.getElementById("ticketPreview");
  const ticketDate = document.getElementById("ticketDate");
  const consentimiento = document.getElementById("consentimiento");
  const adjuntosInput = document.getElementById("adjuntos");

  function generarFolio() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `LW-${y}${m}${d}-${h}${min}`;
  }

  function fechaLegible() {
    return new Date().toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function actualizarMetaTicket() {
    const folio = generarFolio();
    const fecha = fechaLegible();
    folioInput.value = folio;
    fechaInput.value = fecha;
    preview.textContent = folio;
    ticketDate.textContent = fecha;
  }

  actualizarMetaTicket();

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status show ${type}`;
  }

  function clearStatus() {
    formStatus.textContent = "";
    formStatus.className = "form-status";
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("is-loading", isLoading);
  }

  function showFieldError(group, message) {
    if (!group) return;
    group.classList.add("error");
    const errorText = group.querySelector(".error-text");
    if (errorText) errorText.textContent = message;
  }

  function clearFieldError(group) {
    if (!group) return;
    group.classList.remove("error");
    const errorText = group.querySelector(".error-text");
    if (errorText) errorText.textContent = "";
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function validateForm() {
    let isValid = true;
    clearStatus();

    const requiredFields = [
      { id: "empresa", message: "Ingresa la empresa o negocio." },
      { id: "nombre", message: "Ingresa el nombre del solicitante." },
      { id: "email", message: "Ingresa un correo electrónico válido." },
      { id: "categoria", message: "Selecciona una categoría." },
      { id: "prioridad", message: "Selecciona una prioridad." },
      { id: "servicio_afectado", message: "Indica el servicio afectado." },
      { id: "impacto", message: "Selecciona el impacto." },
      { id: "asunto", message: "Ingresa el asunto del ticket." },
      { id: "descripcion", message: "Describe la incidencia." }
    ];

    requiredFields.forEach((field) => {
      const input = document.getElementById(field.id);
      const group = input.closest(".input-group");
      clearFieldError(group);

      if (!input.value.trim()) {
        showFieldError(group, field.message);
        isValid = false;
      }
    });

    const emailInput = document.getElementById("email");
    const emailGroup = emailInput.closest(".input-group");
    if (emailInput.value.trim() && !validateEmail(emailInput.value)) {
      showFieldError(emailGroup, "Ingresa un correo electrónico válido.");
      isValid = false;
    }

    const checkboxGroup = consentimiento.closest(".checkbox-group");
    clearFieldError(checkboxGroup);
    if (!consentimiento.checked) {
      showFieldError(checkboxGroup, "Debes confirmar el consentimiento.");
      isValid = false;
    }

    const adjuntosGroup = adjuntosInput ? adjuntosInput.closest(".input-group") : null;

    if (adjuntosInput && adjuntosInput.files.length > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 25 * 1024 * 1024;

      clearFieldError(adjuntosGroup);

      if (adjuntosInput.files.length > 10) {
        showFieldError(adjuntosGroup, "Solo puedes adjuntar hasta 10 archivos.");
        isValid = false;
      }

      Array.from(adjuntosInput.files).forEach((file) => {
        if (!allowedTypes.includes(file.type)) {
          showFieldError(adjuntosGroup, "Solo se permiten archivos JPG, PNG o PDF.");
          isValid = false;
        }

        if (file.size > maxSize) {
          showFieldError(adjuntosGroup, "Cada archivo debe ser menor a 25 MB.");
          isValid = false;
        }
      });
    }

    return isValid;
  }

  form.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldError(field.closest(".input-group") || field.closest(".checkbox-group"));
    });

    field.addEventListener("change", () => {
      clearFieldError(field.closest(".input-group") || field.closest(".checkbox-group"));
    });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    actualizarMetaTicket();

    if (!validateForm()) {
      showStatus("Por favor revisa los campos marcados antes de continuar.", "error");
      return;
    }

    setLoading(true);
    clearStatus();

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        const folioEnviado = folioInput.value;
        form.reset();
        showStatus(`Gracias. Tu ticket fue enviado correctamente con el folio ${folioEnviado}.`, "success");
        actualizarMetaTicket();
      } else {
        showStatus("No se pudo enviar el ticket. Intenta nuevamente.", "error");
      }
    } catch (error) {
      showStatus("Ocurrió un error de conexión. Intenta de nuevo en unos momentos.", "error");
    } finally {
      setLoading(false);
    }
  });
});
