import { CTA } from "@/components/CTA";
import { HighlightedText, SectionTitle } from "@/components/SectionTitle";

type Problem = { number: string; text: string };
type ProblemsProps = {
  content: { kicker: string; title: string; lead: string; productName: string };
  items: readonly Problem[];
  worriesContent: { title: string; lead: string; relief: string; productName: string; reassurance: string };
  worries: readonly string[];
  cta: { href: string; label: string };
};

export function Problems({ content, items, worriesContent, worries, cta }: ProblemsProps) {
  return <><section className="cream center"><SectionTitle kicker={content.kicker}>{content.title}</SectionTitle><p className="lead"><HighlightedText text={content.lead} highlight={content.productName} /></p><div className="cards">{items.map((item) => <article className="problem" key={item.text}><span className="problem-number">{item.number}</span><h3>{item.text}</h3></article>)}</div></section><section className="dark-section center"><SectionTitle light>{worriesContent.title}</SectionTitle><p className="lead">{worriesContent.lead}</p><div className="worry-grid">{worries.map((worry, index) => <div className="worry" key={worry}><b>{String(index + 1).padStart(2, "0")}</b><p>{worry}</p></div>)}</div><div className="relief"><p><HighlightedText text={worriesContent.relief} highlight={worriesContent.productName} /></p><strong>{worriesContent.reassurance}</strong><CTA {...cta} /></div></section></>;
}
