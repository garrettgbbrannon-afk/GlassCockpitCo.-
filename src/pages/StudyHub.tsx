import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import cirrusFormation from "../assets/photos/cirrus-formation.webp";
import twin from "../assets/photos/twin.webp";
import cessnaSunset from "../assets/photos/cessna-sunset.webp";
import bonanzaDetail from "../assets/photos/bonanza-detail.webp";

interface HubCard {
  title: string;
  description: string;
  to: string;
  image: string;
  alt: string;
}

const CARDS: HubCard[] = [
  {
    title: "60-Question Exam",
    description: "The full simulated FAA knowledge test, weighted to match the real exam's topic distribution.",
    to: "/exam",
    image: cirrusFormation,
    alt: "Two Cirrus aircraft flying in formation over a coastline",
  },
  {
    title: "Quick Quiz",
    description: "10 questions, on the go. Pick a category or fly through a mixed set.",
    to: "/quiz",
    image: twin,
    alt: "Twin-engine piston aircraft flying over farmland",
  },
  {
    title: "Flashcards",
    description: "A categorized deck for concept review — flip through at your own pace.",
    to: "/flashcards",
    image: cessnaSunset,
    alt: "Cessna facing down the runway at sunset",
  },
  {
    title: "Struggle Set",
    description: "An adaptive 10-question quiz built from whichever categories you've been getting wrong most.",
    to: "/struggle",
    image: bonanzaDetail,
    alt: "Close-up of a Beechcraft Bonanza nose and propeller",
  },
];

export default function StudyHub() {
  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar
        right={
          <Link
            to="/progress"
            className="rounded-full border border-panel-600 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-silver-300 hover:border-panel-400 hover:text-white"
          >
            Progress
          </Link>
        }
      />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-12 text-center">
          <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.25em] text-white sm:text-3xl">
            Study Hub
          </h1>
          <div className="mx-auto mt-3 mb-3 h-px w-12 bg-silver-500/40" />
          <p className="text-silver-400">Four ways to get ready for the FAA written test.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group relative overflow-hidden rounded-2xl border border-panel-700 bg-panel-900 transition-all hover:-translate-y-0.5 hover:border-silver-400/50"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="h-full w-full object-cover grayscale-[35%] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel-900 via-panel-900/20 to-transparent" />
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg font-semibold uppercase tracking-[0.1em] text-white">
                  {card.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-silver-400">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
