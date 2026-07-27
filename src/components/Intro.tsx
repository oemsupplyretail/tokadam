import { HighlightedText, SectionTitle } from "@/components/SectionTitle";

type IntroProps = { content: { kicker: string; title: string; description: string; productName: string; image: string; imageAlt: string } };

export function Intro({ content }: IntroProps) {
  return <section className="intro"><div className="two-col"><div className="couple-frame"><img className="doctor" src={content.image} alt={content.imageAlt} /></div><div><SectionTitle kicker={content.kicker}><span>{content.title}</span></SectionTitle><p><HighlightedText text={content.description} highlight={content.productName} /></p></div></div></section>;
}
