
'use client';
import { BrainCircuit, Users, Trophy } from 'lucide-react';
import PageHeader from '@/components/page-header';

const proFeatures = [
    {
        icon: <Trophy className="h-6 w-6 text-primary" />,
        title: "Full Whale Leaderboard",
        description: "Unlock the top 100 whale wallets, analyze their PnL and full history, and copy-trade the market's most profitable players."
    },
    {
        icon: <BrainCircuit className="h-6 w-6 text-primary" />,
        title: "AI-Powered Insights",
        description: "Leverage our AI to curate news, analyze market sentiment, and uncover narratives before they become mainstream."
    }
];

export default function UpgradePage() {
  
  return (
    <div className="bg-background text-foreground -mt-8 -mx-4 sm:-mx-8">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 text-center relative overflow-hidden">
        <div 
            className="absolute inset-0 bg-center bg-no-repeat [mask-image:linear-gradient(to_bottom,white_10%,transparent_100%)]"
            style={{
                backgroundImage: 'radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.1), transparent 50%)',
            }}
        />
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl font-headline">
            All Features Unlocked. 100% Free.
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-muted-foreground">
            Tack100x is now a fully free platform. All "Pro" features have been unlocked for all users.
          </p>
        </div>
      </section>

      {/* Trusted by Section */}
       <section className="py-8">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">Join our growing community</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70">
                    <div className="flex items-center gap-2"><Users className="h-5 w-5" /><span className="font-semibold text-xs">CRYPTO FUNDS</span></div>
                    <div className="flex items-center gap-2"><BrainCircuit className="h-5 w-5" /><span className="font-semibold text-xs">DEGEN TRADERS</span></div>
                    <div className="flex items-center gap-2"><Trophy className="h-5 w-5" /><span className="font-semibold text-xs">ALPHA HUNTERS</span></div>
                </div>
            </div>
        </section>

      {/* Pro Features */}
       <section className="py-16 sm:py-24 bg-muted/50 border-y">
            <div className="container mx-auto px-4">
                <PageHeader title="All Features Unlocked" description="Explore some of the powerful features now available to everyone."/>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {proFeatures.map((feature) => (
                        <div key={feature.title} className="text-center p-4 rounded-lg hover:bg-background transition-colors">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 font-headline">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
       </section>
    </div>
  );
}
