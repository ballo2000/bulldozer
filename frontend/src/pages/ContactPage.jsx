import { useState } from "react";

const whatsappNumber = "2250700000000";

function ContactPage() {
  const [sent, setSent] = useState(false);

  function submitContact(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Bonjour, je souhaite contacter Ivoire Machines.",
      `Nom : ${data.get("name")}`,
      `Téléphone : ${data.get("phone")}`,
      `E-mail : ${data.get("email") || "Non renseigné"}`,
      `Sujet : ${data.get("subject")}`,
      `Message : ${data.get("message")}`,
    ].join("\n");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <>
      <section className="page-hero contact-hero">
        <div className="eyebrow light"><span /> CONTACT</div>
        <h1>Votre chantier<br />commence par un <em>échange.</em></h1>
        <p>Une question, un besoin de location ou un projet d’achat ? Notre équipe est là pour vous répondre.</p>
      </section>
      <section className="contact-page section-wrap">
        <div className="contact-details">
          <div className="eyebrow"><span /> PARLONS DE VOTRE PROJET</div>
          <h2>Comment pouvons-nous <em>vous aider ?</em></h2>
          <p>Partagez-nous votre besoin. Nous vous recontacterons pour vous orienter vers les machines et services adaptés.</p>
          <div className="contact-detail"><span><Phone /></span><div><small>Téléphone / WhatsApp</small><a href="tel:+2250700000000">+225 07 00 00 00 00</a></div></div>
          <div className="contact-detail"><span><Pin /></span><div><small>Notre zone d’intervention</small><b>Abidjan et toute la Côte d’Ivoire</b></div></div>
          <p className="contact-placeholder">Les coordonnées affichées sont à remplacer par celles de l’entreprise.</p>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <h3>Écrivez-nous</h3>
          <p>Le formulaire prépare un message WhatsApp à nous envoyer.</p>
          <div className="form-grid"><label className="field-label">Nom complet<input name="name" required minLength="2" maxLength="100" autoComplete="name" placeholder="Votre nom" /></label><label className="field-label">Téléphone<input name="phone" required minLength="8" maxLength="20" autoComplete="tel" placeholder="+225 07 00 00 00 00" /></label></div>
          <label className="field-label">E-mail <span>(facultatif)</span><input name="email" type="email" autoComplete="email" placeholder="vous@entreprise.ci" /></label>
          <label className="field-label">Sujet<select name="subject" defaultValue="Location d’une machine"><option>Location d’une machine</option><option>Achat d’une machine</option><option>Transport et livraison</option><option>Entretien et assistance</option><option>Autre demande</option></select></label>
          <label className="field-label">Votre message<textarea name="message" required minLength="10" maxLength="1500" rows="5" placeholder="Décrivez votre chantier ou votre besoin…" /></label>
          {sent && <div className="contact-sent" role="status">WhatsApp a été ouvert avec votre message. Envoyez-le pour transmettre votre demande.</div>}
          <button className="button button-primary submit-button">Continuer sur WhatsApp <Arrow /></button>
        </form>
      </section>
    </>
  );
}

function Phone() {
  return <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></svg>;
}
function Pin() {
  return <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}
function Arrow() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
}

export default ContactPage;
