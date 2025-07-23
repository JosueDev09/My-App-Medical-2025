// components/Especialistas.tsx
export default function Especialistas() {
    return (
      <section id="especialistas" className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-semibold text-center mb-10">Conoce a nuestros especialistas</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded shadow text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full" />
                <h4 className="font-bold text-lg">Dr. Nombre {i + 1}</h4>
                <p className="text-gray-600 text-sm">Especialidad</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }