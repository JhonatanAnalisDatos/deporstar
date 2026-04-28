"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/supabase.js";

interface Torneo {
  id: string;
  nombre: string;
}

interface Equipo {
  id: string;
  nombre: string;
}

interface Partido {
  id: string;
  torneo_id: string;
  local_id: string;
  visitante_id: string;
  goles_local: number;
  goles_visitante: number;
  estado: string;
  jornada: number;
}

export default function PartidosPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [homeScore, setHomeScore] = useState<{ [key: string]: string }>({});
  const [awayScore, setAwayScore] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchTorneos();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchEquipos();
      fetchPartidos();
    } else {
      setEquipos([]);
      setPartidos([]);
    }
  }, [selectedTournament]);

  const fetchTorneos = async () => {
    const { data } = await supabase.from("torneos").select("id, nombre");
    setTorneos(data || []);
  };

  const fetchEquipos = async () => {
    if (!selectedTournament) return;
    const { data } = await supabase.from("equipos").select("id, nombre").eq("torneo_id", selectedTournament);
    setEquipos(data || []);
  };

  const fetchPartidos = async () => {
    if (!selectedTournament) return;
    const { data } = await supabase
      .from("partidos")
      .select("*")
      .eq("torneo_id", selectedTournament)
      .order("jornada", { ascending: true });
    setPartidos(data || []);
  };

  const getTeamName = (id: string) => equipos.find((t) => t.id === id)?.nombre || "Equipo";

  const updateScore = async (matchId: string) => {
    const home = parseInt(homeScore[matchId] || "0");
    const away = parseInt(awayScore[matchId] || "0");

    const { error } = await supabase
      .from("partidos")
      .update({ goles_local: home, goles_visitante: away, estado: "jugado" })
      .eq("id", matchId);

    if (!error) {
      fetchPartidos();
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
          {torneos.map((t) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        <div className="space-y-4">
          {partidos.length === 0 ? (
            <p className="text-slate-600">No hay partidos. Genera un fixture primero.</p>
          ) : (
            partidos.map((match) => (
              <div key={match.id} className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-sm text-slate-600 mb-2">Jornada {match.jornada}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <p className="font-bold">{getTeamName(match.local_id)}</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={homeScore[match.id] || match.goles_local || ""}
                      onChange={(e) => setHomeScore({ ...homeScore, [match.id]: e.target.value })}
                      placeholder="0"
                      className="w-16 border px-2 py-1 rounded text-center"
                    />
                    <span className="px-2 py-1">-</span>
                    <input
                      type="number"
                      value={awayScore[match.id] || match.goles_visitante || ""}
                      onChange={(e) => setAwayScore({ ...awayScore, [match.id]: e.target.value })}
                      placeholder="0"
                      className="w-16 border px-2 py-1 rounded text-center"
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold">{getTeamName(match.visitante_id)}</p>
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
