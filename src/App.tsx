"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Project = {
  title: string;
  type: "Producto" | "Digital" | "IA";
  kicker: string;
  description: string;
  impact: string;
  stack: string[];
  accent: string;
};

const timeline = [
  {
    year: "2018",
    role: "Delineante eléctrico",
    company: "MAETEL",
    text: "El punto de partida: redes de baja tensión, conexionado y proyectos fotovoltaicos con AutoCAD.",
    code: "01 / PRECISIÓN",
  },
  {
    year: "2019",
    role: "Ingeniero electrónico de I+D",
    company: "iDeeFe and Wits",
    text: "Diseño PCB, firmware ATmega2560, sensores, actuadores y control de motores para un sistema semiautomático.",
    code: "02 / PRODUCTO",
  },
  {
    year: "2021",
    role: "Ingeniero electrónico",
    company: "PoweredCub",
    text: "Electrónica de control, PCB y firmware para sistemas de alarma y seguridad en vehículos industriales.",
    code: "03 / SISTEMAS",
  },
  {
    year: "2023",
    role: "Project Manager · Ingeniero I+D",
    company: "DOIT Multisensorial",
    text: "Evolución de ingeniería a coordinación integral de proyectos, manteniendo responsabilidad directa en hardware y firmware.",
    code: "04 / LIDERAZGO",
  },
  {
    year: "2026",
    role: "Transformación digital + IA",
    company: "Aplicación real en DOIT",
    text: "Diagnóstico, hoja de ruta, trazabilidad, dashboards, aplicaciones internas y agentes de automatización que siguen en uso.",
    code: "05 / ESCALA",
  },
];

const projects: Project[] = [
  {
    title: "Transformación digital DOIT",
    type: "Digital",
    kicker: "De la auditoría a la operativa",
    description: "Hoja de ruta aplicada con trazabilidad de comandas, Jira, Billage, Drive, KPI, copias de seguridad, ciberseguridad e IA.",
    impact: "Proyecto formativo 10/10 · primera fase implantada",
    stack: ["Procesos", "KPI", "Jira", "IA"],
    accent: "#b7ff48",
  },
  {
    title: "Sistema multisensorial New Gen",
    type: "Producto",
    kicker: "Hardware + firmware + experiencia",
    description: "Arquitectura de producto con ESP32, RF, NFC, audio, sensores, interfaces gráficas y protocolos propietarios.",
    impact: "Diseño de extremo a extremo",
    stack: ["ESP32", "C++", "RF", "NFC"],
    accent: "#6fe7ff",
  },
  {
    title: "CRM / Jira Dashboard",
    type: "Digital",
    kicker: "Datos útiles, sin fricción",
    description: "Dashboard autónomo para consolidar comandas, productos e información de Jira con búsqueda y filtrado operativo.",
    impact: "Herramienta local en uso interno",
    stack: ["HTML", "JavaScript", "JSON", "Jira"],
    accent: "#ffb86b",
  },
  {
    title: "Packing List App",
    type: "Digital",
    kicker: "Menos errores en expediciones",
    description: "Asignación de productos a cajas, prevención de duplicidades, control visual por bulto y gestión de líneas parciales.",
    impact: "Aplicación local en operativa real",
    stack: ["Web app", "UX", "Logística", "QA"],
    accent: "#ad9cff",
  },
  {
    title: "Agentes operativos DOIT",
    type: "IA",
    kicker: "IA dirigida a procesos concretos",
    description: "Agentes para packing lists, manuales técnicos, respuestas a proveedores y flujos documentales, diseñados con ChatGPT bajo dirección propia.",
    impact: "Automatización con validación humana",
    stack: ["GPTs", "Prompts", "Make", "Documentos"],
    accent: "#ff78b7",
  },
  {
    title: "Lumina",
    type: "IA",
    kicker: "Producto web con propósito",
    description: "Aplicación de bienestar con calendario de ánimo, objetivos, medicación, estadísticas y sugerencias asistidas por IA.",
    impact: "Prototipo funcional publicado en GitHub",
    stack: ["React", "TypeScript", "Vite", "Gemini"],
    accent: "#7af0c1",
  },
  {
    title: "Gateway RF 868 ↔ 915",
    type: "Producto",
    kicker: "Resolver incompatibilidades de campo",
    description: "Puente bidireccional con ESP32-C3 para integrar equipos europeos y mexicanos manteniendo sus tramas originales.",
    impact: "Ingeniería práctica orientada a cliente",
    stack: ["ESP32-C3", "RF", "UART", "C++"],
    accent: "#ffd66f",
  },
  {
    title: "Herramientas Web Serial",
    type: "Producto",
    kicker: "El navegador también es una herramienta",
    description: "Interfaces para configurar y decodificar NFC y controlar matrices LED conectadas a ESP32 directamente desde la web.",
    impact: "Hardware y software en una sola experiencia",
    stack: ["Web Serial", "ESP32", "PN532", "FastLED"],
    accent: "#70a7ff",
  },
];

const challenges = [
  {
    label: "Proceso manual",
    output: "Flujo digital medible",
    steps: ["Observar", "Mapear", "Priorizar", "Automatizar", "Medir"],
    note: "Empiezo por el problema y las personas; la tecnología llega después.",
  },
  {
    label: "Producto electrónico",
    output: "Prototipo validado",
    steps: ["Requisitos", "Arquitectura", "PCB + FW", "Validar", "Industrializar"],
    note: "Puedo seguir la señal desde el esquema hasta el comportamiento del usuario.",
  },
  {
    label: "Oportunidad de IA",
    output: "Agente útil y controlado",
    steps: ["Caso de uso", "Contexto", "Prototipo", "Humano en bucle", "Escalar"],
    note: "Uso IA para aumentar capacidad, con validación y trazabilidad.",
  },
];

export default function Home() {
  const [activeYear, setActiveYear] = useState(4);
  const [filter, setFilter] = useState<"Todos" | Project["type"]>("Todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [challenge, setChallenge] = useState(0);
  const [focusMode, setFocusMode] = useState<"hybrid" | "digital">("hybrid");
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => filter === "Todos" || project.type === filter),
    [filter],
  );

  const copyEmail = async () => {
    await navigator.clipboard.writeText("francescbg1@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const heroStyle = {
    "--pointer-x": `${pointer.x}px`,
    "--pointer-y": `${pointer.y}px`,
  } as CSSProperties;

  return (
    <main>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <div className="noise" aria-hidden="true" />

      <nav className="nav-shell" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="Inicio">
          <span>FB</span><i>/</i><span>G</span>
        </a>
        <div className="nav-links">
          <a href="#trayectoria">Trayectoria</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div className="availability"><span /> DISPONIBLE PARA CONECTAR</div>
      </nav>

      <section
        id="inicio"
        className="hero"
        style={heroStyle}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        }}
      >
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy reveal-up">
          <p className="eyebrow"><span>01</span> INGENIERÍA · PROYECTOS · TRANSFORMACIÓN</p>
          <h1>
            Diseño sistemas.<br />
            Conecto equipos.<br />
            <em>Transformo negocios.</em>
          </h1>
          <p className="hero-intro">
            Soy <strong>Francesc Benach Garcia</strong>. Ingeniero electrónico y project manager
            que convierte problemas complejos en productos, procesos y herramientas que funcionan.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#proyectos">Explorar mi trabajo <span>↘</span></a>
            <a className="button button-ghost" href={`${import.meta.env.BASE_URL}files/Francesc_Benach_CV_ES.pdf`} download>Descargar CV <span>↓</span></a>
          </div>
        </div>

        <div className="avatar-stage reveal-scale">
          <div className="orbit orbit-one" aria-hidden="true"><span>HW</span><span>FW</span></div>
          <div className="orbit orbit-two" aria-hidden="true"><span>AI</span><span>PM</span></div>
          <div className="portrait-wrap">
            <img
              src={`${import.meta.env.BASE_URL}media/francesc-benach.webp`}
              alt="Retrato profesional de Francesc Benach Garcia"
              width="768"
              height="768"
            />
            <div className="portrait-scan" aria-hidden="true" />
          </div>
          <div className="avatar-tag avatar-tag-top"><b>+7</b><span>AÑOS<br />CREANDO</span></div>
          <div className="avatar-tag avatar-tag-bottom"><span>BASE</span><b>SALOU</b></div>
          <div className="avatar-caption">FRANCESC // SYSTEM BUILDER</div>
        </div>

        <div className="hero-bottom">
          <div className="mode-switch" role="group" aria-label="Enfoque del perfil">
            <button className={focusMode === "hybrid" ? "active" : ""} onClick={() => setFocusMode("hybrid")}>Perfil híbrido</button>
            <button className={focusMode === "digital" ? "active" : ""} onClick={() => setFocusMode("digital")}>Foco digital</button>
          </div>
          <div className="live-statement" aria-live="polite">
            <span className="live-icon">◆</span>
            {focusMode === "hybrid"
              ? "Hardware · Firmware · Producto · Project Management"
              : "Procesos · Datos · Automatización · IA aplicada"}
          </div>
          <a className="scroll-cue" href="#manifiesto"><span>SCROLL</span><i>↓</i></a>
        </div>
      </section>

      <section id="manifiesto" className="manifesto section-shell">
        <div className="section-index">02 / EN UNA FRASE</div>
        <p className="big-quote">
          No soy solo quien diseña la placa.<br />
          Soy quien entiende <span>por qué existe,</span><br />
          cómo se fabrica y cómo <span>mejora el negocio.</span>
        </p>
        <div className="proof-strip">
          <div><strong>HW + FW</strong><span>Del esquema al firmware</span></div>
          <div><strong>PM</strong><span>De requisitos a entrega</span></div>
          <div><strong>DX + IA</strong><span>De proceso a sistema</span></div>
          <div><strong>10/10</strong><span>Proyecto aplicado DOIT</span></div>
        </div>
      </section>

      <section id="trayectoria" className="trajectory section-shell">
        <div className="section-heading">
          <div><p className="section-index">03 / TRAYECTORIA</p><h2>Una evolución natural.</h2></div>
          <p>La técnica no desaparece cuando lideras.<br />Se convierte en criterio.</p>
        </div>
        <div className="timeline-layout">
          <div className="timeline-years" role="tablist" aria-label="Años de trayectoria">
            {timeline.map((item, index) => (
              <button
                key={item.year}
                role="tab"
                aria-selected={activeYear === index}
                className={activeYear === index ? "active" : ""}
                onClick={() => setActiveYear(index)}
              >
                <span>{item.year}</span><i>{item.code}</i>
              </button>
            ))}
          </div>
          <article className="timeline-card" key={timeline[activeYear].year}>
            <div className="card-coordinates">41.0768° N · 1.1440° E</div>
            <p>{timeline[activeYear].company}</p>
            <h3>{timeline[activeYear].role}</h3>
            <div className="timeline-rule"><span /></div>
            <p className="timeline-description">{timeline[activeYear].text}</p>
            <div className="timeline-number">{timeline[activeYear].year}</div>
          </article>
        </div>
      </section>

      <section className="capabilities section-shell">
        <div className="section-heading">
          <div><p className="section-index">04 / CAPACIDADES</p><h2>Tres capas. Un solo perfil.</h2></div>
        </div>
        <div className="capability-grid">
          <article className="capability-card cyan">
            <div className="capability-top"><span>01</span><i>◉</i></div>
            <h3>Ingeniería electrónica</h3>
            <p>Arquitectura, esquemas, PCB, firmware C/C++, sistemas embebidos, RF, NFC, sensores y validación.</p>
            <div className="signal-bars" aria-hidden="true">{[1,2,3,4,5,6,7,8].map(n => <i key={n} />)}</div>
          </article>
          <article className="capability-card violet">
            <div className="capability-top"><span>02</span><i>⌁</i></div>
            <h3>Dirección de proyectos</h3>
            <p>Requisitos, planificación, coordinación funcional, proveedores, taller, fabricación, calidad y soporte.</p>
            <div className="node-map" aria-hidden="true"><i /><i /><i /><i /><span /></div>
          </article>
          <article className="capability-card lime">
            <div className="capability-top"><span>03</span><i>✦</i></div>
            <h3>Transformación digital + IA</h3>
            <p>Auditoría, procesos, dashboards, aplicaciones web, automatización y agentes con validación humana.</p>
            <div className="mini-terminal"><span>&gt; system.status</span><b>IMPROVING_</b></div>
          </article>
        </div>
      </section>

      <section id="proyectos" className="projects section-shell">
        <div className="section-heading projects-heading">
          <div><p className="section-index">05 / PROYECTOS SELECCIONADOS</p><h2>Pruebas, no promesas.</h2></div>
          <div className="filter-row" role="group" aria-label="Filtrar proyectos">
            {(["Todos", "Producto", "Digital", "IA"] as const).map((item) => (
              <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="project-grid">
          {filteredProjects.map((project, index) => (
            <button
              className="project-card"
              key={project.title}
              onClick={() => setSelectedProject(project)}
              style={{ "--project-accent": project.accent, "--delay": `${index * 55}ms` } as CSSProperties}
            >
              <div className="project-meta"><span>{project.type}</span><i>0{index + 1}</i></div>
              <p>{project.kicker}</p>
              <h3>{project.title}</h3>
              <div className="project-impact">{project.impact}</div>
              <div className="project-open"><span>VER DETALLE</span><i>↗</i></div>
            </button>
          ))}
        </div>
      </section>

      <section className="solver section-shell">
        <div className="solver-panel">
          <div className="solver-intro">
            <p className="section-index">06 / MODO DE PENSAR</p>
            <h2>Dame un reto.</h2>
            <p>Selecciona el tipo de problema y observa cómo lo convierto en una solución.</p>
            <div className="challenge-buttons">
              {challenges.map((item, index) => (
                <button key={item.label} className={challenge === index ? "active" : ""} onClick={() => setChallenge(index)}>
                  <span>0{index + 1}</span>{item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="solver-output" key={challenge}>
            <div className="output-header"><span>INPUT</span><i>PROCESSING</i><b>OUTPUT</b></div>
            <div className="pipeline">
              {challenges[challenge].steps.map((step, index) => (
                <div key={step} className="pipeline-step" style={{ "--step": index } as CSSProperties}>
                  <span>{String(index + 1).padStart(2, "0")}</span><b>{step}</b>{index < 4 && <i>→</i>}
                </div>
              ))}
            </div>
            <div className="output-result"><span>RESULTADO</span><strong>{challenges[challenge].output}</strong></div>
            <p>{challenges[challenge].note}</p>
          </div>
        </div>
      </section>

      <section className="formation section-shell">
        <div className="formation-title"><p className="section-index">07 / FORMACIÓN CONTINUA</p><h2>Aprender para aplicar.</h2></div>
        <div className="formation-list">
          <article><span>2026</span><div><h3>Transformación digital: IA y Big Data</h3><p>Programa GDPYMES · 150 horas · Proyecto final aplicado a DOIT: 10/10</p></div><i>↗</i></article>
          <article><span>2025</span><div><h3>Introducción a la IA</h3><p>BIG School · ChatGPT, GPTs personalizados y Make</p></div><i>↗</i></article>
          <article><span>2018</span><div><h3>Ingeniería Electrónica Industrial y Automática</h3><p>Universitat Rovira i Virgili · Estudios adicionales de Ingeniería Informática</p></div><i>↗</i></article>
        </div>
      </section>

      <footer id="contacto" className="contact">
        <div className="contact-glow" aria-hidden="true" />
        <p className="section-index">08 / SIGUIENTE PROYECTO</p>
        <h2>¿Construimos algo<br /><em>que funcione de verdad?</em></h2>
        <p className="contact-copy">Disponible para proyectos de transformación digital, producto electrónico y coordinación técnica.</p>
        <div className="contact-actions">
          <a className="button button-primary" href="mailto:francescbg1@gmail.com">Hablemos <span>↗</span></a>
          <button className="button button-ghost" onClick={copyEmail}>{copied ? "Correo copiado ✓" : "Copiar correo"}</button>
        </div>
        <div className="contact-grid">
          <div><span>LOCALIZACIÓN</span><b>Salou, Tarragona</b></div>
          <div><span>TELÉFONO</span><a href="tel:+34638981733">+34 638 981 733</a></div>
          <div><span>LINKEDIN</span><a href="https://www.linkedin.com/in/francesc-benach-garcia-b86391106" target="_blank" rel="noreferrer">Ver perfil ↗</a></div>
          <div><span>GITHUB</span><a href="https://github.com/FrancescGiT" target="_blank" rel="noreferrer">FrancescGiT ↗</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Francesc Benach Garcia</span><div><a href={`${import.meta.env.BASE_URL}files/Francesc_Benach_CV_ES.pdf`} download>CV ES ↓</a><a href={`${import.meta.env.BASE_URL}files/Francesc_Benach_CV_EN.pdf`} download>CV EN ↓</a></div></div>
      </footer>

      {selectedProject && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedProject(null)}>
          <article className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-title" onMouseDown={(event) => event.stopPropagation()} style={{ "--project-accent": selectedProject.accent } as CSSProperties}>
            <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Cerrar detalle">×</button>
            <p>{selectedProject.type} / {selectedProject.kicker}</p>
            <h2 id="project-title">{selectedProject.title}</h2>
            <div className="modal-line" />
            <p className="modal-description">{selectedProject.description}</p>
            <div className="modal-impact"><span>IMPACTO</span><b>{selectedProject.impact}</b></div>
            <div className="modal-stack">{selectedProject.stack.map(item => <span key={item}>{item}</span>)}</div>
          </article>
        </div>
      )}
    </main>
  );
}
