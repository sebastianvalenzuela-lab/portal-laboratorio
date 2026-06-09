import { readSheet } from '../../../lib/sheets';
import { cors } from '../../../lib/cors';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const labId = req.query.lab_id;
  if (!labId) return res.json({ ok: false, error: 'Falta lab_id en query' });
  try {
    const todos = await readSheet('INSCRIPCIONES');
    const inscritos = todos.filter(i => i.lab_id === labId);
    res.json({ ok: true, lab_id: labId, inscritos, total: inscritos.length });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
}
