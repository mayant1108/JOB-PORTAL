import { Link } from 'react-router-dom';

const variants = {
  primary: 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700',
  accent: 'border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700',
  warning: 'border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-500/20 hover:bg-amber-600',
  ghost: 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700',
  dark: 'border-slate-950 bg-slate-950 text-white shadow-sm shadow-slate-950/20 hover:bg-slate-800',
};

const baseClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

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

