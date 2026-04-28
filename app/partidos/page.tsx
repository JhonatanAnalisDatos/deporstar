'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../src/supabase';
import Link from 'next/link';

export default function RegistrarPartido() {
  const [equipos, setEquipos] = useState([]);
  const [local, setLocal] = useState('');
  const [visitante, setVisitante] = useState('');
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const obtenerEquipos = async () => {
      const { data } = await supabase.from('equipos').select('*');
      setEquipos(data || []);
    };
    obtenerEquipos();
  }, []);

  const subirResultado = async (e) => {
    e.preventDefault();
    if (local === visitante) return alert("Selecciona equipos diferentes");
    setCargando(true);

    try {
      // 1. Registrar el partido en la tabla 'partidos'
      await supabase.from('partidos').insert([
        { local_id: local, visitante_id: visitante, goles_local: golesLocal, goles_visitante: golesVisitante }
      ]);

      // 2. Lógica simple para actualizar puntos
      let puntosLocal = golesLocal > golesVisitante ? 3 : golesLocal === golesVisitante ? 1 : 0;
      let puntosVisitante = golesVisitante > golesLocal ? 3 : golesLocal === golesVisitante ? 1 : 0;

      // Actualizar equipo Local (Usando la columna 'puntos_totales' que vimos en Supabase)
      const { data: dataLocal } = await supabase.from('equipos').select('puntos_totales').eq('id', local).single();
      await supabase.from('equipos').update({ puntos_totales: (dataLocal.puntos_totales || 0) + puntosLocal }).eq('id', local);

      // Actualizar equipo Visitante
      const { data: dataVis } = await supabase.from('equipos').select('puntos_totales').eq('id', visitante).single();
      await supabase.from('equipos').update({ puntos_totales: (dataVis.puntos_totales || 0) + puntosVisitante }).eq('id', visitante);

      alert("✅ Resultado guardado y puntos actualizados");
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <form onSubmit={subirResultado} className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Registrar Marcador</h2>
        <div className="grid grid-cols-2 gap-4">
          <select onChange={(e) => setLocal(e.target.value)} className="p-2 border rounded">
            <option>Local</option>
            {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
          <select onChange={(e) => setVisitante(e.target.value)} className="p-2 border rounded">
            <option>Visitante</option>
            {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
          <input type="number" placeholder="Goles" onChange={(e) => setGolesLocal(Number(e.target.value))} className="p-2 border rounded text-center" />
          <input type="number" placeholder="Goles" onChange={(e) => setGolesVisitante(Number(e.target.value))} className="p-2 border rounded text-center" />
        </div>
        <button disabled={cargando} className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg font-bold">
          {cargando ? 'Guardando...' : 'Finalizar Partido'}
        </button>
        <Link href="/" className="block text-center mt-4 text-blue-500">Volver</Link>
      </form>
    </div>
  );
}