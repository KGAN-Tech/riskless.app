import { useState, useCallback } from "react";
import { linkService } from "@/services/link.service";
import toast from "react-hot-toast";

export function useLink() {
  // const baseUrl = "healthlink.ftcc.com.ph";
  const baseUrl = window.location.origin;

  const auth = localStorage.getItem("auth");
  const authData = auth ? JSON.parse(auth) : null;
  const createdById = authData?.user?.person?.id || "";

  const [form, setForm] = useState<any>({
    name: "",
    type: "organization",
    address: {
      unit: "",
      buildingName: "",
      houseNo: "",
      street: "",
      province: { value: "", code: "N/A" },
      city: { value: "", code: "N/A" },
      barangay: { value: "", code: "N/A" },
      zipCode: "",
      country: "Philippines",
      type: "office",
    },
    url: "",
    slug: "",
    facilityId: "",
    createdBy: createdById,
    images: [{ url: "https://example.com/logo.png", title: "HealthLink Logo" }],
    description: "",
    expiredAt: "",
    generatedIn: "qr",
  });

  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Handle input changes (supports nested fields) ---
  const handleInputChange = useCallback((field: string, value: any) => {
    setForm((prev: any) => {
      const keys = field.split(".");
      if (keys[0] === "address") {
        if (keys.length === 2) {
          // address.unit, address.street, etc.
          return { ...prev, address: { ...prev.address, [keys[1]]: value } };
        } else if (keys.length === 3) {
          // address.province.value, address.city.code, etc.
          const [_, parent, child] = keys;
          return {
            ...prev,
            address: {
              ...prev.address,
              [parent]: { ...prev.address[parent], [child]: value },
            },
          };
        }
      }
      return { ...prev, [field]: value };
    });
  }, []);

  // --- Generate slug and URL based on name ---
  const generateSlug = useCallback(() => {
    const slug = form.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    const url = `${baseUrl}/${slug}/register`;
    return { slug, url };
  }, [form.name]);

  // --- Fetch all links ---
  const getAll = useCallback(async (params?: Record<string, any>) => {
    try {
      setLoading(true);
      const response = await linkService.getAll(params);
      setLinks(response?.data || []);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch links");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Prepare form data for Prisma ---
  const prepareFormData = useCallback(() => {
    const { slug, url } = generateSlug();
    const newForm = { ...form, slug, url };

    // Remove empty optional fields
    if (!newForm.expiredAt) delete newForm.expiredAt;
    if (!newForm.facilityId) delete newForm.facilityId;

    return newForm;
  }, [form, generateSlug]);

  // --- Create new link ---
  const onSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const newForm = prepareFormData();
      const response = await linkService.create(newForm);
      toast.success("Link created successfully!");
      return response;
    } catch (error: any) {
      toast.error(error?.message || "Failed to create link");
    } finally {
      setLoading(false);
    }
  }, [prepareFormData]);

  // --- Update existing link ---
  const onUpdate = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const newForm = prepareFormData();
        const response = await linkService.update(id, newForm);
        toast.success("Link updated successfully!");
        return response;
      } catch (error: any) {
        toast.error(error?.message || "Failed to update link");
      } finally {
        setLoading(false);
      }
    },
    [prepareFormData]
  );

  // --- Soft delete ---
  const onDelete = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await linkService.update(id, { expiredAt: new Date().toISOString() });
      toast.success("Link deleted successfully!");
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete link");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    form,
    setForm,
    links,
    loading,
    handleInputChange,
    generateSlug,
    getAll,
    onSubmit,
    onUpdate,
    onDelete,
  };
}
