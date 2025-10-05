
import PageHeader from '@/components/page-header';
import { PlaceHolderImagesById } from '@/lib/placeholder-images';
import { BarChart, Search, Target, Users } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

const teamMembers = [
  { name: 'Alex Johnson', role: 'Co-Founder & CEO', avatarId: 'avatar-01' },
  { name: 'Samantha Lee', role: 'Co-Founder & CTO', avatarId: 'avatar-02' },
  { name: 'David Chen', role: 'Lead Data Scientist', avatarId: 'avatar-03' },
  { name: 'Maria Garcia', role: 'Head of Product', avatarId: 'avatar-04' },
];

const stats = [
    {
        icon: <BarChart className="h-8 w-8 text-primary" />,
        value: '$10B+',
        label: 'Volume Tracked Daily'
    },
    {
        icon: <Search className="h-8 w-8 text-primary" />,
        value: '1M+',
        label: 'Transactions Processed'
    },
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        value: '10,000+',
        label: 'Active Users'
    },
     {
        icon: <Target className="h-8 w-8 text-primary" />,
        value: '99.9%',
        label: 'Data Accuracy'
    }
]

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <PageHeader
        title="We're Decoding the Digital Asset Economy"
        description="Track100x was founded on a simple principle: on-chain data should be accessible to everyone, not just data scientists or elite trading firms."
      />

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
            <Card key={index} className="p-6">
                <div className="flex items-center gap-4">
                    {stat.icon}
                    <div>
                        <p className="text-3xl font-bold text-primary">{stat.value}</p>
                        <p className="text-muted-foreground text-sm">{stat.label}</p>
                    </div>
                </div>
            </Card>
        ))}
      </section>

      {/* Our Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
            <p className="text-muted-foreground">
            Our mission is to decode the complexity of the blockchain. We provide real-time, actionable insights by tracking the most significant players in the crypto space—the "whales." By monitoring their movements, we help our users anticipate market trends, discover new opportunities, and make more informed decisions.
            </p>
            <p className="text-muted-foreground">
            We are a team of developers, data analysts, and crypto natives who are passionate about building tools that empower the individual investor. We believe that with the right information, anyone can gain an edge in the market.
            </p>
        </div>
         <div className="relative h-80 rounded-2xl overflow-hidden">
            <Image 
                src="https://images.unsplash.com/photo-1639322537231-2f206e06af84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxibG9ja2NoYWluJTIwbmV0d29ya3xlbnwwfHx8fDE3NTk1MDQ2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Our Mission"
                fill
                className="object-cover"
                data-ai-hint="blockchain network"
            />
         </div>
      </section>

      {/* Team Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Meet the Team</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
            A passionate group of developers, data scientists, and crypto-enthusiasts dedicated to financial transparency.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member) => {
                 const avatar = PlaceHolderImagesById[member.avatarId];
                return(
                    <Card key={member.name} className="pt-6">
                      {avatar && (
                          <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4 mx-auto">
                              <Image
                                  src={avatar.imageUrl}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                  data-ai-hint={avatar.imageHint}
                              />
                          </div>
                      )}
                      <div className="p-4 border-t">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-primary">{member.role}</p>
                      </div>
                    </Card>
                );
            })}
        </div>
      </section>
    </div>
  );
}
