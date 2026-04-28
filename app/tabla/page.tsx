'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../src/supabase';

export default function Tabla() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from('equipos')
        .select('nombre, puntos_totales')
        .order('puntos_totales', { ascending: false });
      setDatos(data || []);
    };
    cargar();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white text-center text-xl font-bold">🏆 Posiciones Actuales</div>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Equipo</th>
              <th className="p-4 text-center">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((equipo, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{equipo.nombre}</td>
                <td className="p-4 text-center font-bold text-blue-600">{equipo.puntos_totales || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}