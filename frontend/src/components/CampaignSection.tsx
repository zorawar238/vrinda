export function CampaignSection() {
  return (
    <div className="relative w-full border-y-2 border-foreground bg-background py-3 overflow-hidden flex whitespace-nowrap">
      <div className="animate-marquee flex items-center space-x-4">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-foreground font-display text-2xl md:text-4xl uppercase tracking-widest shrink-0">
            COLLECTION <span className="text-secondary mx-2">/</span>
          </span>
        ))}
      </div>
      <div className="animate-marquee flex items-center space-x-4 absolute top-0" style={{ transform: 'translateX(100%)' }}>
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-foreground font-display text-2xl md:text-4xl uppercase tracking-widest shrink-0">
            COLLECTION <span className="text-secondary mx-2">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
