export interface ReciboPagoProps {
    paciente: string;
    fecha: string;
    hora: string;
    especialidad: string;
    medico: string;
    metodoPago: 'efectivo' | 'transferencia';
    estatusPago: 'pendiente' | 'pagado';
    total: number;
    folio: string;
  }