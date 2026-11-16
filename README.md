# Francesc Benach Garcia — Portfolio

**Web:** https://francescgit.github.io/

Portfolio profesional basado en la estructura visual de la plantilla de referencia aportada por el propietario. La página presenta una portada editorial con avatar estilizado, galería horizontal reactiva al scroll, información profesional, especialidades, trayectoria, proyectos apilados y contacto.

## Contenido

- 8 proyectos documentados en el portfolio original: New Gen multisensorial, Gateway RF 868/915, transformación digital DOIT, CRM/Jira, Packing List, agentes operativos DOIT, Lumina y herramientas Web Serial.
- 5 etapas profesionales: MAETEL (2018), iDeeFe and Wits (2019), PoweredCub (2021), DOIT Multisensorial (2023) y transformación digital en DOIT (2026).
- 3 entradas de formación y 5 áreas de especialización.
- Selector español/inglés persistente, filtros funcionales, galerías de proyectos y formulario que prepara un correo local.
- Fotografía auténtica y currículums originales conservados en `media/` y `files/`.

## Identidad gráfica

El avatar utilizado en la portada es una **ilustración estilizada**, no un modelo 3D interactivo ni una fotografía literal. Se incluye como imagen WebP integrada en el documento HTML, sin URL externa. Las representaciones de proyectos son conceptuales y no muestran datos internos de clientes.

## Despliegue

GitHub Pages sirve `index.html` en `main`. El archivo incluye estilos, código JavaScript y avatar, por lo que no requiere npm, frameworks ni compilación para funcionar. Se mantiene la composición de la plantilla de referencia, adaptada a un despliegue estático.

La fuente opcional de Google Fonts tiene alternativas de sistema. No se cargan scripts externos. Se respeta `prefers-reduced-motion`.

## Verificaciones

Pruebas de Chromium a 1440 × 900, 768 × 1024, 390 × 844 y 320 × 700 sin errores JavaScript ni desbordamiento horizontal. Verificados selector ES/EN, ocho proyectos, filtros, cuadros de diálogo, contacto y rutas a ambos CV.

## Copias de seguridad

- `backup/portfolio-original-2026-11-16`: versión original previa a todos los rediseños
- `backup/portfolio-expanded-before-jack-template-2026-11-16`: versión ampliada anterior a este diseño
- Las otras ramas históricas del proyecto continúan disponibles
