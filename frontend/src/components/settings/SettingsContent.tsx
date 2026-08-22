import { useState, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import type { UserSettings, NotificationPreferences } from "@/types/settings.types";

interface SettingsContentProps {
  settings: UserSettings;
  onSave: (settings: Partial<UserSettings>) => Promise<void>;
}

export default function SettingsContent({ settings, onSave }: SettingsContentProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings);

  const handleNotifToggle = useCallback((key: keyof NotificationPreferences) => {
    setLocalSettings((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key],
      },
    }));
  }, []);

  const handleThemeChange = useCallback((theme: "light" | "dark" | "system") => {
    setLocalSettings((prev) => ({ ...prev, theme }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave(localSettings);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [localSettings, onSave]);

  function InfoRow({ label, value, locked }: { label: string; value: string; locked?: boolean }) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{value}</span>
          {locked && (
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          )}
        </div>
      </div>
    );
  }

  function SecuritySection() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
      const newErrors: typeof errors = {};
      if (!currentPassword) newErrors.current = "Current password is required";
      if (newPassword.length < 8) newErrors.new = "Password must be at least 8 characters";
      if (newPassword !== confirmPassword) newErrors.confirm = "Passwords must match";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
      if (validate()) {
        setSubmitted(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSubmitted(false), 3000);
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          {errors.current && <p className="mt-1 text-sm text-red-600">{errors.current}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          {errors.new && <p className="mt-1 text-sm text-red-600">{errors.new}</p>}
          <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          {errors.confirm && <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>}
        </div>
        {submitted && (
          <p className="text-sm text-green-600">Password updated successfully.</p>
        )}
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Update Password
        </button>
      </div>
    );
  }

  const notificationItems: { key: keyof NotificationPreferences; label: string; description: string }[] = [
    { key: "leaveUpdates", label: "Leave Updates", description: "Get notified about leave request approvals, rejections, and balances." },
    { key: "attendanceUpdates", label: "Attendance Updates", description: "Receive alerts for attendance check-ins, check-outs, and irregularities." },
    { key: "salaryNotifications", label: "Salary Notifications", description: "Get notified about salary credits and payslip availability." },
    { key: "documentUpdates", label: "Document Updates", description: "Receive alerts when documents are uploaded, approved, or require action." },
    { key: "announcements", label: "Announcements", description: "Stay updated with company-wide announcements and policy changes." },
  ];

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-500">Manage your profile information.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            To update your personal and professional information, visit the{" "}
            <a href="/employee/profile" className="text-brand-600 hover:text-brand-700 font-medium">
              My Profile
            </a>{" "}
            page.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Account</h2>
          <p className="text-sm text-gray-500">Your account information.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="divide-y divide-gray-100">
            <InfoRow label="Employee ID" value="EMP1024" locked />
            <InfoRow label="Email" value="rahul.sharma@dayflow.com" />
            <InfoRow label="Phone" value="+91 98765 43210" />
            <InfoRow label="Status" value="Active" />
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={localSettings.language}
                onChange={(e) => setLocalSettings((prev) => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={localSettings.timezone}
                onChange={(e) => setLocalSettings((prev) => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select
                value={localSettings.dateFormat}
                onChange={(e) => setLocalSettings((prev) => ({ ...prev, dateFormat: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          <p className="text-sm text-gray-500">Manage your password and security settings.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <SecuritySection />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
          <p className="text-sm text-gray-500">Choose which notifications you want to receive.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            {notificationItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div className="flex-1 mr-4">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <button
                  onClick={() => handleNotifToggle(item.key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                    localSettings.notificationPreferences[item.key] ? "bg-brand-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      localSettings.notificationPreferences[item.key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
          <p className="text-sm text-gray-500">Customize the look and feel.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex gap-3">
            {(["light", "dark", "system"] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  localSettings.theme === theme
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">Theme switching will be available in a future update.</p>
        </div>
      </section>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            {showSuccess && (
              <p className="text-sm text-green-600">Settings saved successfully.</p>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
