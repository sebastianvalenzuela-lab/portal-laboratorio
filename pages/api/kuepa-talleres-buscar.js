import { cors } from '../../lib/cors';

const SUPABASE_URL = 'https://csdavuvgqkmvrmntnskz.supabase.co/rest/v1/SEGUIMIENTO%20ETDH';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  const body = req.body || {};
  const cedulaBuscar = (body.cedula || body.documento || '').toString().trim();
  if (!cedulaBuscar) return res.json({ found: false, error: 'Debe proporcionar una cédula' });
  try {
    const response = await fetch(SUPABASE_URL, { headers: { apikey: process.env.SUPABASE_ANON_KEY || '', Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY || ''}` } });
    const rows = await response.json();
    if (!Array.isArray(rows)) return res.json({ found: false, error: 'No hay datos' });
    const row = rows.find(r => {
      const keys = Object.keys(r);
      const k = keys.find(k => k.trim().toLowerCase().includes('cedula') || k.trim().toLowerCase().includes('documento') || k.trim().toLowerCase().includes('cc')) || 'cedula';
      return (r[k] || '').toString().trim() === cedulaBuscar;
    });
    if (!row) return res.json({ found: false, error: 'Cédula no encontrada' });
    res.json({ found: true, cedula: cedulaBuscar, nombre: (row.nombre || '').toString().trim(), correo: (row.correo_institucional || row.correo || '').toString().trim(), datos_completos: row });
  } catch (e) { res.status(500).json({ found: false, error: e.message }); }
}
