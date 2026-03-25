# 📊 Dashboard · Ventas por Evento — Web

Dashboard interactivo construido con **HTML + JavaScript** (Chart.js) para visualizar ventas agrupadas por evento.  
Versión web estática — equivalente a la app Streamlit del directorio `dashboard/`.

---

## 🚀 Cómo ver localmente

Simplemente abre el archivo `index.html` en tu navegador favorito.  
No requiere servidor, ni instalación de dependencias.

```
Doble clic → index.html
```

O con un servidor local liviano (recomendado para evitar restricciones CORS):

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx -y serve .
```

Luego abre: `http://localhost:8080`

---

## 🌐 Deploy a GitHub Pages (gratis)

1. **Subir a GitHub**

   ```bash
   git init
   git add .
   git commit -m "feat: initial dashboard-web"
   git remote add origin https://github.com/TU_USUARIO/dashboard-web.git
   git push -u origin main
   ```

2. **Activar GitHub Pages**
   - Ve a tu repositorio en GitHub
   - `Settings` → `Pages`
   - En **Source** selecciona `Deploy from a branch`
   - Branch: `main` / Folder: `/ (root)`
   - Haz clic en **Save**

3. Tu sitio estará en:  
   `https://TU_USUARIO.github.io/dashboard-web/`

---

## 🌐 Deploy a Netlify (alternativa, aún más simple)

1. Registrate en [netlify.com](https://netlify.com)
2. Arrastra la carpeta `dashboard-web/` al panel de Netlify
3. ¡Listo! Obtienes una URL pública al instante.

---

## 📦 Tecnologías

| Tecnología | Rol |
|---|---|
| HTML5 | Estructura semántica |
| CSS3 (Vanilla) | Estilos dark-mode, responsive |
| JavaScript (ES6+) | Lógica de datos y renderizado |
| [Chart.js v4](https://www.chartjs.org/) | Gráfico de barras (CDN) |

---

## 📁 Estructura

```
dashboard-web/
├── index.html        # Página principal
├── style.css         # Estilos (dark mode, responsive)
├── app.js            # Datos + lógica de renderizado
├── .gitignore        # Archivos ignorados por Git
└── README.md         # Este archivo
```

---

## 🔄 Importar Datos (JSON)

El dashboard permite importar datos dinámicamente. Puedes copiar y pegar un array JSON en el campo "Importar Datos" para actualizar las visualizaciones al instante.

### Formato de datos requerido:
```json
[
  {
    "name": "Nombre del Evento",
    "price": 12000,
    "category": "Música"
  }
]
```

---

## 📦 Tecnologías

| Tecnología | Rol |
|---|---|
| HTML5 | Estructura semántica |
| CSS3 (Vanilla) | Estilos dark-mode, responsive |
| JavaScript (ES6+) | Lógica de datos, validación JSON y renderizado |
| [Chart.js v4](https://www.chartjs.org/) | Gráfico de barras (CDN) |

---

## 📁 Estructura

```
dashboard-web/
├── index.html        # Página principal y estructura
├── style.css         # Estilos y diseño premium
├── app.js            # Lógica de procesamiento y Chart.js
├── .gitignore        # Configuración de Git
└── README.md         # Documentación del proyecto
```
