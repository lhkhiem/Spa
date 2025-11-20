'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Reply, CheckCircle, Archive, Clock, MapPin } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { buildApiUrl } from '@/lib/api';

interface ConsultationSubmission {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  province: string;
  message: string | null;
  status: 'new' | 'read' | 'replied' | 'archived';
  assigned_to: string | null;
  replied_at: string | null;
  replied_by: string | null;
  reply_message: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  assigned_to_name?: string;
  replied_by_name?: string;
}

export default function ConsultationsPage() {
  const { user, hydrate } = useAuthStore();
  const [submissions, setSubmissions] = useState<ConsultationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ConsultationSubmission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    if (!user) {
      hydrate().then(() => {
        if (!useAuthStore.getState().user) return (window.location.href = '/login');
        fetchSubmissions();
        setIsInitialized(true);
      });
    } else {
      fetchSubmissions();
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search query
  useEffect(() => {
    if (!isInitialized) return;
    
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchSubmissions();
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Fetch when filters/pagination change
  useEffect(() => {
    if (isInitialized) {
      fetchSubmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, statusFilter, provinceFilter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get<any>(buildApiUrl('/api/consultations'), {
        params: {
          page: currentPage,
          limit: pageSize,
          status: statusFilter || undefined,
          province: provinceFilter || undefined,
          search: searchQuery || undefined,
          sortBy: 'created_at',
          sortOrder: 'DESC',
        },
        withCredentials: true,
      });
      
      setSubmissions(response.data?.data || []);
      setTotal(response.data?.pagination?.total || 0);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch consultation submissions:', error);
      toast.error('Failed to load consultation submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axios.put(
        buildApiUrl(`/api/consultations/${id}`),
        { status },
        { withCredentials: true }
      );
      toast.success('Status updated successfully');
      fetchSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: status as any });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleReply = async () => {
    if (!selectedSubmission || !replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      await axios.put(
        buildApiUrl(`/api/consultations/${selectedSubmission.id}`),
        { reply_message: replyMessage, status: 'replied' },
        { withCredentials: true }
      );
      toast.success('Reply sent successfully');
      setReplyMessage('');
      setShowDetailModal(false);
      fetchSubmissions();
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consultation submission?')) {
      return;
    }

    try {
      await axios.delete(buildApiUrl(`/api/consultations/${id}`), {
        withCredentials: true,
      });
      toast.success('Consultation submission deleted successfully');
      fetchSubmissions();
      if (selectedSubmission?.id === id) {
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Failed to delete submission:', error);
      toast.error('Failed to delete submission');
    }
  };

  const openDetailModal = async (submission: ConsultationSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
    
    // Mark as read if status is 'new'
    if (submission.status === 'new') {
      await handleStatusUpdate(submission.id, 'read');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-800',
      replied: 'bg-green-100 text-green-800',
      archived: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" />;
      case 'read':
        return <Eye className="h-4 w-4" />;
      case 'replied':
        return <CheckCircle className="h-4 w-4" />;
      case 'archived':
        return <Archive className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Get unique provinces for filter
  const uniqueProvinces = Array.from(new Set(submissions.map(s => s.province))).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consultation Submissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage spa equipment setup consultation requests
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, phone, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Provinces</option>
          {uniqueProvinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No consultation submissions found"
          description="Spa equipment setup consultation form submissions will appear here"
        />
      ) : (
        <div className="overflow-hidden border border-border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Province</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Message</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {submission.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{submission.phone}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {submission.email || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {submission.province}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    <div className="max-w-xs truncate" title={submission.message || ''}>
                      {submission.message || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(submission.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetailModal(submission)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {submission.status !== 'replied' && (
                        <button
                          onClick={() => handleStatusUpdate(submission.id, 'replied')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Mark as replied"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, total)} of {total} submissions
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Consultation Submission Details</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedSubmission(null);
                    setReplyMessage('');
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-foreground">{selectedSubmission.phone}</p>
                </div>
                {selectedSubmission.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{selectedSubmission.email}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Province</label>
                  <p className="text-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedSubmission.province}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSubmission.status)}`}>
                    {getStatusIcon(selectedSubmission.status)}
                    {selectedSubmission.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-foreground">{formatDate(selectedSubmission.created_at)}</p>
                </div>
              </div>

              {/* Message */}
              {selectedSubmission.message && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <div className="mt-2 p-4 bg-muted rounded-lg text-foreground whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </div>
                </div>
              )}

              {/* Existing Reply */}
              {selectedSubmission.reply_message && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Previous Reply</label>
                  <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg text-foreground whitespace-pre-wrap">
                    {selectedSubmission.reply_message}
                  </div>
                  {selectedSubmission.replied_by_name && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Replied by {selectedSubmission.replied_by_name} on {selectedSubmission.replied_at ? formatDate(selectedSubmission.replied_at) : ''}
                    </p>
                  )}
                </div>
              )}

              {/* Reply Form */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Reply Message
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your reply..."
                />
                <button
                  onClick={handleReply}
                  disabled={!replyMessage.trim()}
                  className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Reply
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                {selectedSubmission.status !== 'read' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedSubmission.id, 'read')}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
                  >
                    Mark as Read
                  </button>
                )}
                {selectedSubmission.status !== 'archived' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedSubmission.id, 'archived')}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
                  >
                    Archive
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedSubmission.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

