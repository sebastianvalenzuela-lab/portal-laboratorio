import { readSheet } from '../../../lib/sheets';
import { cors } from '../../../lib/cors';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  const { usuario, password } = req.body || {};
  const usuarioInput = (usuario || '').toString().trim().toLowerCase();
  const passwordInput = (password || '').toString().trim();
  try {
    const tutores = await readSheet('TUTORES');
    const tutor = tutores.find(t => {
      const keys = Object.keys(t);
      const userKey = keys.find(k => k.trim().toLowerCase() === 'usuario') || 'usuario';
      const pwKey = keys.find(k => k.trim().toLowerCase() === 'password') || 'password';
      return (t[userKey] || '').toString().trim().toLowerCase() === usuarioInput
        && (t[pwKey] || '').toString().trim() === passwordInput;
    });
    if (!tutor) return res.json({ ok: false, error: 'Usuario o contraseña incorrectos' });
    const token = Buffer.from(`${tutor.usuario}:${tutor.lab_asignado}:${Date.now()}`).toString('base64');
    res.json({ ok: true, nombre: tutor.nombre || '', usuario: tutor.usuario || '', lab_asignado: tutor.lab_asignado || '', token });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
}
