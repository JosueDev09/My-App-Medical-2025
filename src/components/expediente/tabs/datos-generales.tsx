"use client";

import { Mail, Phone, MapPin, Calendar, Droplet, Activity, Pill, AlertTriangle } from "lucide-react";

interface Paciente {
  intPaciente: number;
  strNombre: string;
  strGenero: string;
  intEdad: number;
  datFechaNacimiento: string;
  strEmail: string;
  strTelefono: string;
  strTipoSangre: string | null;
  strAlergias: string | null;
  strEnfermedadesCronicas: string | null;
  strMedicamentosActuales: string | null;
  strDireccion?: string | null;
  strCiudad?: string | null;
  strEstado?: string | null;
  strCodigoPostal?: string | null;
  strTelefonoEmergencia?: string | null;
}

interface DatosGeneralesProps {
  paciente: Paciente;
  onRefresh: () => void;
}

export default function DatosGenerales({ paciente, onRefresh }: DatosGeneralesProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Datos Generales del Paciente</h2>
        <p className="text-gray-600">Información demográfica y de contacto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Información Personal
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                <p className="font-medium text-gray-800">
                  {formatDate(paciente.datFechaNacimiento)}
                </p>
                <p className="text-xs text-gray-500">{paciente.intEdad} años</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Correo Electrónico</p>
                <p className="font-medium text-gray-800">
                  {paciente.strEmail || "No registrado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium text-gray-800">{paciente.strTelefono}</p>
              </div>
            </div>

            {paciente.strTelefonoEmergencia && (
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Teléfono de Emergencia</p>
                  <p className="font-medium text-gray-800">
                    {paciente.strTelefonoEmergencia}
                  </p>
                </div>
              </div>
            )}

            {(paciente.strDireccion || paciente.strCiudad || paciente.strEstado) && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="font-medium text-gray-800">
                    {paciente.strDireccion || "No registrada"}
                  </p>
                  {paciente.strCiudad && (
                    <p className="text-sm text-gray-600">
                      {paciente.strCiudad}
                      {paciente.strEstado && `, ${paciente.strEstado}`}
                      {paciente.strCodigoPostal && ` - CP ${paciente.strCodigoPostal}`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información Médica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Información Médica
          </h3>

          <div className="space-y-4">
            {paciente.strTipoSangre && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Droplet className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Sangre</p>
                    <p className="text-xl font-bold text-red-700">
                      {paciente.strTipoSangre}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paciente.strAlergias && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-800 mb-1">
                      ⚠️ ALERGIAS
                    </p>
                    <p className="text-sm text-gray-800">{paciente.strAlergias}</p>
                  </div>
                </div>
              </div>
            )}

            {paciente.strEnfermedadesCronicas && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-800 mb-1">
                      Enfermedades Crónicas
                    </p>
                    <p className="text-sm text-gray-800">
                      {paciente.strEnfermedadesCronicas}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paciente.strMedicamentosActuales && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Pill className="w-5 h-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      Medicamentos Actuales
                    </p>
                    <p className="text-sm text-gray-800">
                      {paciente.strMedicamentosActuales}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!paciente.strAlergias && 
             !paciente.strEnfermedadesCronicas && 
             !paciente.strMedicamentosActuales && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  No se ha registrado información médica adicional
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
