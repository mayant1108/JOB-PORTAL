import Button from './Button';
import Icon from './Icon';

const EmptyState = ({
  icon = 'search',
  title = 'No data found',
  description = 'There is nothing to show here yet.',
  actionLabel,
  actionTo,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <Icon name={icon} className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
      {(actionLabel && (actionTo || onAction)) ? (
        <div className="mt-6">
          {actionTo ? (
            <Button to={actionTo} variant="accent">
              {actionLabel}
            </Button>
          ) : (
            <Button onClick={onAction} variant="accent">
              {actionLabel}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default EmptyState;

