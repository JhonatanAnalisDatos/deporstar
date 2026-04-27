'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../src/supabase';

export default function TablaPosiciones() {
  const [tabla, setTabla] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!supabase) return;
      try {
        // Cambiamos a la tabla 'equipos' que es donde veo tus datos en la imagen
        const { data, error } = await supabase
          .from('equipos') 
          .select('nombre, puntos_totales')
          .order('puntos_totales', { ascending: false });

        if (error) console.error("Error:", error.message);
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
                <th className="p-4 rounded-tl-lg">Equipo</th>
                <th className="p-4 text-center font-bold text-yellow-300">PUNTOS</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((fila: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-700">
                    {fila.nombre}
                  </td>
                  <td className="p-4 text-center font-bold text-blue-600 text-xl">
                    {fila.puntos_totales || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tabla.length === 0 && (
            <p className="text-center mt-6 text-gray-400 italic">Cargando datos de Supabase...</p>
          )}
        </div>
        <div className="mt-8 text-center">
            <a href="/" className="text-blue-500 hover:underline">← Volver al Inicio</a>
        </div>
      </div>
    </div>
  );
}