import Button from './Button';
import Icon from './Icon';

const JobCard = ({ job, compact = false }) => {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-lg font-bold text-white">
          {job.company[0].toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-950">{job.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{job.company}</p>
            </div>
            {job.fitScore ? (
              <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">
                {job.fitScore}% fit
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              <Icon name="briefcase" className="h-3.5 w-3.5" />
              {job.type}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              <Icon name="map" className="h-3.5 w-3.5" />
              {job.location}
            </span>
            {job.urgent ? (
              <span className="rounded-md bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
                Urgent
              </span>
            ) : null}
            {job.verified ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                <Icon name="shield" className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : null}
          </div>

          {!compact ? (
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{job.description}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-950">{job.salary}</p>
              <p className="text-xs text-slate-500">{job.posted} - {job.applicants} applicants</p>
            </div>
            <Button to="/login" variant="accent" className="w-full sm:w-auto">
              <Icon name="check" className="h-4 w-4" />
              Apply
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default JobCard;

