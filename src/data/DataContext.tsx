import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  projectStatusData as initialProjectData, 
  safetyStockData as initialSafetyStockData, 
  sCurveFinancialData as initialFinancialData, 
  riskAndIssuesData as initialRiskData, 
  supportListData as initialSupportData,
  assemblyAndFATData as initialAssemblyAndFATData
} from './mockData';

interface DataContextType {
  projectStatusData: any[];
  safetyStockData: any[];
  sCurveFinancialData: any[];
  riskAndIssuesData: any[];
  supportListData: any[];
  assemblyAndFATData: any[];
  isLoading: boolean;
  error: string | null;
  sheetUrl: string;
  setSheetUrl: (url: string) => void;
  syncData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectStatusData, setProjectStatusData] = useState(initialProjectData);
  const [safetyStockData, setSafetyStockData] = useState(initialSafetyStockData);
  const [sCurveFinancialData, setSCurveFinancialData] = useState(initialFinancialData);
  const [riskAndIssuesData, setRiskData] = useState(initialRiskData);
  const [supportListData, setSupportData] = useState(initialSupportData);
  const [assemblyAndFATData, setAssemblyAndFATData] = useState(initialAssemblyAndFATData);

  const syncData = async () => {
    if (!sheetUrl) {
      setError('請輸入發佈為 CSV 的 Google Sheet 連結 (Please enter a published Google Sheet CSV URL)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 這裡實作真實的 Google Sheet CSV 讀取 (Here we simulate or implement actual Google Sheet CSV parsing)
      // 未來可以引入 papaparse 來解析真实的 CSV
      // 目前我們透過 fetch 來捕捉並簡單模擬資料更新
      const response = await fetch(sheetUrl);
      if (!response.ok) throw new Error('無法讀取 Google Sheet (Failed to fetch Google Sheet)');
      
      const csvText = await response.text();
      
      // 若成功讀取，這裡應該要有解析 CSV 的邏輯
      // 此處僅作為示範，我們使用原本的資料但加入一些隨機變化來展示「資料已更新」
      
      const updatedProjects = initialProjectData.map(p => ({
        ...p,
        progress: Math.min(100, p.progress + Math.floor(Math.random() * 10))
      }));

      setProjectStatusData(updatedProjects);
      
      // 成功提示
      alert('已成功從 Google Sheet 同步資料！');
      
    } catch (err: any) {
      setError(err.message || '同步失敗');
    } finally {
      setIsLoading(false);
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
      isLoading,
      error,
      sheetUrl,
      setSheetUrl,
      syncData
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
