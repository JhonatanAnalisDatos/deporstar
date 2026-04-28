"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/supabase.js";
import Link from "next/link";

interface Torneo {
  id: string;
  nombre: string;
  tipo: string;
  estado: string;
  version: number;
  created_at: string;
}

export default function TorneosPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("liga");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTorneos();
  }, []);

  const fetchTorneos = async () => {
    const { data, error } = await supabase
      .from("torneos")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setTorneos(data || []);
  };

  const createTorneo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("torneos").insert({
      nombre,
      tipo,
      estado: "activo",
      version: 1,
    });
    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Torneo creado exitosamente");
      setNombre("");
      fetchTorneos();
    }
  };

  const deleteTorneo = async (id: string) => {
    const { error } = await supabase.from("torneos").delete().eq("id", id);
    if (!error) {
      fetchTorneos();
      setMessage("Torneo eliminado");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📋 Gestión de Torneos</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Crear Nuevo Torneo</h2>
          <form onSubmit={createTorneo} className="space-y-4">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del torneo"
              required
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg"
            >
              <option value="liga">Liga</option>
              <option value="copa">Copa</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Creando..." : "✨ Crear Torneo"}
            </button>
          </form>
          {message && <p className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</p>}
        </div>

        <div className="grid gap-4">
          <h2 className="text-2xl font-bold">Torneos Existentes</h2>
          {torneos.length === 0 ? (
            <p className="text-slate-600">No hay torneos. ¡Crea uno para comenzar!</p>
          ) : (
            torneos.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{t.nombre}</h3>
                    <p className="text-slate-600">Tipo: {t.tipo === "liga" ? "Liga" : "Copa"} | Estado: {t.estado} | Versión: {t.version}</p>
                  </div>
                  <div className="space-x-2">
                    <Link href={`/torneos/${t.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
                      Ver Detalles
                    </Link>
                    <button
                      onClick={() => deleteTorneo(t.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
