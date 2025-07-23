// src/app/public/page.tsx
import Header from '@/components/paginaWeb/header/header';
import Hero from '@/components/paginaWeb/hero/hero';
import Servicios from '@/components/paginaWeb/servicios/servicios';
import Especialistas from '@/components/paginaWeb/especialistas/especialistas';
// import CitasCTA from '@/components/CitasCTA';
import Testimonios from '@/components/paginaWeb/testimonios/testimonios';
import PreguntasFrecuentes from '@/components/paginaWeb/preguntasFrecuentes/preguntasFrecuentes';
import Contacto from '@/components/paginaWeb/contacto/contacto';
import Footer from '@/components/paginaWeb/footer/footer';

export default function PublicHomePage() {
  return (
    <>
      <Header />
      <main className="mt-16">
        <Hero />
        <Servicios />
        <Especialistas />
        
        <Testimonios />
        <PreguntasFrecuentes />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}