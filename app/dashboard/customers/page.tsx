import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { DashboardSidebarInset } from '@/components/dashboard/app-sidebar-inset'

export default function DashboardPage() {
  return (
    <div className="">
      <div className="w-full">
        <DashboardSidebar>
        <DashboardSidebarInset>
            <h1>Customers</h1>
        </DashboardSidebarInset>
        </DashboardSidebar>
      </div>
    </div>
  );
}
