const form = document.getElementById('registro-form');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const passwordError = document.getElementById('password-error');

// Requisitos de contraseña
const requirementsBox = document.getElementById('password-requirements');
const reqLength = document.getElementById('req-length');
const reqUppercase = document.getElementById('req-uppercase');
const reqLowercase = document.getElementById('req-lowercase');
const reqNumber = document.getElementById('req-number');
const reqSymbol = document.getElementById('req-symbol');

// Evaluar requisitos
function checkRequirements(pw) {
  reqLength.textContent = (pw.length >= 8) ? '✅ Al menos 8 caracteres' : '❌ Al menos 8 caracteres';
  reqUppercase.textContent = (/[A-Z]/.test(pw)) ? '✅ Una letra mayúscula' : '❌ Una letra mayúscula';
  reqLowercase.textContent = (/[a-z]/.test(pw)) ? '✅ Una letra minúscula' : '❌ Una letra minúscula';
  reqNumber.textContent = (/\d/.test(pw)) ? '✅ Un número' : '❌ Un número';
  reqSymbol.textContent = (/[\W_]/.test(pw)) ? '✅ Un símbolo (por ej. !, @, #, $)' : '❌ Un símbolo (por ej. !, @, #, $)';
}

// Mostrar y ocultar lista de requisitos
password.addEventListener('focus', () => {
  requirementsBox.classList.remove('hidden');
});

password.addEventListener('blur', () => {
  requirementsBox.classList.add('hidden');
});

password.addEventListener('input', () => {
  const pw = password.value;
  checkRequirements(pw);
});

// Validar y enviar formulario
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const pw = password.value;

  const valid = pw.length >= 8 &&
                /[A-Z]/.test(pw) &&
                /[a-z]/.test(pw) &&
                /\d/.test(pw) &&
                /[\W_]/.test(pw);

  if (!valid) {
    passwordError.textContent = 'La contraseña no cumple con los requisitos.';
    passwordError.classList.remove('hidden');
    return;
  } else {
    passwordError.classList.add('hidden');
  }

  if (pw !== confirmPassword.value) {
    errorMessage.classList.remove('hidden');
    return;
  }

  errorMessage.classList.add('hidden');
  successMessage.classList.remove('hidden');

  const nuevoUsuario = {
    username: document.getElementById('username').value,
    password: pw
  };

  fetch("https://jycapp.duckdns.org/chat-server/api/auth/register", {
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
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    })
    .catch(error => {
      successMessage.classList.add('hidden');
      alert("Falló el registro: " + error.message);
    });
});
