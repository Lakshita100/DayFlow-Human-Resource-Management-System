import { Calendar, Briefcase, Heart, Wallet } from "lucide-react";

interface LeaveSummaryCardsProps {
  data: any;
}

export default function LeaveSummaryCards({ data }: LeaveSummaryCardsProps) {
  const balances: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.balances)
    ? (data as any).balances
    : Array.isArray((data as any)?.allocations)
    ? (data as any).allocations
    : [];

  const getAvailable = (type: string) => {
    const item = balances.find((b: any) => (b.type || '').toString().toLowerCase() === type.toLowerCase());
    if (!item) return 0;
    return item.available ?? Math.max(0, (item.total ?? 0) - (item.used ?? 0));
  };

  const totalAvailable = data?.totalAvailable ?? balances.reduce((sum: number, b: any) => {
    const avail = b.available ?? Math.max(0, (b.total ?? 0) - (b.used ?? 0));
    return sum + avail;
  }, 0);

  const cards = [
    {
      label: "Available Leave",
      icon: Calendar,
      value: totalAvailable,
      colorClass: "bg-brand-50 text-brand-600",
    },
    {
      label: "Paid Leave",
      icon: Briefcase,
      value: getAvailable("paid"),
      colorClass: "bg-violet-50 text-violet-600",
    },
    {
      label: "Sick Leave",
      icon: Heart,
      value: getAvailable("sick"),
      colorClass: "bg-amber-50 text-amber-600",
    },
    {
      label: "Unpaid Leave",
      icon: Wallet,
      value: getAvailable("unpaid"),
      colorClass: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = card.value;

        return (
          <div
            key={card.label}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-card hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex rounded-lg p-2.5 ${card.colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>

            <p className="mt-3 text-sm text-gray-500">{card.label}</p>

            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>

            <p className="mt-1 text-xs text-gray-400">{value} days available</p>
          </div>
        );
      })}
    </div>
  );
}
