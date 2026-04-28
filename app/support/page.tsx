import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Centro de Soporte</h1>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <h2 className="text-xl font-bold mb-2">❓ Acceso y Contraseñas</h2>
            <p className="text-slate-600 mb-2">¿Problemas para entrar?</p>
            <Link href="/login" className="text-blue-600 hover:underline">Ir a login</Link> | {" "}
            <Link href="/recover" className="text-blue-600 hover:underline">Recuperar contraseña</Link>
          </div>

          <div className="border-l-4 border-green-600 pl-4">
            <h2 className="text-xl font-bold mb-2">📧 Contacto Directo</h2>
            <p className="text-slate-600">Email: <strong>soporte@deporstar.com</strong></p>
            <p className="text-slate-600">WhatsApp: +57 XXX XXX XXXX</p>
          </div>

          <div className="border-l-4 border-purple-600 pl-4">
            <h2 className="text-xl font-bold mb-2">❓ Preguntas Frecuentes</h2>
            <ul className="list-disc pl-5 text-slate-600 space-y-2">
              <li>¿Cómo crear un torneo? Ve a "Torneos" y haz clic en "Crear".</li>
              <li>¿Cómo generar el fixture? Usa "Generador Fixture", ingresa equipos y genera.</li>
              <li>¿Cómo ver las estadísticas? Ve a "Estadísticas" para tabla y rankings.</li>
              <li>¿Cómo descargar reportes? En Estadísticas hay botón para descargar.</li>
            </ul>
          </div>

          <div className="border-l-4 border-orange-600 pl-4">
            <h2 className="text-xl font-bold mb-2">🎯 Comunidad</h2>
            <p className="text-slate-600">Únete a nuestro Discord para tips y soporte rápido.</p>
            <a href="#" className="text-blue-600 hover:underline">Discord de DeporStar</a>
          </div>
        </div>
      </div>
    </main>
  );
}
