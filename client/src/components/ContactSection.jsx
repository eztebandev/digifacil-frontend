export default function ContactSection() {
  return (
    <section className="contact-section" id="contacto">
      <div className="container contact-shell">
        <div>
          <span className="eyebrow">Contacto</span>
          <h2>Te ayudamos a encontrar el curso ideal para tu ritmo.</h2>
          <p>
            Si quieres aprender para tu trabajo, tu negocio o tu vida diaria,
            conversemos y te orientamos.
          </p>
        </div>

        <div className="contact-card">
          <a href="mailto:hola@digifacil.lat">hola@digifacil.lat</a>
          <a href="https://digifacil.lat/" target="_blank" rel="noreferrer">
            digifacil.lat
          </a>
          <a href="https://wa.me/51999999999" target="_blank" rel="noreferrer">
            WhatsApp de atencion
          </a>
        </div>
      </div>
    </section>
  );
}
