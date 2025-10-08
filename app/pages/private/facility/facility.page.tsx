import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { facilityService } from "@/services/facility.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import AddressSelect, {
  type Address,
} from "@/components/organisms/selectors/address.select";

// Define TypeScript interfaces
interface Contact {
  id: number;
  type: string;
  provider: string;
  value: string;
}

interface FormData {
  name: string;
  type: string;
  provider: string;
  tagline: string;
  status: string;
  category: string;
  accreditationNo: string;
  pcbUsername: string;
  pcbPassword: string;
  pmccNo: string;
  certificationId: string;
  chiperKey: string;
  pcbType: string;
}

export default function ClinicEditForm() {
  const currentUser = getUserFromLocalStorage();

  // Ensure facilityId is always a plain string
  const rawFacilityId = currentUser?.user?.facilityId;
  const facilityId =
    typeof rawFacilityId === "object" && rawFacilityId.$oid
      ? rawFacilityId.$oid
      : rawFacilityId;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "",
    provider: "",
    tagline: "",
    status: "",
    category: "clinic",
    accreditationNo: "",
    pcbUsername: "",
    pcbPassword: "",
    pmccNo: "",
    certificationId: "",
    chiperKey: "",
    pcbType: "mock",
  });

  const [address, setAddress] = useState<Address>({
    houseNo: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    zipCode: "",
    type: "current",
  });

  const [unit, setUnit] = useState("");
  const [buildingName, setBuildingName] = useState("");

  const [mobileNumbers, setMobileNumbers] = useState<Contact[]>([]);
  const [emails, setEmails] = useState<Contact[]>([]);
  const [otherContacts, setOtherContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // fetch facility data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!facilityId) return;
      try {
        const facility = await facilityService.get(facilityId);

        // Transform the API data to match form structure
        const facilityAddress = facility?.data?.addresses?.[0] || {};

        setFormData({
          name: facility?.data?.name || "",
          type: facility?.data?.type || "",
          provider: facility?.data?.provider || "",
          tagline: facility?.data?.tagline || "",
          status: facility?.data?.status || "",
          category: facility?.data?.category || "clinic",
          accreditationNo: facility?.data?.pcb?.accreditationNo || "",
          pcbUsername: facility?.data?.pcb?.username || "",
          pcbPassword: facility?.data?.pcb?.password || "",
          pmccNo: facility?.data?.pcb?.pmccNo || "",
          certificationId: facility?.data?.pcb?.certificationId || "",
          chiperKey: facility?.data?.pcb?.chiperKey || "",
          pcbType: facility?.data?.pcb?.type || "mock",
        });

        // Set address data
        setAddress({
          houseNo: facilityAddress.houseNo || "",
          street: facilityAddress.street || "",
          barangay: facilityAddress.barangay?.value || "",
          city: facilityAddress.city?.value || "",
          province: facilityAddress.province?.value || "",
          zipCode: facilityAddress.zipCode || "",
          type: "current",
        });

        setUnit(facilityAddress.unit || "");
        setBuildingName(facilityAddress.buildingName || "");

        // Separate contacts by type
        if (facility?.data?.contacts && facility?.data?.contacts.length > 0) {
          const mobiles: Contact[] = [];
          const emailContacts: Contact[] = [];
          const others: Contact[] = [];

          facility?.data?.contacts.forEach((contact: any, index: number) => {
            const contactObj = {
              id: index + 1,
              type: contact.type || "",
              provider: contact.provider || "",
              value: contact.value || "",
            };

            if (contact.type === "mobile_number") {
              mobiles.push(contactObj);
            } else if (contact.type === "email") {
              emailContacts.push(contactObj);
            } else {
              others.push(contactObj);
            }
          });

          setMobileNumbers(
            mobiles.length > 0
              ? mobiles
              : [{ id: 1, type: "mobile_number", provider: "", value: "" }]
          );
          setEmails(
            emailContacts.length > 0
              ? emailContacts
              : [{ id: 1, type: "email", provider: "", value: "" }]
          );
          setOtherContacts(others.length > 0 ? others : []);
        } else {
          // Initialize with empty fields
          setMobileNumbers([
            { id: 1, type: "mobile_number", provider: "", value: "" },
          ]);
          setEmails([{ id: 1, type: "email", provider: "", value: "" }]);
          setOtherContacts([]);
        }

        setIsLoaded(true);
      } catch (err) {
        console.error("Error fetching facility:", err);
        setMessage("Error loading clinic details.");
      }
    };
    fetchData();
  }, [facilityId]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Mobile number functions
  const addMobileNumber = () => {
    setMobileNumbers((prev) => [
      ...prev,
      { id: Date.now(), type: "mobile_number", provider: "", value: "" },
    ]);
  };

  const removeMobileNumber = (id: number) => {
    setMobileNumbers((prev) => prev.filter((c) => c.id !== id));
  };

  const updateMobileNumber = (
    index: number,
    field: keyof Contact,
    value: string
  ) => {
    setMobileNumbers((prev) =>
      prev.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  // Email functions
  const addEmail = () => {
    setEmails((prev) => [
      ...prev,
      { id: Date.now(), type: "email", provider: "", value: "" },
    ]);
  };

  const removeEmail = (id: number) => {
    setEmails((prev) => prev.filter((c) => c.id !== id));
  };

  const updateEmail = (index: number, field: keyof Contact, value: string) => {
    setEmails((prev) =>
      prev.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  // Other contact functions
  const addOtherContact = () => {
    setOtherContacts((prev) => [
      ...prev,
      { id: Date.now(), type: "", provider: "", value: "" },
    ]);
  };

  const removeOtherContact = (id: number) => {
    setOtherContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const updateOtherContact = (
    index: number,
    field: keyof Contact,
    value: string
  ) => {
    setOtherContacts((prev) =>
      prev.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  const handleAddressChange = (newAddress: Address) => {
    setAddress(newAddress);
  };

  const isValidEmail = (email: string): boolean => {
    // Regex for email validation
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSave = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setMessage("");

    // Combine all contacts
    const allContacts = [
      ...mobileNumbers.filter((contact) => contact.value.trim() !== ""),
      ...emails.filter((contact) => contact.value.trim() !== ""),
      ...otherContacts.filter((contact) => contact.value.trim() !== ""),
    ].map(({ id, ...rest }) => rest); // Remove the 'id' field

    // Validate contacts
    for (const contact of mobileNumbers) {
      if (
        contact.value.trim() !== "" &&
        contact.value.replace(/\D/g, "").length !== 11
      ) {
        setMessage("Mobile number must be 11 digits long.");
        setIsLoading(false);
        return;
      }
    }

    for (const contact of emails) {
      if (contact.value.trim() !== "" && !isValidEmail(contact.value)) {
        setMessage("Please enter a valid email address.");
        setIsLoading(false);
        return;
      }
    }

    // Corrected data structure
    const data = {
      name: formData.name,
      addresses: [
        {
          unit: unit,
          buildingName: buildingName,
          houseNo: address.houseNo,
          street: address.street,
          province: {
            value: address.province,
            code: "",
          },
          city: {
            value: address.city,
            code: "",
          },
          barangay: {
            value: address.barangay,
            code: "",
          }, // Just the string value
          description: null,
          zipCode: address.zipCode,
          country: "Philippines",
          type: "current",
        },
      ],
      type: formData.type,
      provider: formData.provider,
      tagline: formData.tagline,
      status: formData.status,
      contacts: allContacts,
      category: formData.category,
      pcb: {
        accreditationNo: formData.accreditationNo,
        username: formData.pcbUsername,
        password: formData.pcbPassword,
        pmccNo: formData.pmccNo,
        certificationId: formData.certificationId,
        chiperKey: formData.chiperKey,
        type: formData.pcbType,
      },
    };

    try {
      await facilityService.update(facilityId, data);
      setMessage("Clinic updated successfully!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating clinic:", error);
      setMessage("Error updating clinic. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded && !message) {
    return (
      <div className="min-h-screen from-white-50 to-white-100 p-6">
        <div className="max-w mx-auto bg-white">
          <div className="text-center">Loading clinic details...</div>
        </div>
      </div>
    );
  }

  const renderContactSection = (
    title: string,
    contacts: Contact[],
    addFunction: () => void,
    removeFunction: (id: number) => void,
    updateFunction: (
      index: number,
      field: keyof Contact,
      value: string
    ) => void,
    showTypeField: boolean = false
  ) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {/* Remove the Add button by removing this element */}
      </div>

      <div className="space-y-3">
        {contacts.map((contact, index) => (
          <div
            key={contact.id}
            className="flex gap-3 bg-gray-50 p-4 rounded-lg"
          >
            {showTypeField && (
              <select
                value={contact.type}
                onChange={(e) => updateFunction(index, "type", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Type</option>
                <option value="landline">Landline</option>
                <option value="fax">Fax</option>
                <option value="website">Website</option>
                <option value="social_media">Social Media</option>
              </select>
            )}

            <input
              type="text"
              placeholder="Provider (e.g., Globe, Smart, Gmail)"
              value={contact.provider}
              onChange={(e) =>
                updateFunction(index, "provider", e.target.value)
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type={
                title === "Email"
                  ? "email"
                  : title === "Mobile Number"
                  ? "tel"
                  : "text"
              }
              placeholder={
                title === "Email"
                  ? "email@example.com"
                  : title === "Mobile Number"
                  ? "+639171234567"
                  : "Value"
              }
              value={contact.value}
              onChange={(e) => updateFunction(index, "value", e.target.value)}
              maxLength={title === "Mobile Number" ? 11 : undefined}
              pattern={
                title === "Email"
                  ? "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"
                  : undefined
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />

            {contacts.length > 1 && (
              <button
                onClick={() => removeFunction(contact.id)}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen from-white-50 to-white-100 p-6">
      <div className="max-w mx-auto bg-white ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Medical Clinic Editor
          </h1>
          <button
            onClick={handleSave}
            disabled={isLoading || !isLoaded}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            <Save size={20} />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Basic Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Clinic Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => updateFormData("type", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateFormData("status", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Provider
                </label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => updateFormData("provider", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => updateFormData("category", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => updateFormData("tagline", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Address</h2>
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Unit Number
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Unit number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Building Name
                </label>
                <input
                  type="text"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                  placeholder="Building name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Address
              </label>
              <AddressSelect
                value={address}
                onChange={handleAddressChange}
                isPermanent={false}
                inputTextCase="uppercase"
              />
            </div>
          </div>
        </section>

        {/* Contacts */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Contacts</h2>

          {/* Mobile Numbers */}
          {renderContactSection(
            "Mobile Number",
            mobileNumbers,
            addMobileNumber,
            removeMobileNumber,
            updateMobileNumber
          )}

          {/* Emails */}
          {renderContactSection(
            "Email",
            emails,
            addEmail,
            removeEmail,
            updateEmail
          )}

          {/* Other Contacts */}
          {renderContactSection(
            "Other Contact",
            otherContacts,
            addOtherContact,
            removeOtherContact,
            updateOtherContact,
            true
          )}
        </section>

        {/* PCB */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Additional Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                PCB Accreditation No
              </label>
              <input
                type="text"
                value={formData.accreditationNo}
                onChange={(e) =>
                  updateFormData("accreditationNo", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                PCB Username
              </label>
              <input
                type="text"
                value={formData.pcbUsername}
                onChange={(e) => updateFormData("pcbUsername", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                PCB Password
              </label>
              <input
                type="password"
                value={formData.pcbPassword}
                onChange={(e) => updateFormData("pcbPassword", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                PMCC No
              </label>
              <input
                type="text"
                value={formData.pmccNo}
                onChange={(e) => updateFormData("pmccNo", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Certification ID
              </label>
              <input
                type="text"
                value={formData.certificationId}
                onChange={(e) =>
                  updateFormData("certificationId", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Chiper Key
              </label>
              <input
                type="text"
                value={formData.chiperKey}
                onChange={(e) => updateFormData("chiperKey", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                PCB Type
              </label>
              <input
                type="text"
                value={formData.pcbType}
                onChange={(e) => updateFormData("pcbType", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
