const paths = {
  search: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
  ),
  briefcase: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m-9 5h14M5 7h16v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Z" />
  ),
  users: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m22 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  ),
  shield: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3.5-10 2 2 5-5" />
  ),
  globe: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0 0c2.2-2.8 3.3-6.1 3.3-10S14.2 4.8 12 2m0 20c-2.2-2.8-3.3-6.1-3.3-10S9.8 4.8 12 2M2 12h20" />
  ),
  plus: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m7-7H5" />
  ),
  check: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7" />
  ),
  map: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Zm0 0V3m6 18V6" />
  ),
  rupee: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 5h10M7 9h10M8 5c5.5 0 7 5.5 1 7l7 7" />
  ),
  trend: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 17 6-6 4 4 8-8m0 0h-6m6 0v6" />
  ),
  code: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-9-4 12" />
  ),
  lock: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V8a5 5 0 0 1 10 0v3m-11 0h12v10H6V11Z" />
  ),
  message: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a8 8 0 0 1-8 8H6l-4 3 1.4-5A8 8 0 1 1 21 12Z" />
  ),
  star: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9L12 3Z" />
  ),
  upload: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  ),
  menu: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  ),
  close: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 6 12 12M18 6 6 18" />
  ),
};

const Icon = ({ name, className = 'h-5 w-5' }) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {paths[name] || paths.briefcase}
  </svg>
);

export default Icon;
