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
    <div className="max-w-4xl mx-auto px-6 py-24 min-h-screen animate-fade-in">
      <div className="mb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-display tracking-wide mb-6">
          FAQ
        </h1>
        <p className="font-sans text-xs tracking-widest uppercase text-foreground/50">
          Everything you need to know
        </p>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border-b border-foreground/10 last:border-0"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
            >
              <h3 className="font-sans text-sm tracking-wide text-foreground group-hover:text-primary transition-colors">{faq.question}</h3>
              <span className="text-foreground/50 transition-transform duration-300">
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <ChevronDown className="w-5 h-5" strokeWidth={1.5} />
                )}
              </span>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="font-sans text-sm tracking-wide leading-relaxed text-foreground/70 pr-12">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-32 text-center">
        <p className="font-sans text-xs tracking-widest uppercase text-foreground/50 mb-6">Still have questions?</p>
        <a 
          href="/contact" 
          className="inline-block border-b border-foreground text-foreground font-sans text-sm tracking-wide pb-1 hover:text-primary hover:border-primary transition-colors"
        >
          Contact our bold support team
        </a>
      </div>
    </div>
  );
}
