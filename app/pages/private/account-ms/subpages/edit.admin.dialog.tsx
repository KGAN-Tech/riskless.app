import React, { useEffect, useState } from "react";
import {Label } from "@/components/atoms/label"
import { Modal } from "@/components/atoms/modal"; // Adjust import path as needed
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { useToast } from "@/hooks/use.toast";
import { userService } from "@/services/user.service";
import type { AdminData } from "./admin.list.page";
import {Select, SelectItem, SelectTrigger, SelectValue, SelectContent} from "@/components/atoms/select"

interface EditAdminDialogProps {
  admin: AdminData | null;
  open: boolean;
  onClose: () => void;
  onSave: (admin: AdminData) => void;
}

export const EditAdminDialog: React.FC<EditAdminDialogProps> = ({
  admin,
  open,
  onClose,
  onSave,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AdminData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (admin) setFormData(admin);
  }, [admin]);

  if (!formData) return null;

  const handleChange = (field: keyof AdminData, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);

      const payload = {
        userName: formData.userName,
        type: formData.type,
        status: formData.membershipStatus ?? "active",
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        extensionName: formData.extensionName ?? null,
        sex: formData.sex ?? "male",
        religion: formData.religion ?? "",
        civilStatus: formData.civilStatus ?? "",
        citizenship: formData.citizenship ?? "filipino",

        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        birthPlace: formData.birthPlace ?? "",
        professional: [
          {
            profession: "unknown",
            position: formData.position ?? "",
            specialization: formData.specialization ?? "",
          },
        ],
        contacts: [
          {
            type: "email",
            provider: "Gmail",
            value: formData.email ?? "",
          },
          {
            type: "mobile_number",
            provider: "",
            value: formData.phoneNumber ?? "",
          },
        ],
      };

      await userService.update(formData.id, payload);

      toast({
        title: "Success",
        description: "Admin updated successfully",
      });

      onSave({ ...formData });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update admin",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="max-w-5xl w-full mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Edit Administrator</h2>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-8">
          <div>
            <label className="text-sm font-medium">User Name</label>
            <Input
              className="w-full"
              value={formData.userName}
              onChange={(e) => handleChange("userName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">First Name</label>
            <Input
              className="w-full"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Middle Name</label>
            <Input
              className="w-full"
              value={formData.middleName}
              onChange={(e) => handleChange("middleName", e.target.value)}
            />
          </div>
  
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <Input
              className="w-full"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              className="w-full"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              className="w-full"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </div>
  
          <div>
            <label className="text-sm font-medium">PRC ID</label>
            <Input
              className="w-full"
              value={formData.prcId}
              onChange={(e) => handleChange("prcId", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Sex</label>
            <Input
              className="w-full"
              value={formData.sex}
              onChange={(e) => handleChange("sex", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Religion</label>
            <Input
              className="w-full"
              value={formData.religion}
              onChange={(e) => handleChange("religion", e.target.value)}
            />
          </div>
  
          <div>
            <label className="text-sm font-medium">Birth Place</label>
            <Input
              className="w-full"
              value={formData.birthPlace}
              onChange={(e) => handleChange("birthPlace", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Birth Date</label>
            <Input
              className="w-full"
              type="date"
              value={formData.birthDate ? formData.birthDate.split("T")[0] : ""}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Civil Status</label>
            <Input
              className="w-full"
              value={formData.civilStatus}
              onChange={(e) => handleChange("civilStatus", e.target.value)}
            />
          </div>
  
          <div>
            <label className="text-sm font-medium">Citizenship</label>
            <Input
              className="w-full"
              value={formData.citizenship}
              onChange={(e) => handleChange("citizenship", e.target.value)}
            />
          </div>
          <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) =>
                        handleChange("position", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="it-staff">IT Staff</SelectItem>
                        <SelectItem value="encoder">Encoder</SelectItem>
                        <SelectItem value="administrative">
                          Administrative
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
          <div>
            <label className="text-sm font-medium">Specialization</label>
            <Input
              className="w-full"
              value={formData.specialization}
              onChange={(e) => handleChange("specialization", e.target.value)}
            />
          </div>
          <div className="space-y-2">
                  <Label htmlFor="accessRole">Access/Role *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physician">
                        Physician (Doctor)
                      </SelectItem>
                      <SelectItem value="presenter">
                        Presenter (Nurse)
                      </SelectItem>
                      <SelectItem value="hci">HCI Staff</SelectItem>
                      <SelectItem value="laboratory">
                        Laboratory Staff
                      </SelectItem>
                      <SelectItem value="pharmacy">Pharmacy Staff</SelectItem>
                      <SelectItem value="admin">Admin Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
        </div>
  
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
  
};