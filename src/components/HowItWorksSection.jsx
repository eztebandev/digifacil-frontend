import { FaBookOpen, FaCertificate, FaUserPlus, FaVideo } from "react-icons/fa";

const steps = [
  {
    title: "Elige tu curso",
    description: "Revisa las opciones y selecciona el curso que necesitas.",
    icon: FaBookOpen,
    desktopClass: "left-0 top-[15.5rem]",
  },
  {
    title: "Inscríbete",
    description: "Completa tus datos y realiza el pago.",
    icon: FaUserPlus,
    desktopClass: "left-[28%] top-8",
  },
  {
    title: "Aprende en vivo",
    description: "Participa en clases prácticas por Google Meet, Teams o Zoom.",
    icon: FaVideo,
    desktopClass: "right-[26%] top-[14.5rem]",
  },
  {
    title: "Recibe tus materiales",
    description: "Accede a grabaciones, recursos y certificado.",
    icon: FaCertificate,
    desktopClass: "right-0 top-10",
  },
];

const desktopPath = "M78 286 C198 88 326 72 430 194 S684 326 792 150 S958 104 1040 236";
const mobilePath = "M28 18 C4 78 52 124 28 186 C4 246 52 292 28 354 C4 414 52 462 28 522";

function PaperPlaneGlyph() {
  return (
    <>
      <path
        d="M39.3 4.8 4.8 19.3c-1.4.6-1.3 2.6.2 3l13 3.2 3.2 13c.4 1.5 2.4 1.6 3 .2L38.7 4.2c.2-.5-.2-.9-.7-.7Z"
        fill="currentColor"
      />
      <path
        d="m18 25.5 9.7-9.7"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
    </>
  );
}

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-white px-4 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
            Cómo funciona
          </span>
          <h2 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl md:text-4xl">
            Un camino simple desde elegir tu curso hasta recibir tus materiales
          </h2>
        </div>

        <div className="relative mt-10 hidden min-h-[420px] md:block">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-8 h-[330px] w-full"
            viewBox="0 0 1120 360"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d={desktopPath}
              stroke="#06B6D4"
              strokeDasharray="9 13"
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path
              d={desktopPath}
              stroke="#0F172A"
              strokeDasharray="1 27"
              strokeLinecap="round"
              strokeWidth="9"
              opacity="0.12"
            />
            {[
              [78, 286],
              [430, 194],
              [792, 150],
              [1040, 236],
            ].map(([cx, cy]) => (
              <g key={`${cx}-${cy}`}>
                <circle cx={cx} cy={cy} r="19" fill="white" stroke="#06B6D4" strokeWidth="5" />
                <circle cx={cx} cy={cy} r="7" fill="#0F172A" />
              </g>
            ))}
          </svg>

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                className={`absolute z-10 w-[min(16rem,22vw)] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${step.desktopClass}`}
                key={step.title}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <Icon aria-hidden="true" className="text-lg" />
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">{step.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
              </article>
            );
          })}

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-8 z-20 h-[330px] w-full"
            viewBox="0 0 1120 360"
            fill="none"
            preserveAspectRatio="none"
          >
            <g className="text-slate-900 drop-shadow-lg">
              <animateMotion dur="11s" repeatCount="indefinite" rotate="auto" path={desktopPath} />
              <g transform="translate(-22 -22)">
                <g transform="rotate(45 22 22)">
                  <PaperPlaneGlyph />
                </g>
              </g>
            </g>
          </svg>
        </div>

        <div className="relative mt-10 md:hidden">
          <svg
            aria-hidden="true"
            className="absolute left-2 top-2 h-[540px] w-14"
            viewBox="0 0 56 540"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d={mobilePath}
              stroke="#06B6D4"
              strokeDasharray="8 12"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-2 top-2 z-20 h-[540px] w-14"
            viewBox="0 0 56 540"
            fill="none"
            preserveAspectRatio="none"
          >
            <g className="text-slate-900 drop-shadow-lg">
              <animateMotion dur="11s" repeatCount="indefinite" rotate="auto" path={mobilePath} />
              <g transform="translate(-18 -18) scale(0.82)">
                <g transform="rotate(45 22 22)">
                  <PaperPlaneGlyph />
                </g>
              </g>
            </g>
          </svg>

          <div className="relative z-10 grid gap-5 pl-16">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  key={step.title}
                >
                  <span className="absolute -left-[3.35rem] top-6 h-4 w-4 rounded-full border-4 border-cyan-500 bg-white shadow-sm" />
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                      <Icon aria-hidden="true" className="text-lg" />
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
