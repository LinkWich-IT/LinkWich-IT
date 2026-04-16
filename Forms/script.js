const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');
const ratingHidden = document.getElementById('puntuacion_general');
const ratingLabel = document.getElementById('ratingLabel');
const starButtons = document.querySelectorAll('.star-btn');
const ratingWrapper = document.getElementById('ratingWrapper');

const ratingTexts = {
  1: '1 estrella - Muy mala',
  2: '2 estrellas - Regular',
  3: '3 estrellas - Buena',
  4: '4 estrellas - Muy buena',
  5: '5 estrellas - Excelente'
};

function setRating(value) {
  ratingHidden.value = value;
  ratingLabel.textContent = ratingTexts[value] || 'Selecciona una calificación';

  starButtons.forEach((btn) => {
    const btnValue = Number(btn.dataset.value);
    btn.classList.toggle('active', btnValue <= value);
  });

  const parentGroup = ratingWrapper.closest('.input-group');
  parentGroup.classList.remove('error');
  const errorText = parentGroup.querySelector('.error-text');
  if (errorText) errorText.textContent = '';
  ratingWrapper.classList.remove('error');
}

starButtons.forEach((btn) => {
  btn.addEventListener('click', () => setRating(Number(btn.dataset.value)));
  btn.addEventListener('mouseenter', () => {
    const hoverValue = Number(btn.dataset.value);
    starButtons.forEach((star) => {
      star.classList.toggle('active', Number(star.dataset.value) <= hoverValue);
    });
  });
});

ratingWrapper.addEventListener('mouseleave', () => {
  const currentValue = Number(ratingHidden.value || 0);
  starButtons.forEach((star) => {
    star.classList.toggle('active', Number(star.dataset.value) <= currentValue);
  });
});

function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status show ${type}`;
}

function clearStatus() {
  formStatus.textContent = '';
  formStatus.className = 'form-status';
}

function setLoadingState(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle('is-loading', isLoading);
  submitBtn.querySelector('.btn-text').textContent = isLoading ? 'Enviando...' : 'Enviar testimonio';
}

function validateField(field) {
  const group = field.closest('.input-group') || field.closest('.checkbox-group');
  if (!group) return true;

  const errorText = group.querySelector('.error-text');
  let valid = true;
  let message = '';

  if (field.type === 'checkbox') {
    if (!field.checked) {
      valid = false;
      message = 'Debes aceptar el consentimiento para continuar.';
    }
  } else if (field.id === 'puntuacion_general') {
    if (!field.value) {
      valid = false;
      message = 'Selecciona una puntuación general.';
    }
  } else if (!field.checkValidity()) {
    valid = false;
    if (field.validity.valueMissing) message = 'Este campo es obligatorio.';
    else if (field.validity.typeMismatch) message = 'Ingresa un formato válido.';
    else message = 'Revisa este campo.';
  }

  group.classList.toggle('error', !valid);
  if (field.id === 'puntuacion_general') ratingWrapper.classList.toggle('error', !valid);
  if (errorText) errorText.textContent = message;

  return valid;
}

function validateForm() {
  clearStatus();
  let isValid = true;

  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach((field) => {
    const ok = validateField(field);
    if (!ok) isValid = false;
  });

  return isValid;
}

form.querySelectorAll('input, textarea, select').forEach((field) => {
  field.addEventListener('input', () => {
    if (field.type === 'checkbox') return;
    validateField(field);
  });

  field.addEventListener('change', () => validateField(field));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    showStatus('Por favor revisa los campos obligatorios antes de enviar.', 'error');
    return;
  }

  setLoadingState(true);
  clearStatus();

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      showStatus('Gracias. Tu testimonio fue enviado correctamente.', 'success');
      form.reset();
      setRating(0);
      ratingLabel.textContent = 'Selecciona una calificación';
      document.querySelectorAll('.input-group, .checkbox-group').forEach((group) => group.classList.remove('error'));
      document.querySelectorAll('.error-text').forEach((error) => error.textContent = '');
    } else {
      const data = await response.json().catch(() => ({}));
      const message = data.errors?.map(err => err.message).join(', ') || 'No se pudo enviar el formulario. Intenta nuevamente.';
      showStatus(message, 'error');
    }
  } catch (error) {
    showStatus('Ocurrió un error de conexión al enviar el formulario. Verifica tu internet e inténtalo de nuevo.', 'error');
  } finally {
    setLoadingState(false);
  }
});


const termsModal = document.getElementById('termsModal');
const openTermsButtons = document.querySelectorAll('#openTermsModal, [data-open-terms="true"]');
const closeTermsButton = document.getElementById('closeTermsModal');
const dismissTermsButton = document.getElementById('dismissTermsModal');
const acceptTermsButton = document.getElementById('acceptTermsBtn');
const consentimientoCheckbox = document.getElementById('consentimiento');

function openTermsModal() {
  if (!termsModal) return;
  termsModal.classList.add('show');
  termsModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeTermsModal() {
  if (!termsModal) return;
  termsModal.classList.remove('show');
  termsModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openTermsButtons.forEach((btn) => {
  btn.addEventListener('click', openTermsModal);
});

if (closeTermsButton) closeTermsButton.addEventListener('click', closeTermsModal);
if (dismissTermsButton) dismissTermsButton.addEventListener('click', closeTermsModal);

if (acceptTermsButton) {
  acceptTermsButton.addEventListener('click', () => {
    if (consentimientoCheckbox) {
      consentimientoCheckbox.checked = true;
      validateField(consentimientoCheckbox);
    }
    closeTermsModal();
  });
}

if (termsModal) {
  termsModal.addEventListener('click', (e) => {
    if (e.target === termsModal) closeTermsModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && termsModal && termsModal.classList.contains('show')) {
    closeTermsModal();
  }
});
