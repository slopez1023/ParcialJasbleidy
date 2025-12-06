const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ request }) => {
  await request.delete('http://localhost:3001/api/test/reset');
});

test.describe('Flujo completo de registro y agendamiento', () => {
  test('debe permitir registrar paciente y agendar cita exitosamente', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-nombre').fill('Alejandro Ramírez');
    await page.getByTestId('input-email').fill('alejandro.ramirez@hospital.com');
    await page.getByTestId('input-telefono').fill('3201234567');
    await page.getByTestId('btn-registrar-paciente').click();

    await expect(page.getByTestId('mensaje')).toContainText('Paciente registrado exitosamente');

    await page.getByTestId('select-paciente').selectOption({ label: 'Alejandro Ramírez' });
    await page.getByTestId('select-doctor').selectOption('Dr. García');
    await page.getByTestId('input-fecha').fill('2025-12-15');
    await page.getByTestId('select-hora').selectOption('10:00');
    await page.getByTestId('btn-agendar-cita').click();

    await expect(page.getByTestId('mensaje')).toContainText('Cita agendada exitosamente');
    await expect(page.getByTestId('cita-1')).toBeVisible();
    await expect(page.getByTestId('cita-1')).toContainText('Alejandro Ramírez');
    await expect(page.getByTestId('cita-1')).toContainText('Dr. García');
  });
});

test.describe('Validación de datos incorrectos', () => {
  test('debe rechazar email inválido', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-nombre').fill('Valentina Moreno');
    await page.getByTestId('input-email').fill('email-sin-formato');
    await page.getByTestId('input-telefono').fill('3159876543');
    await page.getByTestId('btn-registrar-paciente').click();

    await expect(page.getByTestId('mensaje')).toContainText('Email inválido');
  });

  test('debe rechazar teléfono inválido', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-nombre').fill('Santiago Herrera');
    await page.getByTestId('input-email').fill('santiago.herrera@clinica.com');
    await page.getByTestId('input-telefono').fill('320');
    await page.getByTestId('btn-registrar-paciente').click();

    await expect(page.getByTestId('mensaje')).toContainText('Teléfono inválido');
  });

  test('debe rechazar campos vacíos', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('btn-registrar-paciente').click();

    await expect(page.getByTestId('mensaje')).toContainText('Todos los campos son requeridos');
  });
});

test.describe('Validación de horarios solapados', () => {
  test('debe rechazar cita en horario ya ocupado', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-nombre').fill('Camila Rodríguez');
    await page.getByTestId('input-email').fill('camila.rodriguez@correo.com');
    await page.getByTestId('input-telefono').fill('3145678901');
    await page.getByTestId('btn-registrar-paciente').click();

    await page.getByTestId('select-paciente').selectOption({ label: 'Camila Rodríguez' });
    await page.getByTestId('select-doctor').selectOption('Dra. Martínez');
    await page.getByTestId('input-fecha').fill('2025-12-20');
    await page.getByTestId('select-hora').selectOption('14:00');
    await page.getByTestId('btn-agendar-cita').click();

    await expect(page.getByTestId('mensaje')).toContainText('Cita agendada exitosamente');

    await page.getByTestId('input-nombre').fill('Mateo Jiménez');
    await page.getByTestId('input-email').fill('mateo.jimenez@email.com');
    await page.getByTestId('input-telefono').fill('3187654321');
    await page.getByTestId('btn-registrar-paciente').click();

    await page.getByTestId('select-paciente').selectOption({ label: 'Mateo Jiménez' });
    await page.getByTestId('select-doctor').selectOption('Dra. Martínez');
    await page.getByTestId('input-fecha').fill('2025-12-20');
    await page.getByTestId('select-hora').selectOption('14:00');
    await page.getByTestId('btn-agendar-cita').click();

    await expect(page.getByTestId('mensaje')).toContainText('El horario ya está ocupado para este doctor');
  });
});

test.describe('Cancelación de citas', () => {
  test('debe permitir cancelar cita y liberar horario', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-nombre').fill('Isabella Castro');
    await page.getByTestId('input-email').fill('isabella.castro@medico.com');
    await page.getByTestId('input-telefono').fill('3001112233');
    await page.getByTestId('btn-registrar-paciente').click();

    await page.getByTestId('select-paciente').selectOption({ label: 'Isabella Castro' });
    await page.getByTestId('select-doctor').selectOption('Dr. García');
    await page.getByTestId('input-fecha').fill('2025-12-30');
    await page.getByTestId('select-hora').selectOption('16:00');
    await page.getByTestId('btn-agendar-cita').click();

    await expect(page.getByTestId('cita-1')).toBeVisible();

    await page.getByTestId('btn-cancelar-1').click();

    await expect(page.getByTestId('mensaje')).toContainText('Cita cancelada exitosamente');
    await expect(page.getByTestId('cita-1')).not.toBeVisible();

    await page.getByTestId('input-nombre').fill('Sebastián Vargas');
    await page.getByTestId('input-email').fill('sebastian.vargas@paciente.com');
    await page.getByTestId('input-telefono').fill('3112223344');
    await page.getByTestId('btn-registrar-paciente').click();

    await page.getByTestId('select-paciente').selectOption({ label: 'Sebastián Vargas' });
    await page.getByTestId('select-doctor').selectOption('Dr. García');
    await page.getByTestId('input-fecha').fill('2025-12-30');
    await page.getByTestId('select-hora').selectOption('16:00');
    await page.getByTestId('btn-agendar-cita').click();

    await expect(page.getByTestId('mensaje')).toContainText('Cita agendada exitosamente');
  });
});
