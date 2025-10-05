
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Can I cancel my Pro subscription at any time?',
    answer: 'Yes, you can cancel your subscription at any time from your account page. You will retain Pro access until the end of your current billing period.',
  },
  {
    question: 'What happens to my data and alerts if I downgrade to Free?',
    answer: 'Your alerts and watchlist items will not be deleted, but they will be deactivated if you exceed the Free plan limits (1 active alert, 3 watched wallets). You can re-activate them if you upgrade again or reduce your usage to fit within the limits.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards. All payments are processed securely through our payment provider, Stripe.',
  },
  {
    question: 'How "real-time" is the data?',
    answer: 'Our Pro plan offers a feed with near-zero latency, pulling data directly as transactions are confirmed on-chain. The Free plan feed has a delay of up to 1-2 minutes.',
  },
   {
    question: 'Do you offer a free trial for the Pro plan?',
    answer: "We do not offer a time-based free trial. However, our Free plan is a great way to experience the core functionality of WhaleWatch100x. You can upgrade to Pro at any time to unlock all features.",
  },
];

export function Faq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem value={`item-${index + 1}`} key={index}>
          <AccordionTrigger className="text-left font-semibold hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-left">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
