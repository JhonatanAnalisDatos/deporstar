"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/supabase.js";

type TablaPosiciones = Record<string, any>;

interface Torneo {
  id: string;
  nombre: string;
}

interface Equipo {
  id: string;
  nombre: string;
}

export default function EstadisticasPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [standings, setStandings] = useState<TablaPosiciones[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  useEffect(() => {
    fetchTorneos();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchStandings();
      fetchEquipos();
    } else {
      setStandings([]);
    }
  }, [selectedTournament]);

  const fetchTorneos = async () => {
    const { data } = await supabase.from("torneos").select("id, nombre");
    setTorneos(data || []);
  };

  const fetchEquipos = async () => {
    const { data } = await supabase.from("equipos").select("id, nombre");
    setEquipos(data || []);
  };

  const fetchStandings = async () => {
    if (!selectedTournament) return;
    const { data } = await supabase
      .from("tabla_posiciones")
      .select("*")
      .eq("torneo_id", selectedTournament)
      .order("pts", { ascending: false });
    setStandings(data || []);
  };

  const getTeamName = (row: TablaPosiciones) => {
    const teamId = row.equipo_id ?? row.equipo;
    const equipo = equipos.find((e) => e.id === teamId);
    return equipo?.nombre || row.equipo || "Equipo desconocido";
  };

  const exportReport = () => {
    const rows = standings
      .map((row) => {
        const teamName = getTeamName(row);
        const played = row.pj ?? row.played ?? 0;
        const wins = row.pg ?? row.wins ?? 0;
        const draws = row.pe ?? row.draws ?? 0;
        const losses = row.pp ?? row.losses ?? 0;
        const gf = row.gf ?? row.goals_for ?? 0;
        const gc = row.gc ?? row.goals_against ?? 0;
        const pts = row.pts ?? row.points ?? 0;

        return `
          <tr>
            <td>${teamName}</td>
            <td>${played}</td>
            <td>${wins}</td>
            <td>${draws}</td>
            <td>${losses}</td>
            <td>${gf}</td>
            <td>${gc}</td>
            <td>${pts}</td>
          </tr>`;
      })
      .join("");

    const html = `
      <html>
        <head><meta charset="UTF-8"><title>Tabla de Posiciones</title></head>
        <body>
          <h1>Tabla de Posiciones</h1>
          <table border="1" cellpadding="8" cellspacing="0">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>PJ</th>
                <th>PG</th>
                <th>PE</th>
                <th>PP</th>
                <th>GF</th>
                <th>GC</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tabla_posiciones_${selectedTournament}.html`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📊 Estadísticas y Tabla</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <select
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            className="w-full border border-slate-300 px-4 py-2 rounded-lg"
          >
            <option value="">Selecciona un torneo</option>
            {torneos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        {standings.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Tabla de Posiciones</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-3 border">Equipo</th>
                    <th className="p-3 border">PJ</th>
                    <th className="p-3 border">PG</th>
                    <th className="p-3 border">PE</th>
                    <th className="p-3 border">PP</th>
                    <th className="p-3 border">GF</th>
                    <th className="p-3 border">GC</th>
                    <th className="p-3 border">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, index) => {
                    const played = row.pj ?? row.played ?? 0;
                    const wins = row.pg ?? row.wins ?? 0;
                    const draws = row.pe ?? row.draws ?? 0;
                    const losses = row.pp ?? row.losses ?? 0;
                    const gf = row.gf ?? row.goals_for ?? 0;
                    const gc = row.gc ?? row.goals_against ?? 0;
                    const pts = row.pts ?? row.points ?? 0;

                    return (
                      <tr key={row.id ?? index}>
                        <td className="p-3 border">{getTeamName(row)}</td>
                        <td className="p-3 border">{played}</td>
                        <td className="p-3 border">{wins}</td>
                        <td className="p-3 border">{draws}</td>
                        <td className="p-3 border">{losses}</td>
                        <td className="p-3 border">{gf}</td>
                        <td className="p-3 border">{gc}</td>
                        <td className="p-3 border">{pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button onClick={exportReport} className="mt-6 bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700">
              Descargar Reporte
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
