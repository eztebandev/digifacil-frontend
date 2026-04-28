export default function Header() {
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <a className="brand" href="#inicio">
          Digi<span>Facil</span>
        </a>

        <nav className="nav-links" aria-label="Principal">
          <a href="#inicio">Inicio</a>
          <a href="#cursos">Cursos</a>
          <a href="#contacto">Contacto</a>
          <a className="nav-cta" href="/admin/login">
            Administrar
          </a>
        </nav>
      </div>
    </header>
  );
}
