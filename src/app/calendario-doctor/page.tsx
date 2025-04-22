    // app/calendario-doctor/page.tsx

import Calendar from '@/components/ui/full-calendar/full-calendar'; // Importa tu componente Calendar

export default function CalendarioDoctor() {
    return (
        <div className="w-full">
        <h1 className="text-2xl font-semibold mb-6">📅 Calendario del Doctor</h1>
   
        <Calendar /> {/* Renderiza el componente Calendar */}
        </div>
    );
}

