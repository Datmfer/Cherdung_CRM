import TicketTable from "@/components/tables/TicketTable";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function SupportTickets() {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Support Tickets
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage and respond to user inquiries
        </p>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search tickets by subject or user..."
              className="w-full"
            />
          </div>
          <Select
            options={statusOptions}
            defaultValue="all"
            className="w-full md:w-48"
          />
          <Select
            options={priorityOptions}
            defaultValue="all"
            className="w-full md:w-48"
          />
          <Button variant="primary">Apply Filters</Button>
        </div>
      </div>

      <TicketTable />
    </div>
  );
}
