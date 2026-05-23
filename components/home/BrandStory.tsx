export function BrandStory() {
  return (
    <section
      className="py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, var(--color-obsidian) 0%, #1A1408 100%)' }}
      aria-labelledby="brand-story-heading"
    >
      <div className="max-w-[900px] mx-auto px-6 md:px-10 text-center">
        <p className="eyebrow mb-6 animate-fade-up">Our Story</p>
        <span className="gold-rule mx-auto mb-10 animate-fade-up animate-delay-1" aria-hidden="true" />
        <h2
          id="brand-story-heading"
          className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-300 italic text-[var(--color-parchment)] leading-[1.1] mb-8 animate-fade-up animate-delay-2"
        >
          The Art of the<br />Perfect Fit
        </h2>
        <div className="flex flex-col gap-5 font-body text-sm md:text-base text-[var(--color-taupe)] leading-relaxed max-w-2xl mx-auto">
          <p className="animate-fade-up animate-delay-3">
            Mensah was born from a singular belief: that every Ghanaian gentleman deserves
            clothing that speaks before he does. Each piece is a quiet conversation between
            tradition and contemporary elegance.
          </p>
          <p className="animate-fade-up animate-delay-4">
            Our tailors work with the finest fabrics sourced from across West Africa and
            Europe, cutting every garment with the patience of artisans who understand that
            luxury is not loudness — it is precision.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-[var(--color-parchment)]/10 animate-fade-up animate-delay-5">
          {[
            { number: '500+', label: 'Garments Made' },
            { number: '12+', label: 'Years of Craft' },
            { number: '100%', label: 'Made in Ghana' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <span className="font-display text-3xl md:text-4xl font-300 text-[var(--color-gold)]">
                {stat.number}
              </span>
              <span className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-taupe)]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
