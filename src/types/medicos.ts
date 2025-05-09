export interface Medico {
    id: string | number;
    strNombre: string;
    strTelefono: string;
    strEmail: string;
    strDireccion: string;
    datFechaNacimiento: string; // o Date
    strSexo: "Masculino" | "Femenino" | "Otro";
    strEstatus: "Activo" | "Inactivo";
    strEspecialidad: string;
    strHorario: string; // o Date
    strConsultorio: string;
    strTipo: "Medico" | "Enfermero" | "Otro";
    strEspecialidadMedico: "General" | "Especialista" | "Otro";
    strLicencia: string;
    strCertificacion: string;
    strExperiencia: string;
    strIdiomas: string;
    strRedesSociales: string;
    strNotas: string;
    strImagen: string;
    strFirma: string;
    strFirmaDigital: string;
}