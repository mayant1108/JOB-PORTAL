import Button from './Button';
import Icon from './Icon';

const JobCard = ({ job, compact = false, onApply, applyLabel = 'Apply' }) => {
  return (
    <article className="surface-card flex h-full flex-col p-5 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-slate-950 via-sky-900 to-teal-700 text-lg font-black text-white shadow-lg shadow-sky-900/20">
          {job.company?.[0]?.toUpperCase() || 'J'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {job.promoted ? (
                  <span className="badge-amber">
                    <Icon name="star" className="h-3.5 w-3.5" />
                    Promoted
                  </span>
                ) : null}
                {job.verified ? (
                  <span className="badge-green">
                    <Icon name="shield" className="h-3.5 w-3.5" />
                    Verified
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">{job.title}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">{job.company}</p>
            </div>

            {job.fitScore ? (
              <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-white shadow-sm shadow-slate-950/20">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Match</p>
                <p className="text-base font-black">{job.fitScore}%</p>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip">
              <Icon name="briefcase" className="h-3.5 w-3.5" />
              {job.type}
            </span>
            <span className="chip">
              <Icon name="map" className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="chip">
              <Icon name="code" className="h-3.5 w-3.5" />
              {job.workMode}
            </span>
            {job.urgent ? <span className="badge-amber">Urgent</span> : null}
          </div>

          {!compact ? (
            <p className="mt-4 text-sm leading-7 text-slate-600">{job.description}</p>
          ) : (
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{job.description}</p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="chip bg-slate-50">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col justify-end">
        <div className="panel-row flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-black text-slate-950">{job.salary}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {job.posted} • {job.applicants} applicants
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button to={`/jobs/${job.id}`} variant="ghost" className="w-full rounded-full sm:w-auto">
              <Icon name="search" className="h-4 w-4" />
              View details
            </Button>
            {onApply ? (
              <Button onClick={() => onApply(job.id)} variant="accent" className="w-full rounded-full sm:w-auto">
                <Icon name="check" className="h-4 w-4" />
                {applyLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
};

export default JobCard;
