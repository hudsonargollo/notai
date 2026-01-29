/**
 * Scanner Component Examples
 * 
 * Demonstrates various usage patterns for the migrated Scanner component.
 * This component now uses:
 * - PageTransition for smooth navigation
 * - FloatingActionButton for quick actions
 * - BottomSheet for scan results (mobile-responsive)
 * - Skeleton loaders for loading states
 * - Lucide icons throughout
 */

import React, { useState } from 'react';
import { Scanner } from '../Scanner';
import { AIReceiptResponse, Language } from '../../types';

/**
 * Example 1: Basic Scanner Usage
 * 
 * Shows the simplest implementation of the Scanner component.
 */
export function BasicScannerExample() {
  const [showScanner, setShowScanner] = useState(false);

  const handleScanComplete = (data: AIReceiptResponse, imageUrl: string) => {
    console.log('Scan completed:', data);
    console.log('Image URL:', imageUrl);
    setShowScanner(false);
  };

  const handleCancel = () => {
    console.log('Scanner cancelled');
    setShowScanner(false);
  };

  return (
    <div className="h-screen w-screen bg-void">
      {!showScanner ? (
        <div className="flex items-center justify-center h-full">
          <button
            onClick={() => setShowScanner(true)}
            className="px-6 py-3 bg-energy-500 text-white rounded-lg font-bold"
          >
            Open Scanner
          </button>
        </div>
      ) : (
        <Scanner
          onScanComplete={handleScanComplete}
          onCancel={handleCancel}
          currentLang="en"
        />
      )}
    </div>
  );
}

/**
 * Example 2: Scanner with State Management
 * 
 * Shows how to manage scanner state and handle results.
 */
export function ScannerWithStateExample() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResults, setScanResults] = useState<AIReceiptResponse[]>([]);
  const [currentLang, setCurrentLang] = useState<Language>('en');

  const handleScanComplete = (data: AIReceiptResponse, imageUrl: string) => {
    // Add scan result to list
    setScanResults((prev) => [...prev, data]);
    
    // Store image URL if needed
    console.log('Receipt image:', imageUrl);
    
    // Close scanner
    setShowScanner(false);
    
    // Show success message
    alert(`Successfully scanned receipt from ${data.merchant}`);
  };

  const handleCancel = () => {
    setShowScanner(false);
  };

  return (
    <div className="h-screen w-screen bg-void">
      {!showScanner ? (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Receipts</h1>
            <div className="flex gap-2">
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value as Language)}
                className="px-3 py-2 bg-white/10 text-white rounded-lg"
              >
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
              <button
                onClick={() => setShowScanner(true)}
                className="px-6 py-3 bg-energy-500 text-white rounded-lg font-bold"
              >
                Scan Receipt
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {scanResults.length === 0 ? (
              <p className="text-slate-400 text-center py-12">
                No receipts scanned yet. Click "Scan Receipt" to get started.
              </p>
            ) : (
              scanResults.map((result, index) => (
                <div
                  key={index}
                  className="glass-panel p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="text-white font-bold">{result.merchant}</div>
                    <div className="text-slate-400 text-sm">
                      {result.category} • {result.date}
                    </div>
                  </div>
                  <div className="text-energy-500 font-black text-xl">
                    ${result.amount?.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <Scanner
          onScanComplete={handleScanComplete}
          onCancel={handleCancel}
          currentLang={currentLang}
        />
      )}
    </div>
  );
}

/**
 * Example 3: Scanner with Error Handling
 * 
 * Shows how to handle errors and provide user feedback.
 */
export function ScannerWithErrorHandlingExample() {
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<AIReceiptResponse | null>(null);

  const handleScanComplete = (data: AIReceiptResponse, imageUrl: string) => {
    try {
      // Validate scan data
      if (!data.merchant || !data.amount) {
        throw new Error('Invalid scan data: missing required fields');
      }

      if (data.amount <= 0) {
        throw new Error('Invalid amount: must be greater than zero');
      }

      // Process successful scan
      setLastScan(data);
      setError(null);
      setShowScanner(false);
      
      console.log('Scan successful:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setShowScanner(false);
    }
  };

  const handleCancel = () => {
    setShowScanner(false);
    setError(null);
  };

  return (
    <div className="h-screen w-screen bg-void">
      {!showScanner ? (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg max-w-md">
              <div className="font-bold mb-1">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          )}

          {lastScan && (
            <div className="glass-panel p-6 rounded-lg max-w-md w-full">
              <div className="text-white font-bold text-lg mb-4">Last Scan</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Merchant:</span>
                  <span className="text-white font-bold">{lastScan.merchant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-energy-500 font-black">
                    ${lastScan.amount?.toFixed(2)}
                  </span>
                </div>
                {lastScan.category && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-white">{lastScan.category}</span>
                  </div>
                )}
                {lastScan.date && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="text-white">{lastScan.date}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => setShowScanner(true)}
            className="px-6 py-3 bg-energy-500 text-white rounded-lg font-bold"
          >
            {lastScan ? 'Scan Another Receipt' : 'Scan Receipt'}
          </button>
        </div>
      ) : (
        <Scanner
          onScanComplete={handleScanComplete}
          onCancel={handleCancel}
          currentLang="en"
        />
      )}
    </div>
  );
}

/**
 * Example 4: Scanner in Multi-Step Flow
 * 
 * Shows how to integrate Scanner into a multi-step workflow.
 */
export function ScannerInWorkflowExample() {
  const [step, setStep] = useState<'select' | 'scan' | 'review' | 'complete'>('select');
  const [scanData, setScanData] = useState<AIReceiptResponse | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleScanComplete = (data: AIReceiptResponse, url: string) => {
    setScanData(data);
    setImageUrl(url);
    setStep('review');
  };

  const handleCancel = () => {
    setStep('select');
  };

  const handleConfirmReview = () => {
    // Process the expense
    console.log('Processing expense:', scanData);
    setStep('complete');
  };

  const handleStartOver = () => {
    setScanData(null);
    setImageUrl('');
    setStep('select');
  };

  return (
    <div className="h-screen w-screen bg-void">
      {step === 'select' && (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
          <h1 className="text-3xl font-black text-white mb-8">Add Expense</h1>
          <button
            onClick={() => setStep('scan')}
            className="w-full max-w-md glass-panel p-6 rounded-2xl flex items-center gap-4"
          >
            <div className="bg-energy-500 p-4 rounded-xl">
              <span className="text-2xl">📷</span>
            </div>
            <div className="text-left">
              <div className="text-white font-black text-lg">Scan Receipt</div>
              <div className="text-slate-400 text-sm">Use camera or gallery</div>
            </div>
          </button>
          <button
            className="w-full max-w-md glass-panel p-6 rounded-2xl flex items-center gap-4"
          >
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-2xl">✏️</span>
            </div>
            <div className="text-left">
              <div className="text-white font-black text-lg">Manual Entry</div>
              <div className="text-slate-400 text-sm">Type details manually</div>
            </div>
          </button>
        </div>
      )}

      {step === 'scan' && (
        <Scanner
          onScanComplete={handleScanComplete}
          onCancel={handleCancel}
          currentLang="en"
        />
      )}

      {step === 'review' && scanData && (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
          <h1 className="text-2xl font-black text-white">Review Expense</h1>
          
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Receipt"
              className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
            />
          )}

          <div className="w-full max-w-md glass-panel p-6 rounded-lg space-y-4">
            <div>
              <div className="text-slate-400 text-sm">Merchant</div>
              <div className="text-white font-bold text-lg">{scanData.merchant}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Amount</div>
              <div className="text-energy-500 font-black text-2xl">
                ${scanData.amount?.toFixed(2)}
              </div>
            </div>
            {scanData.category && (
              <div>
                <div className="text-slate-400 text-sm">Category</div>
                <div className="text-white">{scanData.category}</div>
              </div>
            )}
            {scanData.date && (
              <div>
                <div className="text-slate-400 text-sm">Date</div>
                <div className="text-white">{scanData.date}</div>
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full max-w-md">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 bg-white/5 text-white rounded-lg font-bold border border-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReview}
              className="flex-1 px-6 py-3 bg-energy-500 text-white rounded-lg font-bold"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-black text-white">Expense Added!</h1>
          <p className="text-slate-400 text-center max-w-md">
            Your expense has been successfully recorded and categorized.
          </p>
          <button
            onClick={handleStartOver}
            className="px-6 py-3 bg-energy-500 text-white rounded-lg font-bold"
          >
            Add Another Expense
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Scanner with Custom Styling
 * 
 * Shows how the Scanner component adapts to different themes and contexts.
 */
export function CustomStyledScannerExample() {
  const [showScanner, setShowScanner] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleScanComplete = (data: AIReceiptResponse, imageUrl: string) => {
    console.log('Scan completed:', data);
    setShowScanner(false);
  };

  const handleCancel = () => {
    setShowScanner(false);
  };

  return (
    <div
      className={`h-screen w-screen ${
        theme === 'dark' ? 'bg-void' : 'bg-white'
      }`}
    >
      {!showScanner ? (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg font-bold ${
                theme === 'dark'
                  ? 'bg-energy-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Dark Theme
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-lg font-bold ${
                theme === 'light'
                  ? 'bg-energy-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Light Theme
            </button>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="px-6 py-3 bg-energy-500 text-white rounded-lg font-bold"
          >
            Open Scanner
          </button>

          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
            }`}
          >
            Scanner adapts to your theme automatically
          </p>
        </div>
      ) : (
        <Scanner
          onScanComplete={handleScanComplete}
          onCancel={handleCancel}
          currentLang="en"
        />
      )}
    </div>
  );
}
