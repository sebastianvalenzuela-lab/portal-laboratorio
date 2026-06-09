import { updateRow } from '../../lib/sheets';
import { cors } from '../../lib/cors';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  const { token, inscripcion_id, asistencia } = req.body || {};
  if (!token || !inscripcion_id || !asistencia)
    return res.json({ ok: false, error: 'Faltan campos: token, inscripcion_id, asistencia' });
  if (!['presente','ausente','pendiente'].includes(asistencia))
    return res.json({ ok: false, error: 'asistencia debe ser: presente, ausente o pendiente' });
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    if (!decoded.includes(':')) return res.json({ ok: false, error: 'Token inválido' });
  } catch { return res.json({ ok: false, error: 'Token malformado' }); }
  try {
    const updated = await updateRow('INSCRIPCIONES', 'inscripcion_id', inscripcion_id, { asistencia });
    if (!updated) return res.json({ ok: false, error: 'Inscripción no encontrada' });
    res.json({ ok: true, mensaje: 'Asistencia registrada', inscripcion_id, asistencia });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
}
