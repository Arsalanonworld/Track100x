
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader
        title="Privacy Policy"
        description="Last updated: July 29, 2024"
      />
      <Card>
        <CardContent className="prose dark:prose-invert max-w-none p-6">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, subscribe to a newsletter, or otherwise communicate with us. This may include:</p>
            <ul>
                <li><strong>Account Information:</strong> Your name, email address, password, and profile picture.</li>
                <li><strong>User Content:</strong> Information you provide for your public profile, alerts you create, and wallets you watch.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Provide, maintain, and improve our services.</li>
                <li>Process transactions and send you related information.</li>
                <li>Communicate with you about products, services, offers, and events.</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not share your personal information with third parties except in the following circumstances:</p>
            <ul>
                <li>With your consent.</li>
                <li>To comply with a legal obligation.</li>
                <li>To protect and defend our rights or property.</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>

            <h2>5. Your Choices</h2>
            <p>You may update, correct, or delete information about you at any time by logging into your online account or emailing us. If you wish to delete your account, please contact us, but note that we may retain certain information as required by law or for legitimate business purposes.</p>

            <h2>6. Changes to This Policy</h2>
            <p>We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.</p>
        </CardContent>
      </Card>
    </div>
  );
}
