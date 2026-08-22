import { Pencil } from 'lucide-react';
import type { EmployeeSkill } from '@/types/profile.types';

interface SkillsCardProps {
  skills: EmployeeSkill[];
  onEdit: () => void;
}

const proficiencyColors: Record<string, string> = {
  Advanced: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  Intermediate: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Beginner: 'bg-gray-50 text-gray-600 ring-gray-500/20',
};

export default function SkillsCard({ skills, onEdit }: SkillsCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Skills</h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50"
        >
          <Pencil size={12} />
          Edit Skills
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">No skills added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2"
            >
              <span className="text-sm font-medium text-gray-900">{skill.name}</span>
              {skill.proficiency && (
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${proficiencyColors[skill.proficiency] ?? proficiencyColors.Beginner}`}>
                  {skill.proficiency}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
