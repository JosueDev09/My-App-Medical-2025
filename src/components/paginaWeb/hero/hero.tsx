export default function Hero() {
    return (
        <section className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center text-center px-6">

        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Tu salud es nuestra prioridad</h2>
          <p className="mt-4 text-gray-600 text-lg">Consulta con especialistas certificados y agenda en línea</p>
          <a href="/public/agendar" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md">
            Agendar cita
          </a>
        </div>
      </section>
    );
  }