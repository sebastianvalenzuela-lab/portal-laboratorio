import { readSheet } from '../../lib/sheets';
import { cors } from '../../lib/cors';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (!process.env.SPREADSHEET_ID) throw new Error('Falta SPREADSHEET_ID');
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) throw new Error('Falta GOOGLE_SERVICE_ACCOUNT_JSON');
    const labs = await readSheet('DISPONIBLES');
    const result = labs
      .filter(l => (l.estado || '').toLowerCase() === 'activo')
      .map(l => ({
        lab_id: l.lab_id, nombre: l.nombre, descripcion: l.descripcion || '',
        fecha: l.fecha || '', hora_inicio: l.hora_inicio || '', hora_fin: l.hora_fin || '',
        tutor: l.tutor || '', cupo_total: Number(l.cupo_total) || 0,
        cupo_disponible: Number(l.cupo_disponible) || 0,
      }));
    res.json({ ok: true, laboratorios: result, total: result.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message, stack: e.stack?.split('\n').slice(0,3) });
  }
}
