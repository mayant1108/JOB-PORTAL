import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Icon from '../components/Icon';
import toast from 'react-hot-toast';
import api from '../services/api';
import { motion } from 'framer-motion';
import { normalizeJob } from '../utils/helpers';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      const response = await api.getJob(id);

      if (response.success && response.job) {
        setJob(normalizeJob(response.job));
      } else {
        toast.error(response.message || 'Failed to load job');
        setJob(null);
      }

      setLoading(false);
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast('Please login to apply');
      return;
    }

    if (user.role !== 'candidate') {
      toast.error('Only candidate accounts can apply for jobs');
      return;
    }

    setApplying(true);
    const response = await api.applyJob(job.id, coverLetter);

    if (response.success) {
      toast.success(response.message || 'Application submitted successfully');
    } else {
      toast.error(response.message || 'Failed to apply. Try again.');
    }

    setApplying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-64 rounded-lg bg-slate-200" />
            <div className="h-6 w-full rounded-lg bg-slate-200" />
            <div className="h-64 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">Job not found</h1>
          <p className="mt-2 text-slate-500">This role may have been removed or is no longer available.</p>
          <Button to="/jobs" className="mt-6">
            Back to jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/jobs" className="mb-8 inline-flex items-center gap-2 font-medium text-teal-600 hover:text-teal-700">
          <Icon name="arrow-left" className="h-4 w-4" />
          Back to jobs
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="border-b border-slate-200 p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <div>
                <h1 className="mb-2 text-3xl font-black text-slate-950">{job.title}</h1>
                <p className="text-xl font-bold text-teal-600">{job.company}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Icon name="map" className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="dollar" className="h-4 w-4" />
                    {job.salary}
                  </span>
                  <span>{job.type} • {job.workMode}</span>
                  <span>{job.applicants} applicants</span>
                </div>
              </div>

              {job.promoted ? (
                <div className="h-fit rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-800">
                  PROMOTED
                </div>
              ) : null}
            </div>
          </div>

          <div className="p-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-950">About Company</h2>
              <p className="mb-6 text-slate-600">
                {job.companyDescription || 'Company details have not been added yet.'}
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-950">
                    <Icon name="code" />
                    Skills Required
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-950">
                    <Icon name="play" />
                    Responsibilities
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {job.responsibilities.length ? (
                      job.responsibilities.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Icon name="check" className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                          {item}
                        </li>
                      ))
                    ) : (
                      <li>Responsibilities will be shared by the employer after screening.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-xl font-bold text-slate-950">Job Description</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="whitespace-pre-wrap text-slate-600">{job.fullDescription}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Experience level</h3>
                <p className="font-semibold text-slate-800">{job.experienceLevel}</p>
              </div>

              <div className="space-y-3">
                {user ? (
                  <>
                    <textarea
                      value={coverLetter}
                      onChange={(event) => setCoverLetter(event.target.value)}
                      placeholder="Optional: Add a cover letter..."
                      className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      rows="4"
                    />
                    <Button onClick={handleApply} disabled={applying} className="h-12 w-full text-lg font-bold">
                      {applying ? 'Applying...' : 'Apply Now'}
                    </Button>
                  </>
                ) : (
                  <Link to="/login">
                    <Button className="h-12 w-full text-lg font-bold">Login to Apply</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetails;
