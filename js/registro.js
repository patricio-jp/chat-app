const form = document.getElementById('registro-form');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

const strengthBar = document.getElementById('password-strength-bar');
const strengthText = document.getElementById('password-strength-text');

const passwordErrorContainer = document.createElement('div');
passwordErrorContainer.className = 'text-red-500 text-sm mb-2 hidden';
passwordErrorContainer.id = 'password-error';
password.parentNode.insertBefore(passwordErrorContainer, password.nextSibling);

// Función para evaluar fuerza
function evaluatePasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[\W_]/.test(pw)) score++;
  return score;
}

// Escuchar mientras escribe
password.addEventListener('input', function() {
  const pw = password.value;
  const score = evaluatePasswordStrength(pw);
  let width = (score / 5) * 100;
  let color = 'bg-red-500';
  let text = 'Débil';

  if (score >= 4) {
    color = 'bg-green-500';
    text = 'Fuerte';
  } else if (score >= 3) {
    color = 'bg-yellow-500';
    text = 'Media';
  }

  strengthBar.className = `h-2 rounded ${color}`;
  strengthBar.style.width = `${width}%`;
  strengthText.textContent = text;
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const passwordValue = password.value;
  const score = evaluatePasswordStrength(passwordValue);

  if (score < 4) {
    passwordErrorContainer.textContent = 
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.';
    passwordErrorContainer.classList.remove('hidden');
    return;
  } else {
    passwordErrorContainer.classList.add('hidden');
  }

  if (passwordValue !== confirmPassword.value) {
    errorMessage.classList.remove('hidden');
    return;
  }

  errorMessage.classList.add('hidden');
  successMessage.classList.remove('hidden');

  // Crear objeto con los datos
  const nuevoUsuario = {
    username: document.getElementById('username').value,
    password: password.value
  };

  // Enviar al backend
  fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevoUsuario)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al registrar el usuario");
      }
      return response.json();
    })
    .then(data => {
      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    })
    .catch(error => {
      successMessage.classList.add('hidden');
      alert("Falló el registro: " + error.message);
    });
});

// Modal
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const passwordModal = document.getElementById('password-modal');

openModalBtn.addEventListener('click', () => {
  passwordModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  passwordModal.classList.add('hidden');
});

passwordModal.addEventListener('click', (e) => {
  if (e.target === passwordModal) {
    passwordModal.classList.add('hidden');
  }
});
