"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/supabase.js";
import Link from "next/link";

interface Equipo {
  id: string;
  nombre: string;
  torneo_id: string;
  created_at?: string;
}

interface Torneo {
  id: string;
  nombre: string;
}

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [nombre, setNombre] = useState("");
  const [torneoId, setTorneoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTorneos();
    fetchEquipos();
  }, []);

  const fetchTorneos = async () => {
    const { data } = await supabase.from("torneos").select("id, nombre");
    setTorneos(data || []);
  };

  const fetchEquipos = async () => {
    const { data } = await supabase.from("equipos").select("*").order("created_at", { ascending: false });
    setEquipos(data || []);
  };

  const addEquipo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!torneoId) {
      setMessage("Selecciona un torneo");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("equipos").insert({ nombre, torneo_id: torneoId });
    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Equipo registrado");
      setNombre("");
      fetchEquipos();
    }
  };

  const deleteEquipo = async (id: string) => {
    await supabase.from("equipos").delete().eq("id", id);
    fetchEquipos();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">👥 Gestión de Equipos</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Equipo</h2>
          <form onSubmit={addEquipo} className="space-y-4">
            <select
              value={torneoId}
              onChange={(e) => setTorneoId(e.target.value)}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            >
              <option value="">Selecciona un torneo</option>
              {torneos.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
          {equipos.length === 0 ? (
            <p className="text-slate-600">No hay equipos registrados.</p>
          ) : (
            equipos.map((equipo) => (
              <div key={equipo.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-600 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{equipo.nombre}</h3>
                  {equipo.created_at ? (
                    <p className="text-slate-600 text-sm">Creado: {new Date(equipo.created_at).toLocaleDateString()}</p>
                  ) : null}
                </div>
                <button
                  onClick={() => deleteEquipo(equipo.id)}
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
