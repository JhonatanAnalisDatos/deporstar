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

export default function FixturePage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [selectedTorneo, setSelectedTorneo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTorneos();
  }, []);

  useEffect(() => {
    if (selectedTorneo) fetchEquipos();
  }, [selectedTorneo]);

  const fetchTorneos = async () => {
    const { data } = await supabase.from("torneos").select("id, nombre");
    setTorneos(data || []);
  };

  const fetchEquipos = async () => {
    if (!selectedTorneo) return;
    const { data } = await supabase.from("equipos").select("id, nombre").eq("torneo_id", selectedTorneo);
    setEquipos(data || []);
  };

  const generateFixture = async () => {
    if (!selectedTorneo || equipos.length < 2) {
      setMessage("Necesitas al menos 2 equipos");
      return;
    }

    setLoading(true);
    const matches = [];
    for (let i = 0; i < equipos.length; i += 2) {
      if (i + 1 < equipos.length) {
        matches.push({
          torneo_id: selectedTorneo,
          local_id: equipos[i].id,
          visitante_id: equipos[i + 1].id,
          jornada: Math.floor(i / 2) + 1,
          estado: "pendiente",
        });
      }
    }

    const { error } = await supabase.from("partidos").insert(matches);
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
            value={selectedTorneo}
            onChange={(e) => setSelectedTorneo(e.target.value)}
            className="w-full border border-slate-300 px-4 py-2 rounded-lg mb-4"
          >
            <option value="">Selecciona un torneo</option>
            {torneos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>

          {selectedTorneo && (
            <div>
              <h3 className="font-bold mb-2">Equipos: {equipos.length}</h3>
              <ul className="mb-4">
                {equipos.map((t) => (
                  <li key={t.id} className="text-slate-600">• {t.nombre}</li>
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
