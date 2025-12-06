# Casos de Prueba - Sistema de Citas Médicas

## Técnicas de Selección de Datos

### 1. Particiones de Equivalencia
- **Email válido**: formato correcto con @ y dominio
- **Email inválido**: sin @, sin dominio, formato incorrecto
- **Teléfono válido**: exactamente 10 dígitos numéricos
- **Teléfono inválido**: menos de 10, más de 10, con letras

### 2. Valores Límite
- **Teléfono**: probamos con 3 dígitos (muy corto), 10 dígitos (válido), 14 dígitos (muy largo)
- **Campos vacíos**: límite inferior de validación

### 3. Datos Válidos e Inválidos
- **Válidos**: datos que cumplen todas las reglas de negocio
- **Inválidos**: datos que violan al menos una regla

## Casos de Prueba Implementados

### Flujo Completo Exitoso
- Registrar paciente con datos válidos
- Agendar cita con paciente registrado
- Verificar que la cita aparece en la lista

### Validación de Email
- Email sin @: "email-invalido"
- Verifica que el sistema rechace el registro

### Validación de Teléfono
- Teléfono corto: "123" (3 dígitos)
- Teléfono largo: "12345678901234" (14 dígitos)
- Teléfono con letras: "123abc7890"
- Teléfono válido: "1234567890" (10 dígitos)

### Validación de Campos Vacíos
- Intento de registro sin llenar campos
- Intento de agendar cita sin seleccionar opciones

### Validación de Solapamiento
- Dos pacientes intentan agendar con el mismo doctor a la misma hora
- El segundo debe ser rechazado
- Mismo horario pero diferente doctor debe ser aceptado

### Cancelación de Citas
- Cancelar una cita existente
- Verificar que desaparece de la lista
- Verificar que el horario queda libre para nuevo agendamiento
