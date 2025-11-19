'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, Filter, Mail, Trash2, Reply, CheckCircle, Archive, Clock } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { buildApiUrl } from '@/lib/api';

interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
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

export default function ContactsPage() {
  const { user, hydrate } = useAuthStore();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    if (!user) {
      hydrate().then(() => {
        if (!useAuthStore.getState().user) return (window.location.href = '/login');
        fetchMessages();
        setIsInitialized(true);
      });
    } else {
      fetchMessages();
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search query
  useEffect(() => {
    if (!isInitialized) return;
    
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchMessages();
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Fetch when filters/pagination change
  useEffect(() => {
    if (isInitialized) {
      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, statusFilter, subjectFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get<any>(buildApiUrl('/api/contacts'), {
        params: {
          page: currentPage,
          limit: pageSize,
          status: statusFilter || undefined,
          subject: subjectFilter || undefined,
          search: searchQuery || undefined,
          sortBy: 'created_at',
          sortOrder: 'DESC',
        },
        withCredentials: true,
      });
      
      setMessages(response.data?.data || []);
      setTotal(response.data?.pagination?.total || 0);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch contact messages:', error);
      toast.error('Failed to load contact messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axios.put(
        buildApiUrl(`/api/contacts/${id}`),
        { status },
        { withCredentials: true }
      );
      toast.success('Status updated successfully');
      fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: status as any });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      await axios.put(
        buildApiUrl(`/api/contacts/${selectedMessage.id}`),
        { reply_message: replyMessage, status: 'replied' },
        { withCredentials: true }
      );
      toast.success('Reply sent successfully');
      setReplyMessage('');
      setShowDetailModal(false);
      fetchMessages();
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await axios.delete(buildApiUrl(`/api/contacts/${id}`), {
        withCredentials: true,
      });
      toast.success('Message deleted successfully');
      fetchMessages();
      if (selectedMessage?.id === id) {
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    }
  };

  const openDetailModal = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
    
    // Mark as read if status is 'new'
    if (message.status === 'new') {
      await handleStatusUpdate(message.id, 'read');
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
        return <Mail className="h-4 w-4" />;
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

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, string> = {
      product: 'Product Inquiry',
      order: 'Order Status',
      support: 'Technical Support',
      'spa-development': 'Spa Development',
      partnership: 'Partnership',
      other: 'Other',
    };
    return labels[subject] || subject;
  };

  const filteredMessages = messages;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer inquiries and support requests
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
              placeholder="Search by name, email, or message..."
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
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Subjects</option>
          <option value="product">Product Inquiry</option>
          <option value="order">Order Status</option>
          <option value="support">Technical Support</option>
          <option value="spa-development">Spa Development</option>
          <option value="partnership">Partnership</option>
          <option value="other">Other</option>
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

      {/* Messages List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No contact messages found"
          description="Contact form submissions will appear here"
        />
      ) : (
        <div className="overflow-hidden border border-border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Message</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-foreground">
                      {message.first_name} {message.last_name}
                    </div>
                    {message.phone && (
                      <div className="text-xs text-muted-foreground">{message.phone}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{message.email}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {getSubjectLabel(message.subject)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    <div className="max-w-xs truncate" title={message.message}>
                      {message.message}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {getStatusIcon(message.status)}
                      {message.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(message.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetailModal(message)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {message.status !== 'replied' && (
                        <button
                          onClick={() => handleStatusUpdate(message.id, 'replied')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Mark as replied"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(message.id)}
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
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, total)} of {total} messages
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
      {showDetailModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Contact Message Details</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedMessage(null);
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
                  <p className="text-foreground font-medium">
                    {selectedMessage.first_name} {selectedMessage.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="text-foreground">{getSubjectLabel(selectedMessage.subject)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                    {getStatusIcon(selectedMessage.status)}
                    {selectedMessage.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-foreground">{formatDate(selectedMessage.created_at)}</p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <div className="mt-2 p-4 bg-muted rounded-lg text-foreground whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Existing Reply */}
              {selectedMessage.reply_message && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Previous Reply</label>
                  <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg text-foreground whitespace-pre-wrap">
                    {selectedMessage.reply_message}
                  </div>
                  {selectedMessage.replied_by_name && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Replied by {selectedMessage.replied_by_name} on {selectedMessage.replied_at ? formatDate(selectedMessage.replied_at) : ''}
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
                {selectedMessage.status !== 'read' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'read')}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
                  >
                    Mark as Read
                  </button>
                )}
                {selectedMessage.status !== 'archived' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'archived')}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
                  >
                    Archive
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
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







