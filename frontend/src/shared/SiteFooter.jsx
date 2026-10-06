function SiteFooter({ navigate }) {
  return (
    <>
      <section className="contact-banner">
        <div><div className="eyebrow light"><span /> VOTRE PROCHAIN CHANTIER COMMENCE ICI</div><h2>Parlons de votre <em>projet.</em></h2><p>Notre équipe vous aide à trouver la machine qu’il vous faut.</p></div>
        <a className="button button-dark" href="/contact" onClick={(event) => { event.preventDefault(); navigate("/contact"); }}>Contacter notre équipe <Icon /></a>
      </section>
      <footer className="footer">
        <a className="brand footer-brand" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}><span className="brand-mark">IM<span>.</span></span><span className="brand-name">IVOIRE <b>MACHINES</b></span></a>
        <span>La puissance pour faire avancer vos projets.</span>
        <span>© {new Date().getFullYear()} Ivoire Machines · Abidjan, Côte d’Ivoire</span>
      </footer>
    </>
  );
}

function Icon() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
}

export default SiteFooter;
