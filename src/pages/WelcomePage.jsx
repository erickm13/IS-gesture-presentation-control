import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../index.css";

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

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
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
        {/* glow radial */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.2),transparent_60%)] pointer-events-none" />

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 opacity-90 relative z-10 max-w-3xl">
          Controla tus presentaciones con solo mover la mano
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 relative z-10">
          GesturePresenter detecta tus gestos en tiempo real y avanza las diapositivas
          sin que tengas que tocar el teclado, el mouse o un control remoto.
        </p>

        {/* Logos flotando */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
            className="w-12 md:w-25 absolute top-[20%] left-[12%] floating opacity-70"
            alt="React"
          />
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg"
            className="w-12 md:w-25 absolute top-[12%] right-[16%] floating-reverse opacity-70"
            alt="TailwindCSS"
          />
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg"
            className="w-10 md:w-25 absolute bottom-[22%] left-[20%] floating opacity-70"
            alt="Vite"
          />
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
            className="w-10 md:w-25 absolute bottom-[18%] right-[22%] floating-reverse opacity-70"
            alt="JavaScript"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Google_Mediapipe_logo.svg/512px-Google_Mediapipe_logo.svg.png"
            className="w-10 md:w-25 absolute top-[25%] left-[45%] floating opacity-70 rounded"
            alt="MediaPipe"
          />
        </div>

        {/* Botones principales */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 relative z-10">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium 
                       shadow-lg shadow-blue-600/40 transition transform hover:scale-105"
          >
            Comenzar ahora
          </button>
          <button
            onClick={() => scrollTo(demoRef)}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium 
                       text-gray-200 border border-gray-700"
          >
            Ver demo
          </button>
        </div>
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
        className="py-20 bg-[#020617] px-6"
        data-aos="fade-up"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Mira cómo funciona</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Próximamente podrás ver una demo en vivo controlando una presentación real
            con gestos de la mano. Por ahora, te mostramos un espacio listo para tu
            video o GIF.
          </p>

          <div className="bg-[#0f172a] border border-gray-800 rounded-3xl h-64 md:h-80 flex items-center justify-center text-gray-400 text-sm">
            Área de demo — inserta aquí tu video o GIF cuando esté listo.
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
            <h2 className="text-2xl font-bold mb-4">Compatible con tus herramientas</h2>
            <p className="text-gray-300 text-sm mb-4">
              GesturePresenter funciona con cualquier software de presentaciones que
              acepte atajos de teclado:
            </p>
            <ul className="space-y-2 text-gray-300 text-sm list-disc list-inside">
              <li>PowerPoint</li>
              <li>Google Slides</li>
              <li>Visores de PDF</li>
              <li>Keynote y herramientas basadas en navegador</li>
            </ul>
          </div>

          {/* Ventajas */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Pensado para ser práctico</h2>
            <ul className="space-y-3 text-gray-300 text-sm">
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Nuestros Precios
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-[#0f172a] p-8 rounded-2xl border border-gray-800 text-center">
            <h3 className="text-2xl font-bold mb-2">Básico</h3>
            <p className="text-gray-400 mb-4 text-sm">Ideal para comenzar</p>
            <p className="text-4xl font-extrabold mb-6">$9</p>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium">
              Elegir plan
            </button>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-2xl border border-blue-600 shadow-xl shadow-blue-700/30 text-center">
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-gray-400 mb-4 text-sm">Para usos frecuentes</p>
            <p className="text-4xl font-extrabold mb-6">$29</p>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium">
              Elegir plan
            </button>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-2xl border border-gray-800 text-center">
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <p className="text-gray-400 mb-4 text-sm">Para equipos completos</p>
            <p className="text-4xl font-extrabold mb-6">$49</p>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium">
              Elegir plan
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
          de presentaciones por gestos.
        </p>
        <p>
          Código fuente en{" "}
          <a
            href="https://github.com/tu-usuario/tu-repo"
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

