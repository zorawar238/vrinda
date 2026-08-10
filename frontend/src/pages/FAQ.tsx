import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days within India. Express shipping takes 2-3 business days. International orders typically arrive within 10-15 business days."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship unapologetic fashion worldwide! International shipping rates are calculated at checkout based on your location and order weight."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 14 days of delivery for unworn, unwashed items with original tags attached. Custom or sale items are final sale."
  },
  {
    question: "How do your sizes run?",
    answer: "Our fits are designed to be bold and comfortable. Most items run true to size, but we recommend checking our size guide on each product page for specific measurements."
  },
  {
    question: "Can I change or cancel my order?",
    answer: "Orders are processed quickly to get you your gear ASAP. If you need to make a change, contact us within 1 hour of placing the order."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 min-h-screen">
      <div className="mb-12 border-b-8 border-foreground pb-6">
        <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter">
          F.A.Q.
        </h1>
        <p className="text-2xl font-bold uppercase mt-4 text-primary">
          Frequently Asked Questions
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] bg-background transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(17,17,17,1)]"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-6 flex justify-between items-center text-left focus:outline-none"
            >
              <h3 className="text-xl md:text-2xl font-bold uppercase">{faq.question}</h3>
              {openIndex === index ? (
                <ChevronUp className="w-8 h-8 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-8 h-8 flex-shrink-0" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-6 border-t-4 border-foreground pt-4 bg-secondary/10">
                <p className="text-lg font-medium">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-16 p-8 border-4 border-foreground bg-primary text-background text-center">
        <h2 className="text-3xl font-bold uppercase mb-4">Still have questions?</h2>
        <p className="text-xl font-medium mb-6">Our bold support team is here to help.</p>
        <a 
          href="/contact" 
          className="inline-block bg-background text-foreground border-4 border-foreground font-bold uppercase px-8 py-4 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] transition-all"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
