
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
    question: 'What happens if I hit my alert limit on the Free plan?',
    answer: 'On the Free plan, you can create up to 3 active alerts. If you reach this limit, you will need to upgrade to Pro to create more alerts. You can also delete an existing alert to free up a slot.',
  },
  {
    question: 'What blockchains do you support?',
    answer: 'We currently support real-time data from Ethereum, Solana, and Bitcoin. We are constantly working on adding support for more chains, which will be available to Pro users first.',
  },
  {
    question: 'How "real-time" is the data?',
    answer: 'Our Pro plan offers a feed with near-zero latency, pulling data directly as transactions are confirmed on-chain. The Free plan feed has a delay of up to 15 minutes.',
  },
   {
    question: 'Can I use Track100x for commercial purposes?',
    answer: 'Our Pro plan includes a license for individual commercial use (e.g., for your own trading). For team or enterprise-level access and API usage, please contact us for a custom plan.',
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
