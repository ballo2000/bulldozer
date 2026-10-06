const formatPrice = (amount) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount) + " FCFA";

function ProductCard({ product, index, onOrder }) {
  return (
    <article className="product-card">
      <div className="product-photo">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-badge"><i />{product.badge}</span>
        <span className="product-number">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="product-info">
        <div className="product-kicker">{product.category} <span>·</span> {product.condition}</div>
        <h3>{product.name}</h3>
        <div className="product-specs"><span>{product.year}</span><i /><span>{Number(product.hours).toLocaleString("fr-FR")} h</span><i /><span>{product.power}</span></div>
        <div className="product-location"><Icon /> {product.location}</div>
        <div className="product-prices">
          <div><small>À l’achat</small><b>{formatPrice(product.salePrice)}</b></div>
          <div><small>À la location</small><b>{formatPrice(product.dailyRentalPrice)}<span> / jour</span></b></div>
        </div>
        <button className="product-button" onClick={() => onOrder(product)}>Voir les options <Arrow /></button>
      </div>
    </article>
  );
}

function Icon() {
  return <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

function Arrow() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
}

export default ProductCard;
