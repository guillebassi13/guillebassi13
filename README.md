# Panel personal — guía paso a paso (Netlify + Supabase)

Tu usuario y contraseña para entrar al panel (los vas a crear en el paso 1.5):

```
Usuario: tu email (el que quieras usar)
Contraseña sugerida: JP1IYt9E2WD5VHhV
```

Podés usar esa contraseña generada o cambiarla por la que prefieras — la vas a
cargar vos misma en Supabase en el paso 1.5. Guardala en un lugar seguro (por
ejemplo, en la solapa "Redes / Contraseñas" del propio panel, una vez que lo
tengas andando).

---

## PARTE 1 — Supabase (donde se guardan tus datos)

### 1.1 Crear la cuenta y el proyecto
1. Entrá a **https://supabase.com**
2. Tocá **"Start your project"** → registrate con Google o con email.
3. Tocá **"New project"**.
4. Completá:
   - **Name**: `panel-personal` (o el nombre que quieras)
   - **Database Password**: creá una y GUARDALA (no es la de tu login, es la de la base de datos interna; casi nunca la vas a necesitar de nuevo)
   - **Region**: elegí la más cercana (ej. South America - São Paulo)
5. Tocá **"Create new project"** y esperá 1-2 minutos a que termine de crearse (vas a ver una barra de progreso).

### 1.2 Crear la tabla donde vive tu panel
1. En el menú de la izquierda, tocá el ícono de **"SQL Editor"**.
2. Tocá **"New query"**.
3. Abrí el archivo `supabase_schema.sql` que está en esta misma carpeta, copiá TODO su contenido, y pegalo en el recuadro grande.
4. Tocá el botón verde **"Run"** (abajo a la derecha).
5. Debería decir "Success. No rows returned". Eso significa que la tabla ya existe.

### 1.3 Copiar tus dos claves de conexión
1. En el menú de la izquierda, tocá el ícono de engranaje **"Project Settings"**.
2. Tocá **"API"** (en el submenú).
3. Vas a ver dos datos, copialos a un bloc de notas porque los necesitás en la Parte 3:
   - **Project URL**: algo como `https://abcdefgh.supabase.co`
   - **Project API keys → anon / public**: una key larga que empieza con `eyJ...`

### 1.4 Desactivar la confirmación por email (para que el login sea inmediato)
1. En el menú de la izquierda, tocá **"Authentication"**.
2. Tocá **"Providers"** (o "Sign In / Providers" según la versión).
3. Entrá a **"Email"**.
4. Buscá la opción **"Confirm email"** y ponela en **OFF** (desactivada).
5. Guardá los cambios (botón "Save").

Esto es importante: si lo dejás activado, Supabase te va a pedir confirmar el
mail antes de poder loguearte, y como esto es un panel privado (no un producto
público) no lo necesitás.

### 1.5 Crear tu usuario (tu login del panel)
1. Seguí dentro de **"Authentication"**, ahora tocá **"Users"** (en el menú de arriba o al costado).
2. Tocá **"Add user"** → **"Create new user"**.
3. Completá:
   - **Email**: el que quieras usar para entrar (puede ser tu email real).
   - **Password**: `JP1IYt9E2WD5VHhV` (o la que prefieras — copiala bien, con mayúsculas y números).
   - Marcá la casilla **"Auto Confirm User"** si aparece (así no hace falta confirmar por mail).
4. Tocá **"Create user"**.

Listo, ese es el usuario y contraseña con los que vas a entrar al panel.

---

## PARTE 2 — Subir el código a GitHub

1. Entrá a **https://github.com** y creá una cuenta si no tenés.
2. Arriba a la derecha, tocá el **"+"** → **"New repository"**.
3. Ponele nombre, por ejemplo `panel-personal`. Marcá **"Private"** (así nadie más lo ve). Tocá **"Create repository"**.
4. En la pantalla que te aparece, buscá el link que dice **"uploading an existing file"** (o andá a la pestaña "Code" → botón "Add file" → "Upload files").
5. Arrastrá o seleccioná **todos los archivos y carpetas de este zip** (incluidas las carpetas `src/` y `public/` con lo que tienen adentro).
6. Abajo, en "Commit changes", tocá el botón verde **"Commit changes"**.

Si GitHub no te deja arrastrar carpetas completas desde el navegador, se puede
subir carpeta por carpeta (primero los archivos sueltos, después entrás a
crear la carpeta `src` subiendo sus archivos, y lo mismo con `public`).

---

## PARTE 3 — Desplegar en Netlify

1. Entrá a **https://netlify.com** → registrate (podés usar tu cuenta de GitHub para entrar más rápido).
2. Tocá **"Add new site"** → **"Import an existing project"**.
3. Elegí **"Deploy with GitHub"** y autorizá el acceso si te lo pide.
4. Buscá y seleccioná el repositorio `panel-personal` que subiste.
5. En la pantalla de configuración del build, Netlify ya debería completar solo:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   (Esto lo toma del archivo `netlify.toml` que ya está en el proyecto — no hace falta que toques nada acá.)
6. ANTES de tocar "Deploy", desplegá la sección **"Environment variables"** (o después andá a **Site settings → Environment variables**) y agregá dos variables, tocando "Add a variable" dos veces:
   - **Key**: `VITE_SUPABASE_URL` → **Value**: la Project URL que copiaste en el paso 1.3
   - **Key**: `VITE_SUPABASE_ANON_KEY` → **Value**: la anon key que copiaste en el paso 1.3
7. Tocá **"Deploy site"** (o "Deploy panel-personal").
8. Esperá 1-3 minutos. Cuando termine, arriba vas a ver un link tipo `random-name-123.netlify.app` — esa ya es tu app funcionando.

### Cambiarle el nombre a la URL (opcional)
1. Adentro del sitio en Netlify, andá a **"Site configuration"** → **"Change site name"**.
2. Poné el nombre que quieras, por ejemplo `guillermina-panel` → te queda `guillermina-panel.netlify.app`.

---

## PARTE 4 — Entrar y agregarlo a la pantalla de inicio del iPhone

1. Abrí la URL de Netlify en **Safari** (importante: en Safari, no en la app de otro navegador).
2. Te va a aparecer la pantalla de login del panel — entrá con el usuario y contraseña que creaste en el paso 1.5.
3. Una vez adentro, tocá el botón de **Compartir** (el cuadrado con la flecha hacia arriba, abajo en Safari).
4. Deslizá y tocá **"Agregar a inicio"**.
5. Ponele un nombre (ej. "Mi Panel") y tocá **"Agregar"**.

Ya te queda el ícono en tu pantalla de inicio como una app más. La próxima vez
que lo abras te va a pedir el login de nuevo solo si cerraste sesión o pasó
mucho tiempo — mientras tanto queda logueado.

---

## Si algo no funciona

- **"Failed to fetch" o pantalla en blanco**: revisá que las dos variables de entorno en Netlify estén bien copiadas (sin espacios de más) y volvé a desplegar (Netlify → "Deploys" → "Trigger deploy" → "Deploy site").
- **"Usuario o contraseña incorrectos"**: revisá que el usuario esté creado en Supabase → Authentication → Users, y que tenga tildado "Auto Confirm User" (o que hayas desactivado "Confirm email" en el paso 1.4).
- **Los cambios que hago no se guardan**: fijate que tengas conexión a internet — esta versión necesita internet para guardar (a diferencia de la versión de prueba que usabas acá en el chat).

Cualquier error puntual, mandame el mensaje exacto que te aparece y seguimos desde ahí.
