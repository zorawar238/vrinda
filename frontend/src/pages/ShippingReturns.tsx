import { Truck, RefreshCcw, Clock, ShieldCheck } from 'lucide-react';

export function ShippingReturns() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 min-h-screen">
      <div className="mb-16 border-b-8 border-foreground pb-6">
        <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter">
          Shipping & Returns
        </h1>
        <p className="text-2xl font-bold uppercase mt-4 text-primary">
          Everything you need to know about getting your gear.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Shipping Section */}
        <div className="bg-background border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] p-8">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b-4 border-foreground">
            <Truck className="w-10 h-10 text-primary" />
            <h2 className="text-3xl font-bold uppercase">Shipping</h2>
          </div>
          
          <div className="space-y-6 font-medium text-lg">
            <div>
              <h3 className="font-bold uppercase text-xl mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Standard Delivery
              </h3>
              <p>5-7 business days across India.</p>
              <p className="font-bold text-primary mt-1">FREE on orders over ₹2000</p>
            </div>
            
            <div>
              <h3 className="font-bold uppercase text-xl mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Express Delivery
              </h3>
              <p>2-3 business days across India.</p>
              <p className="font-bold mt-1">Flat rate: ₹250</p>
            </div>
            
            <div>
              <h3 className="font-bold uppercase text-xl mb-2">International Shipping</h3>
              <p>We ship worldwide! Delivery takes 10-15 business days. Shipping costs are calculated at checkout based on location and weight.</p>
            </div>
          </div>
        </div>

        {/* Returns Section */}
        <div className="bg-foreground text-background border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(233,69,96,1)] p-8">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b-4 border-background/20">
            <RefreshCcw className="w-10 h-10 text-primary" />
            <h2 className="text-3xl font-bold uppercase">Returns</h2>
          </div>
          
          <div className="space-y-6 font-medium text-lg">
            <div>
              <h3 className="font-bold uppercase text-xl mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> 14-Day Policy
              </h3>
              <p className="text-background/90">We accept returns within 14 days of the delivery date. Items must be unworn, unwashed, and have original tags attached.</p>
            </div>
            
            <div>
              <h3 className="font-bold uppercase text-xl mb-2">How to Return</h3>
              <ol className="list-decimal pl-5 space-y-2 text-background/90">
                <li>Log in and go to your Order History</li>
                <li>Select the item and click "Request Return"</li>
                <li>Pack the item in original packaging</li>
                <li>Hand it over to our courier partner</li>
              </ol>
            </div>
            
            <div className="bg-primary/20 p-4 border-2 border-primary">
              <h3 className="font-bold uppercase text-xl mb-1 text-primary">Non-Returnable</h3>
              <p className="text-background/90 text-sm">Sale items, intimates, and custom-made apparel are final sale and cannot be returned or exchanged.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
