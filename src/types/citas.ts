export interface Cita {
    id: string | number;
    strPaciente: string;
    datFecha: string;          // o Date
    intHora: string;
    strDoctor: string;
    strEspecialidad: string;
    strEstatus: "Confirmada" | "Pendiente" | "Cancelada";
  }