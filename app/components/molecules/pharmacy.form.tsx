import React from "react";
import { Trash2, Plus, Edit } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  notes?: string;
}

interface Receipt {
  number: string;
  totalAmount: string;
}

interface PharmacyData {
  prescriptionImage: File | null;
  summary: string;
  medicines: Medicine[];
  receipt: Receipt;
}

interface PharmacyFormProps {
  pharmacyData: PharmacyData;
  onPharmacyChange: (data: PharmacyData) => void;
  scan?: boolean;
  summary?: boolean;
  receipt?: boolean;
}

export const PharmacyForm: React.FC<PharmacyFormProps> = ({
  pharmacyData,
  onPharmacyChange,
  scan = false,
  summary = false,
  receipt = false,
}) => {
  const handleMedicineChange = (id: string, field: keyof Medicine, value: any) => {
    const updated = pharmacyData.medicines.map((m) =>
      m.id === id ? { ...m, [field]: value } : m
    );
    onPharmacyChange({ ...pharmacyData, medicines: updated });
  };

  const addMedicine = () => {
    const newMed: Medicine = { id: Date.now().toString(), name: "", dosage: "", quantity: 1 };
    onPharmacyChange({ ...pharmacyData, medicines: [...pharmacyData.medicines, newMed] });
  };

  const removeMedicine = (id: string) => {
    onPharmacyChange({
      ...pharmacyData,
      medicines: pharmacyData.medicines.filter((m) => m.id !== id),
    });
  };

  const handleInputChange = (field: string, value: any) => {
    onPharmacyChange({ ...pharmacyData, [field]: value });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-100">
      {scan && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Prescription Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded-lg"
            onChange={(e) =>
              handleInputChange("prescriptionImage", e.target.files?.[0] || null)
            }
          />
        </div>
      )}

      {summary && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Prescription Summary</h2>

          {/* Medicines Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-medium text-gray-700">
                  <th className="px-4 py-2">Medicine</th>
                  <th className="px-4 py-2">Dosage</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Notes</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pharmacyData.medicines.map((med) => (
                  <tr key={med.id}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={med.name}
                        placeholder="Medicine Name"
                        className="w-full border p-1 rounded-lg"
                        onChange={(e) => handleMedicineChange(med.id, "name", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={med.dosage}
                        placeholder="Dosage"
                        className="w-full border p-1 rounded-lg"
                        onChange={(e) => handleMedicineChange(med.id, "dosage", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min={1}
                        value={med.quantity}
                        className="w-16 border p-1 rounded-lg"
                        onChange={(e) =>
                          handleMedicineChange(med.id, "quantity", Number(e.target.value))
                        }
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={med.notes || ""}
                        placeholder="Notes"
                        className="w-full border p-1 rounded-lg"
                        onChange={(e) => handleMedicineChange(med.id, "notes", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => removeMedicine(med.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addMedicine}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={16} /> Add Medicine
          </button>
        </div>
      )}

      {receipt && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">Receipt</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Receipt Number</label>
              <input
                type="text"
                className="w-full border p-2 rounded-lg"
                value={pharmacyData.receipt.number}
                onChange={(e) =>
                  handleInputChange("receipt", { ...pharmacyData.receipt, number: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <input
                type="text"
                className="w-full border p-2 rounded-lg"
                value={pharmacyData.receipt.totalAmount}
                onChange={(e) =>
                  handleInputChange("receipt", { ...pharmacyData.receipt, totalAmount: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
