export interface Paciente {
    intPaciente: string | number;
    strNombre: string;
    strApellidoPaterno: string;
    strApellidoMaterno: string;
    strTelefono: string;
    strEmail: string;
    strDireccion: string;
    datFechaNacimiento: string; // o Date
    strSexo: "Masculino" | "Femenino" | "Otro";
    strEstatus: "Activo" | "Inactivo";
    datFechaRegistro: string; // o Date
    strCiudad: string; // Nuevo campo para ciudad del paciente
    strEstado: string; // Nuevo campo para estado del paciente

  }