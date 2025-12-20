// Date de l'événement : 16 Décembre 2025
const eventDate = new Date("December 16, 2025 09:00:00").getTime();

// DEADLINE DE CLÔTURE DU FORMULAIRE : Minuit (00:00:00) au début du 16 Décembre 2025
const formClosureDeadline = new Date('2025-12-16T00:00:00').getTime(); 

// Éléments du DOM pour la Fermeture du Formulaire
const formContent = document.getElementById('form-content');
const deadlineMessage = document.getElementById('deadline-message');
const formCountdownEl = document.getElementById('form-countdown'); // Pour le petit timer dans le formulaire


// Compte à rebours (Mise à jour pour inclure la logique de clôture)
const timer = setInterval(function() {
    const now = new Date().getTime();
    
    // --- A. GESTION DU COMPTE À REBOURS DU HERO (jusqu'à 9h00) ---
    const distanceToEvent = eventDate - now;

    const days = Math.floor(distanceToEvent / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distanceToEvent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distanceToEvent % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distanceToEvent % (1000 * 60)) / 1000);
    
    // Fonction utilitaire pour ajouter un zéro devant (pad)
    const pad = (num) => num < 10 ? '0' + num : num;

    document.getElementById("d").innerHTML = pad(days);
    document.getElementById("h").innerHTML = pad(hours);
    document.getElementById("m").innerHTML = pad(minutes);
    document.getElementById("s").innerHTML = pad(seconds);

    if (distanceToEvent < 0) {
        // Le timer HERO peut s'arrêter, mais nous laissons l'intervalle principal pour la clôture.
        document.querySelector(".countdown").innerHTML = "L'événement a commencé !";
    }

    // --- B. GESTION DE LA CLÔTURE DU FORMULAIRE (à Minuit) ---
    const distanceToFormClosure = formClosureDeadline - now;

    if (distanceToFormClosure <= 0) {
        // La deadline du formulaire est passée : fermer le formulaire
        clearInterval(timer); // On arrête l'intervalle principal ici
        if (formContent) formContent.style.display = 'none';
        if (deadlineMessage) deadlineMessage.style.display = 'block';
        
        // Désactiver le bouton et masquer le timer de clôture
        if (btn) btn.disabled = true;
        if (formCountdownEl) formCountdownEl.style.display = 'none';

    } else {
        // Le formulaire est ouvert : AFFICHAGE DU TIMER DE CLÔTURE
        if (formContent) formContent.style.display = 'block';
        if (deadlineMessage) deadlineMessage.style.display = 'none';
        
        // Calculs pour le petit timer (heures, minutes, secondes)
        const hoursForm = Math.floor((distanceToFormClosure % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesForm = Math.floor((distanceToFormClosure % (1000 * 60 * 60)) / (1000 * 60));
        const secondsForm = Math.floor((distanceToFormClosure % (1000 * 60)) / 1000);

        if (formCountdownEl) {
            formCountdownEl.innerHTML = `⚠️ Clôture des inscriptions dans : ${pad(hoursForm)}h ${pad(minutesForm)}m ${pad(secondsForm)}s`;
        }
    }
}, 1000); 

// --- GESTION DU FORMULAIRE VERS GOOGLE SHEET ---

const scriptURL = 'https://script.google.com/macros/s/AKfycbwONQq2WP80RkZSEwkmloyrmkcxefeha-B2zRHt9vy8ch4gNy8X7mF5PVWc_GUk_eOICw/exec'; 

const form = document.forms['google-sheet'];
const msg = document.getElementById("msg");
const btn = document.getElementById("submit-btn");

form.addEventListener('submit', e => {
  e.preventDefault();
  btn.disabled = true;
  btn.innerHTML = "Envoi en cours...";
e.preventDefault();

    // --- VERIFICATION DEADLINE (AJOUT) ---
    const now = new Date().getTime();
    if (now >= formClosureDeadline) {
         msg.innerHTML = "❌ Les inscriptions sont terminées.";
         msg.style.color = "#f87171";
         if (btn) btn.disabled = true;
         return; // Arrêter l'envoi
    }
    // --- FIN VERIFICATION DEADLINE ---

    btn.disabled = true;
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

// --- SMART NAVBAR (Cache le menu quand on descend, montre quand on monte) ---
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Si on scrolle vers le BAS et qu'on n'est pas tout en haut : CACHER
    navbar.classList.add('navbar-hidden');
  } else {
    // Si on scrolle vers le HAUT : MONTRER
    navbar.classList.remove('navbar-hidden');
  }
  
  lastScrollTop = scrollTop;
});

