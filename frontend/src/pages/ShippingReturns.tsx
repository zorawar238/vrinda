import { Truck, RefreshCcw, Clock, ShieldCheck } from 'lucide-react';

export function ShippingReturns() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 min-h-screen animate-fade-in">
      <div className="mb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-display tracking-wide mb-6">
          Shipping & Returns
        </h1>
        <p className="font-sans text-xs tracking-widest uppercase text-foreground/50">
          Everything you need to know
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 md:gap-24">
        {/* Shipping Section */}
        <div className="space-y-12">
          <div className="flex items-center gap-4 mb-8 border-b border-foreground/10 pb-4">
            <Truck className="w-6 h-6 text-foreground/50" strokeWidth={1.5} />
            <h2 className="font-sans text-sm tracking-widest uppercase">Shipping</h2>
          </div>
          
          <div className="space-y-10">
            <div>
              <h3 className="font-sans text-sm tracking-wide mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-foreground/50" strokeWidth={1.5} /> Standard Delivery
              </h3>
              <p className="font-sans text-sm text-foreground/70 leading-relaxed">5-7 business days across India.</p>
              <p className="font-sans text-xs tracking-widest uppercase text-primary mt-3">FREE on orders over ₹2000</p>
            </div>
            
            <div>
              <h3 className="font-sans text-sm tracking-wide mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-foreground/50" strokeWidth={1.5} /> Express Delivery
              </h3>
              <p className="font-sans text-sm text-foreground/70 leading-relaxed">2-3 business days across India.</p>
              <p className="font-sans text-xs tracking-widest uppercase text-foreground/50 mt-3">Flat rate: ₹250</p>
            </div>
            
            <div>
              <h3 className="font-sans text-sm tracking-wide mb-3">International</h3>
              <p className="font-sans text-sm text-foreground/70 leading-relaxed">We ship worldwide. Delivery takes 10-15 business days. Shipping costs are calculated at checkout based on location and weight.</p>
            </div>
          </div>
        </div>

        {/* Returns Section */}
        <div className="space-y-12">
          <div className="flex items-center gap-4 mb-8 border-b border-foreground/10 pb-4">
            <RefreshCcw className="w-6 h-6 text-foreground/50" strokeWidth={1.5} />
            <h2 className="font-sans text-sm tracking-widest uppercase">Returns</h2>
          </div>
          
          <div className="space-y-10">
            <div>
              <h3 className="font-sans text-sm tracking-wide mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-foreground/50" strokeWidth={1.5} /> 14-Day Policy
              </h3>
              <p className="font-sans text-sm text-foreground/70 leading-relaxed">We accept returns within 14 days of the delivery date. Items must be unworn, unwashed, and have original tags attached.</p>
            </div>
            
            <div>
              <h3 className="font-sans text-sm tracking-wide mb-4">How to Return</h3>
              <ol className="list-decimal pl-4 space-y-3 font-sans text-sm text-foreground/70">
                <li>Log in and go to your Order History</li>
                <li>Select the item and click "Request Return"</li>
                <li>Pack the item in original packaging</li>
                <li>Hand it over to our courier partner</li>
              </ol>
            </div>
            
            <div className="bg-muted/20 p-6 border-l border-foreground/30">
              <h3 className="font-sans text-xs tracking-widest uppercase mb-2">Non-Returnable</h3>
              <p className="font-sans text-sm text-foreground/70 leading-relaxed">Sale items, intimates, and custom-made apparel are final sale and cannot be returned or exchanged.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
