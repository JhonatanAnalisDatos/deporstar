"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/supabaseClient.mjs";

interface Player {
  id: string;
  name: string;
  team_id: string;
  dorsal: number | null;
  created_at: string;
}

interface Team {
  id: string;
  name: string;
}

export default function JugadoresPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [dorsal, setDorsal] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("id, name");
    setTeams(data || []);
  };

  const fetchPlayers = async () => {
    const { data } = await supabase.from("players").select("*").order("created_at", { ascending: false });
    setPlayers(data || []);
  };

  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) {
      setMessage("Selecciona un equipo");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("players").insert({
      name,
      team_id: teamId,
      dorsal: dorsal ? parseInt(dorsal) : null,
    });
    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Jugador registrado");
      setName("");
      setDorsal("");
      fetchPlayers();
    }
  };

  const downloadCarne = (player: Player, team: Team) => {
    const carneHTML = `
      <html>
        <head><meta charset="UTF-8"><title>Carné ${player.name}</title></head>
        <body style="font-family: Arial; text-align: center; padding: 20px;">
          <h2>CARNÉ DE JUGADOR</h2>
          <p><strong>Nombre:</strong> ${player.name}</p>
          <p><strong>Equipo:</strong> ${team.name}</p>
          <p><strong>Dorsal:</strong> ${player.dorsal || 'N/A'}</p>
          <p style="margin-top: 40px; border-top: 1px solid #000; padding-top: 20px;">
            <small>DeporStar - Gestión de Torneos</small>
          </p>
        </body>
      </html>
    `;
    const blob = new Blob([carneHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carne_${player.name}.html`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🎮 Gestión de Jugadores</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Jugador</h2>
          <form onSubmit={addPlayer} className="space-y-4">
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            >
              <option value="">Selecciona un equipo</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del jugador"
              required
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            />
            <input
              type="number"
              value={dorsal}
              onChange={(e) => setDorsal(e.target.value)}
              placeholder="Dorsal (opcional)"
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Registrando..." : "➕ Registrar Jugador"}
            </button>
          </form>
          {message && <p className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</p>}
        </div>

        <div className="grid gap-4">
          <h2 className="text-2xl font-bold">Jugadores Registrados</h2>
          {players.length === 0 ? (
            <p className="text-slate-600">No hay jugadores registrados.</p>
          ) : (
            players.map((player) => {
              const team = teams.find((t) => t.id === player.team_id);
              return (
                <div key={player.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-600 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{player.name}</h3>
                    <p className="text-slate-600 text-sm">Equipo: {team?.name} | Dorsal: {player.dorsal || 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => downloadCarne(player, team!)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    📄 Carné
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
