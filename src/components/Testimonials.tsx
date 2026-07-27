import { SectionTitle } from "@/components/SectionTitle";

type Testimonial = { name: string; quote: string; image: string; imageAlt: string };
type TestimonialsProps = { content: { kicker: string; title: string }; items: readonly Testimonial[]; rating: string };

export function Testimonials({ content, items, rating }: TestimonialsProps) {
  return <section className="testimonials center"><SectionTitle kicker={content.kicker}>{content.title}</SectionTitle><div className="testimonial-cards">{items.map((item) => <article key={item.name} className="testimonial-card"><img src={item.image} alt={item.imageAlt} /><div><span>{rating}</span><p>{item.quote}</p><strong>{item.name}</strong></div></article>)}</div></section>;
}
