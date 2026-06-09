# Portal Laboratorio — Vercel

Migración del flujo n8n a Next.js + Vercel.

## Estructura

```
pages/api/
  laboratorios.js          ← GET  /api/laboratorios
  inscribir.js             ← POST /api/inscribir
  mis-inscripciones.js     ← GET  /api/mis-inscripciones
  asistencia.js            ← POST /api/asistencia
  kuepa-talleres-buscar.js ← POST /api/kuepa-talleres-buscar
  tutor/
    login.js               ← POST /api/tutor/login
    inscritos.js           ← GET  /api/tutor/inscritos
lib/
  sheets.js   ← cliente Google Sheets
  cors.js     ← headers CORS
public/
  index.html  ← frontend (sin cambios de UI)
```

## Deploy en Vercel

### 1. Configura Google Service Account

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto (o usa uno existente)
3. Activa la API **Google Sheets API**
4. Ve a **IAM & Admin → Service Accounts → Crear**
5. Descarga el JSON de credenciales
6. Comparte tu Google Sheet con el email de la service account (editor)

### 2. Variables de entorno en Vercel

En el dashboard de Vercel → Settings → Environment Variables, agrega:

| Variable | Valor |
|---|---|
| `SPREADSHEET_ID` | `1SePRape8To0iDwv7hDUfcW5q3lCooc1D4qBn83bjYUs` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Contenido completo del JSON (una línea) |
| `SUPABASE_ANON_KEY` | Tu anon key de Supabase |

### 3. Deploy

```bash
# Instala Vercel CLI
npm i -g vercel

# En la carpeta del proyecto
vercel
```

O conecta el repositorio desde vercel.com → New Project → Import Git Repo.

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local
# Edita .env.local con tus credenciales reales
npm run dev
```

Abre http://localhost:3000
