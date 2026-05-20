import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  projectStatusData as initialProjectData, 
  safetyStockData as initialSafetyStockData, 
  sCurveFinancialData as initialFinancialData, 
  riskAndIssuesData as initialRiskData, 
  supportListData as initialSupportData,
  assemblyAndFATData as initialAssemblyAndFATData,
  businessTripData as initialBusinessTripData,
  crossDeptCoordinationData as initialCrossDeptData
} from './mockData';

interface DataContextType {
  projectStatusData: any[];
  safetyStockData: any[];
  sCurveFinancialData: any[];
  riskAndIssuesData: any[];
  supportListData: any[];
  assemblyAndFATData: any[];
  businessTripData: any[];
  crossDeptCoordinationData: any[];
  isLoading: boolean;
  error: string | null;
  importDataCSV: (type: string, file: File) => void;
  exportDataCSV: (type: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

import Papa from 'papaparse';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectStatusData, setProjectStatusData] = useState(initialProjectData);
  const [safetyStockData, setSafetyStockData] = useState(initialSafetyStockData);
  const [sCurveFinancialData, setSCurveFinancialData] = useState(initialFinancialData);
  const [riskAndIssuesData, setRiskData] = useState(initialRiskData);
  const [supportListData, setSupportData] = useState(initialSupportData);
  const [assemblyAndFATData, setAssemblyAndFATData] = useState(initialAssemblyAndFATData);
  const [businessTripData, setBusinessTripData] = useState(initialBusinessTripData);
  const [crossDeptCoordinationData, setCrossDeptCoordinationData] = useState(initialCrossDeptData);

  const importDataCSV = (type: string, file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        if (data.length === 0) {
          alert('CSV 檔案沒有資料或無法讀取。');
          return;
        }

        switch (type) {
          case 'gantt':
            setProjectStatusData(data.map(row => ({
              id: row.id || row.Id || row.ID || '',
              name: row.name || row.Name || '',
              progress: Number(row.progress || row.Progress) || 0,
              status: row.status || row.Status || 'On Track',
              owner: row.owner || row.Owner || '',
              startDate: row.startDate || row['Start Date'] || '',
              endDate: row.endDate || row['End Date'] || '',
              delayDays: Number(row.delayDays || row['Delay Days']) || 0,
              budget: Number(row.budget || row.Budget) || 0,
              actualCost: Number(row.actualCost || row['Actual Cost']) || 0,
              activeRisks: Number(row.activeRisks || row['Active Risks']) || 0,
              activeIssues: Number(row.activeIssues || row['Active Issues']) || 0,
            })));
            break;
          case 'safetystock':
            setSafetyStockData(data);
            break;
          case 'finance':
            setSCurveFinancialData(data.map(row => ({
              ...row,
              plannedCost: Number(row.plannedCost) || 0,
              actualCost: Number(row.actualCost) || 0
            })));
            break;
          case 'risk':
            setRiskData(data);
            break;
          case 'support':
            setSupportData(data);
            break;
          case 'assembly':
            setAssemblyAndFATData(data.map(row => ({
              ...row,
              assemblyProgress: Number(row.assemblyProgress) || 0,
              fatProgress: Number(row.fatProgress) || 0
            })));
            break;
          case 'trip':
            setBusinessTripData(data);
            break;
          case 'coordination':
            setCrossDeptCoordinationData(data);
            break;
          default:
            alert('未知的資料類型匯入');
            return;
        }
        alert('成功從 CSV 匯入資料！');
      },
      error: (err: any) => {
        alert(err.message || 'CSV 解析失敗');
      }
    });
  };

  const exportDataCSV = (type: string) => {
    let dataToExport: any[] = [];
    let filename = 'export.csv';

    switch (type) {
      case 'gantt':
        dataToExport = projectStatusData;
        filename = 'project_status_export.csv';
        break;
      case 'safetystock':
        dataToExport = safetyStockData;
        filename = 'safety_stock_export.csv';
        break;
      case 'finance':
        dataToExport = sCurveFinancialData;
        filename = 'financial_export.csv';
        break;
      case 'risk':
        dataToExport = riskAndIssuesData;
        filename = 'risk_issues_export.csv';
        break;
      case 'support':
        dataToExport = supportListData;
        filename = 'support_list_export.csv';
        break;
      case 'assembly':
        dataToExport = assemblyAndFATData;
        filename = 'assembly_fat_export.csv';
        break;
      case 'trip':
        dataToExport = businessTripData;
        filename = 'business_trip_export.csv';
        break;
      case 'coordination':
        dataToExport = crossDeptCoordinationData;
        filename = 'cross_dept_coordination_export.csv';
        break;
    }

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DataContext.Provider value={{
      projectStatusData,
      safetyStockData,
      sCurveFinancialData,
      riskAndIssuesData,
      supportListData,
      assemblyAndFATData,
      businessTripData,
      crossDeptCoordinationData,
      isLoading,
      error,
      importDataCSV,
      exportDataCSV
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
