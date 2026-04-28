"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/supabaseClient.mjs";
import html2canvas from "html2canvas";

interface Tournament {
  id: string;
  name: string;
}

interface Standings {
  id: string;
  team_id: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  matches_played: number;
}

interface Team {
  id: string;
  name: string;
}

interface Player {
  id: string;
  name: string;
  team_id: string;
}

export default function EstadisticasPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [standings, setStandings] = useState<Standings[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTournament, setSelectedTournament] = useState("");

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchStandings();
      fetchTeams();
    }
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    const { data } = await supabase.from("tournaments").select("id, name");
    setTournaments(data || []);
  };

  const fetchStandings = async () => {
    if (!selectedTournament) return;
    const { data } = await supabase
      .from("standings")
      .select("*")
      .eq("tournament_id", selectedTournament)
      .order("points", { ascending: false });
    setStandings(data || []);
  };

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("id, name").eq("tournament_id", selectedTournament);
    setTeams(data || []);
  };

  const getTeamName = (id: string) => teams.find((t) => t.id === id)?.name || "Equipo";

  const downloadReport = async () => {
    const element = document.getElementById("standings-table");
    if (!element) return;

    const canvas = await html2canvas(element);
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = `tabla_posiciones.png`;
    link.click();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📊 Estadísticas y Rankings</h1>

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

        {selectedTournament && (
          <>
            <div className="mb-8">
              <button
                onClick={downloadReport}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700"
              >
                📥 Descargar Reporte
              </button>
            </div>

            <div id="standings-table" className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Tabla de Posiciones</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="border px-4 py-2 text-left">Pos</th>
                    <th className="border px-4 py-2 text-left">Equipo</th>
                    <th className="border px-4 py-2 text-center">PJ</th>
                    <th className="border px-4 py-2 text-center">G</th>
                    <th className="border px-4 py-2 text-center">E</th>
                    <th className="border px-4 py-2 text-center">P</th>
                    <th className="border px-4 py-2 text-center">GF</th>
                    <th className="border px-4 py-2 text-center">GC</th>
                    <th className="border px-4 py-2 text-center">DG</th>
                    <th className="border px-4 py-2 text-center">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="border px-4 py-2 text-center text-slate-600">
                        No hay datos. Ingresa resultados primero.
                      </td>
                    </tr>
                  ) : (
                    standings.map((s, idx) => (
                      <tr key={s.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="border px-4 py-2 font-bold">{idx + 1}</td>
                        <td className="border px-4 py-2 font-bold">{getTeamName(s.team_id)}</td>
                        <td className="border px-4 py-2 text-center">{s.matches_played}</td>
                        <td className="border px-4 py-2 text-center">{s.wins}</td>
                        <td className="border px-4 py-2 text-center">{s.draws}</td>
                        <td className="border px-4 py-2 text-center">{s.losses}</td>
                        <td className="border px-4 py-2 text-center">{s.goals_for}</td>
                        <td className="border px-4 py-2 text-center">{s.goals_against}</td>
                        <td className="border px-4 py-2 text-center">{s.goals_for - s.goals_against}</td>
                        <td className="border px-4 py-2 text-center font-bold text-blue-600">{s.points}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
