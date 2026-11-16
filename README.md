# Francesc Benach Garcia

Portfolio de ingeniería y dirección técnica. Español e inglés.

## Estructura

- `index.html` — estructura semántica de la web.
- `site.css` — sistema visual y adaptaciones responsivas.
- `content.js` — textos, proyectos, trayectoria y formación en ambos idiomas.
- `main.js` — interfaz, navegación, filtros, traducciones y detalles.
- `scene.js` — modelo tridimensional por piezas y animación de scroll.
- `vendor/three.module.js` — motor 3D versión r170 (licencia MIT en `vendor/LICENSE-three.txt`).
- `media/francesc-benach.webp` y `files/` — fotografía y currículums existentes.

## Uso local

Se necesita servir archivos mediante HTTP para importar los módulos ES:

```sh
python3 -m http.server 8080
```

Abrir http://localhost:8080/. No requiere instalación de dependencias ni compilación.

## Publicación

La rama `main` se publica desde GitHub Pages. La rama `backup/portfolio-original-2026-11-16` conserva el portfolio original, y `backup/portfolio-v2-2026-11-16` conserva el diseño anterior a esta revisión.

El idioma se obtiene del navegador si no hay selección previa y se recuerda localmente. Todas las acciones de navegación son enlaces HTML reales. El contenido básico y las secciones siguen siendo legibles aunque no se pueda inicializar el motor 3D.