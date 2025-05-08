const form = document.getElementById("login-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const usernameInput = document.getElementById("username").value.trim();
  const passwordInput = document.getElementById("password").value;
  const usuarioRegistrado = JSON.parse(localStorage.getItem("usuarioRegistrado"));

  if (
    usuarioRegistrado &&
    (usuarioRegistrado.email === usernameInput ||
      usuarioRegistrado.nombre === usernameInput) &&
    usuarioRegistrado.password === passwordInput
  ) {
    localStorage.setItem("usuario", usuarioRegistrado.nombre);
    alert(`Bienvenido, ${usuarioRegistrado.nombre}`);
    localStorage.setItem("username", usuarioRegistrado.nombre);
    window.location.href = "chat.html";
  } else {
    alert("Credenciales incorrectas. Verificá tu usuario y contraseña.");
  }
});
