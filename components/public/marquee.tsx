const ITEMS = ['WEBS', 'APPS', 'UI/UX', 'AI SOLUTIONS', 'E-COMMERCE', 'AND MORE'];

export default function Marquee() {
  return (
    <div className="relative border-y border-white/5 bg-white/[0.02] py-5 overflow-hidden" aria-label="Services">
      <div className="flex w-max animate-marquee gap-0 hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center">
                <span className="font-display text-2xl md:text-4xl font-bold tracking-tight text-white/25 px-8">{item}</span>
                <span className="text-electric text-xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
