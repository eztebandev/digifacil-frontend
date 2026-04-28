import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import CoursesSection from "../components/CoursesSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { api } from "../lib/api";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getCourses()
      .then((data) => {
        setCourses(data);
        setError("");
      })
      .catch((requestError) => {
        setError(requestError.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-shell">
      <Header />
      <Hero />
      {error && <div className="container"><p className="form-error">{error}</p></div>}
      <CoursesSection courses={courses} loading={loading} />
      <ContactSection />
      <Footer />
    </main>
  );
}
