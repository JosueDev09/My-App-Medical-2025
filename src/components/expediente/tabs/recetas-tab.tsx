"use client";

import { useState, useEffect } from "react";
import { Pill, Calendar, Eye, FileText, Stethoscope, Activity, Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Input } from "@/components/ui/input/input";

interface Consulta {
  intConsulta: number;
  intCita: number;
  datFechaConsulta: string;
  strMotivoConsulta: string;
  strDiagnostico: string;
  strTratamiento: string;
  strNombreDoctor: string;
  strApellidosDoctor: string;
  strNombreEspecialidad: string;
  strCedulaProfesional: string;
  strNombrePaciente: string;
  strApellidosPaciente: string;
  // Signos vitales
  dblPeso: string;
  dblTalla: string;
  strPresionArterial: string;
  dblTemperatura: string;
}

interface RecetasTabProps {
  intPaciente: number;
}

export default function RecetasTab({ intPaciente }: RecetasTabProps) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [modalReceta, setModalReceta] = useState(false);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<any>(null);
  const [recetaEditable, setRecetaEditable] = useState<{
    strDiagnostico: string;
    strTratamiento: string;
    strPresionArterial: string;
    dblTemperatura: string;
    dblPeso: string;
    dblTalla: string;
  }>({
    strDiagnostico: "",
    strTratamiento: "",
    strPresionArterial: "",
    dblTemperatura: "",
    dblPeso: "",
    dblTalla: ""
  });

  useEffect(() => {
    cargarConsultasFinalizadas();
  }, [intPaciente]);

  const cargarConsultasFinalizadas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expediente/consultas?intPaciente=${intPaciente}`);
      if (response.ok) {
        const data = await response.json();
        // Filtrar solo consultas finalizadas
        const finalizadas = (data.consultas || []).filter(
          (c: any) => c.strEstatusConsulta === "FINALIZADA"
        );
        setConsultas(finalizadas);
      }
    } catch (error) {
      console.error("Error al cargar consultas:", error);
    } finally {
      setLoading(false);
    }
  };

  const verReceta = async (consulta: Consulta) => {
    try {
      // Cargar datos completos de la consulta con signos vitales
      const response = await fetch(`/api/consultas/${consulta.intConsulta}`);
      if (response.ok) {
        const data = await response.json();
        setConsultaSeleccionada({ consulta: data.consulta });
        setRecetaEditable({
          strDiagnostico: data.consulta.strDiagnostico || "",
          strTratamiento: data.consulta.strTratamiento || "",
          strPresionArterial: data.consulta.strPresionArterial || "",
          dblTemperatura: data.consulta.dblTemperatura || "",
          dblPeso: data.consulta.dblPeso || "",
          dblTalla: data.consulta.dblTalla || "",
        });
        setModalReceta(true);
      }
    } catch (error) {
      console.error("Error al cargar receta:", error);
    }
  };

  const guardarReceta = async () => {
    if (!consultaSeleccionada) return;
    
    try {
      setGuardando(true);
      const response = await fetch(`/api/consultas/${consultaSeleccionada.consulta.intConsulta}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strDiagnostico: recetaEditable.strDiagnostico,
          strTratamiento: recetaEditable.strTratamiento,
          signosVitales: {
            strPresionArterial: recetaEditable.strPresionArterial,
            dblTemperatura: recetaEditable.dblTemperatura,
            dblPeso: recetaEditable.dblPeso,
            dblTalla: recetaEditable.dblTalla,
          }
        })
      });

      if (response.ok) {
        // Actualizar la consulta seleccionada con los nuevos valores
        setConsultaSeleccionada({
          consulta: {
            ...consultaSeleccionada.consulta,
            strDiagnostico: recetaEditable.strDiagnostico,
            strTratamiento: recetaEditable.strTratamiento,
            strPresionArterial: recetaEditable.strPresionArterial,
            dblTemperatura: recetaEditable.dblTemperatura,
            dblPeso: recetaEditable.dblPeso,
            dblTalla: recetaEditable.dblTalla,
          }
        });

        // Recargar lista de consultas
        await cargarConsultasFinalizadas();

        alert('✅ Receta actualizada exitosamente');
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error) {
      console.error('Error al guardar receta:', error);
      alert('❌ Error al guardar los cambios');
    } finally {
      setGuardando(false);
    }
  };

  const imprimirReceta = async () => {
    if (!consultaSeleccionada) return;
    
    try {
      const contenidoPDF = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Receta Médica - ${consultaSeleccionada.consulta.strNombrePaciente} ${consultaSeleccionada.consulta.strApellidosPaciente}</title>
          <style>
            @media print {
              @page {
                size: landscape;
                margin: 1cm;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 15px;
              color: #000;
              max-width: 100%;
              margin: 0;
              font-size: 11px;
            }
            
            .logo-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 5px;
            }
            
            .logo-box {
              width: 50px;
              height: 50px;
              border: 2px solid #000;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 30px;
            }
            
            .header {
              border-bottom: 2px solid #000;
              padding-bottom: 8px;
              margin-bottom: 10px;
              text-align: center;
            }
            
            .header h1 {
              margin: 0;
              font-size: 16px;
              font-weight: bold;
              text-transform: uppercase;
            }
            
            .header h2 {
              margin: 3px 0;
              font-size: 14px;
              font-weight: bold;
            }
            
            .header p {
              margin: 2px 0;
              font-size: 11px;
              color: #333;
            }
            
            .receta-titulo {
              text-align: center;
              margin: 8px 0;
              font-size: 14px;
              font-weight: bold;
              color: #000;
            }
            
            .info-paciente {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              margin-bottom: 12px;
              padding: 8px;
              background: #f9f9f9;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            
            .info-item {
              font-size: 10px;
              padding: 2px;
            }
            
            .info-item strong {
              font-weight: bold;
              color: #000;
            }
            
            .seccion {
              margin-bottom: 12px;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              background: #fff;
              min-height: 60px;
            }
            
            .seccion h3 {
              font-size: 12px;
              font-weight: bold;
              margin: 0 0 6px 0;
              color: #000;
              border-bottom: 1px solid #000;
              padding-bottom: 3px;
            }
            
            .seccion p {
              font-size: 11px;
              line-height: 1.4;
              white-space: pre-wrap;
              margin: 0;
              color: #000;
            }
            
            .footer {
              border-top: 2px solid #000;
              padding-top: 10px;
              margin-top: 15px;
              text-align: center;
            }
            
            .footer p {
              margin: 2px 0;
              font-size: 10px;
            }
            
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 80px;
              color: rgba(0, 0, 0, 0.03);
              z-index: -1;
            }
          </style>
        </head>
        <body>
          <div class="watermark">⚕</div>
          
          <div class="logo-header">
            <div class="logo-box">🩺</div>
            <div style="flex: 1;"></div>
            <div class="logo-box">⚕</div>
          </div>
          
          <div class="header">
            <h1>CONSULTORIO MÉDICO</h1>
            <h2>DR(A). ${consultaSeleccionada.consulta.strNombreDoctor.toUpperCase()} ${consultaSeleccionada.consulta.strApellidosDoctor.toUpperCase()}</h2>
            ${consultaSeleccionada.consulta.strNombreEspecialidad ? `<p><strong>${consultaSeleccionada.consulta.strNombreEspecialidad}</strong></p>` : ''}
            ${consultaSeleccionada.consulta.strCedulaProfesional ? `<p>Cédula Profesional: ${consultaSeleccionada.consulta.strCedulaProfesional}</p>` : ''}
          </div>

          <div class="receta-titulo">📋 RECETA MÉDICA</div>

          <div class="info-paciente">
            <div class="info-item" style="grid-column: span 2;">
              <strong>👤 Paciente:</strong> ${consultaSeleccionada.consulta.strNombrePaciente} ${consultaSeleccionada.consulta.strApellidosPaciente || ''}
            </div>
            <div class="info-item">
              <strong>📅 Fecha:</strong> ${new Date(consultaSeleccionada.consulta.datFechaConsulta).toLocaleDateString('es-MX', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </div>
            <div class="info-item">
              <strong>⚖️ Peso:</strong> ${recetaEditable.dblPeso ? `${recetaEditable.dblPeso} kg` : '_____'}
            </div>
            <div class="info-item">
              <strong>💓 TA:</strong> ${recetaEditable.strPresionArterial || '_____'}
            </div>
            <div class="info-item">
              <strong>🌡️ Temp:</strong> ${recetaEditable.dblTemperatura ? `${recetaEditable.dblTemperatura} °C` : '_____'}
            </div>
            <div class="info-item">
              <strong>📏 Talla:</strong> ${recetaEditable.dblTalla ? `${recetaEditable.dblTalla} m` : '_____'}
            </div>
          </div>

          <div class="seccion">
            <h3>🔍 DIAGNÓSTICO</h3>
            <p>${recetaEditable.strDiagnostico || ''}</p>
          </div>

          <div class="seccion">
            <h3>💊 TRATAMIENTO / PRESCRIPCIÓN</h3>
            <p>${recetaEditable.strTratamiento || ''}</p>
          </div>

          <div class="footer">
            <p style="font-size: 12px;"><strong>_______________________________________</strong></p>
            <p style="font-size: 11px;"><strong>${consultaSeleccionada.consulta.strNombreDoctor} ${consultaSeleccionada.consulta.strApellidosDoctor}</strong></p>
            <p style="font-size: 10px;"><em>${consultaSeleccionada.consulta.strNombreEspecialidad || 'Medicina General'}</em></p>
            ${consultaSeleccionada.consulta.strCedulaProfesional ? `<p style="font-size: 9px;">Cédula: ${consultaSeleccionada.consulta.strCedulaProfesional}</p>` : ''}
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([contenidoPDF], { type: 'text/html; charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const ventanaImpresion = window.open(url, '_blank');
      if (ventanaImpresion) {
        ventanaImpresion.onload = () => {
          setTimeout(() => {
            ventanaImpresion.print();
          }, 250);
        };
      }
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar la receta");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Recetas Médicas</h2>
            <p className="text-gray-600">Historial de recetas de consultas finalizadas</p>
          </div>
        </div>

        {consultas.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Pill className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No hay recetas médicas registradas</p>
            <p className="text-sm text-gray-500 mt-1">
              Las recetas se generan automáticamente desde las consultas finalizadas
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultas.map((consulta) => (
              <div
                key={consulta.intConsulta}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-800">
                        {new Date(consulta.datFechaConsulta).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        RECETA DISPONIBLE
                      </span>
                    </div>

                    <div className="ml-8 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Stethoscope className="w-4 h-4" />
                        <span>Dr. {consulta.strNombreDoctor} {consulta.strApellidosDoctor}</span>
                        <span>•</span>
                        <span>{consulta.strNombreEspecialidad}</span>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">Motivo:</span>{" "}
                        <span className="text-gray-700">{consulta.strMotivoConsulta}</span>
                      </div>

                      {consulta.strDiagnostico && (
                        <div className="text-sm">
                          <span className="font-medium">Diagnóstico:</span>{" "}
                          <span className="text-gray-700">{consulta.strDiagnostico}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => verReceta(consulta)}
                    className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Receta
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Receta Médica */}
      <Dialog open={modalReceta} onOpenChange={setModalReceta}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto print:max-w-full">
          <DialogHeader className="print:hidden">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              Receta Médica
            </DialogTitle>
          </DialogHeader>

          {consultaSeleccionada && (
            <div className="print:text-black">
              {/* Formato de Receta Profesional */}
              <div className="bg-white p-6 sm:p-8 print:p-8">
                
                {/* Encabezado con logos y título */}
                <div className="border-b-2 border-gray-800 pb-4 mb-6 print:border-black">
                  <div className="flex items-start justify-between gap-4">
                    {/* Logo izquierdo - Placeholder */}
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-800 rounded flex items-center justify-center print:border-black">
                      <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" />
                    </div>

                    {/* Información central */}
                    <div className="flex-1 text-center">
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">CONSULTORIO MÉDICO</h1>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                        DR(A). {consultaSeleccionada.consulta.strNombreDoctor.toUpperCase()} {consultaSeleccionada.consulta.strApellidosDoctor.toUpperCase()}
                      </h2>
                      {consultaSeleccionada.consulta.strNombreEspecialidad && (
                        <p className="text-xs sm:text-sm text-gray-700">
                          {consultaSeleccionada.consulta.strNombreEspecialidad}
                        </p>
                      )}
                      <p className="mr-[190px] mt-[15px] text-xs sm:text-sm text-black font-bold">
                        Cédula profesional: <span className="text-black font-light"> {consultaSeleccionada.consulta.strCedulaProfesional} </span>
                      </p>
                    </div>

                    {/* Logo derecho - Caduceo médico */}
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                      <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Sección R.P. (Receta/Prescripción) */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Receta Médica</h3>
                  </div>

                  {/* Área de la receta con marca de agua */}
                  <div className="relative min-h-[300px] sm:min-h-[400px] border border-gray-300 p-4 sm:p-6 rounded print:border-gray-600">
                    {/* Marca de agua de fondo */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none print:opacity-10">
                      <Activity className="w-48 h-48 sm:w-64 sm:h-64 text-gray-400 transform rotate-12" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 text-xs sm:text-sm mb-[50px]">
                      <div className="lg:col-span-2">
                        <span className="text-lg font-bold">Nombre:</span> <span className="text-lg">{consultaSeleccionada.consulta.strNombrePaciente} </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold whitespace-nowrap">TA:</span> 
                        <Input
                          value={recetaEditable.strPresionArterial ?? ""}
                          onChange={(e) => setRecetaEditable({...recetaEditable, strPresionArterial: e.target.value})}
                          placeholder="120/80"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold whitespace-nowrap">Temp:</span> 
                        <Input
                          value={recetaEditable.dblTemperatura ?? ""}
                          onChange={(e) => setRecetaEditable({...recetaEditable, dblTemperatura: e.target.value})}
                          placeholder="36.5"
                          className="h-8 text-sm"
                          type="number"
                          step="0.1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold whitespace-nowrap">Peso:</span> 
                        <Input
                          value={recetaEditable.dblPeso ?? ""}
                          onChange={(e) => setRecetaEditable({...recetaEditable, dblPeso: e.target.value})}
                          placeholder="70"
                          className="h-8 text-sm"
                          type="number"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <span className="font-bold">Fecha:</span> <span className="text-lg">{new Date(consultaSeleccionada.consulta.datFechaConsulta).toLocaleDateString('es-MX')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold whitespace-nowrap">Talla:</span> 
                        <Input
                          value={recetaEditable.dblTalla ?? ""}
                          onChange={(e) => setRecetaEditable({...recetaEditable, dblTalla: e.target.value})}
                          placeholder="1.75"
                          className="h-8 text-sm"
                          type="number"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Contenido de la receta */}
                    <div className="relative z-10">
                      {/* Diagnóstico */}
                      <div className="mb-4">
                        <p className="font-bold text-gray-900 mb-1">Diagnóstico:</p>
                        <Textarea
                          value={recetaEditable.strDiagnostico ?? ""}
                          onChange={(e) => setRecetaEditable({...recetaEditable, strDiagnostico: e.target.value})}
                          placeholder="Escriba el diagnóstico..."
                          className="min-h-[100px] text-sm sm:text-base"
                        />
                      </div>

                      {/* Tratamiento/Receta */}
                      <div className="mb-4">
                        <p className="font-bold text-gray-900 mb-1">Tratamiento:</p>
                        <Textarea
                          value={recetaEditable.strTratamiento ?? ""}
                          onChange={(e) => setRecetaEditable({...recetaEditable, strTratamiento: e.target.value})}
                          placeholder="Escriba el tratamiento..."
                          className="min-h-[150px] text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pie de página con información del médico */}
                <div className="border-t-2 border-gray-800 pt-4 mt-8 print:border-black">
                  <div className="text-xs sm:text-sm text-gray-700 text-center">
                    <p className="font-bold mb-1">
                      {consultaSeleccionada.consulta.strNombreDoctor} {consultaSeleccionada.consulta.strApellidosDoctor}
                    </p>
                    <p className="text-gray-600">
                      {consultaSeleccionada.consulta.strNombreEspecialidad || 'Medicina General'}
                    </p>
                    <p className="text-gray-600 mt-1">
                      Consultorio Médico • Teléfono: [Contacto] • Email: [Correo]
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones - Solo visible en pantalla */}
              <div className="flex gap-3 justify-end pt-4 border-t print:hidden">
                <Button
                  variant="outline"
                  onClick={() => setModalReceta(false)}
                  disabled={guardando}
                >
                  Cerrar
                </Button>
                <Button
                  onClick={guardarReceta}
                  disabled={guardando}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button
                  onClick={imprimirReceta}
                  disabled={guardando}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Receta
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
