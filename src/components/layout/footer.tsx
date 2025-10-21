
import Link from 'next/link';

function LogoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-primary"
    >
      <style>
        {`
          @keyframes path-1 {
            0% { stroke-dashoffset: 20; }
            33% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes path-2 {
            0% { stroke-dashoffset: 18; }
            33% { stroke-dashoffset: 18; }
            66% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes path-3 {
            0% { stroke-dashoffset: 29; }
            66% { stroke-dashoffset: 29; }
            100% { stroke-dashoffset: 0; }
          }
          .path-1 { stroke-dasharray: 20; stroke-dashoffset: 20; animation: path-1 2s ease-out infinite; }
          .path-2 { stroke-dasharray: 18; stroke-dashoffset: 18; animation: path-2 2s ease-out infinite; }
          .path-3 { stroke-dasharray: 29; stroke-dashoffset: 29; animation: path-3 2s ease-out infinite; }
        `}
      </style>
      <path className="path-1" d="M14.5 12.5L18 16l-3.5 3.5" />
      <path className="path-2" d="M9.5 12.5L6 16l3.5 3.5" />
      <path className="path-3" d="M12 4v16" />
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
