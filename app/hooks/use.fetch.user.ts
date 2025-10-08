import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import type { User } from "../types/user.types";

export function useFetchUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.getAll();
        setUsers(response.data || []); // adjust based on your API
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}
