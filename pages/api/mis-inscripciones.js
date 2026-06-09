import { readSheet } from '../../lib/sheets';
import { cors } from '../../lib/cors';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const studentId = req.query.estudiante_id;
  if (!studentId) return res.json({ ok: false, error: 'Falta estudiante_id' });
  try {
    const all = await readSheet('INSCRIPCIONES');
    const inscripciones = all.filter(r => String(r.estudiante_id) === String(studentId));
    res.json({ ok: true, estudiante_id: studentId, inscripciones, total: inscripciones.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
