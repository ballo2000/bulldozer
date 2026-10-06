function ServicesPage({ navigate }) {
  const services = [
    ["01", "Location d’engins", "Louez à la journée, à la semaine ou pour toute la durée du chantier. Nous vous aidons à choisir la capacité et la machine adaptées à votre terrain."],
    ["02", "Vente de machines", "Des engins neufs ou reconditionnés, inspectés et présentés avec leurs caractéristiques pour vous permettre de décider en toute confiance."],
    ["03", "Transport et livraison", "Nous organisons l’acheminement de votre machine jusqu’à votre chantier, à Abidjan et dans les principales villes de Côte d’Ivoire."],
    ["04", "Entretien et assistance", "Conseils d’utilisation, maintenance et assistance : notre équipe reste disponible pour accompagner vos opérations."],
  ];
  return (
    <>
      <section className="page-hero services-hero">
        <div className="eyebrow light"><span /> NOS SERVICES</div>
        <h1>Un partenaire<br />à chaque <em>étape.</em></h1>
        <p>De la sélection de la machine à sa mise en service sur votre chantier, nous vous accompagnons concrètement.</p>
      </section>
      <section className="service-page section-wrap">
        <div className="service-page-intro"><div className="eyebrow"><span /> DU CONSEIL AU CHANTIER</div><h2>Plus qu’une machine,<br />un vrai <em>accompagnement.</em></h2><p>Nous réunissons les services essentiels pour vous aider à faire avancer vos projets BTP en Côte d’Ivoire.</p></div>
        <div className="service-cards">{services.map(([number, title, description]) => <article className="service-card" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><Icon /></article>)}</div>
      </section>
      <section className="service-cta"><div><div className="eyebrow light"><span /> VOUS AVEZ UN PROJET ?</div><h2>On trouve la bonne <em>solution.</em></h2><p>Expliquez-nous votre chantier : nous vous orienterons vers la machine et le service adaptés.</p></div><a className="button button-primary" href="/contact" onClick={(event) => { event.preventDefault(); navigate("/contact"); }}>Parler à un conseiller <Arrow /></a></section>
    </>
  );
}

function Icon() {
  return <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
}
function Arrow() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
}

export default ServicesPage;
