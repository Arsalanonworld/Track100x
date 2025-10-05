import PageHeader from '@/components/page-header';

export default function TermsOfServicePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Terms of Service"
        description="Last updated: October 26, 2024"
      />

      <div className="max-w-3xl mx-auto prose dark:prose-invert text-muted-foreground prose-headings:text-foreground">
        <p>
          This is a placeholder for your Terms of Service agreement. A real ToS is a legal contract and should be drafted by a professional. This placeholder outlines the common sections you would include.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Tack100x (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Tack100x provides a platform for monitoring on-chain cryptocurrency data, including whale transactions, wallet leaderboards, and customizable alerts. The information provided is for informational purposes only and does not constitute financial advice.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
        </p>
        
        <h2>4. Subscriptions</h2>
        <p>
          Some parts of the Service are billed on a subscription basis ("Pro Plan"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Your subscription will automatically renew unless you cancel it through your account management page or by contacting customer support.
        </p>

        <h2>5. Content</h2>
        <p>
          Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you create, particularly in custom alerts or notes.
        </p>
        
        <h2>6. Prohibited Uses</h2>
        <p>
          You may not use the service for any illegal or unauthorized purpose. You agree to comply with all laws, rules, and regulations applicable to your use of the Service. You must not interfere with or disrupt the Service or servers or networks connected to the Service.
        </p>

        <h2>7. Disclaimer of Warranties; Limitation of Liability</h2>
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the results of using the Service will be accurate or reliable. You expressly agree that your use of, or inability to use, the service is at your sole risk.
        </p>
        
        <h2>8. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which your company is established, without regard to its conflict of law provisions.
        </p>

        <h2>10. Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
        </p>
      </div>
    </div>
  );
}
