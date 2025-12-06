import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const [nuevaCita, setNuevaCita] = useState({
    pacienteId: '',
    doctor: '',
    fecha: '',
    hora: ''
  });

  useEffect(() => {
    cargarPacientes();
    cargarCitas();
  }, []);

  const cargarPacientes = async () => {
    try {
      const response = await fetch(`${API_URL}/pacientes`);
      const data = await response.json();
      setPacientes(data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    }
  };

  const cargarCitas = async () => {
    try {
      const response = await fetch(`${API_URL}/citas`);
      const data = await response.json();
      setCitas(data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  };

  const registrarPaciente = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    try {
      const response = await fetch(`${API_URL}/pacientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPaciente)
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ tipo: 'success', texto: 'Paciente registrado exitosamente' });
        setNuevoPaciente({ nombre: '', email: '', telefono: '' });
        cargarPacientes();
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al registrar paciente' });
    }
  };

  const agendarCita = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    try {
      const response = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCita)
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ tipo: 'success', texto: 'Cita agendada exitosamente' });
        setNuevaCita({ pacienteId: '', doctor: '', fecha: '', hora: '' });
        cargarCitas();
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al agendar cita' });
    }
  };

  const cancelarCita = async (citaId) => {
    try {
      const response = await fetch(`${API_URL}/citas/${citaId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMensaje({ tipo: 'success', texto: 'Cita cancelada exitosamente' });
        cargarCitas();
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al cancelar cita' });
    }
  };

  return (
    <div className="container">
      <h1>Sistema de Citas Médicas</h1>

      {mensaje.texto && (
        <div className={mensaje.tipo} data-testid="mensaje">
          {mensaje.texto}
        </div>
      )}

      <div className="section">
        <h2>Registrar Paciente</h2>
        <form onSubmit={registrarPaciente}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              data-testid="input-nombre"
              value={nuevoPaciente.nombre}
              onChange={(e) => setNuevoPaciente({...nuevoPaciente, nombre: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              data-testid="input-email"
              value={nuevoPaciente.email}
              onChange={(e) => setNuevoPaciente({...nuevoPaciente, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="text"
              data-testid="input-telefono"
              value={nuevoPaciente.telefono}
              onChange={(e) => setNuevoPaciente({...nuevoPaciente, telefono: e.target.value})}
            />
          </div>
          <button type="submit" data-testid="btn-registrar-paciente">
            Registrar Paciente
          </button>
        </form>
      </div>

      <div className="section">
        <h2>Agendar Cita</h2>
        <form onSubmit={agendarCita}>
          <div className="form-group">
            <label>Paciente:</label>
            <select
              data-testid="select-paciente"
              value={nuevaCita.pacienteId}
              onChange={(e) => setNuevaCita({...nuevaCita, pacienteId: e.target.value})}
            >
              <option value="">Seleccione un paciente</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Doctor:</label>
            <select
              data-testid="select-doctor"
              value={nuevaCita.doctor}
              onChange={(e) => setNuevaCita({...nuevaCita, doctor: e.target.value})}
            >
              <option value="">Seleccione un doctor</option>
              <option value="Dr. García">Dr. García</option>
              <option value="Dra. Martínez">Dra. Martínez</option>
              <option value="Dr. López">Dr. López</option>
            </select>
          </div>
          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              data-testid="input-fecha"
              value={nuevaCita.fecha}
              onChange={(e) => setNuevaCita({...nuevaCita, fecha: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Hora:</label>
            <select
              data-testid="select-hora"
              value={nuevaCita.hora}
              onChange={(e) => setNuevaCita({...nuevaCita, hora: e.target.value})}
            >
              <option value="">Seleccione una hora</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
            </select>
          </div>
          <button type="submit" data-testid="btn-agendar-cita">
            Agendar Cita
          </button>
        </form>
      </div>

      <div className="section">
        <h2>Citas Agendadas</h2>
        <div className="citas-list">
          {citas.length === 0 ? (
            <div className="empty-state">No hay citas agendadas</div>
          ) : (
            citas.map(cita => (
              <div key={cita.id} className="cita-item" data-testid={`cita-${cita.id}`}>
                <div className="cita-info">
                  <p><strong>Paciente:</strong> {cita.pacienteNombre}</p>
                  <p><strong>Doctor:</strong> {cita.doctor}</p>
                  <p><strong>Fecha:</strong> {cita.fecha} - {cita.hora}</p>
                </div>
                <button
                  className="btn-cancelar"
                  data-testid={`btn-cancelar-${cita.id}`}
                  onClick={() => cancelarCita(cita.id)}
                >
                  Cancelar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
