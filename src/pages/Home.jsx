import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';
import JobCard from '../components/JobCard';
import { useLocale } from '../context/LocaleContext';
import api from '../services/api';
import { formatCompactNumber, normalizeCandidate, normalizeJob } from '../utils/helpers';

const workflowItems = [
  {
    title: 'Candidates',
    detail: 'Build a verified profile, upload your resume, search jobs, and track every application from one dashboard.',
    icon: 'users',
  },
  {
    title: 'Employers',
    detail: 'Launch approved job posts, manage applicants, and reach relevant profiles without juggling multiple tools.',
    icon: 'briefcase',
  },
  {
    title: 'Admins',
    detail: 'Moderate listings, review activity, and keep hiring quality high with transparent approval workflows.',
    icon: 'shield',
  },
];

const searchHints = ['React', 'Remote', 'Bengaluru', 'HR'];

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobsPagination, setJobsPagination] = useState({ total: 0 });
  const [candidatePagination, setCandidatePagination] = useState({ total: 0 });

  useEffect(() => {
    const loadHomeData = async () => {
      const [jobsResponse, candidatesResponse] = await Promise.all([
        api.getJobs({ limit: 6 }),
        api.getCandidates({ limit: 3 }),
      ]);

      if (jobsResponse.success) {
        setFeaturedJobs((jobsResponse.jobs || []).map(normalizeJob));
        setJobsPagination(jobsResponse.pagination || { total: jobsResponse.jobs?.length || 0 });
      }

      if (candidatesResponse.success) {
        setCandidates((candidatesResponse.candidates || []).map(normalizeCandidate));
        setCandidatePagination(
          candidatesResponse.pagination || { total: candidatesResponse.candidates?.length || 0 },
        );
      }
    };

    loadHomeData();
  }, []);

  const featuredPreview = featuredJobs.slice(0, 3);
  const candidatePreview = candidates.slice(0, 3);

  const stats = useMemo(() => {
    const cities = new Set(featuredJobs.map((job) => job.city).filter(Boolean));
    const promotedCount = featuredJobs.filter((job) => job.promoted).length;

    return [
      { label: 'Active Jobs', value: formatCompactNumber(jobsPagination.total), detail: 'published from backend data' },
      {
        label: 'Candidate Profiles',
        value: formatCompactNumber(candidatePagination.total),
        detail: 'searchable talent profiles',
      },
      { label: 'Hiring Cities', value: formatCompactNumber(cities.size), detail: 'live locations in the current feed' },
      { label: 'Promoted Roles', value: formatCompactNumber(promotedCount), detail: 'featured listings right now' },
    ];
  }, [candidatePagination.total, featuredJobs, jobsPagination.total]);

  const topSkills = useMemo(() => {
    const skillMap = new Map();

    featuredJobs.forEach((job) => {
      job.skills.forEach((skill) => {
        skillMap.set(skill, (skillMap.get(skill) || 0) + 1);
      });
    });

    return [...skillMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([title, count]) => ({ title, count }));
  }, [featuredJobs]);

  const spotlightMetrics = useMemo(
    () => [
      {
        label: 'Top Skill',
        value: topSkills[0]?.title || 'Hiring data syncing',
        detail: topSkills[0] ? `${topSkills[0].count} live jobs using this skill` : 'Live insights appear here when jobs load',
      },
      {
        label: 'Candidate Feed',
        value: `${formatCompactNumber(candidatePagination.total)}+`,
        detail: 'Profiles with city, skills, and availability',
      },
    ],
    [candidatePagination.total, topSkills],
  );

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set('keyword', keyword.trim());
    }

    if (location.trim()) {
      params.set('location', location.trim());
    }

    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="page-bg">
      <section className="page-hero">
        <div className="section-shell relative grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="badge-green w-fit">
              <Icon name="shield" className="h-4 w-4" />
              {t.home.badge}
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-6xl">
              Hire faster, apply smarter, and keep every step verified.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t.home.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {searchHints.map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => setKeyword(hint)}
                  className="chip transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                >
                  <Icon name="search" className="h-3.5 w-3.5" />
                  {hint}
                </button>
              ))}
            </div>

            <div className="surface-card mt-8 p-4 sm:p-5">
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                <label className="relative">
                  <span className="sr-only">Search keyword</span>
                  <Icon name="search" className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder={t.home.keyword}
                    className="input-control input-with-icon"
                  />
                </label>
                <label className="relative">
                  <span className="sr-only">Search location</span>
                  <Icon name="map" className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder={t.home.location}
                    className="input-control input-with-icon"
                  />
                </label>
                <Button type="button" onClick={handleSearch} variant="accent" className="h-12 rounded-2xl px-6">
                  <Icon name="search" className="h-4 w-4" />
                  {t.home.search}
                </Button>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button to="/jobs" variant="ghost" className="flex-1 justify-start rounded-2xl">
                  <Icon name="briefcase" className="h-4 w-4 text-sky-600" />
                  {t.home.seeking}
                </Button>
                <Button to="/candidates" variant="ghost" className="flex-1 justify-start rounded-2xl">
                  <Icon name="users" className="h-4 w-4 text-emerald-600" />
                  {t.home.hiring}
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <p className="text-3xl font-black tracking-tight text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-sm font-bold text-slate-700">{stat.label}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="surface-card hero-spotlight overflow-hidden p-5 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Live hiring board</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Featured backend jobs</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Fresh roles, hiring locations, and high-signal skills pulled from the current platform feed.
                  </p>
                </div>
                <div className="badge-blue w-fit">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
                  </span>
                  Live
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {featuredPreview.length ? (
                  featuredPreview.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-sm shadow-slate-900/5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{job.company}</p>
                          <h3 className="mt-2 text-lg font-black tracking-tight text-slate-950">{job.title}</h3>
                          <p className="mt-2 text-sm text-slate-500">{job.location}</p>
                        </div>
                        <span className={job.verified ? 'badge-green' : 'badge-slate'}>{job.status}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="chip bg-slate-50">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/80 px-5 py-8 text-center">
                    <Icon name="briefcase" className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 text-sm font-semibold text-slate-600">Live featured jobs will appear here.</p>
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {spotlightMetrics.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`rounded-[24px] p-4 ${
                      index === 0
                        ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                        : 'border border-slate-200/70 bg-white/80 text-slate-950'
                    }`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-[0.16em] ${index === 0 ? 'text-slate-300' : 'text-slate-400'}`}>
                      {metric.label}
                    </p>
                    <p className="mt-2 text-xl font-black tracking-tight">{metric.value}</p>
                    <p className={`mt-2 text-sm leading-6 ${index === 0 ? 'text-slate-300' : 'text-slate-600'}`}>
                      {metric.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-shell">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow-warm">{t.home.featuredEyebrow}</p>
              <h2 className="section-title mt-2">{t.home.featuredTitle}</h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Explore roles with clear salary, city, and skill signals so candidates and recruiters can move faster.
              </p>
            </div>
            <Button to="/jobs" variant="ghost" className="w-fit rounded-full px-5">
              {t.home.viewAll}
              <Icon name="search" className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {featuredPreview.length ? (
              featuredPreview.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="surface-card col-span-full px-6 py-12 text-center">
                <Icon name="search" className="mx-auto h-10 w-10 text-slate-400" />
                <h3 className="mt-4 text-2xl font-black text-slate-950">No featured jobs yet</h3>
                <p className="mt-2 text-slate-500">Once jobs are available, this section will automatically populate.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-band pt-0">
        <div className="section-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-card mesh-panel p-6 sm:p-8">
            <p className="eyebrow">{t.home.modulesEyebrow}</p>
            <h2 className="section-title mt-2">{t.home.modulesTitle}</h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">{t.home.modulesBody}</p>

            <div className="mt-6 space-y-3">
              {workflowItems.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-white/80 bg-white/80 p-4 shadow-sm shadow-slate-900/5">
                  <div className="flex items-start gap-4">
                    <span className="icon-tile shrink-0">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-card bg-slate-950 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Search-ready platform</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight">Candidate and recruiter journeys stay in sync.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                One front-end now supports discovery, applications, admin review, and dashboards without switching context.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="chip border-white/10 bg-white/10 text-slate-100">Job approval</span>
                <span className="chip border-white/10 bg-white/10 text-slate-100">Profile unlocks</span>
                <span className="chip border-white/10 bg-white/10 text-slate-100">Dashboard tracking</span>
              </div>
            </div>

            <div className="surface-card p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Popular skills</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">Where demand is rising</h3>
              <div className="mt-5 grid gap-3">
                {(topSkills.length ? topSkills : searchHints.map((hint) => ({ title: hint, count: 0 }))).map((skill) => (
                  <Link
                    key={skill.title}
                    to={`/jobs?keyword=${encodeURIComponent(skill.title)}`}
                    className="panel-row flex items-center justify-between px-4 py-4 transition hover:-translate-y-0.5 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="icon-tile">
                        <Icon name="trend" className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{skill.title}</p>
                        <p className="text-sm text-slate-500">Click to open matching roles</p>
                      </div>
                    </div>
                    <span className="badge-slate">{skill.count} jobs</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="surface-card p-6 sm:col-span-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow-warm">Live talent feed</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Candidate previews from backend</h3>
                </div>
                <Button to="/candidates" variant="ghost" className="w-fit rounded-full px-5">
                  Explore talent
                  <Icon name="users" className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {candidatePreview.length ? (
                  candidatePreview.map((candidate) => (
                    <article key={candidate.id} className="panel-row flex h-full flex-col p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 to-teal-700 text-lg font-black text-white">
                          {candidate.firstName?.[0] || 'C'}
                        </div>
                        <div>
                          <h4 className="font-black tracking-tight text-slate-950">{candidate.name}</h4>
                          <p className="text-sm text-slate-500">{candidate.role}</p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-600">{candidate.summary}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="chip">{candidate.city}</span>
                        <span className="chip">{candidate.experience}</span>
                        <span className={candidate.verified ? 'badge-green' : 'badge-slate'}>
                          {candidate.verified ? 'Verified' : 'Pending review'}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="chip bg-white">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="col-span-full rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                    <Icon name="users" className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 text-sm font-semibold text-slate-600">Candidate previews will appear here once profiles load.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="section-shell">
          <div className="surface-card overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Move faster</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">Start with a search, then let the platform do the organizing.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Whether you are applying to roles or reviewing candidates, the refreshed UI keeps the most important actions visible first.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button to="/jobs" variant="accent" className="rounded-full px-6">
                  Browse jobs
                </Button>
                <Button to="/candidates" variant="inverted" className="rounded-full px-6">
                  Explore talent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
