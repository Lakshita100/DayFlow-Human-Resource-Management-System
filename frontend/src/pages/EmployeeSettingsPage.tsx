import { useState, useCallback } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import SettingsContent from '@/components/settings/SettingsContent';
import { useUserSettingsMock } from '@/hooks/useSettings';
import type { SettingsSection } from '@/types/settings.types';

export default function EmployeeSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const settings = useUserSettingsMock();

  const handleSave = useCallback(async (_newSettings: Partial<typeof settings>) => {
    await new Promise((r) => setTimeout(r, 800));
  }, []);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account, preferences and notification settings.</p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-card lg:sticky lg:top-6">
              <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <SettingsContent settings={settings} onSave={handleSave} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
