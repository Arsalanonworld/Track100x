
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/lib/app-data';


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
