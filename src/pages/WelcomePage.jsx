import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../index.css";
import { useLocation } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  // Refs para scroll suave
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const demoRef = useRef(null);
  const pricingRef = useRef(null);
  const useCasesRef = useRef(null);
  const reviewsRef = useRef(null);
  const faqRef = useRef(null);
  const footerRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);

  const { search } = useLocation();

useEffect(() => {
  const params = new URLSearchParams(search);
  const section = params.get("scroll");

  if (section === "pricing") scrollTo(pricingRef);
  if (section === "reviews") scrollTo(reviewsRef);
  if (section === "faq") scrollTo(faqRef);
  if (section === "demo") scrollTo(demoRef);
  if (section === "usecases") scrollTo(useCasesRef);
  if (section === "how") scrollTo(howItWorksRef);
  if (section === "hero") scrollTo(heroRef);
}, [search]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

const scrollTo = (ref, offset = -200) => {
  if (!ref.current) return;

  const top = ref.current.getBoundingClientRect().top + window.pageYOffset + offset;

  window.scrollTo({
    top,
    behavior: "smooth",
  });

  setMobileOpen(false);
};


  return (
    <div className="bg-[#020617] text-white min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#020617]/70 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo / Marca */}
          <button
            onClick={() => scrollTo(heroRef)}
            className="text-2xl font-bold tracking-tight text-white"
          >
            GesturePresenter
          </button>

          {/* Menú desktop */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <button onClick={() => scrollTo(howItWorksRef)} className="hover:text-white">
              Cómo funciona
            </button>
            <button onClick={() => scrollTo(demoRef)} className="hover:text-white">
              Demo
            </button>
            <button onClick={() => scrollTo(useCasesRef)} className="hover:text-white">
              Casos de uso
            </button>
            <button onClick={() => scrollTo(pricingRef)} className="hover:text-white">
              Precios
            </button>
            <button onClick={() => scrollTo(reviewsRef)} className="hover:text-white">
              Reseñas
            </button>
            <button onClick={() => scrollTo(faqRef)} className="hover:text-white">
              FAQ
            </button>
          </div>

          {/* Botones auth desktop */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm rounded-lg border border-gray-600 hover:border-gray-400 text-gray-200"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 font-medium shadow-sm shadow-blue-600/40"
            >
              Registrarse
            </button>
          </div>

          {/* Menú móvil */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setMobileOpen((v) => !v)}
          >
            ☰
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#020617]/95 border-t border-white/10">
            <div className="flex flex-col px-6 py-3 text-gray-300 text-sm">
              <button
                onClick={() => scrollTo(howItWorksRef)}
                className="py-2 text-left hover:text-white"
              >
                Cómo funciona
              </button>
              <button
                onClick={() => scrollTo(demoRef)}
                className="py-2 text-left hover:text-white"
              >
                Demo
              </button>
              <button
                onClick={() => scrollTo(useCasesRef)}
                className="py-2 text-left hover:text-white"
              >
                Casos de uso
              </button>
              <button
                onClick={() => scrollTo(pricingRef)}
                className="py-2 text-left hover:text-white"
              >
                Precios
              </button>
              <button
                onClick={() => scrollTo(reviewsRef)}
                className="py-2 text-left hover:text-white"
              >
                Reseñas
              </button>
              <button
                onClick={() => scrollTo(faqRef)}
                className="py-2 text-left hover:text-white"
              >
                FAQ
              </button>

              <div className="flex gap-3 mt-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 py-2 rounded-lg border border-gray-600 hover:border-gray-400"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        ref={heroRef}
        className="
          bg-hero-smooth 
          min-h-screen flex flex-col justify-center items-center 
          px-6 text-center relative overflow-hidden pt-24
        "
        data-aos="fade-up"
      >
{/* Glow radial suave detrás del texto */}
<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.35),transparent_70%)] opacity-40 pointer-events-none" />

<div className="relative z-10 flex flex-col items-center text-center">

  {/* Subtítulo */}
  <p className="text-gray-300 text-sm md:text-base mb-4">
    Control por gestos, hecho para presentadores modernos
  </p>

  {/* Título principal */}
  <h1 className="
      text-4xl md:text-6xl font-extrabold 
      tracking-tight leading-tight 
      mb-6
    "
  >
    Presenta con tus manos,<br className="hidden md:block" />
    sin tocar nada.
  </h1>

  {/* Descripción */}
  <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-8">
    GesturePresenter convierte tus gestos en acciones reales sobre tu presentación en PDF.
    Natural, rápido y sin interrupciones.
  </p>





</div>


{/* Logos flotando */}
<div className="absolute inset-0 pointer-events-none">
  <img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
    className="w-12 md:w-25 absolute top-[20%] left-[12%] floating opacity-70 
               transition-transform duration-300 hover:scale-150 pointer-events-auto"
    alt="React"
  />

  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Pdf-js_logo.svg/2048px-Pdf-js_logo.svg.png"
    className="w-12 md:w-25 absolute top-[12%] right-[16%] floating-reverse opacity-70
               transition-transform duration-300 hover:scale-150 pointer-events-auto"
    alt="PDFJS"
  />

  <img
    src="https://www.galileo.edu/page/wp-content/uploads/2023/04/1-2.png"
    className="w-10 md:w-40 absolute bottom-[22%] left-[20%] floating opacity-70
               transition-transform duration-300 hover:scale-150 pointer-events-auto"
    alt="Vite"
  />

  <img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
    className="w-10 md:w-25 absolute bottom-[18%] right-[22%] floating-reverse opacity-70
               transition-transform duration-300 hover:scale-150 pointer-events-auto"
    alt="JavaScript"
  />

  <img
    src="https://chuoling.github.io/mediapipe/images/logo_horizontal_color.png"
    className="w-10 md:w-65 absolute top-[15%] left-[45%] floating opacity-70 rounded
               transition-transform duration-300 hover:scale-150 pointer-events-auto"
    alt="MediaPipe"
  />
</div>


        {/* Botones principales */}
        <div className="flex flex-col sm:flex-row gap-4 mt-1 relative z-10">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium 
                       shadow-lg shadow-blue-600/40 transition transform hover:scale-105"
          >
            Comenzar ahora
          </button>
    {/* Botón secundario */}
    <button
      onClick={() => scrollTo(demoRef)}
      className="
        px-6 py-3 rounded-xl font-medium shadow-sm shadow-blue-600
        border border-white/20 text-white bg-white/10 hover:bg-white/2 
        transition transform  hover:scale-105 
      "
    >
      Ver demo
    </button>
        </div>
          {/* Nota */}
  <p className="text-gray-500 text-sm mt-6">
    Versión beta · No se requiere tarjeta
  </p>
      </section>

      {/* CÓMO FUNCIONA */}
      <section
        ref={howItWorksRef}
        className="py-20 bg-[#020617] px-6"
        data-aos="fade-up"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            ¿Cómo funciona GesturePresenter?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800">
              <div className="text-3xl mb-3">👋</div>
              <h3 className="font-semibold mb-2">1. Detectamos tu mano</h3>
              <p className="text-gray-300 text-sm">
                Usamos visión por computadora con MediaPipe para reconocer tu mano en
                tiempo real desde la cámara.
              </p>
            </div>

            <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800">
              <div className="text-3xl mb-3">👉</div>
              <h3 className="font-semibold mb-2">2. Leemos tus gestos</h3>
              <p className="text-gray-300 text-sm">
                Desplazar la mano a la derecha avanza la diapositiva, a la izquierda la
                regresa, y otros gestos ejecutan comandos.
              </p>
            </div>

            <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold mb-2">3. Control total de la presentación</h3>
              <p className="text-gray-300 text-sm">
                Enviamos las teclas necesarias al visor de presentaciones para que
                controles todo sin tocar nada.
              </p>
            </div>
          </div>
        </div>
      </section>

{/* DEMO */}
<section
  ref={demoRef}
  className="py-20 bg-[#020617] px-6 relative"
  data-aos="fade-up"
>
  <div className="max-w-5xl mx-auto text-center relative">

    <h2 className="text-3xl md:text-4xl font-bold mb-6">Mira cómo funciona</h2>
    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
      Observa cómo GesturePresenter detecta tus gestos y controla una presentación real.
    </p>

    {/* WRAPPER RELATIVO */}
    <div className="relative">

      {/* VIDEO GRANDE (PRESENTACIÓN) */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-3xl overflow-hidden h-64 md:h-103 shadow-xl">
        <video
          src="/demo.mov"
          className="w-full h-100 object-cover opacity-90"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* VIDEO PEQUEÑO (CÁMARA), AHORA FUERA DEL DIV GRANDE */}
      <div
        className="
          absolute -top-30 -right-40
          w-36 h-24 md:w-64 md:h-68
          rounded-2xl border border-white/10 
          bg-black/50 backdrop-blur-xl
          shadow-[0_8px_30px_rgba(0,0,0,0.4)]
          overflow-hidden
          transition-transform duration-300 ease-out
          hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]
        "
      >
        <video
          src="/camera.mov"
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

    </div>
  </div>
</section>


      {/* CASOS DE USO */}
      <section
        ref={useCasesRef}
        className="py-20 bg-[#020617] px-6"
        data-aos="fade-up"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Diseñado para tus presentaciones
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800">
              <h3 className="font-semibold mb-2">Profesores y catedráticos</h3>
              <p className="text-gray-300 text-sm">
                Muévete por el salón sin regresar constantemente a la computadora.
              </p>
            </div>

            <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800">
              <h3 className="font-semibold mb-2">Expositores y conferencias</h3>
              <p className="text-gray-300 text-sm">
                Presentaciones más naturales, sin controles ni cables visibles.
              </p>
            </div>

            <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800">
              <h3 className="font-semibold mb-2">Estudiantes y proyectos</h3>
              <p className="text-gray-300 text-sm">
                Impresiona en tus exposiciones finales controlando todo solo con tus
                manos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRACIONES + VENTAJAS */}
      <section className="py-20 bg-[#020617] px-6" data-aos="fade-up">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          {/* Integraciones */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Compatible con cualquier presentación en PDF</h2>
            <p className="text-gray-300 text-sm mb-4">
              GesturePresenter incluye su propio visor integrado, por lo que no necesitas PowerPoint, Slides ni Keynote.
Solo exporta tu presentación a PDF y contrólala con gestos.
            </p>

          </div>

          {/* Ventajas */}
          <div className= "ml-25">
            <h2 className="text-2xl font-bold mb-4 ">Pensado para ser práctico</h2>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li>🚫 No requiere hardware adicional: solo tu cámara.</li>
              <li>⚡ Detección en tiempo real con baja latencia.</li>
              <li>🧠 IA de visión por computadora para reconocer gestos.</li>
              <li>🛡 Procesamiento local para mayor privacidad (según diseño).</li>
            </ul>
          </div>
        </div>
      </section>

{/* PRECIOS */}
<section
  ref={pricingRef}
  className="py-24 bg-[#020617] px-6"
  data-aos="fade-up"
>
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
    Nuestros Precios
  </h2>

  {/* Mensaje de versión beta */}
  <p className="text-center text-gray-400 text-sm mb-12">
    🚀 Actualmente estamos en <b>versión beta</b>.  
    Los planes Pro y Premium estarán disponibles <b>próximamente</b> mientras continuamos desarrollando funciones avanzadas.
  </p>

  <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

    {/* PLAN BÁSICO */}
    <div className="bg-[#0f172a] p-8 rounded-2xl border border-gray-800 text-center">
      <h3 className="text-2xl font-bold mb-2">Básico</h3>
      <p className="text-gray-400 mb-4 text-sm">Ideal para comenzar</p>
      <p className="text-4xl font-extrabold mb-6">$0</p>

      <ul className="text-gray-300 text-sm space-y-2 mb-6">
        <li>✔ Hasta <b>5 presentaciones</b></li>
        <li>✔ Control por gestos con <b>dedos</b></li>
        <li>✔ Visor PDF integrado</li>
      </ul>

      <button className="w-full mt-12 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium"
        onClick={() => navigate("/login")}>
        Prueba Gratis
      </button>
    </div>

    {/* PLAN PRO */}
    <div className="bg-[#0f172a] p-8 rounded-2xl border border-blue-600 shadow-xl shadow-blue-700/30 text-center">
      <h3 className="text-2xl font-bold mb-2">Pro</h3>
      <p className="text-gray-400 mb-4 text-sm">Para usuarios frecuentes</p>
      <p className="text-4xl font-extrabold mb-6">$4.99</p>

      <ul className="text-gray-300 text-sm space-y-2 mb-6">
        <li>✔ Hasta <b>20 presentaciones</b></li>
        <li>✔ Gestos con dedos</li>
        <li>✔  Gestos de <b>deslizar la mano</b></li>
        <li>✔ Gestos de <b>zoom</b></li>
      </ul>

      <button className="w-full mt-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium">
        Próximamente
      </button>
    </div>

    {/* PLAN PREMIUM */}
    <div className="bg-[#0f172a] p-8 rounded-2xl border border-gray-800 text-center">
      <h3 className="text-2xl font-bold mb-2">Premium</h3>
      <p className="text-gray-400 mb-4 text-sm">Para equipos y presentadores avanzados</p>
      <p className="text-4xl font-extrabold mb-6">$9.99</p>

      <ul className="text-gray-300 text-sm space-y-2 mb-6">
        <li>✔ <b>Presentaciones ilimitadas</b></li>
        <li>✔ Todos los gestos del plan Pro</li>
        <li>✔ Detección mejorada por IA</li>
        <li>✔ Rendimiento optimizado</li>
      </ul>

      <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium">
        Proximamente
      </button>
    </div>

  </div>
</section>


      {/* RESEÑAS */}
      <section
        ref={reviewsRef}
        className="py-24 bg-[#020617] px-6"
        data-aos="fade-up"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Lo que dicen nuestros clientes
        </h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800">
            <p className="text-gray-300 mb-4 text-sm">
              “Presenté mi proyecto final sin tocar la laptop ni una sola vez. El
              tribunal quedó impresionado.”
            </p>
            <p className="font-semibold">— Ana López, Estudiante</p>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800">
            <p className="text-gray-300 mb-4 text-sm">
              “En mis clases ya no tengo que ir y venir al escritorio. Solo muevo la
              mano y cambio de diapositiva.”
            </p>
            <p className="font-semibold">— Carlos Martínez, Profesor</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        ref={faqRef}
        className="py-24 bg-[#020617] px-6"
        data-aos="fade-up"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Preguntas frecuentes
          </h2>

          <div className="space-y-4 text-sm text-gray-200">
            <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800">
              <h3 className="font-semibold mb-1">
                ¿Necesito una cámara especial?
              </h3>
              <p className="text-gray-300">
                No, basta con una cámara web estándar que apunte hacia ti mientras
                presentas.
              </p>
            </div>

            <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800">
              <h3 className="font-semibold mb-1">
                ¿Funciona con cualquier programa de presentaciones?
              </h3>
              <p className="text-gray-300">
                Sí, mientras el programa permita avanzar y retroceder diapositivas con
                el teclado.
              </p>
            </div>

            <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800">
              <h3 className="font-semibold mb-1">
                ¿Qué pasa si la cámara no detecta bien mis gestos?
              </h3>
              <p className="text-gray-300">
                Puedes ajustar la posición, la iluminación y la distancia. En versiones
                futuras se podrán calibrar gestos personalizados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        ref={footerRef}
        className="py-10 bg-[#020617] border-t border-white/10 text-center text-gray-400 text-sm"
      >
        <p className="mb-2">
          © {new Date().getFullYear()} GesturePresenter. Proyecto académico de control
          de presentaciones por gestos. Universidad Galileo
        </p>
        <p>
          Código fuente en{" "}
          <a
            href="https://github.com/erickm13/IS-gesture-presentation-control.git"
            className="text-blue-400 hover:text-blue-300 underline"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

