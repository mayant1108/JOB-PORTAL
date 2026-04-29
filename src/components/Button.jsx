import { Link } from 'react-router-dom';

const variants = {
  primary: 'border-sky-600 bg-sky-600 text-white shadow-lg shadow-sky-600/20 hover:border-sky-700 hover:bg-sky-700',
  accent: 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:border-emerald-700 hover:bg-emerald-700',
  warning: 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600',
  ghost: 'border-slate-200/80 bg-white/90 text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700',
  dark: 'border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800',
  inverted: 'border-white/10 bg-white/10 text-white hover:border-white/15 hover:bg-white/15',
};

const baseClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const Button = ({ children, to, className = '', variant = 'primary', type = 'button', ...props }) => {
  const classes = `${baseClass} ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;

