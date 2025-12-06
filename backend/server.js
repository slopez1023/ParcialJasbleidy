const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let pacientes = [];
let citas = [];
let pacienteIdCounter = 1;
let citaIdCounter = 1;

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarTelefono(telefono) {
  const regex = /^[0-9]{10}$/;
  return regex.test(telefono);
}

function validarSolapamiento(doctor, fecha, hora, citaIdExcluir = null) {
  return citas.some(cita => 
    cita.id !== citaIdExcluir &&
    cita.doctor === doctor && 
    cita.fecha === fecha && 
    cita.hora === hora &&
    cita.estado !== 'cancelada'
  );
}

app.post('/api/pacientes', (req, res) => {
  const { nombre, email, telefono } = req.body;

  if (!nombre || !email || !telefono) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  if (!validarEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (!validarTelefono(telefono)) {
    return res.status(400).json({ error: 'Teléfono inválido. Debe tener 10 dígitos' });
  }

  const paciente = {
    id: pacienteIdCounter++,
    nombre,
    email,
    telefono
  };

  pacientes.push(paciente);
  res.status(201).json(paciente);
});

app.get('/api/pacientes', (req, res) => {
  res.json(pacientes);
});

app.post('/api/citas', (req, res) => {
  const { pacienteId, doctor, fecha, hora } = req.body;

  if (!pacienteId || !doctor || !fecha || !hora) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const paciente = pacientes.find(p => p.id === parseInt(pacienteId));
  if (!paciente) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  if (validarSolapamiento(doctor, fecha, hora)) {
    return res.status(409).json({ error: 'El horario ya está ocupado para este doctor' });
  }

  const cita = {
    id: citaIdCounter++,
    pacienteId: parseInt(pacienteId),
    pacienteNombre: paciente.nombre,
    doctor,
    fecha,
    hora,
    estado: 'activa'
  };

  citas.push(cita);
  res.status(201).json(cita);
});

app.get('/api/citas', (req, res) => {
  res.json(citas.filter(c => c.estado === 'activa'));
});

app.delete('/api/citas/:id', (req, res) => {
  const citaId = parseInt(req.params.id);
  const cita = citas.find(c => c.id === citaId);

  if (!cita) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  cita.estado = 'cancelada';
  res.json({ mensaje: 'Cita cancelada exitosamente' });
});

app.delete('/api/test/reset', (req, res) => {
  pacientes = [];
  citas = [];
  pacienteIdCounter = 1;
  citaIdCounter = 1;
  res.json({ mensaje: 'Datos reiniciados' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
