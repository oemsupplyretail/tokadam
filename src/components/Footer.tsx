import { FaWhatsapp } from "react-icons/fa";

type FooterProps = { content: { disclaimer: string; copyright: string }; whatsapp: { url: string; ariaLabel: string } };

export function Footer({ content, whatsapp }: FooterProps) {
  return <><footer><p>{content.disclaimer}</p><p>{content.copyright}</p></footer><a className="float whatsapp-float" href={whatsapp.url} target="_blank" rel="noreferrer" aria-label={whatsapp.ariaLabel}><FaWhatsapp aria-hidden="true" /></a></>;
}
