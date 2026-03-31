const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const USER_FIELDS = [
  '_id',
  'name',
  'email',
  'isAdmin',
  'phone',
  'location',
  'title',
  'company',
  'about',
  'skills',
  'linkedin',
  'github',
  'website',
];

const isBrowser = typeof window !== 'undefined';

const extractUser = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if (payload.user && typeof payload.user === 'object') {
    return payload.user;
  }

  if (!payload._id && !payload.email && !payload.name) {
    return null;
  }

  return USER_FIELDS.reduce((user, field) => {
    if (payload[field] !== undefined) {
      user[field] = payload[field];
    }
    return user;
  }, {});
};

export const saveAuthSession = (payload) => {
  if (!isBrowser || !payload) {
    return null;
  }

  if (payload.token) {
    window.localStorage.setItem(TOKEN_KEY, payload.token);
  }

  const user = extractUser(payload);
  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  return user;
};

export const setStoredUser = (user) => {
  if (!isBrowser || !user) {
    return;
  }

  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = () => {
  if (!isBrowser) {
    return null;
  }

  const rawUser = window.localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const getAuthToken = () => {
  if (!isBrowser) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
};

export const hasActiveSession = () => Boolean(getAuthToken());

export const clearAuthSession = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
};
