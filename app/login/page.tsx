"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/supabase.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Acceso correcto. Redirigiendo...");
      window.location.href = "/";
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) setMessage(error.message);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Acceder a DeporStar</h1>
        <p className="text-slate-600 mb-6">Elige tu forma de acceso</p>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mb-4"
          disabled={loading}
        >
          🔵 Entrar con Google
        </button>

        <div className="border-t my-4"></div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Acceder"}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-sm">
          <p><Link href="/recover" className="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</Link></p>
          <p><Link href="/support" className="text-blue-600 hover:underline">¿Necesitas soporte?</Link></p>
        </div>

        {message && <p className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</p>}
      </div>
    </main>
  );
}
