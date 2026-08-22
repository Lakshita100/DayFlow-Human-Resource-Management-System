import { Sparkles, Award, Heart, User } from 'lucide-react';
import type { AdminResume } from '@/types/admin-pages.types';

interface ResumeTabProps {
  resume: AdminResume;
}

function EmptyHint({ text }: { text: string }) {
  return <p className="text-sm text-gray-400">{text}</p>;
}

export default function ResumeTab({ resume }: ResumeTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* LEFT — About / Job Love / Interests */}
      <div className="space-y-6 lg:col-span-3">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <User size={16} className="text-brand-600" />
            <h3 className="text-base font-semibold text-gray-900">About</h3>
          </div>
          {resume.about ? (
            <p className="text-sm leading-relaxed text-gray-600">{resume.about}</p>
          ) : (
            <EmptyHint text="No bio added yet." />
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <Heart size={16} className="text-brand-600" />
            <h3 className="text-base font-semibold text-gray-900">What I Love About My Job</h3>
          </div>
          {resume.jobLove ? (
            <p className="text-sm leading-relaxed text-gray-600">{resume.jobLove}</p>
          ) : (
            <EmptyHint text="Share what you enjoy most about your role." />
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <h3 className="mb-3 text-base font-semibold text-gray-900">My Interests &amp; Hobbies</h3>
          {resume.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resume.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-gray-100"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <EmptyHint text="No interests added yet." />
          )}
        </div>
      </div>

      {/* RIGHT — Skills / Certifications */}
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-brand-600" />
            <h3 className="text-base font-semibold text-gray-900">Skills</h3>
          </div>
          {resume.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <EmptyHint text="No skills added yet." />
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <Award size={16} className="text-brand-600" />
            <h3 className="text-base font-semibold text-gray-900">Certifications</h3>
          </div>
          {resume.certifications.length > 0 ? (
            <ul className="divide-y divide-gray-50">
              {resume.certifications.map((cert) => (
                <li key={cert.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                    <Award size={14} className="text-brand-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{cert.name}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {cert.issuer} &middot; {cert.year}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyHint text="No certifications added yet." />
          )}
        </div>
      </div>
    </div>
  );
}
