import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Button from '../components/Button';
import Icon from '../components/Icon';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    const response = await api.getNotifications();

    if (response.success) {
      setNotifications(response.notifications || []);
    } else {
      setNotifications([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const markAsRead = async (id) => {
    const response = await api.markNotificationRead(id);

    if (response.success) {
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: true } : item)),
      );
    }
  };

  const clearAll = async () => {
    const response = await api.markAllNotificationsRead();

    if (response.success) {
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-black text-slate-950">Notifications</h1>
          <p>
            Please{' '}
            <Link to="/login" className="text-teal-600 hover:underline">
              login
            </Link>{' '}
            to view notifications
          </p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-950">Notifications</h1>
            <p className="mt-1 text-xl text-slate-600">
              You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </p>
          </div>
          {notifications.some((item) => !item.isRead) ? (
            <Button onClick={clearAll} variant="ghost">
              Mark all as read
            </Button>
          ) : null}
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="rounded-xl bg-white p-6 animate-pulse">
                <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-24 text-center">
            <Icon name="bell" className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <h3 className="mb-2 text-2xl font-bold text-slate-900">No notifications</h3>
            <p className="text-slate-500">You'll see updates here when there are new notifications</p>
          </div>
        ) : (
          <div className="max-h-[70vh] space-y-2 overflow-y-auto">
            {notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                className={`group w-full cursor-pointer rounded-xl border bg-white p-6 text-left shadow-sm transition-all hover:border-teal-200 hover:shadow-md ${
                  !notification.isRead ? 'border-teal-200 bg-teal-50 ring-2 ring-teal-200' : 'border-slate-100'
                }`}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                      notification.isRead ? 'bg-slate-100 text-slate-400' : 'bg-teal-100 text-teal-600'
                    }`}
                  >
                    <Icon
                      name={notification.type === 'application' ? 'users' : 'check-circle'}
                      className="h-6 w-6"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 line-clamp-1 font-bold text-slate-950 group-hover:text-teal-700">
                      {notification.title}
                    </h3>
                    <p className="mb-2 line-clamp-2 text-sm text-slate-600">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                      {!notification.isRead ? (
                        <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-bold text-teal-800">
                          NEW
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
