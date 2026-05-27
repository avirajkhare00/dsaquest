import { topics } from "@/data/topics";
import TopicsGrid from "@/components/TopicsGrid";

export const metadata = {
  title: "All Topics — DSAQuest",
  description: "Choose a data structure or algorithm topic to master.",
};

export default function TopicsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: 'var(--foreground)' }}>
          📚 All Topics
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
          Each topic contains a story, an interactive visualizer, and a quiz.
          Master them all to become interview-ready!
        </p>
      </div>

      <TopicsGrid topics={topics} />
    </div>
  );
}
