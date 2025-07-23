export default function Servicios() {
    const servicios = [
      { icon: '🩻', title: 'Consultas generales' },
      { icon: '🩺', title: 'Especialidades médicas' },
      { icon: '💉', title: 'Laboratorio clínico' },
    ];
  
    return (
      <section id="servicios" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-semibold mb-10 text-center">Nuestros servicios</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {servicios.map((s, i) => (
              <div key={i} className="text-center p-6 border rounded-md shadow-sm">
                <div className="text-5xl mb-4">{s.icon}</div>
                <h4 className="text-xl font-medium">{s.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }