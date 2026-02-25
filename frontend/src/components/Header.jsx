export default function Header() {
  return (
    <header className="bg-hacker-dark border-b border-hacker-green/30 p-4 flex justify-between items-center font-mono text-hacker-green">
      <h1 className="text-2xl font-bold tracking-tighter glow">HEXTECH_SCHOLAR.exe</h1>
      <nav>
        <ul className="flex gap-6 text-sm uppercase">
          <li><a href="#" className="hover:text-white transition-colors">[ LAB ]</a></li>
          <li><a href="#" className="hover:text-white transition-colors">[ DATA ]</a></li>
          <li><a href="#" className="hover:text-white transition-colors">[ NEXUS ]</a></li>
        </ul>
      </nav>
    </header>
  );
}
