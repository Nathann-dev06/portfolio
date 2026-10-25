// Envoi du formulaire de contact sans quitter la page.
// Le service gratuit FormSubmit reçoit les champs et les transfère par e-mail à nathan.riviere06@gmail.com.
// Sans JavaScript, le formulaire reste fonctionnel : il est alors envoyé normalement à FormSubmit.
const formulaire = document.getElementById("formulaire-contact");
const statut = formulaire.querySelector(".statut-envoi");
const bouton = formulaire.querySelector('button[type="submit"]');

function afficherStatut(texte, type) {
  statut.textContent = texte;
  statut.className = "statut-envoi " + type;
  statut.hidden = false;
}

formulaire.addEventListener("submit", async (evenement) => {
  evenement.preventDefault();

  const donnees = Object.fromEntries(new FormData(formulaire));
  // Si un objet est saisi, il devient le sujet de l'e-mail reçu
  if (donnees.Objet) donnees._subject = "Portfolio : " + donnees.Objet;

  bouton.disabled = true;
  bouton.textContent = "Envoi en cours…";
  statut.hidden = true;

  try {
    const reponse = await fetch("https://formsubmit.co/ajax/nathan.riviere06@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(donnees),
    });
    const resultat = await reponse.json();
    if (!reponse.ok || String(resultat.success) !== "true") throw new Error(resultat.message);

    formulaire.reset();
    afficherStatut("Merci, votre message a bien été envoyé ! Je vous réponds au plus vite.", "succes");
  } catch {
    afficherStatut("Le message n'a pas pu être envoyé. Réessayez, ou écrivez-moi directement à nathan.riviere06@gmail.com.", "erreur");
  } finally {
    bouton.disabled = false;
    bouton.textContent = "Envoyer le message";
  }
});
