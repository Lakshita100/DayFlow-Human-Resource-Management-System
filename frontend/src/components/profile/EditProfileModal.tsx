import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import type { FullEmployeeProfile, ProfileUpdatePayload } from '@/types/profile.types';

const editProfileSchema = z.object({
  phone: z.string().min(1, 'Phone is required').max(20, 'Phone must be 20 characters or less'),
  address: z.string().max(200, 'Address must be 200 characters or less').optional().or(z.literal('')),
  city: z.string().max(100, 'City must be 100 characters or less').optional().or(z.literal('')),
  state: z.string().max(100, 'State must be 100 characters or less').optional().or(z.literal('')),
  zipCode: z.string().max(20, 'Zip code must be 20 characters or less').optional().or(z.literal('')),
  country: z.string().max(100, 'Country must be 100 characters or less').optional().or(z.literal('')),
  emergencyContactName: z.string().max(100, 'Name must be 100 characters or less').optional().or(z.literal('')),
  emergencyContactPhone: z.string().max(20, 'Phone must be 20 characters or less').optional().or(z.literal('')),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FullEmployeeProfile;
  onSave: (data: ProfileUpdatePayload) => Promise<void>;
}

function inputClass(hasError: boolean): string {
  const base =
    'w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';
  return hasError
    ? `${base} border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500`
    : `${base} border-gray-200 bg-white`;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: EditProfileModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      phone: profile.employee.phone ?? '',
      address: profile.personalInfo.address ?? '',
      city: profile.personalInfo.city ?? '',
      state: profile.personalInfo.state ?? '',
      zipCode: profile.personalInfo.zipCode ?? '',
      country: profile.personalInfo.country ?? '',
      emergencyContactName: profile.privateInfo.emergencyContactName ?? '',
      emergencyContactPhone: profile.privateInfo.emergencyContactPhone ?? '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setServerError(null);
      setSuccess(false);
      reset({
        phone: profile.employee.phone ?? '',
        address: profile.personalInfo.address ?? '',
        city: profile.personalInfo.city ?? '',
        state: profile.personalInfo.state ?? '',
        zipCode: profile.personalInfo.zipCode ?? '',
        country: profile.personalInfo.country ?? '',
        emergencyContactName: profile.privateInfo.emergencyContactName ?? '',
        emergencyContactPhone: profile.privateInfo.emergencyContactPhone ?? '',
      });
    }
  }, [isOpen, profile, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: EditProfileFormData) => {
    setServerError(null);
    setSuccess(false);
    try {
      const payload: ProfileUpdatePayload = {
        phone: data.phone || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zipCode: data.zipCode || undefined,
        country: data.country || undefined,
        emergencyContactName: data.emergencyContactName || undefined,
        emergencyContactPhone: data.emergencyContactPhone || undefined,
      };
      await onSave(payload);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {serverError && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle size={16} className="mt-0.5 shrink-0" />
              <span>Profile updated successfully.</span>
            </div>
          )}

          <form id="editProfileForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="text"
                {...register('phone')}
                className={inputClass(!!errors.phone)}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                type="text"
                {...register('address')}
                className={inputClass(!!errors.address)}
                placeholder="Enter address"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  {...register('city')}
                  className={inputClass(!!errors.city)}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="state" className="mb-1 block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  {...register('state')}
                  className={inputClass(!!errors.state)}
                  placeholder="State"
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="mb-1 block text-sm font-medium text-gray-700">
                  Zip Code
                </label>
                <input
                  id="zipCode"
                  type="text"
                  {...register('zipCode')}
                  className={inputClass(!!errors.zipCode)}
                  placeholder="Zip code"
                />
                {errors.zipCode && (
                  <p className="mt-1 text-xs text-red-600">{errors.zipCode.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="country" className="mb-1 block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  {...register('country')}
                  className={inputClass(!!errors.country)}
                  placeholder="Country"
                />
                {errors.country && (
                  <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Emergency Contact
              </h4>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="emergencyContactName"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Contact Name
                  </label>
                  <input
                    id="emergencyContactName"
                    type="text"
                    {...register('emergencyContactName')}
                    className={inputClass(!!errors.emergencyContactName)}
                    placeholder="Emergency contact name"
                  />
                  {errors.emergencyContactName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.emergencyContactName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="emergencyContactPhone"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Contact Phone
                  </label>
                  <input
                    id="emergencyContactPhone"
                    type="text"
                    {...register('emergencyContactPhone')}
                    className={inputClass(!!errors.emergencyContactPhone)}
                    placeholder="Emergency contact phone"
                  />
                  {errors.emergencyContactPhone && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.emergencyContactPhone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="editProfileForm"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
