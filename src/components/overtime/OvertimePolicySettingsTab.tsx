import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { OvertimePolicyConfig } from '../../types/overtime';
import { 
  Settings2, 
  Save, 
  HelpCircle, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

export const OvertimePolicySettingsTab: React.FC = () => {
  const { overtimePolicies, updateOvertimePolicy, addOvertimeAuditLog, currentUser } = useERP();

  const [activePolicy, setActivePolicy] = useState<OvertimePolicyConfig>(
    overtimePolicies[0] || {
      id: 'pol-bd-default',
      policyName: 'Bangladesh Labor Act 2006 Compliant Overtime Policy',
      isDefault: true,
      department: 'All Departments',
      standardWorkingDaysPerMonth: 26,
      standardDailyWorkingHours: 8,
      standardMonthlyWorkingHours: 208,
      wageBasis: 'BASIC_ONLY',
      overtimeMultiplierRegular: 2.0,
      overtimeMultiplierWeekend: 2.0,
      overtimeMultiplierHoliday: 2.5,
      overtimeMultiplierNightShift: 2.2,
      minimumOtMinutesThreshold: 30,
      maxOtHoursPerDay: 4,
      maxOtHoursPerMonth: 60,
      allowOvernightOvertime: true,
      requireSupervisorPreApproval: true,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
    }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOvertimePolicy(activePolicy);
    addOvertimeAuditLog({
      recordId: activePolicy.id,
      recordType: 'POLICY',
      action: 'UPDATE_POLICY',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      details: 'Overtime policy updated with statutory parameters',
      newState: activePolicy.policyName,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToStatutory = () => {
    setActivePolicy({
      ...activePolicy,
      standardMonthlyWorkingHours: 208,
      overtimeMultiplierRegular: 2.0,
      overtimeMultiplierWeekend: 2.0,
      overtimeMultiplierHoliday: 2.5,
      overtimeMultiplierNightShift: 2.2,
      wageBasis: 'BASIC_ONLY',
      minimumOtMinutesThreshold: 30,
      maxOtHoursPerDay: 4,
      maxOtHoursPerMonth: 60,
      allowOvernightOvertime: true,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              Statutory Overtime Policy Configuration
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full">
                BD Labor Act 2006 (Sec 108)
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure standard monthly divisors, overtime wage multipliers, shift allowances, and statutory work duration caps.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetToStatutory}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Statutory Presets
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Divisor & Wage Basis */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-blue-600" />
              1. Base Hourly Rate Calculation Formula
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Hourly rate is computed as: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono font-semibold">Wage Component ÷ Standard Working Hours</code>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Standard Monthly Working Hours (Divisor)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="160"
                  max="260"
                  value={activePolicy.standardMonthlyWorkingHours}
                  onChange={(e) => setActivePolicy({ ...activePolicy, standardMonthlyWorkingHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">Hours / Month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Standard factory baseline: 208 hours (26 days × 8 hours).</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Applicable Wage Basis for Overtime
              </label>
              <select
                value={activePolicy.wageBasis}
                onChange={(e) => setActivePolicy({ ...activePolicy, wageBasis: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BASIC_ONLY">Basic Salary Only (BD Labor Act 2006 Standard)</option>
                <option value="BASIC_PLUS_HOUSING">Basic + Housing Allowance</option>
                <option value="GROSS_WAGE">Gross Wage (Comprehensive Package)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Bangladesh labor law mandates calculating OT solely on ordinary/basic rate.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Overtime Multipliers */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              2. Overtime Rate Multipliers
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Multiplier applied to hourly rate for calculating actual payable overtime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Regular Day OT Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="3.0"
                value={activePolicy.overtimeMultiplierRegular}
                onChange={(e) => setActivePolicy({ ...activePolicy, overtimeMultiplierRegular: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm font-mono font-bold text-slate-800 bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 2.0x (Double normal rate)</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weekend / Rest Day Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="3.0"
                value={activePolicy.overtimeMultiplierWeekend}
                onChange={(e) => setActivePolicy({ ...activePolicy, overtimeMultiplierWeekend: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm font-mono font-bold text-slate-800 bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 2.0x</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Festival / Public Holiday
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="4.0"
                value={activePolicy.overtimeMultiplierHoliday}
                onChange={(e) => setActivePolicy({ ...activePolicy, overtimeMultiplierHoliday: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm font-mono font-bold text-slate-800 bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 2.5x</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Night Shift Overtime
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="3.0"
                value={activePolicy.overtimeMultiplierNightShift}
                onChange={(e) => setActivePolicy({ ...activePolicy, overtimeMultiplierNightShift: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm font-mono font-bold text-slate-800 bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 2.2x</span>
            </div>
          </div>
        </div>

        {/* Section 3: Statutory Caps & Thresholds */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              3. Statutory Thresholds & Factory Guardrails
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Limits to prevent factory worker fatigue and ensure compliance during labor inspections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Max Daily OT Limit (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={activePolicy.maxOtHoursPerDay}
                onChange={(e) => setActivePolicy({ ...activePolicy, maxOtHoursPerDay: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Statutory maximum: 4 hours per day</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Max Monthly OT Limit (Hours)
              </label>
              <input
                type="number"
                min="10"
                max="120"
                value={activePolicy.maxOtHoursPerMonth}
                onChange={(e) => setActivePolicy({ ...activePolicy, maxOtHoursPerMonth: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Statutory cap: 60 hours per month</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Minimum Threshold Minutes
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={activePolicy.minimumOtMinutesThreshold}
                  onChange={(e) => setActivePolicy({ ...activePolicy, minimumOtMinutesThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">Minutes</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Minimum extra time required to qualify for OT</span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5" />
              Policy configuration saved and deployed across payroll & costing modules!
            </div>
          ) : (
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-400" />
              Approved policy applies dynamically to all pending and future overtime requests.
            </div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Overtime Policy
          </button>
        </div>
      </form>
    </div>
  );
};
