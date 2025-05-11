const form = document.getElementById('login-form');   // o el id que tengas
form.addEventListener('submit', event => {
  event.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const contrasenia = document.getElementById('password').value;
  fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, contrasenia })
  })
  .then(res => {
    if (!res.ok) throw new Error("Credenciales inválidas");
    return res.json();
  })
  .then(data => {
    // Guarda el token que te envíe el backend
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", usuario);
    window.location.href = "chat.html";
  })
  .catch(err => alert(err.message));
});
