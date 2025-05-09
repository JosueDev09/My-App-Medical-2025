export interface Paciente {
    id: string | number;
    strNombre: string;
    strApellido: string;
    strTelefono: string;
    strEmail: string;
    strDireccion: string;
    datFechaNacimiento: string; // o Date
    strSexo: "Masculino" | "Femenino" | "Otro";
    strEstatus: "Activo" | "Inactivo";
  }