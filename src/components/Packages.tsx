import { SectionTitle } from "@/components/SectionTitle";

type Package = { id: string; quantity: number; price: number; image: string; bestSeller: boolean };
type PackagesProps = { content: { kicker: string; title: string; label: string; bottleLabel: string; pricePrefix: string; buyLabel: string; bestSellerLabel: string }; items: readonly Package[] };

export function Packages({ content, items }: PackagesProps) {
  return <section id="pakej" className="packages center"><SectionTitle kicker={content.kicker}>{content.title}</SectionTitle><div className="package-grid">{items.map((item) => <article key={item.quantity} className={item.bestSeller ? "best-seller" : ""}>{item.bestSeller ? <span className="best-seller-badge">{content.bestSellerLabel}</span> : null}<p>{content.label} {item.quantity}</p><img src={item.image} alt={`${content.label} ${item.quantity} ${content.bottleLabel}`} /><strong>{item.quantity} {content.bottleLabel}</strong><h3>{content.pricePrefix} {item.price}</h3><a className="buy-button" href={`/checkout?package=${item.id}`}>{content.buyLabel}</a></article>)}</div></section>;
}
