import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Card, CardContent } from '@/components/atoms/card';
import { Badge } from '@/components/atoms/badge';
import { Package, Plus, AlertTriangle } from 'lucide-react';

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

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
  onRestock: (medicineName: string, quantity: number, batchInfo?: RestockInfo) => void;
}

interface RestockInfo {
  batchNumber: string;
  expiryDate: string;
  supplier: string;
  unitPrice: number;
}

export function RestockModal({ isOpen, onClose, medicine, onRestock }: RestockModalProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default values when modal opens or medicine changes
  useEffect(() => {
    if (isOpen && medicine) {
      setSupplier(medicine.supplier || '');
      setUnitPrice(medicine.unitPrice || 0);
    }
  }, [isOpen, medicine]);

  const handleClose = () => {
    // Reset form
    setQuantity(0);
    setBatchNumber('');
    setExpiryDate('');
    setSupplier(medicine?.supplier || '');
    setUnitPrice(medicine?.unitPrice || 0);
    setErrors({});
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!quantity || quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (quantity > 1000) {
      newErrors.quantity = 'Quantity cannot exceed 1000 units';
    }

    if (!batchNumber.trim()) {
      newErrors.batchNumber = 'Batch number is required';
    }

    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const expiry = new Date(expiryDate);
      const today = new Date();
      if (expiry <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }

    if (!supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    if (!unitPrice || unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRestock = () => {
    if (!medicine || !validateForm()) return;

    const batchInfo: RestockInfo = {
      batchNumber,
      expiryDate,
      supplier,
      unitPrice
    };

    onRestock(medicine.name, quantity, batchInfo);
    handleClose();
  };

  // Early return after all hooks
  if (!medicine) return null;

  const getStockStatus = () => {
    if (medicine.currentStock <= medicine.minStock) return { status: 'Critical', variant: 'destructive' as const };
    if (medicine.currentStock <= medicine.minStock * 1.5) return { status: 'Low', variant: 'secondary' as const };
    return { status: 'Good', variant: 'default' as const };
  };

  const stockStatus = getStockStatus();
  const newStockLevel = medicine.currentStock + quantity;
  const isOverMax = newStockLevel > medicine.maxStock;

  return (
    <Dialog open={isOpen && !!medicine} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-blue-900 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Restock Medicine
          </DialogTitle>
          <DialogDescription>
            Add new stock for {medicine.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Stock Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-blue-900 font-medium">{medicine.name}</h4>
                  <Badge variant={stockStatus.variant}>{stockStatus.status} Stock</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600">Current Stock</p>
                    <p className="text-blue-900 font-medium">{medicine.currentStock} {medicine.unit}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Min Stock</p>
                    <p className="text-blue-900 font-medium">{medicine.minStock} {medicine.unit}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Max Stock</p>
                    <p className="text-blue-900 font-medium">{medicine.maxStock} {medicine.unit}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Category</p>
                    <p className="text-blue-900 font-medium">{medicine.category}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restock Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity" className="text-blue-700">
                Restock Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity || ''}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                placeholder="Enter quantity to add"
                className={`border-blue-200 focus:border-blue-400 ${errors.quantity ? 'border-red-300' : ''}`}
                min="1"
                max="1000"
              />
              {errors.quantity && (
                <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <Label htmlFor="batchNumber" className="text-blue-700">
                Batch Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="batchNumber"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g., BT2024001"
                className={`border-blue-200 focus:border-blue-400 ${errors.batchNumber ? 'border-red-300' : ''}`}
              />
              {errors.batchNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.batchNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="expiryDate" className="text-blue-700">
                Expiry Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={`border-blue-200 focus:border-blue-400 ${errors.expiryDate ? 'border-red-300' : ''}`}
              />
              {errors.expiryDate && (
                <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="supplier" className="text-blue-700">
                Supplier <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Supplier name"
                className={`border-blue-200 focus:border-blue-400 ${errors.supplier ? 'border-red-300' : ''}`}
              />
              {errors.supplier && (
                <p className="text-red-600 text-sm mt-1">{errors.supplier}</p>
              )}
            </div>

            <div>
              <Label htmlFor="unitPrice" className="text-blue-700">
                Unit Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={unitPrice || ''}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                placeholder="Price per unit"
                className={`border-blue-200 focus:border-blue-400 ${errors.unitPrice ? 'border-red-300' : ''}`}
              />
              {errors.unitPrice && (
                <p className="text-red-600 text-sm mt-1">{errors.unitPrice}</p>
              )}
            </div>
          </div>

          {/* Stock Level Preview */}
          {quantity > 0 && (
            <Card className={`${isOverMax ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {isOverMax ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  ) : (
                    <Plus className="h-5 w-5 text-green-600 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className={`font-medium ${isOverMax ? 'text-yellow-800' : 'text-green-800'}`}>
                      Stock Level After Restock
                    </p>
                    <p className={`text-sm ${isOverMax ? 'text-yellow-700' : 'text-green-700'}`}>
                      {medicine.currentStock} + {quantity} = {newStockLevel} {medicine.unit}
                    </p>
                    {isOverMax && (
                      <p className="text-yellow-700 text-sm">
                        ⚠️ This exceeds maximum stock level ({medicine.maxStock} {medicine.unit})
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 border-blue-200 text-blue-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRestock}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!quantity || quantity <= 0}
            >
              <Package className="h-4 w-4 mr-2" />
              Restock
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}