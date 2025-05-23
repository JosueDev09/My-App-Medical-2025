'use client';

export default function formatearFechaLarga(fechaISO: string): string {
    const fecha = new Date(fechaISO);
  
    // Opciones de formato en español
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
  
    // Formatear con locale 'es-MX' o 'es-ES'
    return fecha.toLocaleDateString('es-MX', opciones);
  }