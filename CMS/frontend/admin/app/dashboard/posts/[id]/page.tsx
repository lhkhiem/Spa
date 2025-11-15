'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';
import MediaPicker from '@/components/MediaPicker';
import { generateSlug } from '@/lib/slug';
import { Image as ImageIcon, X } from 'lucide-react';
import { buildApiUrl, getAssetUrl } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function EditPostPage(){
  const params = useParams();
  const id = params?.id as string;
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
  const [pubDate, setPubDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [featuredImageId, setFeaturedImageId] = useState<string>('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [allTopics, setAllTopics] = useState<Array<{id:string; name:string}>>([]);
  const [allTags, setAllTags] = useState<Array<{id:string; name:string}>>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const handleSelectFeaturedImage = async (value: string | string[]) => {
    const assetId = Array.isArray(value) ? value[0] : value;
    console.log('[handleSelectFeaturedImage] Selected asset ID:', assetId);
    setFeaturedImageId(assetId || '');
    
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

  // Fetch topics & tags lists
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

  useEffect(()=>{ fetchPost(); },[id]);

  const fetchPost = async () => {
    try{
      const res = await fetch(buildApiUrl(`/api/posts/${id}`), { credentials: 'include' });
      const data = await res.json();
      setTitle(data.title || '');
      setSlug(data.slug || '');
      setExcerpt(data.excerpt || '');
      // Handle both HTML string and JSON content (for backward compatibility)
      if (typeof data.content === 'string') {
        setContent(data.content);
      } else if (data.content) {
        // If content is JSON (from old TipTap format), convert to HTML or empty
        setContent('');
      } else {
        setContent('');
      }
      setStatus(data.status || 'draft');
      setAuthorId(data.author_id || '');
      setPubDate(data.published_at ? String(data.published_at).slice(0,10) : '');
      setReadTime(data.read_time || data.readTime || '');
      // Preselect relations if API provides them (optional)
      if (Array.isArray(data.topics)) setSelectedTopicIds(data.topics.map((t:any)=>t.id));
      if (Array.isArray(data.tags)) setSelectedTagIds(data.tags.map((t:any)=>t.id));
      
      // Load featured image
      if (data.cover_asset_id) {
        setFeaturedImageId(data.cover_asset_id);
        if (data.cover_asset) {
          const imageUrl = data.cover_asset.medium_url || data.cover_asset.url;
          setFeaturedImage(getAssetUrl(imageUrl));
        }
      }
    }catch(err){
      console.error('Failed to load post:', err);
      toast.error('Failed to load post');
    }finally{ setLoading(false); }
  }

  // Debounced auto-generate slug unless manually edited
  useEffect(()=>{
    if (manualEdit || !title) return;
    const t = setTimeout(()=> setSlug(generateSlug(title)), 1200);
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
  }, [title, slug, excerpt, content, status, authorId, pubDate, readTime]);

  const handleSubmit = async () => {
    if (!title) { 
      toast.error('Title is required'); 
      return; 
    }
    setSaving(true);
    try{
      const body: any = {
        title,
        slug: slug || generateSlug(title),
        excerpt,
        content,
        status,
        published_at: status === 'published' ? (pubDate ? pubDate : new Date().toISOString()) : null,
        topics: selectedTopicIds,
        tags: selectedTagIds,
        read_time: readTime?.trim() ? readTime.trim() : null,
      };
      
      // Include author if changed
      body.author_id = authorId || null;
      
      // Include cover_asset_id (even if null to allow clearing)
      body.cover_asset_id = featuredImageId || null;
      
      console.log('[handleSubmit] Body:', body);
      
      const res = await fetch(buildApiUrl(`/api/posts/${id}`),{
        method:'PATCH',
        headers:{ 'Content-Type':'application/json' },
        credentials:'include',
        body: JSON.stringify(body),
      });
      
      if(!res.ok) {
        const json = await res.json().catch(()=>({ error: 'Failed to update post' }));
        throw new Error(json.message || json.error || 'Failed to update post');
      }
      
      toast.success('Post updated successfully!');
      router.push('/dashboard/posts');
    }catch(err){
      console.error('Failed to update post:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update post');
    }finally{ 
      setSaving(false); 
    }
  }

  if(loading) return <div className='p-6'>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <div className="text-sm text-muted-foreground">{saving? 'Saving...' : 'Saved ✓'}</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input className="w-full rounded border px-3 py-2" value={title} onChange={(e)=>setTitle(e.target.value)} required />
            <div className="text-xs text-muted-foreground mt-1">Preview: {slugPreview}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input className="w-full rounded border px-3 py-2" value={slug} onChange={(e)=>setSlug(generateSlug(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea className="w-full rounded border px-3 py-2" value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Read Time</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="e.g. 5 min read"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Displayed with the post to help readers gauge the reading length.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <RichTextEditor 
              value={content} 
              onChange={setContent}
              placeholder="Start writing your post content here..."
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded border p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Featured Image</label>
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
              <label className="block text-sm font-medium mb-1">Author (optional)</label>
              <select
                className="w-full rounded border px-3 py-2"
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
              <label className="block text-sm font-medium mb-1">Published Date</label>
              <input type="date" className="w-full rounded border px-3 py-2" value={pubDate} onChange={(e)=>setPubDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select className="w-full rounded border px-3 py-2" value={status} onChange={(e)=>setStatus(e.target.value as any)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            {/* Topics */}
            <div>
              <label className="block text-sm font-medium mb-1">Topics</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto rounded border p-2">
                {allTopics.map(t => (
                  <label key={t.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedTopicIds.includes(t.id)}
                      onChange={(e)=>{
                        setSelectedTopicIds(prev => e.target.checked ? [...prev, t.id] : prev.filter(id=>id!==t.id));
                      }}
                    />
                    <span>{t.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto rounded border p-2">
                {allTags.map(t => (
                  <label key={t.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedTagIds.includes(t.id)}
                      onChange={(e)=>{
                        setSelectedTagIds(prev => e.target.checked ? [...prev, t.id] : prev.filter(id=>id!==t.id));
                      }}
                    />
                    <span>{t.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={saving} className="w-full rounded bg-blue-600 text-white px-3 py-2">{saving? 'Saving...':'Save'}</button>
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
