"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/supabaseClient.mjs";

interface Tournament {
  id: string;
  name: string;
}

interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
  jornada: number;
}

interface Team {
  id: string;
  name: string;
}

export default function PartidosPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [homeScore, setHomeScore] = useState<{ [key: string]: string }>({});
  const [awayScore, setAwayScore] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchMatches();
      fetchTeams();
    }
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    const { data } = await supabase.from("tournaments").select("id, name");
    setTournaments(data || []);
  };

  const fetchMatches = async () => {
    if (!selectedTournament) return;
    const { data } = await supabase.from("matches").select("*").eq("tournament_id", selectedTournament);
    setMatches(data || []);
  };

  const fetchTeams = async () => {
    if (!selectedTournament) return;
    const { data } = await supabase.from("teams").select("id, name").eq("tournament_id", selectedTournament);
    setTeams(data || []);
  };

  const getTeamName = (id: string) => teams.find((t) => t.id === id)?.name || "Equipo";

  const updateScore = async (matchId: string) => {
    const home = parseInt(homeScore[matchId] || "0");
    const away = parseInt(awayScore[matchId] || "0");

    const { error } = await supabase
      .from("matches")
      .update({ home_score: home, away_score: away, status: "jugado" })
      .eq("id", matchId);

    if (!error) {
      fetchMatches();
      alert("✅ Resultado actualizado");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">⚽ Ingresar Resultados</h1>

        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="w-full border border-slate-300 px-4 py-2 rounded-lg mb-8"
        >
          <option value="">Selecciona un torneo</option>
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <div className="space-y-4">
          {matches.length === 0 ? (
            <p className="text-slate-600">No hay partidos. Genera un fixture primero.</p>
          ) : (
            matches.map((match) => (
              <div key={match.id} className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-sm text-slate-600 mb-2">Jornada {match.jornada}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <p className="font-bold">{getTeamName(match.home_team_id)}</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={homeScore[match.id] || match.home_score || ""}
                      onChange={(e) => setHomeScore({ ...homeScore, [match.id]: e.target.value })}
                      placeholder="0"
                      className="w-16 border px-2 py-1 rounded text-center"
                    />
                    <span className="px-2 py-1">-</span>
                    <input
                      type="number"
                      value={awayScore[match.id] || match.away_score || ""}
                      onChange={(e) => setAwayScore({ ...awayScore, [match.id]: e.target.value })}
                      placeholder="0"
                      className="w-16 border px-2 py-1 rounded text-center"
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold">{getTeamName(match.away_team_id)}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateScore(match.id)}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  💾 Guardar Resultado
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
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