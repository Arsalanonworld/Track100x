import PageHeader from '@/components/page-header';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Privacy Policy"
        description="Last updated: October 26, 2024"
      />

      <div className="max-w-3xl mx-auto prose dark:prose-invert text-muted-foreground prose-headings:text-foreground">
        <p>
          This is a placeholder for your Privacy Policy. In a real application, this page would detail how you collect, use, and protect your users' data. It is a legally important document.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          This section should describe the types of information you collect. For this app, it would include:
        </p>
        <ul>
          <li><strong>Account Information:</strong> Email address, display name, and unique user ID provided during signup.</li>
          <li><strong>Usage Data:</strong> Information on how users interact with the app, such as features used (e.g., creating alerts, adding to watchlist). This is typically anonymous.</li>
          <li><strong>Payment Information:</strong> If you sell a "Pro" plan, you'd specify that payment is handled by a third-party processor (like Stripe) and you do not store credit card details.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          Explain the purpose of collecting data, for example:
        </p>
        <ul>
          <li>To provide and maintain the service.</li>
          <li>To manage user accounts and subscriptions.</li>
          <li>To notify users about changes to our service.</li>
          <li>To provide customer support.</li>
        </ul>

        <h2>3. Data Sharing and Disclosure</h2>
        <p>
          Be transparent about when you might share user data. Usually, this is very limited.
        </p>
        <ul>
          <li><strong>With Service Providers:</strong> Such as payment processors or analytics services.</li>
          <li><strong>For Legal Reasons:</strong> If required by law or in response to valid requests by public authorities.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          Briefly describe the measures you take to protect user data (e.g., encryption, secure servers).
        </p>

        <h2>5. Your Data Rights</h2>
        <p>
          Inform users of their rights, such as the right to access, update, or delete their personal information.
        </p>

        <h2>6. Changes to This Privacy Policy</h2>
        <p>
          State that you may update the policy from time to time and how you will notify users of changes.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          Provide a way for users to contact you with questions about the policy.
        </p>
      </div>
    </div>
  );
}
