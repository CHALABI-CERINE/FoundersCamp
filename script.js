// Date de l'événement : 16 Décembre 2025
const eventDate = new Date("December 16, 2025 09:00:00").getTime();

// Compte à rebours
const timer = setInterval(function() {
  const now = new Date().getTime();
  const distance = eventDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("d").innerHTML = days;
  document.getElementById("h").innerHTML = hours;
  document.getElementById("m").innerHTML = minutes;
  document.getElementById("s").innerHTML = seconds;

  if (distance < 0) {
    clearInterval(timer);
    document.querySelector(".countdown").innerHTML = "L'événement a commencé !";
  }
}, 1000);

// --- GESTION DU FORMULAIRE VERS GOOGLE SHEET ---

const scriptURL = 'https://script.google.com/macros/s/AKfycbwB9W5e-llaCBrJoivv30OB6l_McxKvBToKh3O2E3UgCdWqMmRNKz-41urAxYLZg-gswg/exec'; 

const form = document.forms['google-sheet'];
const msg = document.getElementById("msg");
const btn = document.getElementById("submit-btn");

form.addEventListener('submit', e => {
  e.preventDefault();
  btn.disabled = true;
  btn.innerHTML = "Envoi en cours...";

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      msg.innerHTML = "✅ Inscription réussie ! On se voit au camp.";
      msg.style.color = "#4ade80";
      btn.innerHTML = "Inscrit";
      form.reset();
    })
    .catch(error => {
      msg.innerHTML = "❌ Erreur lors de l'envoi.";
      msg.style.color = "#f87171";
      btn.disabled = false;
      btn.innerHTML = "Réessayer";
      console.error('Error!', error.message);
    });
});