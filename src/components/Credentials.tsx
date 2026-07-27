import { SectionTitle } from "@/components/SectionTitle";

type CredentialsProps = { content: { kicker: string; title: string; description: string; seals: readonly { symbol: string; label: string }[] } };

export function Credentials({ content }: CredentialsProps) {
  return <section className="credentials center"><SectionTitle kicker={content.kicker}>{content.title}</SectionTitle><p>{content.description}</p><div className="seals">{content.seals.map((seal) => <div key={seal.label}>{seal.symbol}<small>{seal.label}</small></div>)}</div></section>;
}
