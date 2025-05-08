const form = document.getElementById('recover-form');
const message = document.getElementById('message');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  message.classList.remove('hidden');
});
