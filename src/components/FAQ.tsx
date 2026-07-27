type FAQ = { question: string; answer: string; isOpen: boolean };
type FAQProps = { content: { kicker: string; title: string }; items: readonly FAQ[] };

export function FAQ({ content, items }: FAQProps) {
  return <section className="faq"><div className="faq-intro"><p className="eyebrow">{content.kicker}</p><h2>{content.title}</h2></div><div className="faq-list">{items.map((item, index) => <details key={item.question} open={item.isOpen}><summary><span>{String(index + 1).padStart(2, "0")}</span>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>;
}
