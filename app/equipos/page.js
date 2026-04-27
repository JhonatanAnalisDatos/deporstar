import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">⚽ DeporStar</h1>
        <p className="text-xl text-gray-600 mb-8">Gestión profesional de torneos de fútbol</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link href="/equipos" className="p-6 bg-white rounded-xl shadow-md border hover:border-blue-500 transition-all">
            <h2 className="text-2xl font-bold mb-2">Equipos →</h2>
            <p className="text-gray-500">Inscribe y gestiona los equipos del torneo.</p>
          </Link>

          <Link href="/partidos" className="p-6 bg-white rounded-xl shadow-md border hover:border-blue-500 transition-all text-gray-400">
            <h2 className="text-2xl font-bold mb-2">Próximamente →</h2>
            <p>Calendario y resultados de partidos.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}