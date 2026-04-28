'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../src/supabase';
import Link from 'next/link';

export default function Tabla() {
  // Cambiamos useState([]) por useState<any[]>([]) para evitar el error de tipo
  const [datos, setDatos] = useState<any[]>([]);

  useEffect(() => {
    const cargar = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from('equipos')
        .select('nombre, puntos_totales')
        .order('puntos_totales', { ascending: false });
      
      setDatos(data || []);
    };
    cargar();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold italic">🏆 TABLA DE POSICIONES</h1>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-700">Equipo</th>
                <th className="p-4 text-center font-bold text-gray-700">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((equipo, i) => (
                <tr key={i} className="border-b hover:bg-blue-5 transition-colors">
                  <td className="p-4 font-semibold text-gray-800">{equipo.nombre}</td>
                  <td className="p-4 text-center font-bold text-blue-600 text-xl">
                    {equipo.puntos_totales || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {datos.length === 0 && (
          <p className="p-10 text-center text-gray-400 italic">Cargando estadísticas...</p>
        )}

        <div className="p-6 bg-gray-50 text-center">
          <Link href="/" className="text-blue-500 font-medium hover:underline">
            ← Volver al Panel Principal
          </Link>
        </div>
      </div>
    </div>
  );
}