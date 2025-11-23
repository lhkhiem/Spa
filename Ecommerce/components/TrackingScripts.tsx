'use client';

// Tracking Scripts Component
// Dynamically loads and injects tracking scripts (Google Analytics, Facebook Pixel, etc.)

import { useEffect } from 'react';
import Script from 'next/script';
import { getApiUrl } from '@/config/site';

interface TrackingScript {
  id: string;
  name: string;
  type: string;
  provider?: string;
  position: 'head' | 'body';
  script_code: string;
  load_strategy: 'sync' | 'async' | 'defer';
  priority: number;
}

interface TrackingScriptsProps {
  position: 'head' | 'body';
  page?: string;
}

/**
 * TrackingScripts Component (Client-Side)
 * Fetches and renders active tracking scripts from CMS
 * Supports Google Analytics, Facebook Pixel, Tag Managers, etc.
 */
export default function TrackingScripts({ position, page = 'all' }: TrackingScriptsProps) {
  useEffect(() => {
    // Fetch and inject scripts on client-side
    async function loadScripts() {
      try {
        const apiUrl = getApiUrl();
        const url = `${apiUrl}/tracking-scripts/active?page=${encodeURIComponent(page)}`;
        
        const response = await fetch(url);
        if (!response.ok) return;
        
        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) return;
        
        const scripts: TrackingScript[] = result.data;
        const filteredScripts = scripts
          .filter(s => s.position === position)
          .sort((a, b) => a.priority - b.priority);
        
        // Inject scripts dynamically - Simple approach: inject raw HTML
        filteredScripts.forEach((script) => {
          // Check if already injected
          if (document.getElementById(`tracking-${script.id}`)) return;
          
          // Create a wrapper div to hold the scripts
          const wrapper = document.createElement('div');
          wrapper.id = `tracking-${script.id}`;
          wrapper.style.display = 'none';
          wrapper.innerHTML = script.script_code;
          
          // Inject wrapper
          if (position === 'head') {
            document.head.appendChild(wrapper);
          } else {
            document.body.appendChild(wrapper);
          }
          
          // Extract and re-execute all scripts (because innerHTML doesn't execute scripts)
          const scriptTags = wrapper.querySelectorAll('script');
          scriptTags.forEach((oldScript) => {
            const newScript = document.createElement('script');
            
            // Copy attributes
            Array.from(oldScript.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value);
            });
            
            // Copy content if inline script
            if (!oldScript.src) {
              newScript.textContent = oldScript.textContent;
            }
            
            // Replace old script with new one to trigger execution
            oldScript.parentNode?.replaceChild(newScript, oldScript);
          });
        });
      } catch (error) {
        console.error('Error loading tracking scripts:', error);
      }
    }
    
    loadScripts();
  }, [position, page]);

  // Return null as scripts are injected via useEffect
  return null;
}

// Alternative approach using Script component (not used, but kept for reference)
function TrackingScriptsWithScriptComponent({ position, page = 'all' }: TrackingScriptsProps) {
  const scripts: TrackingScript[] = []; // This would need to be fetched

  return (
    <>
      {scripts.map((script) => {
        // Handle different script types
        const scriptContent = script.script_code;
        
        // Check if it's inline script or external script
        const isExternalScript = scriptContent.includes('<script') && scriptContent.includes('src=');
        
        if (isExternalScript) {
          // Extract src and other attributes
          const srcMatch = scriptContent.match(/src=["']([^"']+)["']/);
          const asyncMatch = scriptContent.includes('async');
          const deferMatch = scriptContent.includes('defer');
          
          if (srcMatch && srcMatch[1]) {
            const src = srcMatch[1];
            
            // Determine strategy
            let strategy: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive' = 'afterInteractive';
            if (script.load_strategy === 'defer' || deferMatch) {
              strategy = 'lazyOnload';
            } else if (script.load_strategy === 'async' || asyncMatch) {
              strategy = 'afterInteractive';
            }
            
            return (
              <Script
                key={script.id}
                src={src}
                strategy={strategy}
                id={`tracking-${script.id}`}
              />
            );
          }
        }
        
        // For inline scripts or complex scripts, use dangerouslySetInnerHTML
        // Extract script content (remove <script> tags if present)
        let cleanScript = scriptContent;
        cleanScript = cleanScript.replace(/<script[^>]*>/gi, '');
        cleanScript = cleanScript.replace(/<\/script>/gi, '');
        
        // Determine strategy for inline scripts
        let strategy: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive' = 'afterInteractive';
        if (script.load_strategy === 'defer') {
          strategy = 'lazyOnload';
        }
        
        return (
          <Script
            key={script.id}
            id={`tracking-${script.id}`}
            strategy={strategy}
            dangerouslySetInnerHTML={{ __html: cleanScript }}
          />
        );
      })}
    </>
  );
}

