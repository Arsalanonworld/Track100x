import PageHeader from '@/components/page-header';

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="About Tack100x"
        description="The story behind the ultimate wallet intelligence platform."
      />

      <div className="max-w-2xl mx-auto text-muted-foreground space-y-6">
        <p>
          Tack100x was founded on a simple principle: on-chain data should be accessible to everyone, not just data scientists or elite trading firms. We saw a gap in the market for a tool that was both powerful enough for professional analysts and intuitive enough for everyday crypto enthusiasts.
        </p>
        <p>
          Our mission is to decode the complexity of the blockchain. We provide real-time, actionable insights by tracking the most significant players in the crypto space—the "whales." By monitoring their movements, we help our users anticipate market trends, discover new opportunities, and make more informed decisions.
        </p>
        <p>
          We are a team of developers, data analysts, and crypto natives who are passionate about building tools that empower the individual investor. We believe that with the right information, anyone can gain an edge in the market.
        </p>
        <p>
          Thank you for joining us on this journey.
        </p>
      </div>
    </div>
  );
}
