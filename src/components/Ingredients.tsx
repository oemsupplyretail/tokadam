import { CTA } from "@/components/CTA";

type IngredientsProps = {
  content: { kicker: string; title: string; duration: string; productKicker: string; image: string; imageAlt: string; ingredientsTitle: string };
  items: readonly string[];
  cta: { href: string; label: string };
};

export function Ingredients({ content, items, cta }: IngredientsProps) {
  return <section className="product-section center"><p className="eyebrow">{content.kicker}</p><h2>{content.title}</h2><h1 className="minutes">{content.duration}</h1><p className="eyebrow">{content.productKicker}</p><img className="product-shot" src={content.image} alt={content.imageAlt} /><h2 className="natural">{content.ingredientsTitle}</h2><div className="ingredients">{items.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div><CTA {...cta} /></section>;
}
