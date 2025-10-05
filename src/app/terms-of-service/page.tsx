
import PageHeader from '@/components/page-header';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'service-description', title: '2. Description of Service' },
  { id: 'user-accounts', title: '3. User Accounts' },
  { id: 'subscriptions', title: '4. Subscriptions' },
  { id: 'content', title: '5. Content' },
  { id: 'prohibited-uses', title: '6. Prohibited Uses' },
  { id: 'disclaimer', title: '7. Disclaimer of Warranties' },
  { id: 'termination', title: '8. Termination' },
  { id: 'governing-law', title: '9. Governing Law' },
  { id: 'changes', title: '10. Changes' },
];

export default function TermsOfServicePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Terms of Service"
        description="Last updated: October 26, 2024"
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <h3 className="font-semibold text-lg mb-4">On this page</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {sections.map(section => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="hover:text-primary transition-colors">{section.title}</a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="lg:col-span-3 prose dark:prose-invert max-w-full text-muted-foreground prose-headings:text-foreground prose-headings:scroll-m-20">
          <p>
            This is a placeholder for your Terms of Service agreement. A real ToS is a legal contract and should be drafted by a professional. This placeholder outlines the common sections you would include.
          </p>

          <h2 id="acceptance">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Track100x (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
          </p>

          <h2 id="service-description">2. Description of Service</h2>
          <p>
            Track100x provides a platform for monitoring on-chain cryptocurrency data, including whale transactions, wallet leaderboards, and customizable alerts. The information provided is for informational purposes only and does not constitute financial advice.
          </p>

          <h2 id="user-accounts">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>
          
          <h2 id="subscriptions">4. Subscriptions</h2>
          <p>
            Some parts of the Service are billed on a subscription basis ("Pro Plan"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Your subscription will automatically renew unless you cancel it through your account management page or by contacting customer support.
          </p>

          <h2 id="content">5. Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you create, particularly in custom alerts or notes.
          </p>
          
          <h2 id="prohibited-uses">6. Prohibited Uses</h2>
          <p>
            You may not use the service for any illegal or unauthorized purpose. You agree to comply with all laws, rules, and regulations applicable to your use of the Service. You must not interfere with or disrupt the Service or servers or networks connected to the Service.
          </p>

          <h2 id="disclaimer">7. Disclaimer of Warranties; Limitation of Liability</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the results of using the Service will be accurate or reliable. You expressly agree that your use of, or inability to use, the service is at your sole risk.
          </p>
          
          <h2 id="termination">8. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 id="governing-law">9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which your company is established, without regard to its conflict of law provisions.
          </p>

          <h2 id="changes">10. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
          </p>
        </div>
      </div>
    </div>
  );
}
