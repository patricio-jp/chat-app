const form = document.getElementById('login-form');   // o el id que tengas
form.addEventListener('submit', event => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch("https://jycapp.duckdns.org/chat-server/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    if (!res.ok) throw new Error("Credenciales inválidas");
    return res.json();
  })
  .then(data => {
    // Guarda el token que te envíe el backend
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "chat.html";
  })
  .catch(err => alert(err.message));
});
