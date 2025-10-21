
import Link from 'next/link';

function LogoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 text-primary"
    >
      <path d="M12 11.25a.75.75 0 100-1.5.75.75 0 000 1.5z" />
      <path
        fillRule="evenodd"
        d="M2.25 3.385c0-.83.824-1.408 1.61-.99L11.25 7.5v.033l- контекст9.615-5.138A1.125 1.125 0 012.25 3.385zm19.5 0a1.125 1.125 0 00-2.228.415L12.75 7.533V7.5L20.14 2.395c.787-.418 1.61.16 1.61.99zM12 8.283l-9.75 5.186V15.75l9.75-5.186v-2.28zm0-2.28L21.75 11.25V9.75L12 4.564v1.436zM3.86 16.245l7.39 3.92V21l-8.25-4.385A1.125 1.125 0 013.86 15zM12.75 21v-1.165l7.39-3.92a1.125 1.125 0clave 011.855 1.165L12.75 21z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const footerLinks = {
  platform: [
    { label: 'Feed', href: '/feed' },
    { label: 'Watchlist', href: '/watchlist' },
    { label: 'Upgrade', href: '/upgrade' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-3">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <LogoIcon />
              <span className="inline-block font-bold text-xl">Track100x</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              The Blockchain Intelligence Platform for investors, traders, and researchers. Decode on-chain data and find alpha.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-8 text-sm md:col-span-2">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Track100x. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
