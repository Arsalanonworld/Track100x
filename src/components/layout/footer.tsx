import Link from 'next/link';
import { LogoIcon } from './header';

const footerLinks = {
    platform: [
      { label: 'Leaderboard', href: '/leaderboard' },
      { label: 'Alerts', href: '/alerts' },
      { label: 'Insights', href: '/insights' },
      { label: 'Upgrade', href: '/upgrade' },
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Account', href: '/account' },
    ],
    legal: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
  };

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <LogoIcon />
              <span className="inline-block font-bold text-xl">Track100x</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
                The Whale-Powered Wallet Intelligence Platform. Monitor on-chain data, track whale wallets, and get real-time smart alerts.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
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
                  <li key={link.href}>
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