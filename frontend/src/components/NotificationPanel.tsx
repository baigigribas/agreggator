import React from 'react';
import { X, Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string; // Unique identifier
  title: string; // Short notification title
  message: string; // Detailed notification message
  type: 'new-listing' | 'price-change' | 'system'; // What kind of notification this is
  read: boolean; // Whether user has read this notification
  createdAt: string; // When notification was created (ISO date string)
  listingId?: string; // Optional - which listing this notification is about
}

interface User {
  name: string;
  email: string;
  role?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onRestore: () => void;
  user?: User | null;
}

export function NotificationPanel({
  isOpen,
  notifications,
  onClose,
  onMarkRead,
  onClearAll,
  onRestore,
  user,
}: NotificationPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-end">
      <div className="w-96 bg-white h-full shadow-xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Admin-only Restore button */}
          {user?.role === 'admin' && (
            <button
              onClick={onRestore}
              className="mb-4 mr-2 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Restore Mock
            </button>
          )}

          {/* Clear all button */}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="mb-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          )}

          {/* Notification list */}
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <Bell className="mx-auto h-10 w-10 mb-2 text-gray-300" />
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-lg border ${
                    n.read
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-blue-50 border-blue-200'
                  } flex items-start justify-between`}
                >
                  <div>
                    <div className="font-medium text-gray-900 mb-1">
                      {n.title}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">{n.message}</div>
                    <div className="text-xs text-gray-400">{n.createdAt}</div>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    <Link
                      to={`/listing/${n.listingId}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-xs font-medium"
                    >
                      View <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                    {!n.read && (
                      <button
                        onClick={() => onMarkRead(n.id)}
                        className="mt-2 text-xs text-gray-500 hover:text-blue-600"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}