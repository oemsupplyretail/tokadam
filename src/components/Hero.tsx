import { CTA } from "@/components/CTA";
import { RotatingIcon } from "@/components/RotatingIcon";

type HeroProps = {
  content: { eyebrow: string; duration: string; durationUnit: string; title: string; description: string; image: string; imageAlt: string };
  logo: { name: string; emphasis: string };
  cta: { href: string; label: string };
  rotatingIcon: { image: string; imageAlt: string; ariaLabel: string; baseSpeed: number; boostSpeed: number; maximumSpeed: number; settleDuration: number };
};

export function Hero({ content, logo, cta, rotatingIcon }: HeroProps) {
  return <section className="hero"><div className="hero-inner"><div className="hero-copy"><p className="brand">{logo.name} <span>{logo.emphasis}</span></p><p className="eyebrow gold">{content.eyebrow}</p><h1>{content.duration} <span>{content.durationUnit}</span></h1><h3>{content.title}</h3><p>{content.description}</p><CTA {...cta} /></div><div className="hero-product"><img src={content.image} alt={content.imageAlt} /></div></div><RotatingIcon content={rotatingIcon} /></section>;
}
