import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";

export default function Page() {
  return (
    <div className="relative min-h-screen w-full text-[#E8DCC8]">
      <div className="global-dune-canvas">
        <div className="global-dune-grid" />
        <div className="global-dune-glow" />
      </div>

      <main className="relative z-10">
        <Hero />
        <About />
        <Services />
        <Work />
      </main>
    </div>
  );
}
