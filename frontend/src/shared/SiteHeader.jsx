import { useState } from "react";

function SiteHeader({ pathname, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["/", "Accueil"],
    ["/machines", "Nos machines"],
    ["/services", "Nos services"],
    ["/contact", "Contact"],
  ];

  function go(path) {
    navigate(path);
    setMenuOpen(false);
  }

  return (
    <>
      <div className="announcement">
        <span>Votre partenaire engins en Côte d’Ivoire</span>
        <span className="announcement-right"><Icon name="phone" size={14} /> Besoin d’un conseil ? <a href="tel:+2250700000000">+225 07 00 00 00 00</a></span>
      </div>
      <header className="header">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); go("/"); }} aria-label="Ivoire Machines, accueil">
          <span className="brand-mark">IM<span>.</span></span>
          <span className="brand-name">IVOIRE <b>MACHINES</b></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen}><Icon name={menuOpen ? "close" : "menu"} /></button>
        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Navigation principale">
          {links.map(([path, label]) => (
            <a key={path} href={path} className={pathname === path ? "nav-link current" : "nav-link"} aria-current={pathname === path ? "page" : undefined} onClick={(event) => { event.preventDefault(); go(path); }}>{label}</a>
          ))}
          <a className="nav-cta" href="/machines" onClick={(event) => { event.preventDefault(); go("/machines"); }}>Trouver un engin <Icon name="arrow" size={17} /></a>
        </nav>
      </header>
    </>
  );
}

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
    close: <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
    menu: <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default SiteHeader;
