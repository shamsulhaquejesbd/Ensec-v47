import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { OvertimeRequest } from '../../types/overtime';
import { 
  Layers, 
  Split, 
  AlertCircle, 
  CheckCircle2, 
  Factory, 
  Clock, 
  DollarSign, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';

interface OvertimeBatchAllocationTabProps {
  onOpenSplitModal: (request: OvertimeRequest) => void;
}

export const OvertimeBatchAllocationTab: React.FC<OvertimeBatchAllocationTabProps> = ({
  onOpenSplitModal,
}) => {
  const { overtimeRequests, productionOrders } = useERP();
  const [filterType, setFilterType] = useState<'all' | 'unsplit' | 'split' | 'overhead'>('all');

  // Requests that are approved or verified
  const eligibleRequests = overtimeRequests.filter(req => {
    if (filterType === 'all') return true;
    if (filterType === 'unsplit') return !req.batchAllocations || req.batchAllocations.length <= 1;
    if (filterType === 'split') return req.batchAllocations && req.batchAllocations.length > 1;
    if (filterType === 'overhead') return req.batchAllocations?.some(a => a.isOverhead);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner explaining Production Cost absorption */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl p-5 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-300">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="font-semibold text-slate-100">Direct Production Order & Batch Cost Absorption</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            In accordance with industrial accounting standards, overtime hours can be split across multiple manufacturing batches (e.g. BMS Assembly vs Inverter Final Test). Maintenance & non-production overtime is allocated to factory overhead.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-2 rounded-lg border border-white/15 text-xs text-slate-200">
          <Factory className="w-4 h-4 text-emerald-400" />
          <span>Active Batches: <strong className="text-white">{productionOrders.length} Orders</strong></span>
        </div>
      </div>

      {/* Filter switches */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 ml-1" />
          <span className="text-slate-400 mr-1">Filter Allocation:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-100'}`}
          >
            All Requests ({overtimeRequests.length})
          </button>
          <button
            onClick={() => setFilterType('split')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'split' ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-100'}`}
          >
            Multi-Batch Split
          </button>
          <button
            onClick={() => setFilterType('unsplit')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'unsplit' ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-100'}`}
          >
            Single Batch Assigned
          </button>
          <button
            onClick={() => setFilterType('overhead')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'overhead' ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-100'}`}
          >
            Overhead / Maintenance
          </button>
        </div>
      </div>

      {/* Table of Batch Allocations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Request # & Date</th>
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Approved OT Hours</th>
                <th className="py-3 px-3">Batch Allocation Breakdown</th>
                <th className="py-3 px-3">Direct WIP vs Overhead</th>
                <th className="py-3 px-3 text-right">Total Allocated Cost</th>
                <th className="py-3 px-4 text-right">Split Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {eligibleRequests.map((req) => {
                const totalAllocatedHrs = req.batchAllocations?.reduce((sum, b) => sum + b.allocatedHours, 0) || 0;
                const hoursMatch = Math.abs(totalAllocatedHrs - (req.actualOvertimeHours || req.expectedHours)) < 0.05;
                const totalCost = req.calculatedOvertimeAmountBDT || 0;

                return (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 text-xs">{req.requestNumber}</div>
                      <div className="text-xs text-slate-500">{req.overtimeDate}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-800">{req.employeeName}</div>
                      <div className="text-xs text-slate-500">{req.department}</div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-mono font-semibold text-slate-900">{(req.actualOvertimeHours || req.expectedHours || 0).toFixed(2)} hrs</div>
                      <div className="text-[11px] text-slate-400">Rate: ৳{(req.hourlyRateBDT || 0).toFixed(0)}/hr × {req.overtimeMultiplier || 2.0}x</div>
                    </td>

                    <td className="py-3.5 px-3">
                      {req.batchAllocations && req.batchAllocations.length > 0 ? (
                        <div className="space-y-1.5 min-w-[240px]">
                          {req.batchAllocations.map((alloc) => (
                            <div 
                              key={alloc.id} 
                              className={`p-2 rounded-lg text-xs border flex items-center justify-between ${
                                alloc.isOverhead 
                                  ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                                  : 'bg-indigo-50/60 border-indigo-200 text-indigo-900'
                              }`}
                            >
                              <div>
                                <span className="font-semibold font-mono">
                                  {alloc.isOverhead ? 'FACTORY OVERHEAD' : alloc.productionBatchNumber}
                                </span>
                                <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                                  {alloc.processType} {alloc.notes ? `• ${alloc.notes}` : ''}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold font-mono">{alloc.allocatedHours.toFixed(2)}h</span>
                                <div className="text-[10px] text-slate-500">৳{alloc.allocatedCostBDT.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No batch allocation defined</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {req.batchAllocations?.some(a => a.isOverhead) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800">
                          Factory Overhead
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                          Direct WIP Cost
                        </span>
                      )}
                      <div className="text-[10px] text-slate-500 mt-1">
                        {hoursMatch ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> 100% Absorbed
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Partial ({totalAllocatedHrs}/{req.actualOvertimeHours}h)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">৳{totalCost.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">Total BDT</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenSplitModal(req)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Split className="w-3.5 h-3.5" />
                        Split / Allocate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
