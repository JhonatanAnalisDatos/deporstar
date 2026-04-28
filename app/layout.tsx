import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeporStar - Gestión de Torneos de Fútbol",
  description: "Plataforma completa para gestionar torneos de fútbol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <nav className="bg-slate-900 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
            <Link href="/" className="text-2xl font-bold">⚽ DeporStar</Link>
            <ul className="flex gap-4 flex-wrap text-sm md:text-base">
              <li><Link href="/torneos" className="hover:text-blue-400 transition">Torneos</Link></li>
              <li><Link href="/equipos" className="hover:text-blue-400 transition">Equipos</Link></li>
              <li><Link href="/jugadores" className="hover:text-blue-400 transition">Jugadores</Link></li>
              <li><Link href="/fixture" className="hover:text-blue-400 transition">Fixture</Link></li>
              <li><Link href="/partidos" className="hover:text-blue-400 transition">Partidos</Link></li>
              <li><Link href="/estadisticas" className="hover:text-blue-400 transition">Estadísticas</Link></li>
              <li><Link href="/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition">Acceder</Link></li>
            </ul>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
