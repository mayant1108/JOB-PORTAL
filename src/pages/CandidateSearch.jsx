import { useMemo, useState } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { candidateProfiles } from '../data/mockData';

const cities = ['All', 'Bengaluru', 'Mumbai', 'Pune'];

const CandidateSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredProfiles = useMemo(() => {
    const value = keyword.trim().toLowerCase();

    return candidateProfiles.filter((profile) => {
      const matchesKeyword =
        !value ||
        [profile.firstName, profile.role, profile.summary, ...profile.skills].some((field) =>
          field.toLowerCase().includes(value),
        );
      const matchesCity = city === 'All' || profile.city === city;
      const matchesVerified = !verifiedOnly || profile.verified;

      return matchesKeyword && matchesCity && matchesVerified;
    });
  }, [city, keyword, verifiedOnly]);

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Candidate profile search</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">Search talent with blurred previews</h1>
              <p className="mt-4 leading-7 text-slate-600">
                Employers can search by keyword, skills, city, and area. First names remain visible, while contact
                details are locked until login and payment.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="relative">
                  <span className="sr-only">Keyword</span>
                  <Icon name="search" className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    placeholder="Role, skill, or candidate"
                  />
                </label>
                <label className="relative">
                  <span className="sr-only">City</span>
                  <Icon name="map" className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <select
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    {cities.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(event) => setVerifiedOnly(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                Verified profiles only
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-950">{filteredProfiles.length} profiles available</h2>
              <p className="text-sm text-slate-500">Preview first names, role, location, salary, and skills</p>
            </div>
            <Button to="/employer-dashboard" variant="accent">
              <Icon name="briefcase" className="h-4 w-4" />
              Open employer dashboard
            </Button>
          </div>

          <div className="grid gap-5">
            {filteredProfiles.map((profile) => (
              <article key={profile.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xl font-black text-white">
                      {profile.firstName[0]}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-black text-slate-950">{profile.firstName}</h3>
                        {profile.verified ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                            <Icon name="shield" className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 font-semibold text-slate-700">{profile.role}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {profile.city}, {profile.area} - {profile.experience}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm font-bold text-slate-600 md:w-44">
                    <div className="flex items-center gap-2">
                      <Icon name="lock" className="h-4 w-4" />
                      {profile.blurredContact}
                    </div>
                    <div className="mt-2 h-2 rounded bg-slate-200" />
                    <div className="mt-2 h-2 w-2/3 rounded bg-slate-200" />
                  </div>
                </div>

                <p className="mt-4 leading-7 text-slate-600">{profile.summary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-600">
                    Expected: <span className="font-bold text-slate-950">{profile.salary}</span> - Availability:{' '}
                    <span className="font-bold text-slate-950">{profile.availability}</span>
                  </div>
                  <Button to="/login" variant="warning">
                    <Icon name="lock" className="h-4 w-4" />
                    Pay to unlock
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-950">Employer access</h3>
            <div className="mt-4 space-y-3">
              {['Phone OTP login', 'Google login', 'Payment unlock', 'Candidate chat'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <Icon name="check" className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-teal-200 bg-teal-50 p-5">
            <h3 className="font-bold text-slate-950">Profile availability</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Public search shows only first name and profile summary. Contact details remain locked until purchase.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default CandidateSearch;
