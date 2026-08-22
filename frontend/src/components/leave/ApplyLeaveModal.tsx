import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Calendar, FileText, Loader2 } from 'lucide-react';
import type { CreateLeavePayload } from '@/types/leave.types';

const leaveSchema = z.object({
  leaveType: z.enum(['paid', 'sick', 'unpaid'], {
    required_error: 'Leave type is required',
  }),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  remarks: z
    .string()
    .min(1, 'Remarks are required')
    .max(500, 'Remarks must be 500 characters or less'),
});

type LeaveFormValues = z.infer<typeof leaveSchema>;

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeavePayload) => Promise<void>;
}

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ApplyLeaveModal({
  isOpen,
  onClose,
  onSubmit,
}: ApplyLeaveModalProps) {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leaveType: undefined,
      startDate: '',
      endDate: '',
      remarks: '',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const numberOfDays = (() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start)
      return null;
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff + 1;
  })();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setErrorMessage('Only PDF, JPG, and PNG files are accepted.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File size must be 5MB or less.');
      return;
    }
    setErrorMessage(null);
    setAttachment(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const handleFormSubmit = async (data: LeaveFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: CreateLeavePayload = {
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        remarks: data.remarks,
        attachment: attachment ?? undefined,
      };
      await onSubmit(payload);
      reset();
      setAttachment(null);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to submit leave request.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    setAttachment(null);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Apply for Leave
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="max-h-[70vh] overflow-y-auto"
        >
          <div className="space-y-5 px-6 py-5">
            {errorMessage && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Leave Type
              </label>
              <select
                {...register('leaveType')}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              >
                <option value="">Select leave type</option>
                <option value="paid">Paid Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
              {errors.leaveType && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.leaveType.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                />
                {errors.startDate && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                />
                {errors.endDate && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Number of Days
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-2.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {numberOfDays !== null
                    ? `${numberOfDays} day${numberOfDays !== 1 ? 's' : ''}`
                    : '--'}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <textarea
                rows={3}
                {...register('remarks')}
                placeholder="Reason for leave..."
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
              />
              {errors.remarks && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.remarks.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Supporting Document (Optional)
              </label>
              {attachment ? (
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="truncate text-sm text-gray-700">
                      {attachment.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="ml-2 shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-5 transition-colors hover:border-brand-300 hover:bg-brand-50">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    PDF, JPG, PNG (max 5MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
