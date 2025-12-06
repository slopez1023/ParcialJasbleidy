# Sistema de Citas Médicas

Sistema de reserva de citas médicas con frontend en React y backend en Node.js/Express.

## Instalación

### Backend
```bash
cd backend
npm install
npm start
```

El servidor se ejecuta en http://localhost:3001

### Frontend
```bash
cd frontend
npm install
npm start
```

La aplicación se ejecuta en http://localhost:3000

### Pruebas E2E
```bash
npm install
npx playwright install
npm test
```

## Características

- Registro de pacientes con validación de email y teléfono
- Agendamiento de citas médicas
- Validación de horarios solapados
- Cancelación de citas
- Pruebas automatizadas E2E con Playwright

## API Endpoints

- POST /api/pacientes - Registrar paciente
- GET /api/pacientes - Listar pacientes
- POST /api/citas - Crear cita
- GET /api/citas - Listar citas activas
- DELETE /api/citas/:id - Cancelar cita
