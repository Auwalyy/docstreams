import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import FindCompany from './FindCompany';
import RequestVehicle from './RequestVehicle';
import InventoryForm from './InventoryForm';
import RequestItems from './RequestItems';
import AddFacility from './AddFacility';
import AssignOfficer from './AssignOfficer';
import EditDriverInfo from './EditDriverInfo';
import StaffManagement from './StaffManagement';
import ActivityLog from './ActivityLog';

const NAV_BY_ROLE = {
  staff: [
    { key: 'find_company', label: 'Find Company Details' },
    { key: 'request_vehicle', label: 'Request Vehicle' },
    { key: 'inventory', label: 'Inventory/Checklist Form' },
    { key: 'request_items', label: 'Request items' },
  ],
  rom_supervisor: [
    { key: 'find_company', label: 'Find Company Details' },
    { key: 'request_vehicle', label: 'Request Vehicle' },
    { key: 'inventory', label: 'Inventory/Checklist Form' },
    { key: 'request_items', label: 'Request items' },
    { key: 'add_facility', label: 'Add a Facility' },
  ],
  supervisor: [
    { key: 'find_company', label: 'Find Company Details' },
    { key: 'request_vehicle', label: 'Request Vehicle' },
    { key: 'inventory', label: 'Inventory/Checklist Form' },
    { key: 'request_items', label: 'Request items' },
  ],
  cooperate: [
    { key: 'find_company', label: 'Find Company Details' },
    { key: 'request_vehicle', label: 'Request Vehicle' },
    { key: 'inventory', label: 'Inventory/Checklist Form' },
    { key: 'request_items', label: 'Request items' },
  ],
  vehicle_officer: [
    { key: 'request_vehicle', label: 'Request Vehicle' },
    { key: 'request_items', label: 'Request items' },
    { key: 'edit_driver', label: 'Edit Driver/Vehicle Information' },
  ],
  regional_coordinator: [
    { key: 'find_company', label: 'Find Company Details' },
    { key: 'request_vehicle', label: 'Request Vehicle' },
    { key: 'inventory', label: 'Inventory/Checklist Form' },
    { key: 'request_items', label: 'Request items' },
    { key: 'assign_officer', label: 'Assign Releaving Officer' },
  ],
  ict: [
    { key: 'find_company', label: 'Find Company Details' },
    { key: 'request_vehicle', label: 'Request Vehicle' },
    { key: 'inventory', label: 'Inventory/Checklist Form' },
    { key: 'request_items', label: 'Request items' },
    { key: 'staff_management', label: 'Staff Management' },
    { key: 'activity_log', label: 'Activity Log' },
  ],
};

const APPROVER_ROLES = ['rom_supervisor', 'cooperate', 'vehicle_officer', 'regional_coordinator', 'supervisor'];

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || 'staff';
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.staff;
  const [activeNav, setActiveNav] = useState(navItems[0]?.key);

  const renderContent = () => {
    switch (activeNav) {
      case 'find_company':
        return <FindCompany />;
      case 'request_vehicle':
        return (
          <RequestVehicle
            isApprover={APPROVER_ROLES.includes(role)}
            role={role}
          />
        );
      case 'inventory':
        return <InventoryForm />;
      case 'request_items':
        return <RequestItems />;
      case 'add_facility':
        return <AddFacility />;
      case 'assign_officer':
        return <AssignOfficer />;
      case 'edit_driver':
        return <EditDriverInfo />;
      case 'staff_management':
        return <StaffManagement />;
      case 'activity_log':
        return <ActivityLog />;
      default:
        return (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '300px', color: '#888', fontSize: '16px',
          }}>
            Select an option from the sidebar
          </div>
        );
    }
  };

  return (
    <Layout activeNav={activeNav} navItems={navItems} onNav={setActiveNav}>
      {renderContent()}
    </Layout>
  );
}
