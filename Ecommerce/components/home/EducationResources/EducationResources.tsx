'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchLearningPosts, LearningPostDTO } from '@/lib/api/publicHomepage';

interface LearningPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readTime: string;
  topic: string;
  image: string;
}

// Mockup fallback hiển thị khi API learning-posts chưa có dữ liệu
const FALLBACK_POSTS: LearningPost[] = [
  {
    id: 'fallback-1',
    title: "Building a Lash & Brow Bar Clients Can't Resist",
    slug: 'building-lash-brow-bar',
    excerpt:
      'Soft Clients will beat a path to your door for beautiful brows. Learn five great reasons to add lash and brow services to your menu.',
    image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=600&h=400',
    readTime: '5 min read',
    topic: 'Learning Library',
  },
  {
    id: 'fallback-2',
    title: 'How Massage Therapists Can Reduce Burnout',
    slug: 'how-massage-therapists-can-reduce-burnout',
    excerpt:
      "As a massage therapist, it's easy to become overwhelmed by the physical and emotional demands of the job. Discover how to prevent burnout.",
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=400',
    readTime: '7 min read',
    topic: 'Learning Library',
  },
];

export default function EducationResources() {
  const [posts, setPosts] = useState<LearningPost[]>(FALLBACK_POSTS);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        const data = await fetchLearningPosts(4);
        if (!isMounted || !data.length) {
          return;
        }

        const mapped: LearningPost[] = data.map((item: LearningPostDTO) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt ?? '',
          readTime: item.readTime ?? '',
          topic: item.topic ?? item.category ?? '',
          image: item.imageUrl ?? 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400',
        }));

        setPosts(mapped);
      } catch (error) {
        console.error('[EducationResources] failed to load learning posts', error);
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        {/* Learning Library / Blog */}
        <div>
          <h3 className="mb-6 text-2xl font-bold text-gray-900">Learning Library</h3>
          <p className="mb-8 text-gray-600">
            Browse a wide variety of blog topics in our learning area, from makeup to nails and beyond.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group flex overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
              >
                <div className="relative h-full w-1/3 flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <div className="mb-2 flex items-center text-xs text-gray-600">
                    <span className="text-brand-purple-600">{post.topic}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h4 className="mb-2 font-semibold text-gray-900 group-hover:text-brand-purple-600">
                    {post.title}
                  </h4>
                  <p className="mb-4 text-sm text-gray-600">{post.excerpt}</p>
                  <span className="text-sm font-medium text-brand-purple-600">
                    Read Article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
