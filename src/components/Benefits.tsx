import { AccentTitle, SectionTitle } from "@/components/SectionTitle";

type BenefitsProps = { content: { title: string; accent: string }; items: readonly string[] };

export function Benefits({ content, items }: BenefitsProps) {
  return <section className="benefit-section center"><SectionTitle><AccentTitle title={content.title} accent={content.accent} /></SectionTitle><div className="benefits">{items.map((item, index) => <article key={item}><b>{String(index + 1).padStart(2, "0")}</b><p>{item}</p></article>)}</div></section>;
}
