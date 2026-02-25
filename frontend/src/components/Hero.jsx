export default function Hero() {
  return (
    <section className="py-32 text-center bg-black font-mono relative overflow-hidden text-hacker-green">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00ff411a_0%,_transparent_70%)]"></div>
      <div className="relative z-10 px-4">
        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase">EMPOWERING_INNOVATORS</h2>
        <p className="text-hacker-green/60 text-xl mb-10 max-w-2xl mx-auto">Synthesizing knowledge across the arcane and the digital.</p>
        <button className="border-2 border-hacker-green px-10 py-3 uppercase font-bold tracking-widest hover:bg-hacker-green hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,65,0.3)]">INITIALIZE_SEQUENCE</button>
      </div>
    </section>
  );
}
