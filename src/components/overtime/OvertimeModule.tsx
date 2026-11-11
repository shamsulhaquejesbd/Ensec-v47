import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { OvertimeRequest } from '../../types/overtime';
import { OvertimeDashboardTab } from './OvertimeDashboardTab';
import { OvertimeRequestsTab } from './OvertimeRequestsTab';
import { OvertimeAttendanceTab } from './OvertimeAttendanceTab';
import { OvertimeBatchAllocationTab } from './OvertimeBatchAllocationTab';
import { OvertimePayrollCostingTab } from './OvertimePayrollCostingTab';
import { OvertimePolicySettingsTab } from './OvertimePolicySettingsTab';
import { OvertimeReportsTab } from './OvertimeReportsTab';

// Modals
import { NewOvertimeRequestModal } from './NewOvertimeRequestModal';
import { OvertimeApprovalModal } from './OvertimeApprovalModal';
import { OvertimeBatchSplitModal } from './OvertimeBatchSplitModal';
import { OvertimeAttendanceModal } from './OvertimeAttendanceModal';

import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Layers, 
  ArrowRightLeft, 
  Settings2, 
  FileSpreadsheet,
  Plus
} from 'lucide-react';

interface OvertimeModuleProps {
  initialSubTab?: string;
}

export const OvertimeModule: React.FC<OvertimeModuleProps> = ({ initialSubTab = 'dashboard' }) => {
  const { overtimeRequests, overtimeAttendances } = useERP();

  const [currentTab, setCurrentTab] = useState<string>(initialSubTab);

  // Modal states
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [approvalModalRequest, setApprovalModalRequest] = useState<OvertimeRequest | null>(null);
  const [batchSplitModalRequest, setBatchSplitModalRequest] = useState<OvertimeRequest | null>(null);

  // Pending counts for badges
  const pendingRequestsCount = overtimeRequests.filter(r => r.status !== 'Final Approved' && r.status !== 'Rejected').length;
  const pendingAttendancesCount = overtimeAttendances.filter(a => !a.isVerified).length;

  const tabs = [
    { id: 'dashboard', label: 'OT Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'OT Requests', icon: FileText, badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined },
    { id: 'attendance', label: 'OT Attendance & Bio-Punches', icon: Clock, badge: pendingAttendancesCount > 0 ? pendingAttendancesCount : undefined },
    { id: 'batch_allocation', label: 'Batch Allocation & Split', icon: Layers },
    { id: 'payroll_costing_sync', label: 'Payroll & Costing Dual-Sync', icon: ArrowRightLeft },
    { id: 'policies', label: 'Policy Configuration', icon: Settings2 },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 -mt-6 -mx-6 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Overtime Management System</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full border border-blue-200">
              Bangladesh Labor Act 2006 Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end multi-batch overtime allocation, supervisor verification, payroll salary sync, and factory costing absorption.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAttendanceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            Quick Punch / Log
          </button>
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Overtime Request
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab View */}
      <div>
        {currentTab === 'dashboard' && (
          <OvertimeDashboardTab
            onOpenNewRequest={() => setIsNewRequestModalOpen(true)}
            onOpenAttendanceModal={() => setIsAttendanceModalOpen(true)}
            onNavigateTab={(tab) => {
              if (tab === 'requests') setCurrentTab('requests');
              else if (tab === 'attendance') setCurrentTab('attendance');
              else if (tab === 'batch_allocation') setCurrentTab('batch_allocation');
              else if (tab === 'costing') setCurrentTab('payroll_costing_sync');
              else if (tab === 'reports') setCurrentTab('reports');
              else setCurrentTab(tab);
            }}
          />
        )}

        {currentTab === 'requests' && (
          <OvertimeRequestsTab
            onOpenNewRequest={() => setIsNewRequestModalOpen(true)}
            onOpenApprovalModal={(req) => setApprovalModalRequest(req)}
            onOpenBatchSplitModal={(req) => setBatchSplitModalRequest(req)}
          />
        )}

        {currentTab === 'attendance' && (
          <OvertimeAttendanceTab
            onRecordNewAttendance={() => setIsAttendanceModalOpen(true)}
          />
        )}

        {currentTab === 'batch_allocation' && (
          <OvertimeBatchAllocationTab
            onOpenSplitModal={(req) => setBatchSplitModalRequest(req)}
          />
        )}

        {currentTab === 'payroll_costing_sync' && (
          <OvertimePayrollCostingTab />
        )}

        {currentTab === 'policies' && (
          <OvertimePolicySettingsTab />
        )}

        {currentTab === 'reports' && (
          <OvertimeReportsTab />
        )}
      </div>

      {/* Modals */}
      {isNewRequestModalOpen && (
        <NewOvertimeRequestModal
          onClose={() => setIsNewRequestModalOpen(false)}
        />
      )}

      <OvertimeAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
      />

      {approvalModalRequest && (
        <OvertimeApprovalModal
          onClose={() => setApprovalModalRequest(null)}
          request={approvalModalRequest}
        />
      )}

      {batchSplitModalRequest && (
        <OvertimeBatchSplitModal
          onClose={() => setBatchSplitModalRequest(null)}
          request={batchSplitModalRequest}
        />
      )}
    </div>
  );
};
