import { useMemo, useState } from "react";
import ProductCard from "../shared/ProductCard.jsx";

function MachinesPage({ products, apiMode, onOrder }) {
  const [category, setCategory] = useState("Toutes");
  const [availability, setAvailability] = useState("all");
  const [search, setSearch] = useState("");
  const categories = useMemo(
    () => ["Toutes", ...new Set(products.map((product) => product.category).filter(Boolean).sort((a, b) => a.localeCompare(b, "fr")))],
    [products],
  );
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "Toutes" || product.category === category;
    const matchesAvailability = availability === "all" ||
      (availability === "buy" && product.salePrice) ||
      (availability === "rent" && product.dailyRentalPrice);
    const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
    const term = normalize(search);
    const matchesSearch = !term || normalize(`${product.name} ${product.category} ${product.location}`).includes(term);
    return matchesCategory && matchesAvailability && matchesSearch;
  }), [products, category, availability, search]);

  return (
    <>
      <section className="page-hero machines-hero">
        <div className="eyebrow light"><span /> NOTRE PARC DE MACHINES</div>
        <h1>Le bon engin pour<br />chaque <em>chantier.</em></h1>
        <p>Bulldozers, pelles, chargeuses et bien plus : trouvez l’équipement qu’il vous faut à l’achat ou à la location.</p>
      </section>
      <section className="machines-section section-wrap">
        <div className="machines-heading"><div><div className="eyebrow"><span /> CATALOGUE BTP</div><h2>Explorez nos <em>machines.</em></h2></div><span className="result-count">{filteredProducts.length} machine{filteredProducts.length === 1 ? "" : "s"}</span></div>
        <label className="machine-search"><Search /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une machine, une catégorie ou une ville…" aria-label="Rechercher dans le catalogue" /></label>
        <div className="machine-filters">
          <div className="category-tabs" aria-label="Catégorie de machine">{categories.map((item) => <button key={item} className={category === item ? "filter-tab active" : "filter-tab"} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="filter-tabs" role="group" aria-label="Disponibilité">
            {[["all", "Tout voir"], ["buy", "À vendre"], ["rent", "À louer"]].map(([value, label]) => <button key={value} className={availability === value ? "filter-tab active" : "filter-tab"} onClick={() => setAvailability(value)}>{label}</button>)}
          </div>
        </div>
        {apiMode === "demo" && <p className="demo-note">Catalogue de démonstration : connectez MongoDB pour administrer le parc de machines.</p>}
        {filteredProducts.length ? <div className="product-grid machines-grid">{filteredProducts.map((product, index) => <ProductCard key={product._id || product.slug} product={product} index={index} onOrder={onOrder} />)}</div> : <div className="empty-state">Aucune machine ne correspond à votre recherche. Modifiez les filtres ou <button onClick={() => { setSearch(""); setCategory("Toutes"); setAvailability("all"); }}>affichez tout le catalogue</button>.</div>}
      </section>
    </>
  );
}

function Search() {
  return <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}

export default MachinesPage;
