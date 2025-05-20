import nodemailer from 'nodemailer';

export const sendCorreo = async (
  destinatario: string,
  asunto: string,
  html: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: destinatario,
      subject: asunto,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return { success: false, error };
  }
};
