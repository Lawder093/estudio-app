import Link from "next/link";

export default function PanelLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-black text-white p-4 flex gap-4">
        <Link href="/dashboard">Inicio</Link>
        <Link href="/participants">Participantes</Link>
        <Link href="/apply-test">Aplicar Test</Link>
        <Link href="/results">Resultados</Link>
        <Link href="/instruments">Instrumentos</Link>
      </nav>

      <main className="p-6">
        {children}
      </main>
    </div>
  );
}