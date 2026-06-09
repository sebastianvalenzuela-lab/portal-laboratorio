import { readSheet, appendRow, updateRow } from '../../lib/sheets';
import { cors } from '../../lib/cors';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  const { estudiante_id, nombre, email, lab_id } = req.body || {};
  if (!estudiante_id || !nombre || !email || !lab_id)
    return res.json({ ok: false, error: 'Faltan campos: estudiante_id, nombre, email, lab_id' });
  try {
    const inscripciones = await readSheet('INSCRIPCIONES');
    const existe = inscripciones.some(i => String(i.estudiante_id) === String(estudiante_id) && String(i.lab_id).trim() === String(lab_id).trim());
    if (existe) return res.json({ ok: false, error: 'Ya estás inscrito en este laboratorio' });
    const labs = await readSheet('DISPONIBLES');
    const lab = labs.find(l => String(l.lab_id).trim() === String(lab_id).trim());
    if (!lab) return res.json({ ok: false, error: 'Laboratorio no encontrado' });
    const cupoActual = Number(lab.cupo_disponible) || 0;
    if (cupoActual <= 0) return res.json({ ok: false, error: 'Sin cupos disponibles' });
    const ahora = new Date();
    const inscripcion_id = 'INS' + ahora.getTime();
    await appendRow('INSCRIPCIONES', { inscripcion_id, estudiante_id, nombre_estudiante: nombre, email, lab_id, fecha_inscripcion: ahora.toISOString().split('T')[0], asistencia: 'pendiente' });
    await updateRow('DISPONIBLES', 'lab_id', lab_id, { cupo_disponible: String(cupoActual - 1), cupo_ocupado: String((Number(lab.cupo_ocupado) || 0) + 1) });
    res.json({ ok: true, inscripcion_id, mensaje: 'Inscripción exitosa' });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
}
