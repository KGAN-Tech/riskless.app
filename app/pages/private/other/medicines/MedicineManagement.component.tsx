import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Package } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "~/app/components/atoms/radio-group";
import { Button } from "@/components/atoms/button";

interface MedicineManagementProps {
  record: any;
  onBack: () => void;
  onNext: () => void;
}

export default function MedicineManagement({
  record,
  onBack,
  onNext,
}: MedicineManagementProps) {
  // Initialize state with record data if available
  const [facilityType, setFacilityType] = useState(
    record?.facilityType || "within"
  );
  const [partnerFacilityName, setPartnerFacilityName] = useState(
    record?.partnerFacilityName || ""
  );
  const [prescribingPhysician, setPrescribingPhysician] = useState(
    record?.physician || ""
  );
  const [dispensingPersonnel, setDispensingPersonnel] = useState(
    record?.dispensingPersonnel || ""
  );
  const [dispenseDate, setDispenseDate] = useState(record?.dateReleased || "");
  const [isDrugDispensed, setIsDrugDispensed] = useState(
    record?.isDrugDispensed ?? true
  );
  const [medicines, setMedicines] = useState<any[]>(record?.medicines || []);
  const [currentMedicine, setCurrentMedicine] = useState({
    genericName: record?.medicineName || "",
    salt: record?.salt || "",
    strength: record?.strength || "",
    form: record?.form || "",
    unit: record?.unit || "",
    quantity: record?.qty || "",
    unitPrice: record?.unitPrice || "",
    instruction: record?.instruction || "",
    frequency: record?.frequency || "",
    remarks: record?.remarks || "",
  });

  const handleAddMedicine = () => {
    if (currentMedicine.genericName && currentMedicine.quantity) {
      setMedicines([...medicines, { ...currentMedicine, id: Date.now() }]);
      setCurrentMedicine({
        genericName: "",
        salt: "",
        strength: "",
        form: "",
        unit: "",
        quantity: "",
        unitPrice: "",
        instruction: "",
        frequency: "",
        remarks: "",
      });
    }
  };

  const handleRemoveMedicine = (id: number) => {
    setMedicines(medicines.filter((medicine) => medicine.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Medicine Prescription
        </h2>
        <p className="text-gray-600">
          Enter detailed information for medicine prescription
        </p>
      </div>
      {/* Patient Information Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="flex items-center text-white hover:text-blue-100 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <h3 className="text-lg font-bold">Patient Information</h3>
          </div>
          <div>
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
                record.status === "Released"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : record.status === "Pending"
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}
            >
              {record.status}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Patient Name
              </Label>
              <div className="text-lg font-medium text-gray-900">
                {record.memberName}
              </div>
            </div>
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Reference Numbers
              </Label>
              <div className="text-gray-700">
                Order #{record.orderNo} • Case #{record.caseNo}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Information Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Facility Information
          </h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="block text-sm font-semibold text-gray-700">
              Facility Type
            </Label>
            <RadioGroup
              value={facilityType}
              onValueChange={(value: "within" | "partner") =>
                setFacilityType(value)
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="within"
                  id="facility-within"
                  className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
                />
                <Label htmlFor="facility-within" className="text-sm">
                  within the facility
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="partner"
                  id="facility-partner"
                  className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
                />
                <Label htmlFor="facility-partner" className="text-sm">
                  Partner Facility
                </Label>
                {facilityType === "partner" && (
                  <Input
                    type="text"
                    placeholder="NAME OF HEALTH CARE INSTITUTION"
                    value={partnerFacilityName}
                    onChange={(e) => setPartnerFacilityName(e.target.value)}
                    className="ml-2 flex-1"
                  />
                )}
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Personnel Information Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Personnel Information</h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Prescribing Physician
              </Label>
              <Input
                type="text"
                value={prescribingPhysician}
                onChange={(e) => setPrescribingPhysician(e.target.value)}
                placeholder="Enter physician name"
                className="w-full"
              />
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Dispensing Personnel
              </Label>
              <Input
                type="text"
                value={dispensingPersonnel}
                onChange={(e) => setDispensingPersonnel(e.target.value)}
                placeholder="Enter personnel name"
                className="w-full"
              />
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Dispense Date
              </Label>
              <Input
                type="date"
                value={dispenseDate}
                onChange={(e) => setDispenseDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label className="block text-sm font-semibold text-gray-700">
                Drug/Medicine Dispensed?
              </Label>
              <RadioGroup
                value={isDrugDispensed ? "yes" : "no"}
                onValueChange={(value: string) =>
                  setIsDrugDispensed(value === "yes")
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="dispensed-yes"
                    className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
                  />
                  <Label htmlFor="dispensed-yes" className="text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="dispensed-no"
                    className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
                  />
                  <Label htmlFor="dispensed-no" className="text-sm">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Details Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Medicine Details</h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2">
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Generic Name *
              </Label>
              <select
                value={currentMedicine.genericName}
                onChange={(e) =>
                  setCurrentMedicine({
                    ...currentMedicine,
                    genericName: e.target.value,
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">Select drug/medicine</option>
                <option value="Amoxicillin">Amoxicillin</option>
                <option value="Paracetamol">Paracetamol</option>
                <option value="Metformin">Metformin</option>
                <option value="Losartan">Losartan</option>
                <option value="Omeprazole">Omeprazole</option>
              </select>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Salt
              </Label>
              <select
                value={currentMedicine.salt}
                onChange={(e) =>
                  setCurrentMedicine({
                    ...currentMedicine,
                    salt: e.target.value,
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">Select</option>
                <option value="Hydrochloride">Hydrochloride</option>
                <option value="Sodium">Sodium</option>
                <option value="Potassium">Potassium</option>
              </select>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Strength
              </Label>
              <select
                value={currentMedicine.strength}
                onChange={(e) =>
                  setCurrentMedicine({
                    ...currentMedicine,
                    strength: e.target.value,
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">Select</option>
                <option value="500mg">500mg</option>
                <option value="250mg">250mg</option>
                <option value="100mg">100mg</option>
                <option value="50mg">50mg</option>
                <option value="20mg">20mg</option>
                <option value="10mg">10mg</option>
              </select>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Form
              </Label>
              <select
                value={currentMedicine.form}
                onChange={(e) =>
                  setCurrentMedicine({
                    ...currentMedicine,
                    form: e.target.value,
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">Select</option>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Cream">Cream</option>
              </select>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit
              </Label>
              <select
                value={currentMedicine.unit}
                onChange={(e) =>
                  setCurrentMedicine({
                    ...currentMedicine,
                    unit: e.target.value,
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">Select</option>
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="g">g</option>
              </select>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity *
              </Label>
              <Input
                type="number"
                value={currentMedicine.quantity}
                onChange={(e) =>
                  setCurrentMedicine({
                    ...currentMedicine,
                    quantity: e.target.value,
                  })
                }
                placeholder="0"
                className="w-full"
              />
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit Price
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
                  ₱
                </span>
                <Input
                  type="number"
                  value={currentMedicine.unitPrice}
                  onChange={(e) =>
                    setCurrentMedicine({
                      ...currentMedicine,
                      unitPrice: e.target.value,
                    })
                  }
                  placeholder="0.00"
                  className="w-full pl-8"
                />
              </div>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-800 border-b pb-2 mb-4">
              Instructions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medicine Instruction
                </Label>
                <Input
                  value={currentMedicine.instruction}
                  onChange={(e) =>
                    setCurrentMedicine({
                      ...currentMedicine,
                      instruction: e.target.value,
                    })
                  }
                  placeholder="e.g., Take with food"
                  className="w-full"
                />
              </div>

              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  Frequency
                </Label>
                <Input
                  value={currentMedicine.frequency}
                  onChange={(e) =>
                    setCurrentMedicine({
                      ...currentMedicine,
                      frequency: e.target.value,
                    })
                  }
                  placeholder="e.g., 3 times daily"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Remarks
              </Label>
              <textarea
                value={currentMedicine.remarks}
                onChange={(e) =>
                  setCurrentMedicine({
                    ...currentMedicine,
                    remarks: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                placeholder="Additional notes or remarks..."
              ></textarea>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddMedicine}
            disabled={!currentMedicine.genericName || !currentMedicine.quantity}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Medicine
          </Button>
        </div>
      </div>

      {/* Medicine List Card */}
      {medicines.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">
              Prescribed Medicines ({medicines.length})
            </h3>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Frequency
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medicines.map((medicine, index) => (
                      <tr
                        key={medicine.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {medicine.genericName}
                            </div>
                            <div className="text-gray-500">
                              {medicine.strength} {medicine.form}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {medicine.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ₱{medicine.unitPrice || "0.00"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          ₱
                          {(
                            Number(medicine.quantity) *
                            Number(medicine.unitPrice || 0)
                          ).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {medicine.frequency || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleRemoveMedicine(medicine.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
        >
          Save and Complete
        </Button>
      </div>
    </div>
  );
}
