import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { TransactionTab } from '@/components/organisms/Pharmacy/TransactionTab';
import { InventoryTab } from '@/components/organisms/Pharmacy/InventoryTab';
import { ReportsTab } from '@/components/organisms/Pharmacy/ReporTab';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/atoms/avatar';
import { Button } from '@/components/atoms/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/card';
import { Badge } from '@/components/atoms/badge';

import { User, ArrowLeft, CheckCircle, Pill } from 'lucide-react';

// Define interfaces for shared state
interface InventoryItem {
  medicine: string;
  available: number;
  expiry: string;
  brand?: string;
  category?: string;
  unit?: string;
  barcode?: string;
}

interface DispensedRecord {
  id: string;
  patientName: string;
  medicine: string;
  quantity: number;
  timestamp: string;
  remainingStock: number;
}

interface NewMedicine {
  name: string;
  brand: string;
  quantity: number;
  unit: string;
  barcode: string;
  category: string;
  expiryDate: string;
}

export default function PharmacyPage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState('transaction');
  const navigate = useNavigate();


  
  // Shared inventory state
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>({
    'Amlodipine 5mg': { medicine: 'Amlodipine 5mg', available: 250, expiry: '2025-06-15', category: 'Cardiovascular', unit: 'tablets' },
    'Metformin 500mg': { medicine: 'Metformin 500mg', available: 180, expiry: '2025-08-20', category: 'Antidiabetic', unit: 'tablets' },
    'Metformin 1000mg': { medicine: 'Metformin 1000mg', available: 95, expiry: '2025-07-10', category: 'Antidiabetic', unit: 'tablets' },
    'Amoxicillin 500mg': { medicine: 'Amoxicillin 500mg', available: 45, expiry: '2024-12-30', category: 'Antibiotic', unit: 'capsules' },
    'Cough Syrup': { medicine: 'Cough Syrup', available: 12, expiry: '2025-03-15', category: 'Respiratory', unit: 'bottles' },
    'Insulin Glargine': { medicine: 'Insulin Glargine', available: 8, expiry: '2024-11-25', category: 'Antidiabetic', unit: 'vials' }
  });

  // Recently dispensed medicines


  const handleBackClick = () => {
  
    navigate(-1);
    
  };

  // Function to update inventory after dispensing
  const updateInventoryAfterDispensing = (dispensedMedicines: { medicine: string; quantity: number; patientName: string }[]) => {
    const newInventory = { ...inventory };
    const newDispensedRecords: DispensedRecord[] = [];

    dispensedMedicines.forEach(({ medicine, quantity, patientName }) => {
      if (newInventory[medicine]) {
        const previousStock = newInventory[medicine].available;
        newInventory[medicine].available = Math.max(0, previousStock - quantity);
        
        // Add to dispensed records
        newDispensedRecords.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          patientName,
          medicine,
          quantity,
          timestamp: new Date().toLocaleTimeString(),
          remainingStock: newInventory[medicine].available
        });
      }
    });

    setInventory(newInventory);
   
  };

  // Function to add new medicine to inventory
  const addNewMedicine = (newMedicine: NewMedicine) => {
    const medicineKey = newMedicine.name;
    
    if (inventory[medicineKey]) {
      // If medicine already exists, add to existing quantity
      setInventory(prev => ({
        ...prev,
        [medicineKey]: {
          ...prev[medicineKey],
          available: prev[medicineKey].available + newMedicine.quantity
        }
      }));
    } else {
      // Add new medicine to inventory
      setInventory(prev => ({
        ...prev,
        [medicineKey]: {
          medicine: newMedicine.name,
          available: newMedicine.quantity,
          expiry: newMedicine.expiryDate,
          brand: newMedicine.brand || undefined,
          category: newMedicine.category,
          unit: newMedicine.unit,
          barcode: newMedicine.barcode || undefined
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackClick}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-blue-900 text-2xl font-semibold">PharmaCare System</h1>
              <p className="text-blue-600 text-sm">Medicine Dispensing Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-blue-900 font-medium">Nurse Sarah Johnson</p>
              <p className="text-blue-600 text-sm">Registered Nurse</p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-blue-200">
              <AvatarImage src="/api/placeholder/40/40" alt="Nurse" />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-1 grid grid-cols-3 w-full max-w-md">
              <button
                onClick={() => setActiveTab('transaction')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'transaction' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
              >
                Transaction
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'inventory' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'reports' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
              >
                Reports
              </button>
            </div>
          </div>

         

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'transaction' && (
              <TransactionTab 
                inventory={inventory}
                onDispenseComplete={updateInventoryAfterDispensing}
              />
            )}
            {activeTab === 'inventory' && (
              <InventoryTab 
                inventory={inventory} 
                onAddMedicine={addNewMedicine}
              />
            )}
            {activeTab === 'reports' && (
              <ReportsTab />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}