'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import MediaPicker from '@/components/MediaPicker';
import axios from 'axios';
import { getAssetUrl, API_BASE_URL } from '@/lib/api';

interface Slider {
  id: string;
  title: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  image_id?: string;
  image_url?: string;
  asset?: {
    id: string;
    url: string;
    cdn_url?: string;
    sizes?: any;
  };
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function SlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Slider | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    button_text: '',
    button_link: '',
    image_id: '',
    image_url: '',
    order_index: 0,
    is_active: true,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ data: Slider[] }>(`${API_BASE_URL}/api/sliders`, {
        withCredentials: true,
      });
      setSliders(response.data?.data || []);
    } catch (error: any) {
      console.error('[fetchSliders] Error:', error);
      console.error('[fetchSliders] Error response:', error.response?.data);
      if (error.response?.status === 404) {
        console.error('[fetchSliders] API endpoint not found. Please ensure backend is running and routes are registered.');
      } else if (error.response?.status === 500) {
        console.error('[fetchSliders] Server error:', error.response?.data?.message || error.response?.data?.error);
      }
      // Set empty array on error to prevent UI crash
      setSliders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (assetId: string | string[]) => {
    const id = Array.isArray(assetId) ? assetId[0] : assetId;
    if (!id) {
      setImagePreview('');
      setForm({ ...form, image_id: '', image_url: '' });
      return;
    }

    // Fetch asset to get URL
    axios.get(`${API_BASE_URL}/api/assets/${id}`, {
      withCredentials: true,
    }).then(response => {
      const asset = response.data;
      const imageUrl = asset.cdn_url || asset.url || asset.sizes?.large?.url || asset.sizes?.medium?.url || '';
      setImagePreview(getAssetUrl(imageUrl));
      setForm({ ...form, image_id: id, image_url: imageUrl });
    }).catch(error => {
      console.error('Failed to fetch asset:', error);
      setImagePreview('');
      setForm({ ...form, image_id: id, image_url: '' });
    });
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '',
      description: '',
      button_text: '',
      button_link: '',
      image_id: '',
      image_url: '',
      order_index: sliders.length,
      is_active: true,
    });
    setImagePreview('');
    setShowDialog(true);
  };

  const openEdit = async (slider: Slider) => {
    console.log('[openEdit] Slider data:', slider);
    console.log('[openEdit] image_id:', slider.image_id);
    console.log('[openEdit] image_url:', slider.image_url);
    console.log('[openEdit] asset:', slider.asset);
    
    setEditing(slider);
    let imageUrl = slider.image_url || slider.asset?.cdn_url || slider.asset?.url || '';
    
    // If we have image_id but no image_url, fetch the asset
    if (slider.image_id && !imageUrl) {
      try {
        console.log('[openEdit] Fetching asset for image_id:', slider.image_id);
        const assetResponse = await axios.get(`${API_BASE_URL}/api/assets/${slider.image_id}`, {
          withCredentials: true,
        });
        const asset = assetResponse.data;
        imageUrl = asset.cdn_url || asset.url || asset.sizes?.large?.url || asset.sizes?.medium?.url || '';
        console.log('[openEdit] Fetched asset URL:', imageUrl);
      } catch (error) {
        console.error('[openEdit] Failed to fetch asset:', error);
      }
    }
    
    console.log('[openEdit] Final imageUrl:', imageUrl);
    
    setForm({
      title: slider.title,
      description: slider.description || '',
      button_text: slider.button_text || '',
      button_link: slider.button_link || '',
      image_id: slider.image_id || '',
      image_url: imageUrl,
      order_index: slider.order_index,
      is_active: slider.is_active,
    });
    // Use getAssetUrl to get full URL for preview
    const fullImageUrl = imageUrl ? getAssetUrl(imageUrl) : '';
    console.log('[openEdit] Full image URL for preview:', fullImageUrl);
    setImagePreview(fullImageUrl);
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean form data: convert empty strings to null/undefined
    const cleanedForm = {
      title: form.title?.trim() || '',
      description: form.description?.trim() || null,
      button_text: form.button_text?.trim() || null,
      button_link: form.button_link?.trim() || null,
      image_id: form.image_id || null,
      image_url: form.image_url || null,
      order_index: form.order_index || 0,
      is_active: form.is_active !== undefined ? form.is_active : true,
    };
    
    console.log('[SliderForm] Submitting form:', cleanedForm);
    try {
      if (editing) {
        console.log('[SliderForm] Updating slider:', editing.id);
        await axios.put(`${API_BASE_URL}/api/sliders/${editing.id}`, cleanedForm, {
          withCredentials: true,
        });
        console.log('[SliderForm] Slider updated successfully');
      } else {
        console.log('[SliderForm] Creating new slider');
        const response = await axios.post(`${API_BASE_URL}/api/sliders`, cleanedForm, {
          withCredentials: true,
        });
        console.log('[SliderForm] Slider created successfully:', response.data);
      }
      setShowDialog(false);
      fetchSliders();
    } catch (err: any) {
      console.error('[SliderForm] Save error:', err);
      console.error('[SliderForm] Error response:', err.response?.data);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to save slider';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/sliders/${id}`, {
        withCredentials: true,
      });
      fetchSliders();
    } catch (err) {
      alert('Failed to delete slider');
      console.error(err);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/sliders/${id}`,
        { is_active: !currentStatus },
        { withCredentials: true }
      );
      fetchSliders();
    } catch (err) {
      alert('Failed to update slider status');
      console.error(err);
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = sliders.findIndex(s => s.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sliders.length) return;

    const items = sliders.map((s, idx) => ({
      id: s.id,
      order_index: idx === currentIndex ? newIndex : idx === newIndex ? currentIndex : idx,
    }));

    try {
      await axios.post(`${API_BASE_URL}/api/sliders/reorder`, { items }, {
        withCredentials: true,
      });
      fetchSliders();
    } catch (err) {
      alert('Failed to reorder sliders');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Slider Management</h1>
          <p className="text-sm text-muted-foreground">Manage hero banner sliders</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Slider
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        </div>
      ) : sliders.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No sliders yet"
          description="Create your first slider to display on the homepage"
        />
      ) : (
        <div className="space-y-4">
          {sliders.map((slider, index) => {
            const imageUrl = slider.image_url || slider.asset?.cdn_url || slider.asset?.url || '';
            const fullImageUrl = imageUrl ? getAssetUrl(imageUrl) : null;

            return (
              <div
                key={slider.id}
                className="rounded-lg border border-border bg-card overflow-hidden shadow-sm"
              >
                <div className="flex">
                  {/* Image Preview */}
                  <div className="w-48 h-32 flex-shrink-0 bg-muted overflow-hidden">
                    {fullImageUrl ? (
                      <img
                        src={fullImageUrl}
                        alt={slider.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-card-foreground">{slider.title}</h3>
                        {slider.is_active ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </div>
                      {slider.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{slider.description}</p>
                      )}
                      {slider.button_text && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Button: {slider.button_text} → {slider.button_link || 'No link'}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Order: {slider.order_index}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMove(slider.id, 'up')}
                        disabled={index === 0}
                        className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMove(slider.id, 'down')}
                        disabled={index === sliders.length - 1}
                        className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(slider.id, slider.is_active)}
                        className="p-2 text-muted-foreground hover:text-foreground"
                        title={slider.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {slider.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(slider)}
                        className="p-2 text-primary hover:bg-primary/10 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(slider.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowDialog(false)}
        >
          <div
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Slider' : 'Create Slider'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded border px-3 py-2"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full rounded border px-3 py-2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    value={form.button_text}
                    onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                    placeholder="e.g., Explore Equipment"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Link</label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    value={form.button_link}
                    onChange={(e) => setForm({ ...form, button_link: e.target.value })}
                    placeholder="/products or https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Background Image</label>
                {imagePreview ? (
                  <div className="relative group mb-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setForm({ ...form, image_id: '', image_url: '' });
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="w-full h-48 rounded border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600"
                  >
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-sm">Choose from Media Library</span>
                  </button>
                )}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="w-full mt-2 text-sm text-primary hover:underline"
                  >
                    Change Image
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Order Index</label>
                  <input
                    type="number"
                    className="w-full rounded border px-3 py-2"
                    value={form.order_index}
                    onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="rounded border px-4 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded bg-primary text-primary-foreground px-4 py-2">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {showDialog && showMediaPicker && (
        <MediaPicker
          value={form.image_id || ''}
          onChange={handleSelectImage}
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </div>
  );
}

