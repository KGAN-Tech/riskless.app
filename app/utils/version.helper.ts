export const formatDate = (date?: string | Date | null) => {
  if (!date) return "N/A";
  const parsed = date instanceof Date ? date : new Date(date);
  if (isNaN(parsed.getTime())) return "Invalid Date";

  return parsed.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "N/A";
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getInitials = (name?: string | null) => {
  if (!name) return "NA";
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const getVersionTypeColor = (version: string) => {
  const [major] = version.split(".");
  const majorNum = parseInt(major);
  if (majorNum >= 2)
    return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
  return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
};
