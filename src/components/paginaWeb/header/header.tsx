export default function Header() {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-bold text-lg text-blue-700">Clínica Esymbel</h1>
          <nav className="space-x-6 text-sm text-gray-600">
            <a href="#servicios">Servicios</a>
            <a href="#especialistas">Especialistas</a>
            <a href="/public/agendar">Agendar</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>
      </header>
    );
  }