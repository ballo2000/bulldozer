import ProductCard from "../shared/ProductCard.jsx";

function HomePage({ products, apiMode, navigate, onOrder }) {
  const featured = products.slice(0, 3);
  return (
    <>
      <section className="hero">
        <div className="hero-image" role="img" aria-label="Bulldozer sur un chantier" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="eyebrow light"><span /> LE TERRAIN, C’EST NOTRE MÉTIER</div>
          <h1>La puissance<br />pour faire <em>avancer</em><br />vos projets.</h1>
          <p>Achetez ou louez des engins fiables, prêts à travailler. De la première pelle au dernier kilomètre, on est à vos côtés.</p>
          <div className="hero-actions">
            <a href="/machines" className="button button-primary" onClick={(event) => { event.preventDefault(); navigate("/machines"); }}>Explorer les machines <Arrow /></a>
            <a href="/contact" className="button button-ghost" onClick={(event) => { event.preventDefault(); navigate("/contact"); }}>Parler à un conseiller</a>
          </div>
          <div className="hero-proof"><span><Check /> Machines inspectées</span><i /><span><Check /> Livraison en Côte d’Ivoire</span></div>
        </div>
        <div className="hero-note"><span className="note-number">01</span><span>DES ENGINS<br />À LA HAUTEUR</span><span className="note-line" /></div>
      </section>
      <section className="trust-strip" aria-label="Nos engagements">
        <div><span className="trust-icon"><Shield /></span><span><b>Inspectés avec soin</b><small>Chaque machine vérifiée</small></span></div>
        <div><span className="trust-icon"><Truck /></span><span><b>Livraison organisée</b><small>Sur vos chantiers partout au pays</small></span></div>
        <div><span className="trust-icon"><Wrench /></span><span><b>À vos côtés</b><small>Conseil et suivi après-vente</small></span></div>
        <div className="trust-location">ABIDJAN · CÔTE D’IVOIRE</div>
      </section>
      <section className="catalog section-wrap home-featured">
        <div className="section-heading">
          <div><div className="eyebrow"><span /> NOTRE SÉLECTION</div><h2>Prêts pour le <em>terrain.</em></h2><p>Découvrez quelques machines de notre catalogue.</p></div>
          <a className="text-link" href="/machines" onClick={(event) => { event.preventDefault(); navigate("/machines"); }}>Voir toutes les machines <Arrow /></a>
        </div>
        <div className="product-grid">{featured.map((product, index) => <ProductCard key={product._id || product.slug} product={product} index={index} onOrder={onOrder} />)}</div>
        {apiMode === "demo" && <p className="demo-note">Catalogue de démonstration — connectez MongoDB pour gérer les machines et les commandes.</p>}
      </section>
      <section className="home-services">
        <div className="home-services-image" role="img" aria-label="Machine de chantier en activité" />
        <div className="home-services-copy"><div className="eyebrow light"><span /> UN PARTENAIRE, PAS JUSTE UN VENDEUR</div><h2>Votre chantier<br />ne peut pas <em>attendre.</em></h2><p>Location flexible, livraison sur site, entretien et accompagnement : on simplifie chaque étape pour vous aider à avancer.</p><a className="button button-primary" href="/services" onClick={(event) => { event.preventDefault(); navigate("/services"); }}>Découvrir nos services <Arrow /></a></div>
      </section>
    </>
  );
}

function Check() {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>;
}
function Arrow() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
}
function Shield() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></svg>;
}
function Truck() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3" /><path d="M14 9h5l3 3v5h-3" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="16.5" cy="17.5" r="2.5" /></svg>;
}
function Wrench() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4l-5.1 5.1a2 2 0 0 0 2.8 2.8l5.1-5.1a5 5 0 0 0 6.4-6.4L14 12l-3-3 3.7-2.7Z" /></svg>;
}

export default HomePage;
