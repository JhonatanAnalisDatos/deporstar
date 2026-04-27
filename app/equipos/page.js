import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-5xl w-full flex flex-col items-center text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">⚽ DeporStar</h1>
        <p className="text-xl text-gray-600 mb-12">Gestión profesional de torneos de fútbol</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {/* Botón Equipos */}
          <Link href="/equipos" className="p-6 bg-white rounded-xl shadow-md border hover:border-blue-500 transition-all group">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600">Equipos →</h2>
            <p className="text-gray-500 text-sm">Inscribe y gestiona los equipos del torneo.</p>
          </Link>

          {/* Botón Tabla (EL NUEVO) */}
          <Link href="/tabla" className="p-6 bg-blue-600 rounded-xl shadow-md border border-blue-700 hover:bg-blue-700 transition-all text-white">
            <h2 className="text-2xl font-bold mb-2 text-white">🏆 Tabla →</h2>
            <p className="text-blue-100 text-sm">Mira las posiciones y estadísticas en vivo.</p>
          </Link>

          {/* Botón Partidos */}
          <Link href="/partidos" className="p-6 bg-white rounded-xl shadow-md border hover:border-blue-500 transition-all group">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600">Partidos →</h2>
            <p className="text-gray-500 text-sm">Registra resultados y marcadores.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}