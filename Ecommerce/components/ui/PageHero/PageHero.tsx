import { ReactNode } from 'react';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

interface PageHeroProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  backgroundOverlay?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function PageHero({
  title,
  description,
  backgroundImage,
  backgroundOverlay = true,
  className = '',
  children,
}: PageHeroProps) {
  return (
    <div className={`relative py-20 text-white overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {backgroundImage && (
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              filter: 'blur(1px)',
            }}
          />
        )}
        {backgroundOverlay && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 via-red-800/50 to-rose-900/60" />
        )}
      </div>
      
      {/* Content */}
      <div className="relative container-custom z-10">
        <FadeInSection>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl drop-shadow-lg">{title}</h1>
          {description && (
            <p className="mb-8 max-w-2xl text-lg text-gray-100 drop-shadow-md">
              {description}
            </p>
          )}
          {children}
        </FadeInSection>
      </div>
    </div>
  );
}

