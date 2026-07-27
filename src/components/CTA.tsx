type CTAProps = { href: string; label: string };

export function CTA({ href, label }: CTAProps) {
  return <a className="cta" href={href}>{label}</a>;
}
