// components/FloatingChat.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { generarChatId } from "@/lib/generarChatId";

interface MensajeChat {
  rol: 'user' | 'asistente';
  texto: string;
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [chat, setChat] = useState<MensajeChat[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { data: session } = useSession();
   const chatId = generarChatId(session);
        useEffect(() => {
        if (session?.user?.rol) {
          setUserRole(session.user.rol.toLowerCase());
        } else {
          const roleMatch = document.cookie.match(/(^| )role=([^;]+)/);
          const role = roleMatch?.[2];
          if (role) {
            setUserRole(role.toLowerCase());
          }
        }
      }, [session]);

  const enviarPregunta = async () => {
    if (!mensaje) return;
    const pregunta = mensaje;
    setMensaje('');
    setCargando(true);
    setChat((prev) => [...prev, { rol: 'user', texto: pregunta }]);

    try {
      const res = await fetch('/api/asistente-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje: pregunta,
        chatId,
        rol: userRole // <-- aquí lo mandas

      }),
    });
      const data = await res.json();
      const respuesta = data.output || 'Sin respuesta.';
      setChat((prev) => [...prev, { rol: 'asistente', texto: respuesta }]);
    } catch {
      setChat((prev) => [...prev, { rol: 'asistente', texto: 'Error al contactar al asistente.' }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white rounded-full w-14 h-14 shadow-xl hover:bg-blue-700 text-2xl"
        >
          💬
        </button>
      ) : (
        <div className="floating-chat-box w-80 h-[450px] bg-white border rounded-xl shadow-2xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Asistente Médico</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-red-600"
            >✖</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 mb-2 pr-1">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  msg.rol === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.rol === 'asistente' && (
                  <span className="text-xl">🤖</span>
                )}
                <div
                  className={`p-2 rounded-lg text-sm max-w-[85%] ${
                    msg.rol === 'user'
                      ? 'bg-blue-100 text-right'
                      : 'bg-gray-100 text-left'
                  }`}
                >
                  {msg.texto}
                </div>
                {msg.rol === 'user' && (
                  <span className="text-xl">👤</span>
                )}
              </div>
            ))}
            {cargando && (
              <div className="text-gray-400 text-sm">Escribiendo...</div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarPregunta()}
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Escribe tu mensaje..."
            />
            <button
              onClick={enviarPregunta}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              disabled={cargando}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}