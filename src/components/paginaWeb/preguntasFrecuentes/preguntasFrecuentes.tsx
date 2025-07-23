export default function PreguntasFrecuentes() {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-3xl font-semibold mb-10 text-center">Preguntas frecuentes</h3>
          <div className="space-y-6">
            <details className="border p-4 rounded">
              <summary className="font-medium cursor-pointer">¿Cómo agendo una cita?</summary>
              <p className="mt-2 text-gray-600">Solo da clic en ´Agendar cita´ y elige el especialista, fecha y hora.</p>
            </details>
            <details className="border p-4 rounded">
              <summary className="font-medium cursor-pointer">¿Puedo pagar en línea?</summary>
              <p className="mt-2 text-gray-600">Sí, aceptamos pagos con tarjeta a través de PayPal.</p>
            </details>
          </div>
        </div>
      </section>
    );
  }