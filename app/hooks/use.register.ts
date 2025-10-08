import { authService } from "@/services/auth.service";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { createEncryptedToken } from "@/utils/token.encyption";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (formData: any, linkId?: string) => {
    try {
      setIsLoading(true);

      const formPayload = new FormData();

      // Extract data
      const {
        image: memberImage,
        passwords,
        userName,
        role,
        type,
        firstName,
        lastName,
        middleName,
        extensionName,
        sex,
        birthDate,
        birthPlace,
        age,
        religion,
        civilStatus,
        addresses,
        legal,
        identifications,
        contacts,
        facilityId,
        dependents = [],
      } = formData;

      // Add main user profile image to files array
      if (memberImage instanceof File) {
        formPayload.append("files", memberImage);
        console.log("Added main user image:", memberImage.name);
      }

      // Add dependent images to files array
      dependents.forEach((dep: any, index: number) => {
        if (dep.image instanceof File) {
          formPayload.append("files", dep.image);
          console.log(`Added dependent ${index + 1} image:`, dep.image.name);
        }
      });

      console.log(`Total files being sent: ${formPayload.getAll("files").length}`);
      console.log(`Number of dependents: ${dependents.length}`);

      // Helper function to format addresses properly
      const formatAddresses = (addrs: any[]) => {
        return addrs.map((addr) => ({
          houseNo: addr.houseNo || "",
          street: addr.street || "",
          province:
            typeof addr.province === "object"
              ? addr.province
              : { value: addr.province || "", code: "unknown" },
          city:
            typeof addr.city === "object" ? addr.city : { value: addr.city || "", code: "unknown" },
          barangay:
            typeof addr.barangay === "object"
              ? addr.barangay
              : { value: addr.barangay || "", code: "unknown" },
          zipCode: addr.zipCode || "",
          country: addr.country || "Philippines",
          type: addr.type || "current",
        }));
      };

      // Format children/dependents data (without images)
      const children = dependents.map((dep: any) => {
        const { image, ...rest } = dep;
        return {
          firstName: dep.firstName || "",
          lastName: dep.lastName || "",
          middleName: dep.middleName || "",
          extensionName: dep.extensionName || "",
          sex: dep.sex || "",
          birthDate: dep.birthDate || "",
          birthPlace: dep.birthPlace || "",
          age: typeof dep.age === "number" ? dep.age : parseInt(dep.age) || 0,
          religion: dep.religion || "",
          civilStatus: dep.civilStatus || "single",
          citizenship: "filipino",
          passwords: [
            { value: `${dep.firstName}123!`, type: "text" }, // Generate default password
            { value: "123456", type: "mpin6char" }, // Generate default MPIN
          ],
          role: "user",
          type: "patient_dependent",
          contacts: [
            {
              value: dep.email || `${dep.firstName.toLowerCase()}@example.com`,
              type: "email",
              provider: "gmail",
            },
            {
              value: dep.contactNumber || `9${Math.floor(Math.random() * 1000000000)}`,
              type: "mobile_number",
              provider: "unknown",
            },
          ],
          addresses: formatAddresses(addresses), // Use same formatted address as main user
          identifications: [],
          legal: [
            { value: true, type: "privacy_policy" },
            { value: true, type: "terms_and_condition" },
          ],
        };
      });

      // Construct main registration payload
      const registrationData = {
        passwords,
        userName:
          userName ||
          contacts.find((c: any) => c.type === "email")?.value?.split("@")[0] ||
          firstName.toLowerCase(),
        role,
        type,
        firstName,
        lastName,
        middleName,
        extensionName,
        sex,
        birthDate,
        birthPlace,
        age: typeof age === "number" ? age : parseInt(age) || 0, // Ensure age is number
        religion,
        civilStatus,
        addresses: formatAddresses(addresses), // Format addresses properly
        identifications,
        contacts,
        citizenship: "filipino",
        legal,
        facilityId,
        ...(linkId && { linkId }), // Add linkId if provided
        ...(children.length > 0 && { children }), // Add children only if they exist
      };

      console.log("Registration Data:", registrationData); // Debug log

      // Append all form fields as individual FormData entries
      Object.keys(registrationData).forEach((key) => {
        const value = registrationData[key as keyof typeof registrationData];
        if (typeof value === "object") {
          formPayload.append(key, JSON.stringify(value));
        } else {
          formPayload.append(key, String(value));
        }
      });

      // Submit to auth/register endpoint
      const res = await authService.register(formPayload);

      if (res) {
        toast.success("Registration successful!");

        // Extract mobile number and MPIN for auto-login
        const mobileContact = contacts.find((c: any) => c.type === "mobile_number")?.value;
        const mpinPassword = passwords.find((p: any) => p.type === "mpin6char")?.value;

        const token = await createEncryptedToken(
          {
            userName: registrationData.userName,
            role,
            type,
            mobileNumber: mobileContact,
            mpin: mpinPassword,
          },
          "pkrf",
          10 * 60 * 1000
        );
        navigate(`/success?tkn=${token}&type=pkrf`);
        return res;
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      const errorPayload = {
        status: error.status || 500,
        message: error.message || "Registration failed",
      };

      const token = await createEncryptedToken(errorPayload, "pkrf", 10 * 60 * 1000);
      navigate(`/failed?err=${encodeURIComponent(token)}&type=pkrf`);
      toast.error("Registration failed. Please check your information and try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRegister,
  };
}
