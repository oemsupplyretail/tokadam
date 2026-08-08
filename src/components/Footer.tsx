import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

type FooterProps = { content: { disclaimer: string; copyright: string }; whatsapp: { url: string; ariaLabel: string } };

export function Footer({ content, whatsapp }: FooterProps) {
  return (
    <>
      <footer>
        <p>{content.disclaimer}</p>
        <div className="footer-meta">
          <p>{content.copyright}</p>
          <details className="footer-login-menu">
            <summary>Login</summary>
            <nav aria-label="Pautan log masuk">
              <Link href="/admin/login" prefetch={false}>Admin Login</Link>
              <Link href="/affiliate/login" prefetch={false}>Affiliate Login</Link>
            </nav>
          </details>
        </div>
      </footer>
      <a className="float whatsapp-float" href={whatsapp.url} target="_blank" rel="noreferrer" aria-label={whatsapp.ariaLabel}>
        <FaWhatsapp aria-hidden="true" />
      </a>
    </>
  );
}
