'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../src/supabase'; // Ruta exacta a tu archivo en src

export default function TablaPosiciones() {
  const [tabla, setTabla] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      // Intentamos traer los datos de la vista que creamos antes
      const { data, error } = await supabase.from('tabla_posiciones').select('*');
      if (error) console.error("Error cargando tabla:", error);
      else setTabla(data);
    };
    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
              {tabla?.map((equipo: any) => (
                <tr key={equipo.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-700">{equipo.nombre}</td>
                  <td className="p-3 text-center">{equipo.pj || 0}</td>
                  <td className="p-3 text-center">{equipo.pg || 0}</td>
                  <td className="p-3 text-center font-bold text-blue-600">{equipo.puntos || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tabla.length === 0 && <p className="text-center mt-4 text-gray-400">No hay datos registrados todavía.</p>}
        </div>
      </div>
    </div>
  );
}