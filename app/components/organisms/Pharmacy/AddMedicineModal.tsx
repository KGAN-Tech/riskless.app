import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle,  DialogDescription  } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { Card, CardContent } from '@/components/atoms/card';
import { Separator } from '@/components/atoms/separator';
import { Plus, Scan, Package, Calendar } from 'lucide-react';

interface NewMedicine {
    name: string;
    brand: string;
    quantity: number;
    unit: string;
    barcode: string;
    category: string;
    expiryDate: string;
  }
  
  interface AddMedicineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMedicine: (medicine: NewMedicine) => void;
  }
  
  export function AddMedicineModal({ isOpen, onClose, onAddMedicine }: AddMedicineModalProps) {
    const [formData, setFormData] = useState<NewMedicine>({
      name: '',
      brand: '',
      quantity: 0,
      unit: '',
      barcode: '',
      category: '',
      expiryDate: ''
    });
  
    const [errors, setErrors] = useState<Partial<Record<keyof NewMedicine, string>>>({});
  
    const categories = [
      'Analgesic',
      'Antibiotic',
      'Antidiabetic',
      'Cardiovascular',
      'Respiratory',
      'Dermatological',
      'Gastrointestinal',
      'Neurological',
      'Psychiatric',
      'Hormonal',
      'Other'
    ];
  
    const units = [
      'tablets',
      'capsules',
      'ml',
      'mg',
      'grams',
      'bottles',
      'vials',
      'sachets',
      'patches',
      'inhalers'
    ];
  
    const handleInputChange = (field: keyof NewMedicine, value: string | number) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: undefined
        }));
      }
    };
  
    const validateForm = (): boolean => {
      const newErrors: Partial<Record<keyof NewMedicine, string>> = {};
  
      if (!formData.name.trim()) {
        newErrors.name = 'Medicine name is required';
      }
  
      if (!formData.quantity || formData.quantity <= 0) {
        newErrors.quantity = 'Quantity must be greater than 0';
      }
  
      if (!formData.unit) {
        newErrors.unit = 'Unit of measurement is required';
      }
  
      if (!formData.category) {
        newErrors.category = 'Category is required';
      }
  
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = () => {
      if (validateForm()) {
        onAddMedicine(formData);
        handleClose();
      }
    };
  
    const handleClose = () => {
      setFormData({
        name: '',
        brand: '',
        quantity: 0,
        unit: '',
        barcode: '',
        category: '',
        expiryDate: ''
      });
      setErrors({});
      onClose();
    };
  
    const generateBarcode = () => {
      const randomBarcode = 'MED' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
      handleInputChange('barcode', randomBarcode);
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] max-w-2xl sm:max-w-3xl lg:max-w-4xl h-[95vh] sm:h-[90vh] lg:h-auto lg:max-h-[90vh] bg-white flex flex-col">
          <DialogHeader className="pb-3 flex-shrink-0">
            <DialogTitle className="text-blue-900 flex items-center gap-2 text-xl">
              <Plus className="h-6 w-6" />
              Add New Medicine
            </DialogTitle>
            <DialogDescription className="text-base">
              Add a new medicine to the pharmacy inventory with all required information.
            </DialogDescription>
          </DialogHeader>
  
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto lg:overflow-visible">
            <div className="space-y-4 lg:space-y-5">
              {/* Desktop: Two-column layout, Mobile: Single column */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                {/* Left Column - Medicine Information */}
                <Card className="border-blue-100">
                  <CardContent className="p-3 lg:p-4 space-y-3 lg:space-y-4">
                    <div className="flex items-center gap-2 pb-1">
                      <Package className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                      <h3 className="text-blue-900 font-medium text-base lg:text-lg">Medicine Information</h3>
                    </div>
                    
                    <div className="space-y-3 lg:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                        <div className="space-y-1.5 lg:space-y-2">
                          <Label htmlFor="name" className="text-blue-700 text-sm font-medium">
                            Medicine Name *
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="e.g., Paracetamol 500mg"
                            className={`border-blue-200 focus:border-blue-400 ${errors.name ? 'border-red-300' : ''}`}
                          />
                          {errors.name && (
                            <p className="text-red-600 text-xs lg:text-sm">{errors.name}</p>
                          )}
                        </div>
    
                        <div className="space-y-1.5 lg:space-y-2">
                          <Label htmlFor="brand" className="text-blue-700 text-sm font-medium">
                            Brand Name
                          </Label>
                          <Input
                            id="brand"
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            placeholder="e.g., Tylenol (optional)"
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                      </div>
    
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                        <div className="space-y-1.5 lg:space-y-2">
                          <Label htmlFor="category" className="text-blue-700 text-sm font-medium">
                            Category *
                          </Label>
                          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                            <SelectTrigger className={`border-blue-200 focus:border-blue-400 ${errors.category ? 'border-red-300' : ''}`}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.category && (
                            <p className="text-red-600 text-xs lg:text-sm">{errors.category}</p>
                          )}
                        </div>
    
                        <div className="space-y-1.5 lg:space-y-2">
                          <Label htmlFor="expiryDate" className="text-blue-700 text-sm font-medium">
                            Expiry Date *
                          </Label>
                          <Input
                            id="expiryDate"
                            type="date"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            className={`border-blue-200 focus:border-blue-400 ${errors.expiryDate ? 'border-red-300' : ''}`}
                          />
                          {errors.expiryDate && (
                            <p className="text-red-600 text-xs lg:text-sm">{errors.expiryDate}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
    
                {/* Right Column - Stock and Identification */}
                <div className="space-y-4 lg:space-y-5">
                  {/* Stock Information */}
                  <Card className="border-blue-100">
                    <CardContent className="p-3 lg:p-4 space-y-3 lg:space-y-4">
                      <h3 className="text-blue-900 font-medium text-base lg:text-lg">Stock Information</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                        <div className="space-y-1.5 lg:space-y-2">
                          <Label htmlFor="quantity" className="text-blue-700 text-sm font-medium">
                            Initial Quantity *
                          </Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={formData.quantity || ''}
                            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                            placeholder="e.g., 100"
                            className={`border-blue-200 focus:border-blue-400 ${errors.quantity ? 'border-red-300' : ''}`}
                          />
                          {errors.quantity && (
                            <p className="text-red-600 text-xs lg:text-sm">{errors.quantity}</p>
                          )}
                        </div>
    
                        <div className="space-y-1.5 lg:space-y-2">
                          <Label htmlFor="unit" className="text-blue-700 text-sm font-medium">
                            Unit of Measurement *
                          </Label>
                          <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                            <SelectTrigger className={`border-blue-200 focus:border-blue-400 ${errors.unit ? 'border-red-300' : ''}`}>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.unit && (
                            <p className="text-red-600 text-xs lg:text-sm">{errors.unit}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
    
                  {/* Barcode Section */}
                  <Card className="border-blue-100">
                    <CardContent className="p-3 lg:p-4 space-y-3 lg:space-y-4">
                      <h3 className="text-blue-900 font-medium text-base lg:text-lg">Identification</h3>
                      
                      <div className="space-y-1.5 lg:space-y-2">
                        <Label htmlFor="barcode" className="text-blue-700 text-sm font-medium">
                          Barcode
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="barcode"
                            value={formData.barcode}
                            onChange={(e) => handleInputChange('barcode', e.target.value)}
                            placeholder="e.g., 1234567890123"
                            className="border-blue-200 focus:border-blue-400"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={generateBarcode}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 shrink-0"
                          >
                            <Scan className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-blue-600 text-xs lg:text-sm">Leave empty to auto-generate or scan existing barcode</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3 lg:pt-4 border-t border-blue-100 flex-shrink-0 mt-3 lg:mt-4">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              className="border-blue-200 text-blue-700 hover:bg-blue-50 sm:w-auto w-full order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto w-full order-1 sm:order-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }