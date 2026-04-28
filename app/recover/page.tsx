"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/supabase.js";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage(`Enlace de recuperación enviado a ${email}. Revisa tu bandeja.`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Recuperar Contraseña</h1>
        <p className="text-slate-600 mb-6">Te enviaremos un enlace para reestablecer tu contraseña</p>

        <form onSubmit={handleRecovery} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email"
            required
            className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Enlace"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">Volver a iniciar sesión</Link>
        </p>

        {message && <p className="mt-4 p-3 bg-green-100 text-green-800 rounded">{message}</p>}
      </div>
    </main>
  );
}
