import { useAuth } from '@/hooks/useAuth';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFirstName(fullName: string): string {
  return fullName.split(' ')[0] ?? fullName;
}

interface DashboardGreetingProps {
  subtitle?: string;
}

export default function DashboardGreeting({ subtitle }: DashboardGreetingProps) {
  const { user } = useAuth();
  const firstName = user ? getFirstName(user.name) : 'there';
  const greeting = getGreeting();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {greeting}, {firstName}! 👋
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {subtitle ?? "Here\u2019s what\u2019s happening with your work today."}
      </p>
    </div>
  );
}
