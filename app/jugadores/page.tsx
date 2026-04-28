"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/supabase.js";

interface Jugador {
  id: string;
  nombre: string;
  equipo_id: string;
  dorsal: number | null;
  created_at?: string;
}

interface Equipo {
  id: string;
  nombre: string;
}

export default function JugadoresPage() {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [nombre, setNombre] = useState("");
  const [equipoId, setEquipoId] = useState("");
  const [dorsal, setDorsal] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEquipos();
    fetchJugadores();
  }, []);

  const fetchEquipos = async () => {
    const { data } = await supabase.from("equipos").select("id, nombre");
    setEquipos(data || []);
  };

  const fetchJugadores = async () => {
    const { data } = await supabase.from("jugadores").select("*").order("created_at", { ascending: false });
    setJugadores(data || []);
  };

  const addJugador = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipoId) {
      setMessage("Selecciona un equipo");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("jugadores").insert({
      nombre,
      equipo_id: equipoId,
      dorsal: dorsal ? parseInt(dorsal) : null,
    });
    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Jugador registrado");
      setNombre("");
      setDorsal("");
      fetchJugadores();
    }
  };

  const downloadCarne = (jugador: Jugador, equipo: Equipo) => {
    const carneHTML = `
      <html>
        <head><meta charset="UTF-8"><title>Carné ${jugador.nombre}</title></head>
        <body style="font-family: Arial; text-align: center; padding: 20px;">
          <h2>CARNÉ DE JUGADOR</h2>
          <p><strong>Nombre:</strong> ${jugador.nombre}</p>
          <p><strong>Equipo:</strong> ${equipo?.nombre || "N/A"}</p>
          <p><strong>Dorsal:</strong> ${jugador.dorsal ?? "N/A"}</p>
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
    a.download = `carne_${jugador.nombre}.html`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🎮 Gestión de Jugadores</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Jugador</h2>
          <form onSubmit={addJugador} className="space-y-4">
            <select
              value={equipoId}
              onChange={(e) => setEquipoId(e.target.value)}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            >
              <option value="">Selecciona un equipo</option>
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
              ))}
            </select>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
          {jugadores.length === 0 ? (
            <p className="text-slate-600">No hay jugadores registrados.</p>
          ) : (
            jugadores.map((jugador) => {
              const equipo = equipos.find((e) => e.id === jugador.equipo_id);
              return (
                <div key={jugador.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-600 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{jugador.nombre}</h3>
                    <p className="text-slate-600 text-sm">Equipo: {equipo?.nombre || "N/A"} | Dorsal: {jugador.dorsal ?? "N/A"}</p>
                  </div>
                  <button
                    onClick={() => downloadCarne(jugador, equipo ?? { id: "", nombre: "N/A" })}
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
