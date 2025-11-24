'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Grid3x3, Image as ImageIcon, X, Grid, List, AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import MediaPicker from '@/components/MediaPicker';
import axios from 'axios';
import { getAssetUrl, buildApiUrl } from '@/lib/api';

// Generate slug from name
const generateSlug = (name: string): string => {
  if (!name) return '';
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-]/g, '')
    .toLowerCase()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [form, setForm] = useState({ 
    name: '', 
    slug: '', 
    description: '', 
    parent_id: '',
    image_id: '',
    is_featured: true  // Default to true
  });
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [deleteWarning, setDeleteWarning] = useState<{
    show: boolean;
    categoryId: string | null;
    categoryName: string;
    productsCount: number;
    subcategoriesCount: number;
    warnings: string[];
  }>({
    show: false,
    categoryId: null,
    categoryName: '',
    productsCount: 0,
    subcategoriesCount: 0,
    warnings: []
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchCategories = async () => {
      try {
        const response: any = await axios.get(buildApiUrl('/api/product-categories'), {
          withCredentials: true
        });
        if (isMounted) {
          setCategories(response.data?.data || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch categories:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchCategories();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const response: any = await axios.get(buildApiUrl('/api/product-categories'), {
        withCredentials: true
      });
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFeaturedImage = (assetId: string | string[]) => {
    // MediaPicker onChange returns asset ID(s)
    const id = Array.isArray(assetId) ? assetId[0] : assetId;
    if (!id) {
      setFeaturedImageUrl('');
      setForm(prev => ({ ...prev, image_id: '' }));
      setImageRemoved(true); // Mark as removed if no image selected
      return;
    }
    
    setImageRemoved(false); // Reset removed flag when image is selected
    
    // Fetch asset to get URL for preview
    let isMounted = true;
    axios.get(buildApiUrl(`/api/assets/${id}`), {
      withCredentials: true
    }).then(response => {
      if (!isMounted) return;
      const asset = response.data as any;
      // Use the best available URL with proper formatting
      const imageUrl = asset.cdn_url || asset.url || asset.sizes?.thumb?.url || asset.sizes?.medium?.url || '';
      setFeaturedImageUrl(getAssetUrl(imageUrl));
      setForm(prev => ({ ...prev, image_id: id }));
    }).catch(error => {
      if (!isMounted) return;
      console.error('Failed to fetch asset:', error);
      setFeaturedImageUrl('');
      setForm(prev => ({ ...prev, image_id: id }));
    });
    
    // Note: We can't return cleanup from this function, but we'll handle it differently
    // The component unmount will prevent state updates anyway
  };

  const openCreate = () => {
    setEditing(null);
    setOriginalName('');
    setForm({ name: '', slug: '', description: '', parent_id: '', image_id: '', is_featured: true });
    setFeaturedImageUrl('');
    setImageRemoved(false);
    setShowDialog(true);
  };

  const openEdit = async (cat: any) => {
    setEditing(cat);
    setOriginalName(cat.name || '');
    setForm({ 
      name: cat.name || '', 
      slug: cat.slug || '', 
      description: cat.description || '',
      parent_id: cat.parent_id || '',
      image_id: cat.image_id || '',
      is_featured: cat.is_featured || false
    });
    setImageRemoved(false); // Reset image removed flag
    
    // Always fetch image if image_id exists, regardless of image_url
    if (cat.image_id) {
      try {
        const response = await axios.get(buildApiUrl(`/api/assets/${cat.image_id}`), {
          withCredentials: true
        });
        const asset = response.data as any;
        // Use the best available URL with proper formatting
        const imageUrl = asset.cdn_url || asset.url || asset.sizes?.thumb?.url || asset.sizes?.medium?.url || '';
        setFeaturedImageUrl(getAssetUrl(imageUrl));
      } catch (error) {
        console.error('Failed to fetch asset:', error);
        // Fallback to image_url from category if available
        if (cat.image_url) {
          setFeaturedImageUrl(getAssetUrl(cat.image_url));
        } else {
          setFeaturedImageUrl('');
        }
      }
    } else {
      // No image_id, use image_url from category if available
      setFeaturedImageUrl(cat.image_url ? getAssetUrl(cat.image_url) : '');
    }
    
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate slug: if editing and name unchanged, keep original slug; otherwise generate new
      const finalSlug = editing && form.name === originalName 
        ? form.slug 
        : generateSlug(form.name);
      
      // Prepare submit data - only include image_id if it's explicitly set (not empty string)
      const submitData: any = {
        name: form.name,
        slug: finalSlug,
        description: form.description,
        parent_id: form.parent_id || null,
        is_featured: form.is_featured,
      };
      
      // Handle image_id: 
      // - If user explicitly removed image (imageRemoved = true), send null to delete
      // - If image_id has value, send it (new or updated image)
      // - If editing and image_id is empty but not removed, don't send (preserve existing image)
      // - If creating and no image, send null
      if (imageRemoved) {
        // User explicitly removed image - send null to delete
        submitData.image_id = null;
      } else if (form.image_id && form.image_id.trim() !== '') {
        // Has image_id - send it (new or updated image)
        submitData.image_id = form.image_id;
      } else if (!editing) {
        // Creating new category without image - send null
        submitData.image_id = null;
      }
      // If editing and image_id is empty but imageRemoved is false, don't include image_id (preserve existing)
      
      if (editing) {
        await axios.put(buildApiUrl(`/api/product-categories/${editing.id}`), submitData, {
          withCredentials: true
        });
      } else {
        await axios.post(buildApiUrl('/api/product-categories'), submitData, {
          withCredentials: true
        });
      }
      setShowDialog(false);
      setFeaturedImageUrl(''); // Reset image preview
      await fetchCategories();
      
      // Reload image if category was edited and has image_id
      if (editing && submitData.image_id) {
        try {
          const response = await axios.get(buildApiUrl(`/api/assets/${submitData.image_id}`), {
            withCredentials: true
          });
          const asset = response.data as any;
          const imageUrl = asset.cdn_url || asset.url || asset.sizes?.thumb?.url || asset.sizes?.medium?.url || '';
          if (imageUrl) {
            setFeaturedImageUrl(getAssetUrl(imageUrl));
          }
        } catch (error) {
          console.error('Failed to reload image:', error);
        }
      }
    } catch (err) {
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    // Find category name
    const category = categories.find(c => c.id === id);
    const categoryName = category?.name || 'this category';

    try {
      // Check relationships first
      const response = await axios.get<any>(buildApiUrl(`/api/product-categories/${id}/relationships`), {
        withCredentials: true
      });
      
      const relationships = response.data as any;
      
      if (relationships.hasRelationships) {
        // Show warning modal
        setDeleteWarning({
          show: true,
          categoryId: id,
          categoryName,
          productsCount: relationships.productsCount || 0,
          subcategoriesCount: relationships.subcategoriesCount || 0,
          warnings: relationships.warnings || []
        });
      } else {
        // No relationships, proceed with delete
        if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
          await performDelete(id);
        }
      }
    } catch (err: any) {
      // If check endpoint fails, try direct delete (backend will check)
      if (err.response?.status === 404) {
        // Endpoint not found, try direct delete
        if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
          await performDelete(id);
        }
      } else {
        console.error('Failed to check relationships:', err);
        alert('Failed to check category relationships. Please try again.');
      }
    }
  };

  const performDelete = async (id: string) => {
    try {
      await axios.delete(buildApiUrl(`/api/product-categories/${id}`), {
        withCredentials: true
      });
      
      setDeleteWarning({ show: false, categoryId: null, categoryName: '', productsCount: 0, subcategoriesCount: 0, warnings: [] });
      fetchCategories();
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.hasRelationships) {
        // Backend returned relationship error - show warning modal
        const data = err.response.data;
        setDeleteWarning({
          show: true,
          categoryId: id,
          categoryName: categories.find(c => c.id === id)?.name || 'this category',
          productsCount: data.productsCount || 0,
          subcategoriesCount: data.subcategoriesCount || 0,
          warnings: data.warnings || []
        });
      } else {
        alert(err.response?.data?.error || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Categories</h1>
          <p className="text-sm text-muted-foreground">Organize products into categories</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-input rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
              title="Grid View"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'compact' 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
              title="Compact View"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Grid3x3}
          title="No categories yet"
          description="Create product categories to organize your catalog."
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const imageUrl = cat.image_url;
            const fullImageUrl = imageUrl ? getAssetUrl(imageUrl) : null;
            
            return (
              <div 
                key={cat.id} 
                className="group rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Category Image */}
                {fullImageUrl ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={fullImageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                
                {/* Category Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{cat.slug}</p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button 
                        onClick={() => openEdit(cat)} 
                        className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{cat.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden border border-border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Parent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Featured</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{cat.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-muted-foreground">{cat.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                      {cat.parent_name || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {cat.description || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {cat.is_featured ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEdit(cat)} 
                        className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowDialog(false)}>
          <div className="w-full max-w-md rounded-lg bg-card border border-border p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 text-foreground">{editing ? 'Edit Category' : 'Create Category'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Name <span className="text-red-500">*</span></label>
                <input 
                  className="w-full rounded border border-input bg-background text-foreground px-3 py-2" 
                  value={form.name} 
                  onChange={(e) => {
                    const newName = e.target.value;
                    // When editing: only generate new slug if name changed
                    // When creating: always generate slug
                    const generatedSlug = editing && newName === originalName 
                      ? form.slug 
                      : generateSlug(newName);
                    setForm({
                      ...form,
                      name: newName,
                      slug: generatedSlug
                    });
                  }} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Slug</label>
                <input 
                  className="w-full rounded border border-input bg-muted text-foreground cursor-not-allowed px-3 py-2" 
                  value={
                    editing && form.name === originalName 
                      ? form.slug 
                      : (form.name ? generateSlug(form.name) : '')
                  } 
                  readOnly
                  disabled
                  placeholder={form.name ? generateSlug(form.name) : "will be generated from name"} 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {editing 
                    ? "Slug is automatically generated when name changes" 
                    : "Slug is automatically generated from name"
                  }
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
                <textarea className="w-full rounded border border-input bg-background text-foreground px-3 py-2" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Parent Category (optional)</label>
                <select className="w-full rounded border border-input bg-background text-foreground px-3 py-2" value={form.parent_id} onChange={(e)=>setForm({...form,parent_id:e.target.value})}>
                  <option value="">-- None (Root Category) --</option>
                  {categories.filter(c => !editing || c.id !== editing.id).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Featured Image</label>
                {featuredImageUrl ? (
                  <div className="relative group">
                    <img 
                      src={featuredImageUrl} 
                      alt="Category" 
                      className="w-full h-40 object-cover rounded border"
                      onError={(e) => {
                        // If image fails to load, try to fetch again
                        if (form.image_id) {
                          axios.get(buildApiUrl(`/api/assets/${form.image_id}`), {
                            withCredentials: true
                          }).then(response => {
                            const asset = response.data as any;
                            const imageUrl = asset.cdn_url || asset.url || asset.sizes?.thumb?.url || '';
                            if (imageUrl) {
                              (e.target as HTMLImageElement).src = getAssetUrl(imageUrl);
                            }
                          }).catch(() => {
                            // Hide image on error
                            setFeaturedImageUrl('');
                          });
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => { 
                        setFeaturedImageUrl(''); 
                        setForm({...form, image_id: ''}); 
                        setImageRemoved(true); // Mark as explicitly removed
                      }} 
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setShowMediaPicker(true)} 
                    className="w-full h-40 rounded border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600"
                  >
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-sm">Choose from Media Library</span>
                  </button>
                )}
                {featuredImageUrl && (
                  <button 
                    type="button" 
                    onClick={() => setShowMediaPicker(true)} 
                    className="w-full mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Change Image
                  </button>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-foreground">
                  <input type="checkbox" checked={form.is_featured} onChange={(e)=>setForm({...form,is_featured:e.target.checked})} />
                  <span className="text-sm font-medium">Featured Category</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">Show on homepage</p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={()=>setShowDialog(false)} className="rounded border border-input bg-background text-foreground hover:bg-accent px-3 py-2">Cancel</button>
                <button type="submit" className="rounded bg-primary text-primary-foreground px-3 py-2 hover:bg-primary/90">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Media Picker Modal - Only show when dialog is open */}
      {showDialog && showMediaPicker && (
        <MediaPicker
          value={form.image_id || ''}
          onChange={handleSelectFeaturedImage}
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
        />
      )}

      {/* Delete Warning Modal */}
      {deleteWarning.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDeleteWarning({ ...deleteWarning, show: false })}>
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Cannot Delete Category
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The category <strong>"{deleteWarning.categoryName}"</strong> cannot be deleted because it has active relationships:
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <ul className="space-y-2">
                    {deleteWarning.productsCount > 0 && (
                      <li className="text-sm text-amber-800">
                        <strong>{deleteWarning.productsCount}</strong> product(s) are assigned to this category
                      </li>
                    )}
                    {deleteWarning.subcategoriesCount > 0 && (
                      <li className="text-sm text-amber-800">
                        <strong>{deleteWarning.subcategoriesCount}</strong> subcategory(ies) belong to this category
                      </li>
                    )}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    📋 How to Delete This Category:
                  </p>
                  <ol className="text-xs text-blue-700 space-y-2 list-decimal list-inside">
                    {deleteWarning.subcategoriesCount > 0 && (
                      <li>
                        <strong>First:</strong> Delete or reassign all <strong>{deleteWarning.subcategoriesCount}</strong> subcategory(ies) that belong to this category.
                        <br />
                        <span className="text-blue-600">Go to each subcategory and change its parent category, or delete them.</span>
                      </li>
                    )}
                    {deleteWarning.productsCount > 0 && (
                      <li>
                        <strong>Then:</strong> Remove or reassign all <strong>{deleteWarning.productsCount}</strong> product(s) from this category.
                        <br />
                        <span className="text-blue-600">Go to Products page, edit each product, and change its category to another one.</span>
                      </li>
                    )}
                    <li>
                      <strong>Finally:</strong> Once all relationships are removed, you can delete this category.
                    </li>
                  </ol>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setDeleteWarning({ ...deleteWarning, show: false })}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    I Understand
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
