'use client';

interface TopicFilterProps {
  topics: string[];
  selectedTopic?: string | null;
  onTopicClick?: (topic: string | null) => void;
}

export default function TopicFilter({ topics, selectedTopic, onTopicClick }: TopicFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button 
        onClick={() => onTopicClick?.(null)}
        className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all shadow-sm ${
          !selectedTopic
            ? 'border-red-700 bg-red-700 text-white hover:bg-red-800 hover:border-red-800'
            : 'border-red-200 bg-red-50/80 text-red-800 hover:border-red-300 hover:bg-red-100 hover:text-red-900'
        }`}
      >
        All Topics
      </button>
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onTopicClick?.(topic)}
          className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
            selectedTopic === topic
              ? 'border-red-700 bg-red-700 text-white hover:bg-red-800 hover:border-red-800 shadow-sm'
              : 'border-red-200 bg-red-50/80 text-red-800 hover:border-red-300 hover:bg-red-100 hover:text-red-900'
          }`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}

