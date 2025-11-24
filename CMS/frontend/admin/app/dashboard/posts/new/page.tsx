'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';
import MediaPicker from '@/components/MediaPicker';
import { generateSlug } from '@/lib/slug';
import { Image as ImageIcon, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { buildApiUrl, getAssetUrl } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function NewPostPage(){
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [manualEdit, setManualEdit] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [readTime, setReadTime] = useState('');
  const [content, setContent] = useState<string>(''); // Changed to string for HTML content
  const [status, setStatus] = useState<'draft'|'published'>('draft');
  const [authorId, setAuthorId] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [pubDate, setPubDate] = useState<string>(()=> new Date().toISOString().slice(0,10));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [featuredImageId, setFeaturedImageId] = useState<string>('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [allTopics, setAllTopics] = useState<Array<{id:string; name:string}>>([]);
  const [allTags, setAllTags] = useState<Array<{id:string; name:string}>>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  
  // Post type and conditional fields
  const [isFeatured, setIsFeatured] = useState(true); // Default to true

  const handleSelectFeaturedImage = async (value: string | string[]) => {
    const assetId = Array.isArray(value) ? value[0] : value;
    console.log('[handleSelectFeaturedImage] Selected asset ID:', assetId);
    setFeaturedImageId(assetId || '');
    setDirty(true);
    
    // Fetch asset details to get URL
    if (assetId) {
      try {
        const response = await fetch(buildApiUrl(`/api/assets/${assetId}`), {
          credentials: 'include'
        });
        if (response.ok) {
          const asset = await response.json();
          const imageUrl = getAssetUrl(asset.sizes?.medium?.url || asset.url);
          setFeaturedImage(imageUrl);
        }
      } catch (error) {
        console.error('Failed to fetch asset:', error);
      }
    } else {
      setFeaturedImage('');
    }
  };

  const slugPreview = useMemo(()=> `/blog/${slug || generateSlug(title)}`, [slug, title]);

  // Fetch users for author dropdown
  useEffect(() => {
    fetch(buildApiUrl('/api/users'), { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        const userList = Array.isArray(d) ? d : (d?.data || []);
        setUsers(userList);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
      });
  }, []);

  // Fetch topics and tags
  useEffect(() => {
    Promise.all([
      fetch(buildApiUrl('/api/topics'), { credentials: 'include' }).then(r=>r.json()).catch(()=>[]),
      fetch(buildApiUrl('/api/tags'), { credentials: 'include' }).then(r=>r.json()).catch(()=>[]),
    ]).then(([topics, tags]) => {
      setAllTopics(Array.isArray(topics) ? topics : []);
      setAllTags(Array.isArray(tags) ? tags : []);
    }).catch((e)=>{
      console.error('Failed to fetch topics/tags', e);
    });
  }, []);

  // Debounced auto-generate slug unless user edited it manually
  useEffect(()=>{
    setDirty(true);
    if (manualEdit || !title) return;
    const t = setTimeout(()=>{
      setSlug(generateSlug(title));
    }, 1200);
    return ()=> clearTimeout(t);
  }, [title, manualEdit]);

  // Ctrl+S to save
  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [title, slug, excerpt, content, status, authorId, pubDate, isFeatured, readTime]);

  // Optional autosave every 60s
  useEffect(()=>{
    const t = setInterval(()=>{ if (dirty && !saving) handleSubmit(true); }, 60000);
    return ()=> clearInterval(t);
  }, [dirty, saving]);

  const handleSubmit = async (autosave?: boolean) => {
    console.log('[handleSubmit] featuredImageId:', featuredImageId);
    if (!title) { 
      if(!autosave) toast.error('Title is required');
      return;
    }
    setSaving(true);
    try{
      const body: any = {
        title,
        slug: slug || generateSlug(title),
        excerpt,
        content,
        status: autosave ? 'draft' : status,
        published_at: (status === 'published') ? pubDate : undefined,
        is_featured: isFeatured,
        topics: selectedTopicIds,
        tags: selectedTagIds,
      read_time: readTime?.trim() ? readTime.trim() : null,
      };
      
      // Only include author_id if a user is selected
      if (authorId) {
        body.author_id = authorId;
      }
      
      // Include cover_asset_id if featured image is selected
      if (featuredImageId) {
        body.cover_asset_id = featuredImageId;
        console.log('[handleSubmit] Adding cover_asset_id:', featuredImageId);
      } else {
        console.log('[handleSubmit] No featuredImageId, skipping cover_asset_id');
      }

      // Attach topics/tags selections (arrays of ids)
      if (selectedTopicIds.length) body.topics = selectedTopicIds;
      if (selectedTagIds.length) body.tags = selectedTagIds;
      
      // Blog/Article-specific fields
      
      console.log('[handleSubmit] Final Body:', JSON.stringify(body, null, 2));
      
      const res = await fetch(buildApiUrl('/api/posts'),{
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        credentials:'include',
        body: JSON.stringify(body),
      });
      
      if(!res.ok) {
        const json = await res.json().catch(()=>({ error: 'Failed to create post' }));
        throw new Error(json.message || json.error || 'Failed to create post');
      }
      
      if (!autosave) {
        toast.success(status === 'published' ? 'Post published successfully!' : 'Draft saved successfully!');
        router.push('/dashboard/posts');
      }
      setDirty(false);
    }catch(err){
      console.error('[NewPost] Error:', err);
      if (!autosave) {
        toast.error(err instanceof Error ? err.message : 'Failed to create post');
      }
    }finally{ 
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Post</h1>
          <p className="text-sm text-muted-foreground">Add a new post to your blog</p>
        </div>
        <Link
          href="/dashboard/posts"
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Title</label>
            <input className="w-full rounded border border-input bg-background text-foreground px-3 py-2" value={title} onChange={(e)=>setTitle(e.target.value)} required />
            <div className="text-xs text-muted-foreground mt-1">Preview: {slugPreview}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Slug</label>
            <input className="w-full rounded border border-input bg-background text-foreground px-3 py-2" value={slug} onChange={(e)=>setSlug(generateSlug(e.target.value))} />
            <p className="text-xs text-muted-foreground mt-1">Auto-generated from title; you can edit.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Excerpt</label>
            <textarea className="w-full rounded border border-input bg-background text-foreground px-3 py-2" value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Estimated Read Time</label>
            <input
              className="w-full rounded border border-input bg-background text-foreground px-3 py-2"
              value={readTime}
              onChange={(e) => {
                setReadTime(e.target.value);
                setDirty(true);
              }}
              placeholder="e.g. 5 min read"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Displayed with the post to help readers gauge the reading length.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Content</label>
            <RichTextEditor 
              value={content} 
              onChange={(html) => { 
                setContent(html); 
                setDirty(true); 
              }} 
              placeholder="Start writing your post content here..."
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded border p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Featured Image</label>
              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage('');
                      setFeaturedImageId('');
                      setDirty(true);
                    }}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="w-full h-40 rounded border-2 border-dashed border-muted-foreground/25 hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-sm">Choose from Media Library</span>
                </button>
              )}
              {featuredImage && (
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="w-full mt-2 text-sm text-primary hover:underline"
                >
                  Change Image
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Author (optional)</label>
              <select
                className="w-full rounded border border-input bg-background text-foreground px-3 py-2"
                value={authorId}
                onChange={(e)=>setAuthorId(e.target.value)}
              >
                <option value="">-- No Author --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">Select an author or leave blank.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Published Date</label>
              <input type="date" className="w-full rounded border border-input bg-background text-foreground px-3 py-2" value={pubDate} onChange={(e)=>setPubDate(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">Used when status is Published (can schedule future).</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Status</label>
              <select className="w-full rounded border border-input bg-background text-foreground px-3 py-2" value={status} onChange={(e)=>setStatus(e.target.value as any)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-foreground">
                <input type="checkbox" checked={isFeatured} onChange={(e)=>setIsFeatured(e.target.checked)} />
                <span className="text-sm font-medium">Featured Post</span>
              </label>
              <p className="text-xs text-muted-foreground mt-1">Show on homepage</p>
            </div>
            {/* Topics */}
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Topics</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto rounded border border-input bg-background p-2">
                {allTopics.map(t => (
                  <label key={t.id} className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedTopicIds.includes(t.id)}
                      onChange={(e)=>{
                        setSelectedTopicIds(prev => e.target.checked ? [...prev, t.id] : prev.filter(id=>id!==t.id));
                        setDirty(true);
                      }}
                    />
                    <span>{t.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Choose one or more topics.</p>
            </div>
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Tags</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto rounded border border-input bg-background p-2">
                {allTags.map(t => (
                  <label key={t.id} className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedTagIds.includes(t.id)}
                      onChange={(e)=>{
                        setSelectedTagIds(prev => e.target.checked ? [...prev, t.id] : prev.filter(id=>id!==t.id));
                        setDirty(true);
                      }}
                    />
                    <span>{t.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Add tags to improve discovery.</p>
            </div>
          </div>
          <button onClick={()=>handleSubmit(false)} disabled={saving} className="w-full rounded bg-blue-600 text-white px-3 py-2">{saving? 'Saving...':'Save'}</button>
        </div>
      </div>
      
      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        value={featuredImageId}
        onChange={handleSelectFeaturedImage}
        modalOnly
      />
    </div>
  );
}
