"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/supabaseClient.mjs";

interface Tournament {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

export default function FixturePage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) fetchTeams();
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    const { data } = await supabase.from("tournaments").select("id, name");
    setTournaments(data || []);
  };

  const fetchTeams = async () => {
    if (!selectedTournament) return;
    const { data } = await supabase.from("teams").select("id, name").eq("tournament_id", selectedTournament);
    setTeams(data || []);
  };

  const generateFixture = async () => {
    if (!selectedTournament || teams.length < 2) {
      setMessage("Necesitas al menos 2 equipos");
      return;
    }

    setLoading(true);
    const matches = [];
    for (let i = 0; i < teams.length; i += 2) {
      if (i + 1 < teams.length) {
        matches.push({
          tournament_id: selectedTournament,
          home_team_id: teams[i].id,
          away_team_id: teams[i + 1].id,
          jornada: Math.floor(i / 2) + 1,
          status: "pendiente",
        });
      }
    }

    const { error } = await supabase.from("matches").insert(matches);
    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(`✅ Fixture generado con ${matches.length} partidos`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🗓️ Generador de Fixture</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Generar Calendario</h2>

          <select
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            className="w-full border border-slate-300 px-4 py-2 rounded-lg mb-4"
          >
            <option value="">Selecciona un torneo</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {selectedTournament && (
            <div>
              <h3 className="font-bold mb-2">Equipos: {teams.length}</h3>
              <ul className="mb-4">
                {teams.map((t) => (
                  <li key={t.id} className="text-slate-600">• {t.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={generateFixture}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Generando..." : "🎲 Generar Fixture"}
          </button>
          {message && <p className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</p>}
        </div>
      </div>
    </main>
  );
}
