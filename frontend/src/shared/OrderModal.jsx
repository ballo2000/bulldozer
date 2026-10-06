import { useState } from "react";

const formatPrice = (amount) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount) + " FCFA";

function OrderModal({ product, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitOrder(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          type: data.get("type"),
          rentalDays: Number(data.get("days")),
          customer: {
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            phone: data.get("phone"),
            email: data.get("email"),
            city: data.get("city"),
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Impossible de créer la commande.");
      if (typeof result.paymentUrl !== "string" || !result.paymentUrl.startsWith("https://")) {
        throw new Error("L’adresse de paiement reçue est invalide.");
      }
      window.location.assign(result.paymentUrl);
    } catch (requestError) {
      setLoading(false);
      setError(requestError.message);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title">
        <button className="modal-close" onClick={onClose} aria-label="Fermer"><Icon /></button>
        <div className="eyebrow"><span /> COMMANDE · {product.name}</div>
        <h2 id="order-title">Votre projet, <em>en route.</em></h2>
        <form onSubmit={submitOrder}>
          <div className="order-summary"><span>{product.name}</span><b>{formatPrice(product.salePrice)}</b></div>
          <div className="field-group"><label>Votre demande</label><div className="choice-row">
            <label className="choice"><input type="radio" name="type" value="purchase" defaultChecked /><span>Achat <b>{formatPrice(product.salePrice)}</b></span></label>
            <label className="choice"><input type="radio" name="type" value="rental" /><span>Location <b>{formatPrice(product.dailyRentalPrice)} / jour</b></span></label>
          </div></div>
          <label className="field-label">Durée de location (jours)<input name="days" type="number" min="1" max="365" defaultValue="1" /></label>
          <div className="form-grid">
            <label className="field-label">Prénom<input name="firstName" required minLength="2" maxLength="80" autoComplete="given-name" placeholder="Votre prénom" /></label>
            <label className="field-label">Nom<input name="lastName" required minLength="2" maxLength="80" autoComplete="family-name" placeholder="Votre nom" /></label>
          </div>
          <div className="form-grid">
            <label className="field-label">Téléphone<input name="phone" required minLength="8" maxLength="20" autoComplete="tel" placeholder="+225 07 00 00 00 00" /></label>
            <label className="field-label">Ville<input name="city" required maxLength="100" placeholder="Ex. Abidjan" /></label>
          </div>
          <label className="field-label">E-mail<input name="email" type="email" required autoComplete="email" placeholder="vous@entreprise.ci" /></label>
          <div className="payment-notice"><b>Paiement sécurisé par CinetPay</b><br />Choisissez Orange Money ou MTN MoMo sur la page de paiement.</div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button-primary submit-button" disabled={loading}>{loading ? "Préparation du paiement…" : "Continuer vers le paiement"} <Arrow /></button>
        </form>
      </section>
    </div>
  );
}

function Icon() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m18 6-12 12" /><path d="m6 6 12 12" /></svg>;
}

function Arrow() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
}

export default OrderModal;
