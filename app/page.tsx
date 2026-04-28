import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">⚽ DeporStar</h1>
          <p className="text-xl text-slate-600">Gestión Profesional de Torneos de Fútbol</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="/torneos" className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold mb-2">Gestión de Torneos</h2>
            <p className="text-slate-600">Crea, administra y versionea tus torneos.</p>
          </Link>

          <Link href="/equipos" className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition border-l-4 border-green-600">
            <h2 className="text-2xl font-bold mb-2">Equipos</h2>
            <p className="text-slate-600">Registra y gestiona equipos.</p>
          </Link>

          <Link href="/jugadores" className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition border-l-4 border-purple-600">
            <h2 className="text-2xl font-bold mb-2">Jugadores</h2>
            <p className="text-slate-600">Administra jugadores y sus carnés.</p>
          </Link>

          <Link href="/fixture" className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition border-l-4 border-orange-600">
            <h2 className="text-2xl font-bold mb-2">Generador Fixture</h2>
            <p className="text-slate-600">Crea calendarios de partidos automáticamente.</p>
          </Link>

          <Link href="/partidos" className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition border-l-4 border-red-600">
            <h2 className="text-2xl font-bold mb-2">Partidos</h2>
            <p className="text-slate-600">Ingresa resultados en tiempo real.</p>
          </Link>

          <Link href="/estadisticas" className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition border-l-4 border-indigo-600">
            <h2 className="text-2xl font-bold mb-2">Estadísticas</h2>
            <p className="text-slate-600">Tabla de posiciones, rankings y sanciones.</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">📊 Datos en Tiempo Real</h3>
            <p className="text-sm text-slate-600">Estadísticas y tablas actualizadas automáticamente</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">📱 Responsive</h3>
            <p className="text-sm text-slate-600">Funciona en móvil, tablet y PC sin app</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">📥 Reportes</h3>
            <p className="text-sm text-slate-600">Descarga resultados para redes sociales</p>
          </div>
        </div>
      </div>
    </main>
  );
}