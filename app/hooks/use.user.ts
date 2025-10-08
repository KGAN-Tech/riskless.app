import { useState, useCallback, useEffect } from "react";
import { linkService } from "@/services/link.service";
import toast from "react-hot-toast";

export function useLink() {
  const baseUrl = "healthlink.ftcc.com.ph";

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
    createdBy: "",
    images: [{ url: "https://example.com/logo.png", title: "HealthLink Logo" }],
    description: "",
    expiredAt: "",
  });

  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(form);
  }, [form]);

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setForm((prev: any) => {
      const updated = { ...prev, [field]: value };
      // If organization name changes, regenerate slug automatically
      if (field === "organizationName") {
        const slug = value
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "");
        updated.slug = `https://healthlink.ftcc.com.ph/${slug}`;
      }
      return updated;
    });
    setForm((prev: any) => ({ ...prev, ...form, [field]: value }));
  };

  // Generate slug and URL based on name
  const generateSlug = useCallback(() => {
    const slug = form.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    const url = `https://${baseUrl}/${slug}`;
    setForm((prev: any) => ({ ...prev, slug, url }));
  }, [form.name]);

  // Fetch all links
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

  // Create a new link
  const onSubmit = useCallback(async () => {
    try {
      setLoading(true);
      generateSlug();
      const response = await linkService.create(form);
      toast.success("Link created successfully!");
      return response;
    } catch (error: any) {
      toast.error(error?.message || "Failed to create link");
    } finally {
      setLoading(false);
    }
  }, [form, generateSlug]);

  // Update an existing link
  const onUpdate = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        generateSlug();
        const response = await linkService.update(id, form);
        toast.success("Link updated successfully!");
        return response;
      } catch (error: any) {
        toast.error(error?.message || "Failed to update link");
      } finally {
        setLoading(false);
      }
    },
    [form, generateSlug]
  );

  // Delete a link (soft delete)
  const onDelete = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await linkService.update(id, { expiredAt: new Date().toISOString() });
      toast.success("Link deleted successfully!");
      // Optionally remove from local state
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
    generateSlug,
    getAll,
    onSubmit,
    onUpdate,
    onDelete,
    handleInputChange,
  };
}
