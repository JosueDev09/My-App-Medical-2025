# Componente Autocomplete de Pacientes

## 📋 Descripción

El componente `AutocompletePacientes` es un campo de búsqueda inteligente que permite buscar pacientes existentes en la base de datos mientras el usuario escribe. Si el paciente existe, se pueden autocompletar sus datos; si no existe, el formulario permite registrar un nuevo paciente.

## ✨ Características

- **Búsqueda en tiempo real**: Busca pacientes mientras escribes (con debounce de 300ms)
- **Auto-completado**: Rellena automáticamente los campos del formulario cuando se selecciona un paciente
- **Indicador visual**: Muestra cuándo un paciente existente ha sido seleccionado
- **Bloqueo de campos**: Los datos del paciente existente no pueden ser editados
- **Creación de nuevos pacientes**: Si no se encuentra el paciente, permite registrar uno nuevo
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 🚀 Uso

### Importación

```tsx
import AutocompletePacientes from '@/components/ui/autocomplete/autocomplete-pacientes';
```

### Ejemplo básico

```tsx
const [nombrePaciente, setNombrePaciente] = useState('');
const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

<AutocompletePacientes
  value={nombrePaciente}
  onChange={setNombrePaciente}
  onSelectPaciente={(paciente) => {
    setPacienteSeleccionado(paciente);
    if (paciente) {
      // Auto-completar otros campos del formulario
      setEmail(paciente.strEmail);
      setTelefono(paciente.strTelefono);
    }
  }}
  error={errores.nombre}
/>
```

## 📊 Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `value` | `string` | ✅ | Valor actual del input |
| `onChange` | `(value: string) => void` | ✅ | Función para actualizar el valor |
| `onSelectPaciente` | `(paciente: Paciente \| null) => void` | ❌ | Callback cuando se selecciona/deselecciona un paciente |
| `error` | `string` | ❌ | Mensaje de error a mostrar |
| `className` | `string` | ❌ | Clases CSS adicionales |

## 🔌 API Endpoint

El componente consume el endpoint: `GET /api/pacientes?tipo=buscar&nombre={termino}`

### Respuesta esperada:

```json
{
  "success": true,
  "data": [
    {
      "intPaciente": 1,
      "strNombre": "Juan",
      "strApellidoPaterno": "Pérez",
      "strApellidoMaterno": "García",
      "strEmail": "juan@example.com",
      "strTelefono": "5551234567",
      "strGenero": "MASCULINO",
      "datFechaNacimiento": "1990-01-15"
    }
  ]
}
```

## 🎨 Estados visuales

### 1. Búsqueda activa
- Muestra un spinner de carga mientras busca

### 2. Resultados encontrados
- Lista de pacientes con:
  - Nombre completo
  - Email y teléfono
  - Edad calculada
  - Género

### 3. Sin resultados
- Mensaje informativo sugiriendo crear un nuevo paciente

### 4. Paciente seleccionado
- Banner verde confirmando la selección
- Los campos relacionados se bloquean para edición

## 💡 Ejemplo completo de integración

```tsx
'use client';

import { useState } from 'react';
import AutocompletePacientes from '@/components/ui/autocomplete/autocomplete-pacientes';

export default function FormularioCita() {
  const [form, setForm] = useState({
    intPaciente: 0,
    strNombrePaciente: '',
    strEmail: '',
    strTelefono: '',
    intEdad: 0,
    strGenero: '',
  });
  
  const [pacienteExistente, setPacienteExistente] = useState(null);

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  };

  return (
    <form>
      {/* Autocomplete de paciente */}
      <AutocompletePacientes
        value={form.strNombrePaciente}
        onChange={(value) => setForm({ ...form, strNombrePaciente: value })}
        onSelectPaciente={(paciente) => {
          setPacienteExistente(paciente);
          if (paciente) {
            const edad = calcularEdad(paciente.datFechaNacimiento);
            setForm({
              ...form,
              intPaciente: paciente.intPaciente,
              strNombrePaciente: `${paciente.strNombre} ${paciente.strApellidoPaterno || ''} ${paciente.strApellidoMaterno || ''}`.trim(),
              strEmail: paciente.strEmail,
              strTelefono: paciente.strTelefono,
              intEdad: edad,
              strGenero: paciente.strGenero,
            });
          } else {
            setForm({ ...form, intPaciente: 0 });
          }
        }}
      />
      
      {/* Otros campos del formulario */}
      <input 
        type="email" 
        value={form.strEmail}
        disabled={!!pacienteExistente}
        onChange={(e) => setForm({ ...form, strEmail: e.target.value })}
      />
      
      <input 
        type="tel" 
        value={form.strTelefono}
        disabled={!!pacienteExistente}
        onChange={(e) => setForm({ ...form, strTelefono: e.target.value })}
      />
    </form>
  );
}
```

## 🔍 Funcionamiento interno

1. **Debounce**: Espera 300ms después de que el usuario deja de escribir antes de hacer la búsqueda
2. **Mínimo de caracteres**: Requiere al menos 2 caracteres para iniciar la búsqueda
3. **Click outside**: Cierra las sugerencias al hacer click fuera del componente
4. **Deselección**: Si el usuario modifica el nombre después de seleccionar, se deselecciona el paciente

## 🎯 Ventajas

- ✅ Evita duplicados de pacientes
- ✅ Mejora la experiencia del usuario
- ✅ Reduce errores de captura
- ✅ Acelera el proceso de registro de citas
- ✅ Mantiene consistencia en los datos

## 🔧 Mantenimiento

### Para modificar el diseño de las sugerencias
Edita la sección del `map` en el componente:

```tsx
{sugerencias.map((paciente) => (
  <div key={paciente.intPaciente} className="...">
    {/* Personaliza aquí */}
  </div>
))}
```

### Para cambiar el tiempo de debounce
Modifica el valor en el `setTimeout`:

```tsx
const timeoutId = setTimeout(buscarPacientes, 300); // Cambiar 300 por el valor deseado
```

### Para ajustar el número mínimo de caracteres
Modifica la condición en `buscarPacientes`:

```tsx
if (value.length < 2) { // Cambiar 2 por el valor deseado
  setSugerencias([]);
  return;
}
```
