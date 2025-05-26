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
