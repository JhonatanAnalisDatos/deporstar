import { supabase } from '@/lib/supabase';

export default async function TablaPosiciones() {
  // Traemos los datos de la "Vista" que creamos en Supabase
  const { data: tabla, error } = await supabase
    .from('tabla_posiciones')
    .select('*');

  if (error) {
    return <div className="p-10 text-red-500">Error al cargar la tabla: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-700 p-6 text-white text-center">
            <h1 className="text-3xl font-extrabold uppercase tracking-wider">🏆 Tabla de Posiciones</h1>
            <p className="text-blue-100 mt-2">Torneo DeporStar 2024</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <th className="px-6 py-4">Pos</th>
                  <th className="px-6 py-4">Equipo</th>
                  <th className="px-6 py-4 text-center">PJ</th>
                  <th className="px-6 py-4 text-center text-green-600">PG</th>
                  <th className="px-6 py-4 text-center text-orange-600">PE</th>
                  <th className="px-6 py-4 text-center text-red-600">PP</th>
                  <th className="px-6 py-4 text-center">GF</th>
                  <th className="px-6 py-4 text-center">GC</th>
                  <th className="px-6 py-4 text-center bg-blue-50 font-bold text-blue-700">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tabla?.map((fila, i) => (
                  <tr key={i} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-400">{i + 1}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{fila.equipo}</td>
                    <td className="px-6 py-4 text-center">{fila.pj}</td>
                    <td className="px-6 py-4 text-center font-semibold">{fila.pg}</td>
                    <td className="px-6 py-4 text-center font-semibold">{fila.pe}</td>
                    <td className="px-6 py-4 text-center font-semibold">{fila.pp}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{fila.gf}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{fila.gc}</td>
                    <td className="px-6 py-4 text-center bg-blue-50 font-extrabold text-blue-700 text-lg">
                      {fila.pts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          * PJ: Partidos Jugados | PG: Ganados | PE: Empatados | PP: Perdidos
        </div>
      </div>
    </div>
  );
}