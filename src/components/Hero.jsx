export default function Hero() {
  return (
    <section className="hero-section" id="inicio">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Clases en vivo por Google Meet</span>
          <h1>Aprender tecnologia puede sentirse simple, humano y util.</h1>
          <p>
            DigiFacil acompana a personas que no vienen del mundo tecnologico
            con cursos online, practicos y guiados paso a paso.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#cursos">
              Ver cursos
            </a>
            <a className="secondary-button" href="#contacto">
              Hablar con nosotros
            </a>
          </div>

          <ul className="hero-points">
            <li>Explicaciones claras, sin tecnicismos innecesarios</li>
            <li>Grupos pequenos y acompanamiento cercano</li>
            <li>Enfoque real para vida diaria y emprendimientos</li>
          </ul>
        </div>

        <div className="hero-card">
          <div className="hero-badge">Metodologia DigiFacil</div>
          <div className="hero-panel">
            <div>
              <strong>1. Entender</strong>
              <p>Partimos desde cero y usamos ejemplos cotidianos.</p>
            </div>
            <div>
              <strong>2. Practicar</strong>
              <p>Trabajamos en vivo contigo durante la videollamada.</p>
            </div>
            <div>
              <strong>3. Aplicar</strong>
              <p>Sales con herramientas para usar de inmediato.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
