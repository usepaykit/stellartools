import { cn } from "@/lib/utils";
import {
  Gauge,
  Coins,
  Repeat,
  CreditCard,
  Plug,
  Users,
  Webhook,
  Key,
  Receipt,
  BarChart,
  Terminal,
  DollarSign,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Metered Billing",
      description:
        "Pay-as-you-go billing based on actual usage. Perfect for API calls, storage, tokens, or any measurable metric.",
      icon: <Gauge className="h-6 w-6" />,
    },
    {
      title: "Credit System",
      description:
        "Flexible credit-based billing with automatic balance tracking and consumption monitoring.",
      icon: <Coins className="h-6 w-6" />,
    },
    {
      title: "Subscriptions",
      description:
        "Recurring billing with automatic renewals, pause/resume, and cancellation management.",
      icon: <Repeat className="h-6 w-6" />,
    },
    {
      title: "One-time Payments",
      description:
        "Simple checkout flows for single payment products with instant confirmation.",
      icon: <CreditCard className="h-6 w-6" />,
    },
    {
      title: "Multi-platform Adapters",
      description:
        "Seamless integrations with BetterAuth, Medusa, AI SDK, UploadThing, and more.",
      icon: <Plug className="h-6 w-6" />,
    },
    {
      title: "Customer Management",
      description:
        "Complete customer lifecycle management with detailed profiles and transaction history.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Webhooks & Events",
      description:
        "Real-time event notifications for payments, subscriptions, and credit transactions.",
      icon: <Webhook className="h-6 w-6" />,
    },
    {
      title: "Stellar Blockchain",
      description:
        "Native Stellar blockchain integration for fast, low-cost crypto payments.",
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      title: "API Keys & Security",
      description:
        "Secure API key management with environment-based access control.",
      icon: <Key className="h-6 w-6" />,
    },
    {
      title: "Transaction Tracking",
      description:
        "Comprehensive transaction history with detailed logs and analytics.",
      icon: <Receipt className="h-6 w-6" />,
    },
    {
      title: "Usage Analytics",
      description:
        "Monitor metered billing usage, credit consumption, and balance changes in real-time.",
      icon: <BarChart className="h-6 w-6" />,
    },
    {
      title: "Developer First",
      description:
        "Built for developers with TypeScript, comprehensive docs, and easy integration.",
      icon: <Terminal className="h-6 w-6" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto border-t-0">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  // Calculate row and column for border logic
  const row = Math.floor(index / 4);
  const col = index % 4;
  const isFirstRow = row === 0;
  const isFirstCol = col === 0;
  const isLastCol = col === 3;

  return (
    <div
      className={cn(
        "flex flex-col py-10 relative group/feature border-border",
        !isLastCol && "lg:border-r",
        isFirstCol && "lg:border-l",
        isFirstRow && "lg:border-t-0",
        "lg:border-b"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-t from-muted to-transparent pointer-events-none" />
      )}
      {index >= 4 && index < 8 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-b from-muted to-transparent pointer-events-none" />
      )}
      {index >= 8 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-t from-muted to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-muted-foreground">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-muted group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
