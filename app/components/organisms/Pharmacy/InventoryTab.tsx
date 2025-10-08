import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { AddMedicineModal } from './AddMedicineModal';
import { RestockModal } from './RestockModal'; 
import {
  Package,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit3,
  Check,
  X,
  PackagePlus, // Added icon for restock button
} from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  expiryDate: string;
  supplier: string;
  lastRestocked: string;
  unit?: string;
  brand?: string;
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

interface InventoryTabProps {
  inventory: Record<string, any>;
  onAddMedicine: (medicine: NewMedicine) => void;
}

const categories = [
  "Cardiovascular",
  "Antidiabetic",
  "Vitamins",
  "Antibiotics",
  "Supplements",
];
const units = ["tablets", "capsules", "bottles", "packs"];

export function InventoryTab({ inventory = {}, onAddMedicine }: InventoryTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMedicine, setEditedMedicine] = useState<Medicine | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Mock data
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "Amlodipine 5mg",
      category: "Cardiovascular",
      currentStock: 120,
      minStock: 50,
      maxStock: 500,
      unitPrice: 0.25,
      expiryDate: "2025-06-15",
      supplier: "MediCorp Ltd",
      lastRestocked: "2024-01-10",
      unit: "tablets",
      brand: "Norvasc",
    },
    {
      id: "2",
      name: "Metformin 500mg",
      category: "Antidiabetic",
      currentStock: 85,
      minStock: 100,
      maxStock: 400,
      unitPrice: 0.15,
      expiryDate: "2025-08-20",
      supplier: "PharmaTech Inc",
      lastRestocked: "2024-01-08",
      unit: "tablets",
      brand: "Glucophage",
    },
    {
      id: "3",
      name: "Vitamin D3 1000IU",
      category: "Vitamins",
      currentStock: 200,
      minStock: 75,
      maxStock: 300,
      unitPrice: 0.12,
      expiryDate: "2025-12-01",
      supplier: "HealthCorp",
      lastRestocked: "2024-01-05",
      unit: "capsules",
      brand: "Nature's Best",
    },
  ]);

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (medicine.brand &&
        medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleView = (medicine: Medicine) => {
    if (viewingId === medicine.id) {
      setViewingId(null);
      setIsEditing(false);
    } else {
      setViewingId(medicine.id);
      setEditedMedicine({ ...medicine });
      setIsEditing(false);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = () => {
    if (editedMedicine) {
      setMedicines((prev) =>
        prev.map((med) => (med.id === viewingId ? editedMedicine : med))
      );
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: keyof Medicine, value: string | number) => {
    if (editedMedicine) {
      setEditedMedicine((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { status: "low", color: "bg-red-100 text-red-800" };
    if (current <= min * 1.5) return { status: "medium", color: "bg-yellow-100 text-yellow-800" };
    return { status: "good", color: "bg-green-100 text-green-800" };
  };

  const handleAddMedicine = (newMedicine: NewMedicine) => {
    // Generate a unique ID for the new medicine
    const newId = (medicines.length + 1).toString();
    
    // Create a complete medicine object with default values for missing fields
    const completeMedicine: Medicine = {
      id: newId,
      name: newMedicine.name,
      category: newMedicine.category,
      currentStock: newMedicine.quantity,
      minStock: 50, // Default value
      maxStock: 500, // Default value
      unitPrice: 0.25, // Default value
      expiryDate: newMedicine.expiryDate,
      supplier: "New Supplier", // Default value
      lastRestocked: new Date().toISOString().split('T')[0], // Today's date
      unit: newMedicine.unit,
      brand: newMedicine.brand,
    };
    
    // Add the new medicine to the list
    setMedicines(prev => [...prev, completeMedicine]);
    
    // Close the modal
    setIsAddModalOpen(false);
    
    // Call the parent's onAddMedicine if provided
    if (onAddMedicine) {
      onAddMedicine(newMedicine);
    }
  };

  // Handle restock functionality
  const handleRestock = (medicineName: string, quantity: number, batchInfo?: any) => {
    setMedicines(prev => prev.map(med => {
      if (med.name === medicineName) {
        return {
          ...med,
          currentStock: med.currentStock + quantity,
          unitPrice: batchInfo?.unitPrice || med.unitPrice,
          supplier: batchInfo?.supplier || med.supplier,
          expiryDate: batchInfo?.expiryDate || med.expiryDate,
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return med;
    }));
    
    setIsRestockModalOpen(false);
    setSelectedMedicine(null);
  };

  // Open restock modal
  const openRestockModal = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsRestockModalOpen(true);
  };

  // Mobile Card Component
  const MobileCard = ({ medicine }: { medicine: Medicine }) => {
    const stockStatus = getStockStatus(medicine.currentStock, medicine.minStock);
    
    return (
      <Card key={medicine.id} className="border-blue-100 mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 text-lg">{medicine.name}</h3>
              <p className="text-blue-600 text-sm">{medicine.brand}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleView(medicine)}
              className="ml-2"
            >
              {viewingId === medicine.id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Badge variant="outline" className="border-blue-200 text-blue-700 mb-2">
                {medicine.category}
              </Badge>
              <p className="text-sm text-gray-600">
                <span className="font-medium">${medicine.unitPrice.toFixed(2)}</span> / {medicine.unit}
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                {medicine.currentStock} / {medicine.maxStock}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Min: {medicine.minStock}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">Expires:</span> {medicine.expiryDate}
            </div>
            <div>
              <span className="font-medium">Restocked:</span> {medicine.lastRestocked}
            </div>
          </div>
          
          {/* Restock Button for Mobile */}
          <div className="mt-4">
            <Button 
              size="sm" 
              variant="outline"
              className="w-full"
              onClick={() => openRestockModal(medicine)}
            >
              <PackagePlus className="h-4 w-4 mr-1" />
              Restock
            </Button>
          </div>
          
          {viewingId === medicine.id && (
            <div className="mt-4 pt-4 border-t border-blue-100">
              <div className="grid grid-cols-1 gap-3">
                {Object.entries({
                  name: "Medicine Name",
                  brand: "Brand",
                  category: "Category",
                  unit: "Unit",
                  unitPrice: "Unit Price",
                  expiryDate: "Expiry Date",
                  currentStock: "Stock",
                  minStock: "Min Stock",
                  maxStock: "Max Stock",
                  supplier: "Supplier",
                  lastRestocked: "Last Restocked",
                }).map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {label}
                    </label>
                    {isEditing ? (
                      key === "category" ? (
                        <select
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          value={(editedMedicine as any)?.[key] || ""}
                          onChange={(e) =>
                            handleInputChange(key as keyof Medicine, e.target.value)
                          }
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      ) : key === "unit" ? (
                        <select
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          value={(editedMedicine as any)?.[key] || ""}
                          onChange={(e) =>
                            handleInputChange(key as keyof Medicine, e.target.value)
                          }
                        >
                          {units.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          type={
                            key.includes("Date")
                              ? "date"
                              : key.includes("Price") || key.includes("Stock")
                              ? "number"
                              : "text"
                          }
                          value={(editedMedicine as any)?.[key] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              key as keyof Medicine,
                              key.includes("Price") || key.includes("Stock")
                                ? Number(e.target.value)
                                : e.target.value
                            )
                          }
                          className="text-sm"
                        />
                      )
                    ) : (
                      <p className="text-sm text-blue-900 font-medium">
                        {key === "unitPrice" 
                          ? `$${(editedMedicine as any)?.[key]?.toFixed(2)}` 
                          : (editedMedicine as any)?.[key]
                        }
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="bg-green-600 text-white"
                    >
                      <Check className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openRestockModal(medicine)}
                    >
                      <PackagePlus className="h-4 w-4 mr-1" /> Restock
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEdit}
                    >
                      <Edit3 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add Medicine
        </Button>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-900">Medicine Inventory</h2>
          <Badge variant="outline" className="ml-auto">
            {filteredMedicines.length} items
          </Badge>
        </div>
        
        {filteredMedicines.length === 0 ? (
          <Card className="border-blue-100">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No medicines found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div>
            {filteredMedicines.map((medicine) => (
              <MobileCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card className="border-blue-100 bg-white">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Package className="h-5 w-5" /> Medicine Inventory
              <Badge variant="outline" className="ml-auto">
                {filteredMedicines.length} items
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[1200px] bg-white">
                <thead className="bg-blue-50 border-b border-blue-100 bg-white">
                  <tr>
                    <th className="p-4 text-left">Medicine</th>
                    <th className="p-4 text-left">Brand</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Unit</th>
                    <th className="p-4 text-left">Unit Price</th>
                    <th className="p-4 text-left">Expiry</th>
                    <th className="p-4 text-left">Stock</th>
                    <th className="p-4 text-left">Min</th>
                    <th className="p-4 text-left">Max</th>
                    <th className="p-4 text-left">Supplier</th>
                    <th className="p-4 text-left">Last Restocked</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((medicine) => (
                    <React.Fragment key={medicine.id}>
                      <tr className="border-b border-blue-50 hover:bg-blue-25">
                        <td className="p-4 font-medium text-blue-900">
                          {medicine.name}
                        </td>
                        <td className="p-4 text-blue-700">{medicine.brand}</td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className="border-blue-200 text-blue-700"
                          >
                            {medicine.category}
                          </Badge>
                        </td>
                        <td className="p-4">{medicine.unit}</td>
                        <td className="p-4 font-medium text-blue-900">
                          ${medicine.unitPrice.toFixed(2)}
                        </td>
                        <td className="p-4">{medicine.expiryDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getStockStatus(medicine.currentStock, medicine.minStock).color}`}>
                            {medicine.currentStock}
                          </span>
                        </td>
                        <td className="p-4">{medicine.minStock}</td>
                        <td className="p-4">{medicine.maxStock}</td>
                        <td className="p-4">{medicine.supplier}</td>
                        <td className="p-4">{medicine.lastRestocked}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openRestockModal(medicine)}
                            >
                              <PackagePlus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(medicine)}
                            >
                              {viewingId === medicine.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {viewingId === medicine.id && (
                        <tr>
                          <td colSpan={12} className="bg-blue-25 p-4">
                            <Card>
                              <CardHeader>
                                <CardTitle>Medicine Details</CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries({
                                  name: "Medicine Name",
                                  brand: "Brand",
                                  category: "Category",
                                  unit: "Unit",
                                  unitPrice: "Unit Price",
                                  expiryDate: "Expiry Date",
                                  currentStock: "Stock",
                                  minStock: "Min Stock",
                                  maxStock: "Max Stock",
                                  supplier: "Supplier",
                                  lastRestocked: "Last Restocked",
                                }).map(([key, label]) => (
                                  <div key={key}>
                                    <label className="block text-sm text-gray-600 mb-1">
                                      {label}
                                    </label>
                                    {isEditing ? (
                                      key === "category" ? (
                                        <select
                                          className="border rounded px-2 py-1 w-full"
                                          value={(editedMedicine as any)?.[key] || ""}
                                          onChange={(e) =>
                                            handleInputChange(key as keyof Medicine, e.target.value)
                                          }
                                        >
                                          {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                              {cat}
                                            </option>
                                          ))}
                                        </select>
                                      ) : key === "unit" ? (
                                        <select
                                          className="border rounded px-2 py-1 w-full"
                                          value={(editedMedicine as any)?.[key] || ""}
                                          onChange={(e) =>
                                            handleInputChange(key as keyof Medicine, e.target.value)
                                          }
                                        >
                                          {units.map((u) => (
                                            <option key={u} value={u}>
                                              {u}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <Input
                                          type={
                                            key.includes("Date")
                                              ? "date"
                                              : key.includes("Price") || key.includes("Stock")
                                              ? "number"
                                              : "text"
                                          }
                                          value={(editedMedicine as any)?.[key] || ""}
                                          onChange={(e) =>
                                            handleInputChange(
                                              key as keyof Medicine,
                                              key.includes("Price") || key.includes("Stock")
                                                ? Number(e.target.value)
                                                : e.target.value
                                            )
                                          }
                                        />
                                      )
                                    ) : (
                                      <p className="text-blue-900">
                                        {key === "unitPrice" 
                                          ? `$${(editedMedicine as any)?.[key]?.toFixed(2)}` 
                                          : (editedMedicine as any)?.[key]
                                        }
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </CardContent>

                              <div className="flex justify-end gap-2 p-4">
                                {isEditing ? (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={handleSave}
                                      className="bg-green-600 text-white"
                                    >
                                      <Check className="h-4 w-4 mr-1" /> Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={handleCancel}
                                    >
                                      <X className="h-4 w-4 mr-1" /> Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openRestockModal(medicine)}
                                    >
                                      <PackagePlus className="h-4 w-4 mr-1" /> Restock
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={handleEdit}
                                    >
                                      <Edit3 className="h-4 w-4 mr-1" /> Edit
                                    </Button>
                                  </>
                                )}
                              </div>
                            </Card>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMedicine={handleAddMedicine}
      />

      {/* Restock Modal */}
      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => {
          setIsRestockModalOpen(false);
          setSelectedMedicine(null);
        }}
        medicine={selectedMedicine}
        onRestock={handleRestock}
      />
    </div>
  );
}