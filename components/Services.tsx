"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImageReveal from "./ImageReveal";
import { services } from "@/utils/main-data";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // ghost headline drifts slowly across the whole section's scroll
        gsap.to(".services-bg-type", {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        rowRefs.current.forEach((row) => {
          if (!row) return;

          const number = row.querySelector(".row-number");
          const strata = row.querySelector(".row-strata");
          const title = row.querySelector(".row-title");
          const copy = row.querySelector(".row-copy");
          const tags = row.querySelectorAll(".row-tag");
          const imageWrap = row.querySelector(".row-image");
          const wash = row.querySelector(".row-wash");

          // set starting states
          gsap.set(number, { autoAlpha: 0, x: -12 });
          gsap.set(strata, { scaleY: 0, transformOrigin: "top" });
          gsap.set(title, { autoAlpha: 0, y: 28 });
          gsap.set(copy, { autoAlpha: 0, y: 20 });
          gsap.set(tags, { autoAlpha: 0, y: 12 });
          gsap.set(imageWrap, { autoAlpha: 0, scale: 0.94 });

          // one-time entrance, plays as the row arrives
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
            defaults: { ease: "power3.out", duration: 0.8 },
          });

          tl.to(number, { autoAlpha: 1, x: 0 })
            .to(strata, { scaleY: 1, duration: 0.7, ease: "power2.out" }, "<")
            .to(title, { autoAlpha: 1, y: 0 }, "<0.05")
            .to(copy, { autoAlpha: 1, y: 0 }, "<0.1")
            .to(
              tags,
              { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.5 },
              "<0.1",
            )
            .to(imageWrap, { autoAlpha: 1, scale: 1, duration: 0.9 }, "<0.1");

          // continuous "spice wash" that breathes as the row passes center
          if (wash) {
            ScrollTrigger.create({
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              onUpdate: (self) => {
                const intensity = 1 - Math.abs(self.progress - 0.5) * 2;
                gsap.set(wash, { opacity: Math.max(intensity, 0) * 0.14 });
              },
            });
          }
        });

        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-screen w-full overflow-hidden py-24 text-[#E9DFC8]"
    >
      <div className="services-bg-type pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-robert-regular text-[17vw] font-semibold uppercase tracking-tight text-[#C99B57]/10">
        CAPABILITIES
      </div>

      <div className="container relative mx-auto px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#C4602A] font-robert-medium">
            The Disciplines
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#E9DFC8] md:text-5xl font-robert-regular">
            Strategy. Design. Engineering.
          </h2>
        </div>

        <div className="mt-10 rounded-lg bg-[#E9DFC8]/5 px-4">
          <div className="flex flex-col">
            {services.map((service, i) => (
              <div
                key={service.title}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="group relative flex flex-col overflow-hidden pt-10 not-last:border-b not-last:border-b-[#C4602050] not-last:pb-10 last:pb-4 lg:grid lg:grid-cols-12 lg:gap-8 lg:last:pb-10"
              >
                <div
                  className="row-wash pointer-events-none absolute inset-0 bg-linear-to-r from-[#C4602A]/40 via-[#C4602A]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-8"
                  aria-hidden="true"
                />

                <div className="relative flex items-start gap-3 lg:col-span-2 lg:block">
                  <span
                    className="row-strata h-6 w-px bg-linear-to-b from-[#C4602A] to-transparent lg:mb-2 lg:h-8"
                    aria-hidden="true"
                  />
                  <p className="row-number mb-1 text-xs font-medium uppercase tracking-wider text-neutral-300 lg:text-[clamp(14px,0.8vw,18px)]">
                    0{i + 1}
                  </p>
                </div>

                <h3
                  className="row-title relative mb-6 font-circular-web text-[clamp(24px,3.1vw,52px)] font-semibold text-[#E9DFC8] lg:col-span-4 lg:-mt-4 lg:mb-0"
                  aria-label={service.title}
                >
                  {service.title}
                </h3>

                <div className="relative mb-8 flex flex-col gap-4 lg:col-span-3 lg:mb-0 lg:gap-6">
                  <p className="row-copy text-[clamp(16px,1.2vw,20px)] font-medium leading-[1.3] text-[#E9DFC8]">
                    {service.description}
                  </p>

                  <ul className="flex flex-wrap items-center gap-1.5">
                    {service.tags.map((t) => (
                      <li
                        key={t}
                        className="row-tag rounded-md border border-[#C99B57]/20 bg-[#241812] px-3 py-1 font-circular-web text-sm uppercase text-[#C99B57] transition-all duration-300 hover:border-[#C4602A]/60 hover:text-[#F2A65A]"
                        aria-label={t}
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="row-image relative lg:col-span-3">
                  <div className="transition-transform duration-500 ease-out">
                    <ImageReveal
                      source={`/images/serv-${i + 1}.jpg`}
                      imgAlt={service.title}
                      className="h-55 rounded-lg sm:h-100 md:h-112 lg:h-[clamp(220px,15vw,360px)]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
