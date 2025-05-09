"use client";
 
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { RegisterGoogle } from "../ui/register-google/register-google";
import Swal from "sweetalert2";
import handler from "@/pages/api/login";
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { useEffect } from "react";


export function FormRegister() {
    const [showPassword, setShowPassword] = useState(false);
    const [ErrorConfirmarContra, setErrorConfirmarContra] = useState('');
    const [strUsuario, setUsuario] = useState("");
    const [strNombre, setNombre] = useState("");
    const [strCorreo, setCorreo] = useState("");
    const [strContra, setContra] = useState("");
    const [strContraConfirmar, setContraConfirmar] = useState("");
    const [strTelefono, setTelefono] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const [errorNombre, setErrorNombre] = useState("");
    const [errorUsuario, setErrorUsuario] = useState("");
    const [errorCorreo, setErrorCorreo] = useState("");
    const [errorTelefono, setErrorTelefono] = useState("");
    const [errorContra, setErrorContra] = useState("");

   const handlerRegister = async (e: React.FormEvent) => {
       
        e.preventDefault();
        let hasError = false;
        if (!strUsuario.trim()) {
            setErrorUsuario('El usuario es obligatorio');
            hasError = true;
        }
        if (!strNombre.trim()) {
            setErrorNombre('El nombre es obligatorio');
            hasError = true;
        }
        if (!strCorreo.trim()) {
            setErrorCorreo('El correo es obligatorio');
            hasError = true;
        }
        if (!strTelefono.trim()) {
            setErrorTelefono('El telefono es obligatorio');
            hasError = true;
        }
        if (!strContra.trim()) {
            setErrorContra('La contraseña es obligatoria');
            hasError = true;
        }
        if (strContra !== strContraConfirmar) {
            setErrorConfirmarContra('Las contraseñas no coinciden');
            hasError = true;
        }

        if (hasError) return;

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ strUsuario, strNombre, strCorreo, strTelefono, strContra })
            });

            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.error || "Error al registrar.");
                return;
            }

            const data = await res.json();
            console.log("Registro exitoso:", data);
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'Tu cuenta ha sido creada con éxito.',
                    confirmButtonText: 'Entendido',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then(() => {
                    // Redirigir a la página de inicio de sesión o donde desees
                    router.push("/login"); // Cambia esto a la ruta deseada
                }
                );
           
            }
            
        } catch (error) {
            console.error("Error en el registro:", error);
        }
    }


    return (
        <form onSubmit={handlerRegister} className="space-y-4 w-full max-w-sm">
                       <input
                          type="text"
                          placeholder="Usuario"
                          className="w-full p-2 border rounded"
                          value={strUsuario}
                          onChange={(e) => setUsuario(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Nombre completo"
                          className="w-full p-2 border rounded"
                          value={strNombre}
                          onChange={(e) => setNombre(e.target.value)}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Correo"
                          className="w-full p-2 border rounded"
                          value={strCorreo}
                          onChange={(e) => setCorreo(e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Telefono"
                          className="w-full p-2 border rounded"
                          value={strTelefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          required
                        />
                         {/* Contraseña */}
                            <div className="relative">
                                <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                className={`w-full p-2 pr-10 border rounded ${
                                    errorContra ? "border-red-500" : "border-gray-300"
                                }`}
                                value={strContra}
                                onChange={(e) => {
                                    setContra(e.target.value);
                                    setErrorContra("");
                                }}
                                />
                                <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                                >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {errorContra && (
                                <p className="text-red-500 text-xs italic mt-1">{errorContra}</p>
                                )}
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="relative">
                                <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                className={`w-full p-2 pr-10 border rounded ${
                                    strContraConfirmar
                                    ? strContra === strContraConfirmar
                                        ? "border-green-500"
                                        : "border-red-500"
                                    : "border-gray-300"
                                }`}
                                value={strContraConfirmar}
                                onChange={(e) => {
                                    setContraConfirmar(e.target.value);
                                    setErrorConfirmarContra("");
                                }}
                                />

                                {/* Iconos */}
                                {strContraConfirmar && strContra === strContraConfirmar && (
                                <Check
                                    className="text-green-500 absolute top-1/2 right-3 transform -translate-y-1/2"
                                    size={18}
                                />
                                )}
                                {strContraConfirmar && strContra !== strContraConfirmar && (
                                <X
                                    className="text-red-500 absolute top-1/2 right-3 transform -translate-y-1/2"
                                    size={18}
                                />
                                )}

                                {ErrorConfirmarContra && (
                                <p className="text-red-500 text-xs italic mt-1">{ErrorConfirmarContra}</p>
                                )}
                            </div>
                        <button
                          type="submit"
                          className="w-full bg-blue-950 text-white py-2 rounded"
                        >
                          Registrarse
                        </button>
                        <RegisterGoogle />
            </form>
    );
}