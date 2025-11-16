'use client';

interface TopicFilterProps {
  topics: string[];
}

export default function TopicFilter({ topics }: TopicFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button className="rounded-full border-2 border-red-700 bg-red-700 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-800 hover:border-red-800 shadow-sm">
        All Topics
      </button>
      {topics.map((topic) => (
        <button
          key={topic}
          className="rounded-full border-2 border-red-200 bg-red-50/80 px-4 py-2 text-sm font-medium text-red-800 transition-all hover:border-red-300 hover:bg-red-100 hover:text-red-900"
        >
          {topic}
        </button>
      ))}
    </div>
  );
}

