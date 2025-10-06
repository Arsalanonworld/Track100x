
import PageHeader from '@/components/page-header';
import PortfolioWhaleImpact from '@/components/portfolio-whale-impact';

export default function PortfolioAnalysisPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Portfolio Whale Impact Analysis"
        description="Understand how whale transactions are affecting your assets."
      />
      <PortfolioWhaleImpact />
    </div>
  );
}
