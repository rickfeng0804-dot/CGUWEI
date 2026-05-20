/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area } from 'recharts';
import { Activity, LayoutDashboard, Users, TrendingUp, AlertTriangle, UserCheck, HandHelping, Database, Menu, X, RefreshCw, Package, Wrench, Plane, Handshake } from 'lucide-react';

import { DataProvider, useData } from './data/DataContext';

function ProjectGanttStatus() {
  const { projectStatusData } = useData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-emerald-500';
      case 'attention': return 'bg-amber-500';
      case 'risk': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal': return '正常 (Normal)';
      case 'attention': return '需注意 (Warning)';
      case 'risk': return '高風險 (Risk)';
      default: return '未知';
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl flex flex-col p-6 text-slate-200 border w-full min-h-[500px]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-400" />
          甘特圖與狀態 (Gantt Timeline & Status)
        </h2>
        <div className="flex gap-4 text-xs font-mono">
          <span className="text-emerald-400">正常: {projectStatusData.filter(p => p.status === 'normal').length}</span>
          <span className="text-amber-400">需注意: {projectStatusData.filter(p => p.status === 'attention').length}</span>
          <span className="text-rose-400">高風險: {projectStatusData.filter(p => p.status === 'risk').length}</span>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto space-y-6 pr-4">
        {projectStatusData.map(proj => (
          <div key={proj.id} className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium truncate text-slate-300 w-1/4 pr-4">
                <span className="block text-lg text-white">{proj.name}</span>
                <span className="text-xs text-slate-500">ID: {proj.id}</span>
              </div>
              <div className="flex-grow bg-slate-800 h-6 rounded-full overflow-hidden relative mx-4">
                <div 
                  className={`${getStatusColor(proj.status)} h-full flex items-center px-4 text-xs font-bold text-slate-950 transition-all duration-500`}
                  style={{ width: `${proj.progress}%` }}
                >
                  {proj.progress}%
                </div>
              </div>
              <div className={`w-24 text-right font-mono text-sm ${proj.status === 'normal' ? 'text-emerald-400' : proj.status === 'attention' ? 'text-amber-400' : 'text-rose-400'}`}>
                {proj.delayDays > 0 ? `延遲 ${proj.delayDays} 天` : '如期 (On Time)'}
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 pl-[25%] mt-2 ml-4">
              <span className="bg-slate-900 px-2 py-1 rounded">預算使用: ${(proj.actualCost || 0).toLocaleString()} / ${(proj.budget || 0).toLocaleString()}</span>
              <span className="flex gap-3">
                <span className="bg-rose-950/30 text-rose-400 px-2 py-1 rounded">風險 (Risk): {proj.activeRisks}</span>
                <span className="bg-amber-950/30 text-amber-400 px-2 py-1 rounded">問題 (Issue): {proj.activeIssues}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SafetyStockList() {
  const { safetyStockData } = useData();

  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl flex flex-col p-6 text-slate-200 border w-full min-h-[500px]">
      <h2 className="text-xl font-semibold mb-6 shrink-0 flex items-center gap-2">
        <Package className="w-6 h-6 text-blue-400" />
        長交期元件安全庫存清單 (Safety Stock List)
      </h2>
      <div className="flex-grow overflow-auto pr-2">
        <table className="w-full text-sm text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-slate-400">
              <th className="font-medium pb-2 px-4 w-20">ID</th>
              <th className="font-medium pb-2 px-2 w-48">元件名稱 (Name)</th>
              <th className="font-medium pb-2 px-2 w-48">料號 (Part Number)</th>
              <th className="font-medium pb-2 px-2 text-center">庫存水位 (Stock Level)</th>
              <th className="font-medium pb-2 px-2 w-32 text-center">交期 (Lead Time)</th>
              <th className="font-medium pb-2 px-4 w-24">狀態 (Status)</th>
            </tr>
          </thead>
          <tbody>
            {safetyStockData.map((item) => {
              const stockRatio = Math.min(100, Math.round((item.currentStock / item.safetyStock) * 100));
              return (
              <tr key={item.id} className="bg-slate-950/60 shadow-sm transition-colors hover:bg-slate-800/50">
                <td className="py-4 px-4 rounded-l-xl font-mono text-slate-400">{item.id}</td>
                <td className="py-4 px-2 text-slate-200 font-medium">{item.name}</td>
                <td className="py-4 px-2 font-mono text-xs text-slate-400">{item.partNumber}</td>
                <td className="py-4 px-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span>{item.currentStock}</span>
                      <span className="text-slate-500">/{item.safetyStock}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${stockRatio < 50 ? 'bg-rose-500' : stockRatio < 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${stockRatio}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 text-center font-mono text-slate-300">{item.leadTimeDays} 天</td>
                <td className="py-4 px-4 rounded-r-xl">
                  <Badge variant="outline" className={`border-none ${
                    item.status === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 
                    item.status === 'Low' ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {item.status}
                  </Badge>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function FinancialTracking() {
  const { sCurveFinancialData } = useData();

  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl flex flex-col p-6 text-slate-200 border w-full min-h-[500px]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          成本與費用管控 (Cost & Expense Control)
        </h2>
        <span className="text-xs text-slate-500 bg-slate-950 px-3 py-1 rounded">單位: 萬 (10k)</span>
      </div>
      <div className="flex-grow flex flex-col gap-8 w-full overflow-y-auto">
        <div className="h-[300px] w-full shrink-0">
          <h3 className="text-sm text-slate-400 mb-2">累積趨勢 (Target S-Curve)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sCurveFinancialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="week" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', fontSize: '14px', color: '#f8fafc'}} 
                itemStyle={{color: '#e2e8f0'}}
              />
              <Area type="monotone" dataKey="plannedCost" name="計畫預算" stroke="#8b5cf6" fill="url(#colorPlanned)" strokeWidth={3} />
              <Area type="monotone" dataKey="actualCost" name="實際支出" stroke="#ec4899" fill="url(#colorActual)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[300px] w-full shrink-0">
          <h3 className="text-sm text-slate-400 mb-2">當週花費比較 (Weekly Comparison)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sCurveFinancialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="week" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', fontSize: '14px', color: '#f8fafc'}} 
                itemStyle={{color: '#e2e8f0'}}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              />
              <Bar dataKey="plannedCost" name="計畫預算" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="actualCost" name="實際支出" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

function RiskIssueRegister() {
  const { riskAndIssuesData } = useData();

  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl flex flex-col p-6 text-slate-200 border w-full min-h-[500px]">
      <h2 className="text-xl font-semibold mb-6 shrink-0 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-rose-400" />
        風險與問題登記冊 (Risk & Issue Register)
      </h2>
      <div className="flex-grow overflow-auto pr-2">
        <table className="w-full text-sm text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-slate-400">
              <th className="font-medium pb-2 px-2 w-24">ID</th>
              <th className="font-medium pb-2 px-2 w-24">類型 (Type)</th>
              <th className="font-medium pb-2 px-2">描述 (Description)</th>
              <th className="font-medium pb-2 px-2 w-32">影響 (Impact)</th>
              <th className="font-medium pb-2 px-2 w-32">負責人 (Owner)</th>
            </tr>
          </thead>
          <tbody>
            {riskAndIssuesData.map((item) => (
              <tr key={item.id} className="bg-slate-950/60 shadow-sm transition-colors hover:bg-slate-800/50">
                <td className="py-4 px-4 rounded-l-xl font-mono text-slate-400">{item.id}</td>
                <td className="py-4 px-2">
                  <Badge variant="outline" className={`border-none ${item.type === '風險' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}`}>
                    {item.type}
                  </Badge>
                </td>
                <td className="py-4 px-2 text-slate-200">{item.description}</td>
                <td className="py-4 px-2 font-medium">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 
                    item.severity === 'High' ? 'bg-orange-400/20 text-orange-400 border border-orange-400/20' : 
                    item.severity === 'Medium' ? 'bg-amber-400/20 text-amber-400 border border-amber-400/20' : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {item.severity}
                  </span>
                </td>
                <td className="py-4 px-2 rounded-r-xl text-slate-400">{item.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function AssemblyAndFAT() {
  const { assemblyAndFATData } = useData();

  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl flex flex-col p-6 text-slate-200 border w-full min-h-[500px]">
      <h2 className="text-xl font-semibold mb-6 shrink-0 flex items-center gap-2">
        <Wrench className="w-6 h-6 text-emerald-400" />
        組裝與廠內調試 (Internal Assembly & FAT)
      </h2>
      <div className="flex-grow overflow-auto pr-2">
        <div className="space-y-4">
          {assemblyAndFATData.map((item) => (
            <div key={item.id} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="font-medium text-slate-200">
                  <span className="mr-2">{item.id}</span>
                  {item.name}
                </div>
                <Badge variant="outline" className={`border-none ${
                  item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  item.status === 'On Track' ? 'bg-blue-500/10 text-blue-400' :
                  item.status === 'Warning' ? 'bg-amber-400/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {item.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>組裝進度 (Assembly)</span>
                    <span>{item.assemblyProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.assemblyProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>廠內調試 (FAT)</span>
                    <span>{item.fatProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.fatProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function SupportList() {
  const { supportListData } = useData();

  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl flex flex-col p-6 text-slate-200 border w-full min-h-[500px]">
      <h2 className="text-xl font-semibold mb-6 shrink-0 flex items-center gap-2">
        <HandHelping className="w-6 h-6 text-teal-400" />
        後勤支援清單 (Logistics Support Queue)
      </h2>
      <div className="flex-grow overflow-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {supportListData.map((item) => (
          <div key={item.id} className="flex flex-col justify-between p-5 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-semibold text-slate-100">{item.item}</span>
                <Badge variant="outline" className={`px-2 py-1 text-xs border-none bg-slate-800 ${
                    item.priority === 'Critical' ? 'text-rose-400' : 
                    item.priority === 'High' ? 'text-orange-400' : 'text-slate-400'
                  }`}>
                  {item.priority}
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mb-4">申請單位 (Team): <span className="text-slate-300 font-medium">{item.requestingTeam}</span></p>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800 pt-3">
              <span className="text-xs text-slate-500">{item.dateRequested}</span>
              <div className={`flex items-center gap-2 text-sm font-medium ${
                  item.status === 'Completed' ? 'text-emerald-500' : 'text-slate-400'
                }`}>
                {item.status === 'Completed' && <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>}
                {item.status === 'Completed' ? '已完成' : '待處理 / 審核中'}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4">
        <span className="text-sm text-slate-400 bg-slate-950 px-4 py-2 rounded-lg">
          已解決 (Resolved): <strong className="text-emerald-400">{supportListData.filter(i => i.status === 'Completed').length}</strong> / {supportListData.length}
        </span>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white px-6">
          提出新需求 (Request New Item)
        </Button>
      </div>
    </Card>
  )
}

function BusinessTripPlan() {
  const { businessTripData } = useData();

  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl flex flex-col p-6 text-slate-200 border w-full min-h-[500px]">
      <h2 className="text-xl font-semibold mb-6 shrink-0 flex items-center gap-2">
        <Plane className="w-6 h-6 text-cyan-400" />
        出差計畫與業務支援項目 (Business Trip & Support Plan)
      </h2>
      <div className="flex-grow overflow-auto pr-2">
        <table className="w-full text-sm text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-slate-400">
              <th className="font-medium pb-2 px-4 w-56">出差時程 (Schedule)</th>
              <th className="font-medium pb-2 px-2 w-32">工程師 (Engineer)</th>
              <th className="font-medium pb-2 px-2 w-64">工作內容 (Content)</th>
              <th className="font-medium pb-2 px-2">預期目標 (Target)</th>
              <th className="font-medium pb-2 px-4 w-28">狀態 (Status)</th>
            </tr>
          </thead>
          <tbody>
            {businessTripData.map((item) => (
              <tr key={item.id} className="bg-slate-950/60 shadow-sm transition-colors hover:bg-slate-800/50">
                <td className="py-4 px-4 rounded-l-xl font-mono text-slate-300 whitespace-nowrap">{item.schedule}</td>
                <td className="py-4 px-2 text-slate-200 font-medium">{item.engineerName}</td>
                <td className="py-4 px-2 text-slate-300">{item.workContent}</td>
                <td className="py-4 px-2 text-slate-400">{item.expectedTarget}</td>
                <td className="py-4 px-4 rounded-r-xl">
                  <Badge variant="outline" className={`border-none ${
                    item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                    item.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400' :
                    item.status === 'Planned' ? 'bg-indigo-500/20 text-indigo-400' :
                    item.status === 'Pending' ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function CrossDeptCoordination() {
  const { crossDeptCoordinationData } = useData();

  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl flex flex-col p-6 text-slate-200 border w-full min-h-[500px]">
      <h2 className="text-xl font-semibold mb-6 shrink-0 flex items-center gap-2">
        <Handshake className="w-6 h-6 text-purple-400" />
        跨部門協調事項 (Cross-Department Coordination)
      </h2>
      <div className="flex-grow overflow-auto pr-2">
        <table className="w-full text-sm text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-slate-400">
              <th className="font-medium pb-2 px-4 w-32">需求單位</th>
              <th className="font-medium pb-2 px-2 w-28">分類</th>
              <th className="font-medium pb-2 px-2 w-64">需求內容</th>
              <th className="font-medium pb-2 px-2 w-32">支援單位</th>
              <th className="font-medium pb-2 px-2 w-64">回覆內容</th>
              <th className="font-medium pb-2 px-4 w-40">備註</th>
            </tr>
          </thead>
          <tbody>
            {crossDeptCoordinationData.map((item) => (
              <tr key={item.id} className="bg-slate-950/60 shadow-sm transition-colors hover:bg-slate-800/50">
                <td className="py-4 px-4 rounded-l-xl font-medium text-slate-300">{item.requestingDept}</td>
                <td className="py-4 px-2">
                  <Badge variant="outline" className="border-slate-700 text-slate-300">
                    {item.category}
                  </Badge>
                </td>
                <td className="py-4 px-2 text-slate-200">{item.requestContent}</td>
                <td className="py-4 px-2 font-medium text-blue-400">{item.supportingDept}</td>
                <td className="py-4 px-2 text-slate-300">{item.responseContent}</td>
                <td className="py-4 px-4 rounded-r-xl text-slate-400 text-xs">{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SettingsView() {
  const { isLoading, error, importDataCSV, exportDataCSV } = useData();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importTarget, setImportTarget] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && importTarget) {
      importDataCSV(importTarget, e.target.files[0]);
      e.target.value = ''; // Reset input to allow identical file selection
      setImportTarget(null);
    }
  };

  const dataModules = [
    { id: 'gantt', label: '甘特圖與狀態' },
    { id: 'safetystock', label: '長交期元件安全庫存' },
    { id: 'assembly', label: '組裝與廠內調試' },
    { id: 'trip', label: '出差計畫與業務支援' },
    { id: 'coordination', label: '跨部門協調事項' },
    { id: 'finance', label: '成本與費用管控' },
    { id: 'risk', label: '風險管控' },
    { id: 'support', label: '後勤支援' },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl flex flex-col p-6 text-slate-200 border w-full max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Database className="w-6 h-6 text-blue-400" />
        資料庫設定 (Database Settings)
      </h2>
      <div className="space-y-6">
        <div className="pt-4 space-y-4">
          <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-400" /> 
            本地資料備份與匯入 (Local CSV Import / Export)
          </h3>
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dataModules.map(module => (
              <div key={module.id} className="flex flex-col gap-2 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-sm font-medium text-slate-300 mb-1">{module.label}</div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => { setImportTarget(module.id); fileInputRef.current?.click(); }} 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white border-transparent flex-1 text-xs"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    匯入 (Import)
                  </Button>
                  <Button 
                    onClick={() => exportDataCSV(module.id)} 
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-500 text-white border-transparent flex-1 text-xs"
                  >
                    <LayoutDashboard className="w-3 h-3 mr-1" />
                    匯出 (Export)
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/50 rounded-lg text-rose-400 text-sm">
            {error}
          </div>
        )}

        <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg text-sm text-slate-400 space-y-2">
          <p className="font-semibold text-blue-300">使用說明：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>個別頁面 CSV 匯出/匯入：</strong> 可在上方「本地資料備份與匯入」區塊針對每個模組進行資料集的備份。</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

function DashboardApp() {
  const [activeTab, setActiveTab] = useState('gantt');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'gantt', label: '甘特圖與狀態', icon: <Activity className="w-5 h-5" /> },
    { id: 'safetystock', label: '長交期元件安全庫存', icon: <Package className="w-5 h-5" /> },
    { id: 'assembly', label: '組裝與廠內調試', icon: <Wrench className="w-5 h-5" /> },
    { id: 'trip', label: '出差計畫與業務支援', icon: <Plane className="w-5 h-5" /> },
    { id: 'coordination', label: '跨部門協調事項', icon: <Handshake className="w-5 h-5" /> },
    { id: 'finance', label: '成本與費用管控', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'risk', label: '風險管控', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'support', label: '後勤支援', icon: <HandHelping className="w-5 h-5" /> },
    { id: 'settings', label: '資料庫設定', icon: <Database className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'gantt': return <ProjectGanttStatus />;
      case 'safetystock': return <SafetyStockList />;
      case 'assembly': return <AssemblyAndFAT />;
      case 'trip': return <BusinessTripPlan />;
      case 'coordination': return <CrossDeptCoordination />;
      case 'finance': return <FinancialTracking />;
      case 'risk': return <RiskIssueRegister />;
      case 'support': return <SupportList />;
      case 'settings': return <SettingsView />;
      default: return <ProjectGanttStatus />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-full shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
            巨緯科技<br/>專案管理可視化系統
          </h1>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === item.id 
                  ? 'bg-blue-600 shadow-md text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 text-center">Version 2.0</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <h1 className="text-lg font-bold text-slate-200">巨緯科技 PMS</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[65px] left-0 right-0 bg-slate-900 border-b border-slate-800 z-50">
            <nav className="p-2 space-y-1 shadow-2xl">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Top Info Bar */}
        <div className="hidden md:flex justify-between items-center p-6 bg-slate-950 shrink-0">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            {navItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
          <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300 h-full">
            {renderContent()}
          </div>
        </div>

      </main>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <DashboardApp />
    </DataProvider>
  );
}

