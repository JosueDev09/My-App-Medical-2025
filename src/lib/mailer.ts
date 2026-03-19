// utils/sendEmailWithQR.ts
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

export const sendEmailWithQR = async (email: string, folio: string) => {
  try {
    const qrData = `http://localhost:3000/asistencia/${folio}`; // puedes usar un folio directo también
    const qrImage = await QRCode.toDataURL(qrData);

    const transporter = nodemailer.createTransport({
    
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // tu correo
        pass: process.env.EMAIL_PASS  // tu contraseña o app password
      }
    });
   

  

   const html = `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f6f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 30px;">
      <h2 style="color: #2a9d8f; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">
        🏥 Esymbel Health
      </h2>
      <p>Hola,</p>
      <p>Tu cita médica ha sido registrada correctamente. Te adjuntamos el siguiente <strong>código QR</strong>, que deberás presentar el día de tu consulta para registrar tu asistencia.</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-weight: bold; color: #264653;">📎 Código QR:</p>
        <p style="font-size: 12px; color: #666;">(Adjunto en este correo como imagen)</p>
      </div>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;">

      <p style="font-size: 14px; color: #666;">
        Si tienes alguna duda o necesitas reprogramar tu cita, no dudes en contactarnos.
      </p>

      <p style="font-size: 14px; color: #666;">📧 contacto@esymbel.com</p>
      <p style="font-size: 14px; color: #666;">📞 +52 81 1234 5678</p>

      <p style="margin-top: 40px; font-size: 12px; color: #999; text-align: center;">
        Este mensaje fue enviado automáticamente por el sistema de gestión de citas de Esymbel Health.
      </p>
    </div>
  </div>
`;

   


    const mailOptions = {
      from: '"Esymbel Health" <no-reply@esymbel.com>',
      to: email,
      subject: 'Se generó tu QR para asistir a la cita',
      html: html,
      attachments: [
        {
          filename: `qr-${folio}.png`,
          content: qrImage.split("base64,")[1],
          encoding: 'base64'
        }
      ]
    };

   

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado con QR");
  } catch (err) {
    console.error("Error al enviar el correo con QR:", err);
    throw err;
  }
};

// Función para enviar notificación de nueva cita al doctor
export const sendDoctorAppointmentNotification = async (
  doctorEmail: string,
  doctorName: string,
  citaData: {
    nombrePaciente: string;
    fecha: string;
    hora: string;
    motivo: string;
    telefono: string;
    correo: string;
    edad: number;
    genero: string;
    especialidad: string;
  }
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const html = `
   <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nueva Cita Agendada</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f7fb; margin:0; padding:0;">
          <tr>
            <td align="center" style="padding:30px 15px;">
              
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; background-color:#ffffff; border-radius:16px; overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(90deg, #005eb6, #5f9efb); padding:28px 32px; text-align:center;">
                    <h1 style="margin:0; font-size:26px; line-height:32px; color:#ffffff; font-weight:bold;">
                      Nueva Cita Agendada
                    </h1>
                    <p style="margin:8px 0 0; font-size:14px; color:#eaf3ff;">
                     ${citaData.nombrePaciente} • Notificación del sistema
                    </p>
                  </td>
                </tr>

                <!-- Intro -->
                <tr>
                  <td style="padding:32px 32px 20px;">
                    <p style="margin:0 0 12px; font-size:16px; line-height:24px; color:#111827;">
                      Hola <strong>${doctorName}</strong>,
                    </p>
                    <p style="margin:0; font-size:15px; line-height:24px; color:#4b5563;">
                      Se ha agendado una nueva cita en tu calendario. Aquí tienes los detalles:
                    </p>
                  </td>
                </tr>

                <!-- Patient Card -->
                <tr>
                  <td style="padding:0 32px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fbff; border:1px solid #dbeafe; border-radius:12px;">
                      <tr>
                        <td style="padding:24px;">
                          <p style="margin:0 0 8px; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#2563eb; font-weight:bold;">
                            Paciente
                          </p>
                          <h2 style="margin:0 0 18px; font-size:24px; line-height:30px; color:#111827;">
                            ${citaData.nombrePaciente}
                          </h2>

                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="50%" style="padding:0 0 14px; vertical-align:top;">
                                <p style="margin:0 0 4px; font-size:12px; color:#6b7280; text-transform:uppercase;">Fecha</p>
                                <p style="margin:0; font-size:16px; color:#111827; font-weight:bold;">${citaData.fecha}</p>
                              </td>
                              <td width="50%" style="padding:0 0 14px; vertical-align:top;">
                                <p style="margin:0 0 4px; font-size:12px; color:#6b7280; text-transform:uppercase;">Hora</p>
                                <p style="margin:0; font-size:16px; color:#111827; font-weight:bold;">${citaData.hora}</p>
                              </td>
                            </tr>
                            <tr>
                              <td width="50%" style="padding:0 0 14px; vertical-align:top;">
                                <p style="margin:0 0 4px; font-size:12px; color:#6b7280; text-transform:uppercase;">Especialidad</p>
                                <p style="margin:0; font-size:15px; color:#111827;">${citaData.especialidad}</p>
                              </td>
                              <td width="50%" style="padding:0 0 14px; vertical-align:top;">
                                <p style="margin:0 0 4px; font-size:12px; color:#6b7280; text-transform:uppercase;">Teléfono</p>
                                <p style="margin:0; font-size:15px; color:#111827;">${citaData.telefono}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" style="vertical-align:top;">
                                <p style="margin:0 0 4px; font-size:12px; color:#6b7280; text-transform:uppercase;">Motivo de consulta</p>
                                <p style="margin:0; font-size:15px; line-height:22px; color:#111827;">
                                  ${citaData.motivo}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Optional notes -->
                <tr>
                  <td style="padding:0 32px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb; border-left:4px solid #60a5fa; border-radius:10px;">
                      <tr>
                        <td style="padding:18px 20px;">
                          <p style="margin:0 0 8px; font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; color:#6b7280;">
                            Notas / antecedentes
                          </p>
                          <p style="margin:0; font-size:14px; line-height:22px; color:#374151;">
                            ${citaData.motivo}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Location -->
                <tr>
                  <td style="padding:0 32px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px;">
                      <tr>
                        <td style="padding:20px;">
                          <p style="margin:0 0 6px; font-size:12px; color:#6b7280; text-transform:uppercase;">Ubicación</p>
                          <p style="margin:0 0 4px; font-size:15px; font-weight:bold; color:#111827;">1</p>
                          <p style="margin:0; font-size:14px; color:#6b7280;">ESYMBEL-MEDICAL</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA buttons -->
                <tr>
                  <td align="center" style="padding:10px 32px 32px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding-bottom:12px;">
                          <a href="" style="display:inline-block; background:linear-gradient(90deg, #005eb6, #5f9efb); color:#ffffff; text-decoration:none; font-size:15px; font-weight:bold; padding:14px 28px; border-radius:999px;">
                            Ver en mi agenda
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom:12px;">
                          <a href="" style="display:inline-block; background-color:#eef2f7; color:#1f2937; text-decoration:none; font-size:15px; font-weight:bold; padding:14px 28px; border-radius:999px;">
                            Agregar a mi calendario
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <a href="" style="display:inline-block; color:#005eb6; text-decoration:none; font-size:14px; font-weight:600;">
                            Solicitar reprogramación
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 32px; background-color:#f8fafc; border-top:1px solid #e5e7eb; text-align:center;">
                    <p style="margin:0 0 8px; font-size:14px; font-weight:bold; color:#111827;">
                     ESYMBEL-MEDICAL
                    </p>
                    <p style="margin:0 0 6px; font-size:12px; color:#6b7280;">
                      Este correo fue enviado automáticamente por el sistema de citas.
                    </p>
                    <p style="margin:0; font-size:12px; color:#9ca3af;">
                      © ${new Date().getFullYear()} ESYMBEL-MEDICAL. Todos los derechos reservados.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: '"Clinical Serenity - Sistema de Citas" <no-reply@esymbel.com>',
      to: doctorEmail,
      subject: `📅 Nueva Cita Agendada - ${citaData.nombrePaciente} | ${new Date(citaData.fecha).toLocaleDateString('es-MX')} ${citaData.hora}`,
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo de notificación enviado al doctor:", doctorEmail);
  } catch (err) {
    console.error("Error al enviar correo al doctor:", err);
    throw err;
  }
};
