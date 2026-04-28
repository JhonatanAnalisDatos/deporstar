"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/supabaseClient.mjs";
import Link from "next/link";

interface Team {
  id: string;
  name: string;
  tournament_id: string;
  created_at: string;
}

interface Tournament {
  id: string;
  name: string;
}

export default function EquiposPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [name, setName] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTournaments();
    fetchTeams();
  }, []);

  const fetchTournaments = async () => {
    const { data } = await supabase.from("tournaments").select("id, name");
    setTournaments(data || []);
  };

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("*").order("created_at", { ascending: false });
    setTeams(data || []);
  };

  const addTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId) {
      setMessage("Selecciona un torneo");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("teams").insert({ name, tournament_id: tournamentId });
    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Equipo registrado");
      setName("");
      fetchTeams();
    }
  };

  const deleteTeam = async (id: string) => {
    await supabase.from("teams").delete().eq("id", id);
    fetchTeams();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">👥 Gestión de Equipos</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Equipo</h2>
          <form onSubmit={addTeam} className="space-y-4">
            <select
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            >
              <option value="">Selecciona un torneo</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del equipo"
              required
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Registrando..." : "➕ Registrar Equipo"}
            </button>
          </form>
          {message && <p className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</p>}
        </div>

        <div className="grid gap-4">
          <h2 className="text-2xl font-bold">Equipos Registrados</h2>
          {teams.length === 0 ? (
            <p className="text-slate-600">No hay equipos registrados.</p>
          ) : (
            teams.map((team) => (
              <div key={team.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-600 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{team.name}</h3>
                  <p className="text-slate-600 text-sm">Creado: {new Date(team.created_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => deleteTeam(team.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
