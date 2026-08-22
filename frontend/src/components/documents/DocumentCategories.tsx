import {
  User, Fingerprint, GraduationCap, Briefcase, Landmark, Receipt, Award, Folder,
} from 'lucide-react';
import type { DocumentCategoryInfo, DocumentCategory } from '@/types/document.types';

interface DocumentCategoriesProps {
  categories: DocumentCategoryInfo[];
  selectedCategory: DocumentCategory | 'all';
  onSelect: (category: DocumentCategory | 'all') => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  personal: User,
  identity: Fingerprint,
  education: GraduationCap,
  employment: Briefcase,
  banking: Landmark,
  tax: Receipt,
  certificates: Award,
  other: Folder,
};

export default function DocumentCategories({ categories, selectedCategory, onSelect }: DocumentCategoriesProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Document Categories</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {/* All category */}
        <button
          onClick={() => onSelect('all')}
          className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
            selectedCategory === 'all'
              ? 'border-brand-200 bg-brand-50 text-brand-700'
              : 'border-gray-100 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            selectedCategory === 'all' ? 'bg-brand-100' : 'bg-gray-100'
          }`}>
            <Folder className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium">All</span>
        </button>

        {categories.map((cat) => {
          const Icon = iconMap[cat.key] ?? Folder;
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onSelect(cat.key)}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                isActive
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                isActive ? 'bg-brand-100' : 'bg-gray-100'
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">{cat.label}</span>
              <span className="text-[10px] text-gray-400">{cat.count} docs</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
