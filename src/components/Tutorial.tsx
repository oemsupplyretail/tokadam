import { CTA } from "@/components/CTA";
import { SectionTitle } from "@/components/SectionTitle";

type TutorialProps = { content: { kicker: string; title: string; frameTitle: string }; videoUrl: string; cta: { href: string; label: string } };

export function Tutorial({ content, videoUrl, cta }: TutorialProps) {
  return <section className="tutorial center"><SectionTitle kicker={content.kicker}>{content.title}</SectionTitle><div className="video-player"><div className="video-frame"><iframe src={videoUrl} title={content.frameTitle} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></div><CTA {...cta} /></section>;
}
