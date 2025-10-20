
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader
        title="Terms of Service"
        description="Last updated: July 29, 2024"
      />
      <Card>
        <CardContent className="prose dark:prose-invert max-w-none p-6">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Track100x ("we," "our," "us"). These Terms of Service
            govern your use of our website and services. By accessing or using
            our service, you agree to be bound by these terms.
          </p>

          <h2>2. Use of Service</h2>
          <p>
            You must be at least 18 years old to use our services. You are
            responsible for any activity that occurs under your account and for
            keeping your password secure.
          </p>

          <h2>3. Prohibited Activities</h2>
          <p>
            You agree not to engage in any of the following prohibited
            activities:
            <ul>
              <li>
                Copying, distributing, or disclosing any part of the service in
                any medium.
              </li>
              <li>
                Using any automated system, including "robots," "spiders,"
                "offline readers," etc., to access the service.
              </li>
              <li>
                Transmitting spam, chain letters, or other unsolicited email.
              </li>
            </ul>
          </p>

          <h2>4. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the
            service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever and without limitation,
            including but not limited to a breach of the Terms.
          </p>

          <h2>5. Disclaimer</h2>
          <p>
            Our service is provided on an "AS IS" and "AS AVAILABLE" basis. The
            service is provided without warranties of any kind, whether express
            or implied. We do not warrant that a) the service will function
            uninterrupted, secure or available at any particular time or
            location; b) any errors or defects will be corrected; c) the
            service is free of viruses or other harmful components.
          </p>

          <h2>6. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of the jurisdiction in which our company is based, without
            regard to its conflict of law provisions.
          </p>

          <h2>7. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. We will provide at least 30 days' notice
            prior to any new terms taking effect.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
