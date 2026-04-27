'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function GestionPartidos() {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [local, setLocal] = useState('');
  const [visitante, setVisitante] = useState('');
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);

  useEffect(() => {
    const cargarEquipos = async () => {
      const { data } = await supabase.from('equipos').select('*');
      if (data) setEquipos(data);
    };
    cargarEquipos();
  }, []);

  const registrarPartido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (local === visitante) return alert("No pueden jugar contra el mismo equipo");

    const { error } = await supabase.from('partidos').insert([
      {
        equipo_local_id: local,
        equipo_visitante_id: visitante,
        goles_local: golesLocal,
        goles_visitante: golesVisitante,
        jugado: true
      }
    ]);

    if (error) alert("Error: " + error.message);
    else {
      alert("¡Resultado registrado con éxito!");
      window.location.href = '/tabla'; // Te manda a ver la tabla actualizada
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Registrar Resultado</h1>
        
        <form onSubmit={registrarPartido} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Equipo Local</label>
              <select className="w-full p-3 border rounded-lg" onChange={(e) => setLocal(e.target.value)} required>
                <option value="">Seleccionar...</option>
                {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Equipo Visitante</label>
              <select className="w-full p-3 border rounded-lg" onChange={(e) => setVisitante(e.target.value)} required>
                <option value="">Seleccionar...</option>
                {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <input type="number" placeholder="Goles Local" className="w-full p-4 text-3xl text-center border rounded-xl" 
                onChange={(e) => setGolesLocal(parseInt(e.target.value))} required />
            </div>
            <div>
              <input type="number" placeholder="Goles Vis." className="w-full p-4 text-3xl text-center border rounded-xl" 
                onChange={(e) => setGolesVisitante(parseInt(e.target.value))} required />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition">
            Finalizar y Guardar Partido
          </button>
        </form>
      </div>
    </div>
  );
}