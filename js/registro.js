const form = document.getElementById('registro-form');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  if (password.value !== confirmPassword.value) {
    errorMessage.classList.remove('hidden');
  } else {
    errorMessage.classList.add('hidden');
    successMessage.classList.remove('hidden');

    setTimeout(function() {
      const usuario = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: password.value
      };

      // Guardar en localStorage
      localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));

      window.location.href = "login.html"; 
    }, 2000);
  }
});
