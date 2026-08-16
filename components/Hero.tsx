"use client";

const STATS: [string, string][] = [
  ["ORIGIN", "CAIRO, EGYPT"],
  ["STACK", "NODE · GO · TS"],
  ["STATUS", "OPEN TO WORK"],
  ["FOCUS", "BACKEND SYSTEMS"],
];

export default function Hero() {
  return (
    <section id="hero" className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-void">
        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div className="mx-auto grid container grid-cols-1 gap-10 px-6 sm:px-10 md:grid-cols-[1fr_auto]">
            <div className="max-w-xl">
              <p className="mb-4 font-mono text-[11px] tracking-widest2 text-amber-500/90">
                THE ARTIFACT / CORE ENTITY
              </p>

              <div className="mb-6">
                <h1 className="font-display text-[15vw] leading-[0.92] text-[#efe6d4] sm:text-[7.5vw] md:text-[8vw]">
                  <span className="block special-font">TAREK</span>
                  <span className="block special-font">FAWZY</span>
                </h1>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-amber-800/80 sm:text-base">
                A fullstack engineer who behaves like a system under pressure
                &mdash; adapts, transforms, and reveals what&rsquo;s running
                underneath. Open source as{" "}
                <span className="text-amber-500">nero-tx</span>.
              </p>
            </div>

            <ul className="flex flex-col gap-4 self-end pb-2 md:self-center md:pb-0">
              {STATS.map(([label, value]) => (
                <li
                  key={label}
                  className="flex items-baseline gap-4 border-b pb-2 font-mono text-[11px] tracking-widest2 md:justify-end md:border-none md:pb-0"
                >
                  <span className="text-white">{label}</span>
                  <span className="text-amber-500/90">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-widest2 text-amber-300">
            SCROLL TO OPEN THE SYSTEM
          </span>
          <span className="h-10 w-px bg-linear-to-b from-amber-500/70 to-transparent" />
        </div>
      </div>
    </section>
  );
}
