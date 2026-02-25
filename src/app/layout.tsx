import '@/styles/globals.css';
import '@/lib/fontawesome';
import type { Metadata } from 'next';
import LayoutClient from '@/components/layout/LayoutClient';

export const metadata: Metadata = {
  title: 'ESYMBEL MEDICAL - Gestión Integral para Clínicas y Hospitales',
  description: 'ESYMBEL MEDICAL es una plataforma de gestión integral diseñada para clínicas y hospitales. Ofrecemos soluciones para la administración de pacientes, citas, historial médico, facturación y contabilidad, todo en un solo lugar. Nuestra misión es optimizar los procesos administrativos y mejorar la experiencia tanto para el personal médico como para los pacientes.',
  keywords: ['clínica', 'hospital', 'gestión médica', 'citas médicas', 'historial clínico', 'facturación', 'contabilidad médica'],
  authors: [{ name: 'ESYMBEL MEDICAL' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'ESYMBEL MEDICAL - Gestión Integral para Clínicas y Hospitales',
    description: 'Plataforma de gestión integral para optimizar procesos administrativos en clínicas y hospitales',
    type: 'website',
    locale: 'es_MX',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen w-full bg-gray-100 lg:overflow-auto sm:overflow-auto">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}