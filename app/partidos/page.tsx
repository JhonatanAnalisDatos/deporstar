'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../src/supabase';
import Link from 'next/link';

export default function RegistrarPartido() {
  // Solución al error: Definimos el estado como any[] para que acepte los datos
  const [equipos, setEquipos] = useState<any[]>([]);
  const [local, setLocal] = useState('');
  const [visitante, setVisitante] = useState('');
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const obtenerEquipos = async () => {
      const { data } = await supabase.from('equipos').select('*');
      setEquipos(data || []); // Ahora TypeScript no marcará error aquí
    };
    obtenerEquipos();
  }, []);

  const subirResultado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!local || !visitante || local === visitante) {
        return alert("Selecciona dos equipos diferentes");
    }
    setCargando(true);

    try {
      // 1. Registrar el partido
      await supabase.from('partidos').insert([
        { 
          local_id: local, 
          visitante_id: visitante, 
          goles_local: golesLocal, 
          goles_visitante: golesVisitante 
        }
      ]);

      // 2. Calcular puntos
      let puntosL = golesLocal > golesVisitante ? 3 : golesLocal === golesVisitante ? 1 : 0;
      let puntosV = golesVisitante > golesLocal ? 3 : golesLocal === golesVisitante ? 1 : 0;

      // 3. Actualizar Puntos Totales (Usando tus columnas reales)
      const { data: dLocal } = await supabase.from('equipos').select('puntos_totales').eq('id', local).single();
      const { data: dVis } = await supabase.from('equipos').select('puntos_totales').eq('id', visitante).single();

      await supabase.from('equipos').update({ puntos_totales: (dLocal?.puntos_totales || 0) + puntosL }).eq('id', local);
      await supabase.from('equipos').update({ puntos_totales: (dVis?.puntos_totales || 0) + puntosV }).eq('id', visitante);

      alert("✅ Partido registrado y puntos actualizados");
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Finalizar Partido</h2>
        
        <form onSubmit={subirResultado} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold">Local</label>
              <select onChange={(e) => setLocal(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="">Seleccionar</option>
                {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
              <input type="number" min="0" placeholder="Goles" onChange={(e) => setGolesLocal(Number(e.target.value))} className="w-full p-2 border rounded-lg text-center" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold">Visitante</label>
              <select onChange={(e) => setVisitante(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="">Seleccionar</option>
                {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
              <input type="number" min="0" placeholder="Goles" onChange={(e) => setGolesVisitante(Number(e.target.value))} className="w-full p-2 border rounded-lg text-center" />
            </div>
          </div>

          <button disabled={cargando} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            {cargando ? 'Procesando...' : 'Registrar Resultado'}
          </button>
          
          <Link href="/" className="block text-center text-blue-500 hover:underline">← Volver al Inicio</Link>
        </form>
      </div>
    </div>
  );
}