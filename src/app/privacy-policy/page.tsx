
import PageHeader from '@/components/page-header';

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'information-we-collect', title: '1. Information We Collect' },
  { id: 'how-we-use-information', title: '2. How We Use Information' },
  { id: 'data-sharing', title: '3. Data Sharing & Disclosure' },
  { id: 'data-security', title: '4. Data Security' },
  { id: 'your-data-rights', title: '5. Your Data Rights' },
  { id: 'changes-to-policy', title: '6. Changes to This Policy' },
  { id: 'contact-us', title: '7. Contact Us' },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Privacy Policy"
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
          <p id="introduction">
            This is a placeholder for your Privacy Policy. In a real application, this page would detail how you collect, use, and protect your users' data. It is a legally important document.
          </p>

          <h2 id="information-we-collect">1. Information We Collect</h2>
          <p>
            This section should describe the types of information you collect. For this app, it would include:
          </p>
          <ul>
            <li><strong>Account Information:</strong> Email address, display name, and unique user ID provided during signup.</li>
            <li><strong>Usage Data:</strong> Information on how users interact with the app, such as features used (e.g., creating alerts, adding to watchlist). This is typically anonymous.</li>
            <li><strong>Payment Information:</strong> If you sell a "Pro" plan, you'd specify that payment is handled by a third-party processor (like Stripe) and you do not store credit card details.</li>
          </ul>

          <h2 id="how-we-use-information">2. How We Use Your Information</h2>
          <p>
            Explain the purpose of collecting data, for example:
          </p>
          <ul>
            <li>To provide and maintain the service.</li>
            <li>To manage user accounts and subscriptions.</li>
            <li>To notify users about changes to our service.</li>
            <li>To provide customer support.</li>
          </ul>

          <h2 id="data-sharing">3. Data Sharing and Disclosure</h2>
          <p>
            Be transparent about when you might share user data. Usually, this is very limited.
          </p>
          <ul>
            <li><strong>With Service Providers:</strong> Such as payment processors or analytics services.</li>
            <li><strong>For Legal Reasons:</strong> If required by law or in response to valid requests by public authorities.</li>
          </ul>

          <h2 id="data-security">4. Data Security</h2>
          <p>
            Briefly describe the measures you take to protect user data (e.g., encryption, secure servers).
          </p>

          <h2 id="your-data-rights">5. Your Data Rights</h2>
          <p>
            Inform users of their rights, such as the right to access, update, or delete their personal information.
          </p>

          <h2 id="changes-to-policy">6. Changes to This Privacy Policy</h2>
          <p>
            State that you may update the policy from time to time and how you will notify users of changes.
          </p>

          <h2 id="contact-us">7. Contact Us</h2>
          <p>
            Provide a way for users to contact you with questions about the policy.
          </p>
        </div>
      </div>
    </div>
  );
}
