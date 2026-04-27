'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../src/supabase';

export default function TablaPosiciones() {
  const [tabla, setTabla] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('tabla_posiciones').select('*');
        if (error) console.error("Error:", error);
        else setTabla(data || []);
      } catch (e) {
        console.error("Error de conexión:", e);
      }
    };
    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">🏆 Tabla de Posiciones</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 rounded-tl-lg">Equipo</th>
                <th className="p-3 text-center">PJ</th>
                <th className="p-3 text-center">PG</th>
                <th className="p-3 text-center font-bold text-yellow-300">PTS</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((fila: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                  {/* Aquí está el truco: intenta buscar 'nombre' o 'equipo' */}
                  <td className="p-3 font-semibold text-gray-700">
                    {fila.nombre || fila.equipo || 'Sin nombre'}
                  </td>
                  <td className="p-3 text-center text-gray-600">{fila.pj || 0}</td>
                  <td className="p-3 text-center text-gray-600">{fila.pg || 0}</td>
                  <td className="p-3 text-center font-bold text-blue-600 text-lg">
                    {fila.puntos || fila.pts || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tabla.length === 0 && (
            <p className="text-center mt-6 text-gray-400 italic">Cargando datos del torneo...</p>
          )}
        </div>
      </div>
    </div>
  );
}