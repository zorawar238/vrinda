export function Marquee() {
  const items = [
    "FREE SHIPPING IN INDIA",
    "BOLD FASHION",
    "NEW ERA",
    "VRINDA EXCLUSIVE",
    "UNAPOLOGETIC STYLE",
    "FREE SHIPPING IN INDIA",
    "BOLD FASHION",
    "NEW ERA",
    "VRINDA EXCLUSIVE",
    "UNAPOLOGETIC STYLE"
  ];

  return (
    <div className="bg-foreground text-secondary overflow-hidden py-3 border-b-4 border-foreground relative flex whitespace-nowrap">
      <div className="flex animate-[marquee_20s_linear_infinite]">
        {items.map((text, i) => (
          <div key={i} className="flex items-center">
            <span className="font-display font-bold text-2xl uppercase tracking-widest mx-4">
              {text}
            </span>
            <span className="mx-2 text-primary font-bold text-2xl">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
