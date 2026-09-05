# Panel personal — despliegue en Netlify + Supabase

## 1) Crear el backend en Supabase (guarda tus datos)

1. Entrá a https://supabase.com → creá una cuenta gratis → **New project**.
2. Ponele un nombre (ej: "panel-personal") y una contraseña de base de datos (guardala, no la vas a necesitar de nuevo para esto pero por las dudas).
3. Cuando el proyecto esté listo, andá a **SQL Editor** (menú izquierdo) → **New query**.
4. Abrí el archivo `supabase_schema.sql` de esta carpeta, copiá todo su contenido, pegalo ahí y tocá **Run**. Esto crea la tabla donde se guarda todo lo del panel.
5. Andá a **Project Settings** (ícono de engranaje) → **API**. Ahí vas a ver dos datos que necesitás:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una key larga)

Guardá esos dos datos, los vas a usar en el paso 3.

## 2) Subir el código a GitHub (Netlify lo pide para conectar el repo)

1. Creá un repositorio nuevo en GitHub (puede ser privado).
2. Subí **todos los archivos de esta carpeta** tal cual están (con la estructura de carpetas incluida: `src/`, `public/`, `package.json`, etc.).
   - Si no usás git desde la terminal, podés arrastrar los archivos directo en la web de GitHub ("Add file" → "Upload files").

## 3) Desplegar en Netlify

1. Entrá a https://netlify.com → **Add new site** → **Import an existing project** → elegí GitHub y seleccioná el repositorio que subiste.
2. Netlify va a detectar solo el `netlify.toml` (build command `npm run build`, carpeta publicada `dist`). No hace falta tocar nada ahí.
3. **Antes de desplegar** (o después, en Site settings → Environment variables), agregá estas dos variables:
   - `VITE_SUPABASE_URL` = el Project URL que copiaste de Supabase
   - `VITE_SUPABASE_ANON_KEY` = la anon public key que copiaste de Supabase
4. Tocá **Deploy**. En un par de minutos te da una URL tipo `tu-panel.netlify.app` — esa es tu app.

Si en algún momento cambiás las variables de entorno, tenés que volver a desplegar (**Trigger deploy**) para que tomen efecto.

## 4) Agregarla a la pantalla de inicio del iPhone

1. Abrí la URL de Netlify en Safari.
2. Tocá el botón de Compartir (el cuadrado con flecha hacia arriba).
3. "Agregar a inicio" → Agregar.

Listo, te queda como una app más.

## Notas importantes

- **Privacidad**: esta configuración no tiene login. Cualquiera que tenga tu URL de Netlify y sepa buscar la anon key en el código público podría en teoría leer o escribir datos. Para un panel de uso personal (vos sola, URL no publicada en ningún lado) el riesgo es bajo, pero si más adelante querés protegerlo con contraseña, se puede agregar Supabase Auth — avisame y te lo sumo.
- **Fotos**: las imágenes se guardan como texto (base64) en la misma tabla, igual que en la versión de Claude. Si en algún momento una foto es muy pesada y falla al guardar, avisame y migramos las imágenes a Supabase Storage (un sistema pensado para archivos, sin límite de tamaño de fila).
- **Sin conexión**: como ahora los datos viven en Supabase (no en el chat), esta versión necesita internet para leer y guardar. Si estás sin señal, se va a ver el panel pero no vas a poder cargar ni ver cambios nuevos hasta reconectarte.
- Para probarlo en tu computadora antes de subirlo: instalá Node.js, corré `npm install` y después `npm run dev` (necesitás un archivo `.env` local con las mismas dos variables — usá `.env.example` como base).
