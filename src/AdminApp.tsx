import { DashboardLayout } from '@/components/admin/layout/DashboardLayout';
import { ItemsDashboard } from '@/components/admin/items/ItemsDashboard';

function AdminApp() {
  return (
    <DashboardLayout>
      <ItemsDashboard />
    </DashboardLayout>
  );
}

export default AdminApp;