'use client';
import { useState } from 'react';
import { supabase } from '../../src/supabase';
import Link from 'next/link';

export default function AgregarEquipo() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const guardarEquipo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return;

    setCargando(true);
    setMensaje('');

    try {
      // Insertamos el nuevo equipo en la tabla 'equipos'
      // puntos_totales se pone en 0 por defecto
      const { error } = await supabase
        .from('equipos')
        .insert([{ nombre: nombre, puntos_totales: 0 }]);

      if (error) throw error;

      setMensaje('✅ ¡Equipo agregado con éxito!');
      setNombre(''); // Limpiar el campo
    } catch (error: any) {
      setMensaje('❌ Error: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Registrar Nuevo Equipo</h1>
        
        <form onSubmit={guardarEquipo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Equipo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Los Galácticos FC"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={cargando}
            className={`w-full p-3 text-white font-bold rounded-lg transition-colors ${
              cargando ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {cargando ? 'Guardando...' : 'Agregar Equipo'}
          </button>
        </form>

        {mensaje && (
          <p className={`mt-4 text-center font-medium ${mensaje.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}

        <div className="mt-8 flex justify-between">
          <Link href="/" className="text-blue-500 hover:underline">← Inicio</Link>
          <Link href="/tabla" className="text-blue-500 hover:underline">Ver Tabla →</Link>
        </div>
      </div>
    </div>
  );
}