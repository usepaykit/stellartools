
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  Calendar,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define transaction data shape
type Transaction = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  type: "credit" | "debit";
  description: string;
  date: Date;
  paymentMethod: "wallet";
};

// Status badge component with icons
const StatusBadge = ({ status }: { status: Transaction["status"] }) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      variant: "outline" as const,
      className: "text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950/20",
    },
    processing: {
      icon: Loader2,
      label: "Processing",
      variant: "outline" as const,
      className: "text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-950/20",
    },
    success: {
      icon: CheckCircle2,
      label: "Success",
      variant: "outline" as const,
      className: "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/20",
    },
    failed: {
      icon: XCircle,
      label: "Failed",
      variant: "outline" as const,
      className: "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/20",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={cn("gap-1.5 font-medium", config.className)}>
      <Icon
        className={cn(
          "size-3",
          status === "processing" && "animate-spin"
        )}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </Badge>
  );
};

// Payment method icon component
const PaymentMethodIcon = () => {
  return (
    <div className="flex items-center">
      <Wallet className="size-4 text-muted-foreground" aria-hidden="true" />
    </div>
  );
};

// Column definitions with enhanced UI and accessibility
const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <button
          className="flex items-center gap-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 -mx-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label={`Sort by status ${isSorted === "asc" ? "descending" : "ascending"}`}
        >
          <span>Status</span>
          {isSorted === "asc" ? (
            <ArrowUp className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : (
            <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" aria-hidden="true" />
          )}
        </button>
      );
    },
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <button
          className="flex items-center gap-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 -mx-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label={`Sort by description ${isSorted === "asc" ? "descending" : "ascending"}`}
        >
          <span>Description</span>
          {isSorted === "asc" ? (
            <ArrowUp className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : (
            <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" aria-hidden="true" />
          )}
        </button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2 max-w-[300px]">
        <span className="truncate font-medium">{row.original.description}</span>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <button
          className="flex items-center gap-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 -mx-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label={`Sort by email ${isSorted === "asc" ? "descending" : "ascending"}`}
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          <span>Email</span>
          {isSorted === "asc" ? (
            <ArrowUp className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : (
            <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" aria-hidden="true" />
          )}
        </button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        <span className="text-muted-foreground">{row.original.email}</span>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <div className="text-right">
          <button
            className="flex items-center justify-end gap-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 -mx-1 ml-auto"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            aria-label={`Sort by amount ${isSorted === "asc" ? "descending" : "ascending"}`}
          >
            <DollarSign className="h-4 w-4" aria-hidden="true" />
            <span>Amount</span>
            {isSorted === "asc" ? (
              <ArrowUp className="ml-1 h-4 w-4" aria-hidden="true" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
            ) : (
              <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" aria-hidden="true" />
            )}
          </button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className="text-right">
          <span className="text-right font-semibold tabular-nums">
            {formatted}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: () => (
        <div className="flex items-center gap-2">
          <PaymentMethodIcon />
          <span className="text-muted-foreground">Wallet</span>
        </div>
      ),
      enableSorting: true,
    },
  {
    accessorKey: "date",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <button
          className="flex items-center gap-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 -mx-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label={`Sort by date ${isSorted === "asc" ? "descending" : "ascending"}`}
        >
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span>Date</span>
          {isSorted === "asc" ? (
            <ArrowUp className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : (
            <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" aria-hidden="true" />
          )}
        </button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.date;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <time dateTime={date.toISOString()} className="text-muted-foreground">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </time>
        </div>
      );
    },
    enableSorting: true,
  },
];

// Enhanced mock data with realistic transactions
const generateMockData = (): Transaction[] => {
  const baseDate = new Date();
  return [
    {
      id: "728ed52f",
      amount: 1250.75,
      status: "success",
      email: "m@example.com",
      type: "credit",
      description: "Payment received from client",
      date: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000),
      paymentMethod: "wallet",
    },
    {
      id: "489e1d42",
      amount: 89.99,
      status: "processing",
      email: "example@gmail.com",
      type: "debit",
      description: "Monthly subscription renewal",
      date: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
      paymentMethod: "wallet",
    },
    {
      id: "123a4d45",
      amount: 2500.0,
      status: "success",
      email: "user@yahoo.com",
      type: "credit",
      description: "Invoice payment - Project Alpha",
      date: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000),
      paymentMethod: "wallet",
    },
    {
      id: "456b7c89",
      amount: 45.5,
      status: "pending",
      email: "john.doe@company.com",
      type: "debit",
      description: "Service fee",
      date: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000),
      paymentMethod: "wallet",
    },
    {
      id: "789c0d12",
      amount: 3200.0,
      status: "success",
      email: "sarah@business.io",
      type: "credit",
      description: "Contract payment - Q4 2024",
      date: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000),
      paymentMethod: "wallet",
    },
    {
      id: "012d3e45",
      amount: 199.99,
      status: "failed",
      email: "test@example.org",
      type: "debit",
      description: "Failed payment attempt",
      date: new Date(baseDate.getTime() - 6 * 24 * 60 * 60 * 1000),
      paymentMethod: "wallet",
    },
    {
      id: "345e6f78",
      amount: 750.25,
      status: "success",
      email: "admin@startup.com",
      type: "credit",
      description: "Refund processed",
      date: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      paymentMethod: "wallet",
    },
    {
      id: "678f9a01",
      amount: 125.0,
      status: "processing",
      email: "billing@corp.net",
      type: "debit",
      description: "API usage charges",
      date: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000),
      paymentMethod: "wallet",
    },
  ];
};

const data: Transaction[] = generateMockData();

export default function TransactionsPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Transactions</h1>
        <p className="text-muted-foreground">
          Manage and monitor all your financial transactions in one place
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        enableBulkSelect={true}
        actions={[
          {
            label: "View Details",
            onClick: (row) => {
              console.log("View", row.id);
            },
          },
          {
            label: "Edit Transaction",
            onClick: (row) => {
              console.log("Edit", row.id);
            },
          },
          {
            label: "Download Receipt",
            onClick: (row) => {
              console.log("Download", row.id);
            },
          },
          {
            label: "Delete",
            onClick: (row) => {
              console.log("Delete", row.id);
            },
            variant: "destructive",
          },
        ]}
        onRowClick={(row) => {
          console.log("Row clicked", row.id);
        }}
        rowClassName="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </div>
  );
}
