import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type PreviewFormMapperProps = {
  label: string;
  value: string | string[];
  type:
    | "text"
    | "number"
    | "date"
    | "array"
    | "array-with-mapper"
    | "security"
    | "question";
  dateFormat?: "dd/mm/yyyy" | "mm/dd/yyyy" | "yyyy/mm/dd";
  dateFormatType?: "readable-1" | "machine";
  textCase?: "uppercase" | "lowercase" | "setencecase";
  className?: {
    container?: string;
    subContainer?: string;
    label?: string;
    value?: string;
  };
  Mapper?: any;
};

export const PreviewFormMapper = ({
  label,
  value,
  type,
  dateFormat,
  dateFormatType,
  textCase,
  className,
  Mapper,
}: PreviewFormMapperProps) => {
  const [showText, setShowText] = useState(false);
  const formatDate = (date: string, format: string, type: string) => {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "---";
    const [year, month, day] = date.split("-");
    const monthIndex = parseInt(month) - 1;
    const dayInt = parseInt(day);
    if (isNaN(monthIndex) || isNaN(dayInt) || monthIndex < 0 || monthIndex > 11)
      return "---";

    const paddedMonth = month.padStart(2, "0");
    const paddedDay = day.padStart(2, "0");

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formatTextCase = (
      text: string | undefined,
      textCase: string
    ): string => {
      if (!text) return "";
      switch (textCase) {
        case "uppercase":
          return text.toUpperCase();
        case "lowercase":
          return text.toLowerCase();
        case "sentencecase":
          return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        default:
          return text;
      }
    };

    const tokens: Record<string, string> = {
      dd: paddedDay,
      mm: paddedMonth,
      yyyy: year,
      monthName: monthNames[monthIndex],
      d: `${dayInt}`,
    };

    if (type === "readable-1") {
      if (format === "mm/dd/yyyy")
        return `${formatTextCase(tokens.monthName, textCase || "uppercase")} ${
          tokens.d
        }, ${tokens.yyyy}`;
      if (format === "dd/mm/yyyy")
        return `${tokens.d} ${formatTextCase(
          tokens.monthName,
          textCase || "uppercase"
        )} ${tokens.yyyy}`;
      if (format === "yyyy/mm/dd")
        return `${tokens.yyyy}, ${formatTextCase(
          tokens.monthName,
          textCase || "uppercase"
        )} ${tokens.d}`;
    }

    if (type === "machine") {
      return format
        .replace("mm", tokens.mm)
        .replace("dd", tokens.dd)
        .replace("yyyy", tokens.yyyy);
    }

    return `${tokens.yyyy}-${tokens.mm}-${tokens.dd}`;
  };

  return (
    <div className={twMerge("space-y-2", className?.container)}>
      {(type === "text" || type === "number") && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
          <p
            className={twMerge(
              "text-gray-800 text-sm font-medium",
              className?.label
            )}
          >
            {label}
          </p>
          <p
            className={twMerge(
              "font-semibold text-sm break-words",
              className?.value
            )}
          >
            {value || "---"}
          </p>
        </div>
      )}
      {type === "question" && (
        <div className="w-full  p-4 bg-white ">
          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <div className="sm:w-1/3 w-full">
              <p
                className={twMerge(
                  "text-sm font-medium text-gray-700",
                  className?.label
                )}
              >
                {label}
              </p>
            </div>
            <div className="sm:w-2/3 w-full bg-gray-50 border border-gray-400 rounded-md px-3 py-2">
              <p
                className={twMerge(
                  "text-sm font-semibold text-gray-900 whitespace-pre-wrap break-words",
                  className?.value
                )}
              >
                {value || "---"}
              </p>
            </div>
          </div>
        </div>
      )}

      {type === "security" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
          <p
            className={twMerge(
              "text-gray-800 text-sm font-medium",
              className?.label
            )}
          >
            {label}
          </p>

          <div className="relative w-fit sm:w-auto">
            <input
              type={showText ? "text" : "password"}
              value={value}
              readOnly
              className={twMerge(
                "text-sm font-semibold w-20 bg-transparent  border-none outline-none mr-4", // add right padding so text doesn't overlap icon
                className?.value
              )}
            />
            {value && (
              <button
                type="button"
                onClick={() => setShowText((prev) => !prev)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" // remove px-1 and use right-1
              >
                {showText ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        </div>
      )}
      {type === "date" && dateFormat && dateFormatType && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
          <p
            className={twMerge(
              "text-gray-800 text-sm font-medium",
              className?.label
            )}
          >
            {label}
          </p>
          <p
            className={twMerge(
              "font-semibold text-sm break-words",
              className?.value
            )}
          >
            {value && value !== ""
              ? formatDate(value as string, dateFormat, dateFormatType)
              : "---"}
          </p>
        </div>
      )}

      {type === "array" && (
        <div className={twMerge("flex flex-col", className?.container)}>
          <p
            className={twMerge(
              "text-gray-800 text-sm font-medium mb-1",
              className?.label
            )}
          >
            {label}
          </p>
          <div className={twMerge("flex flex-wrap gap-2", className?.value)}>
            {Array.isArray(value) && value.length > 0 ? (
              value.map((item: any, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium select-none"
                >
                  {item.value}
                  {item.subValue ? `: ${item.subValue}` : ""}
                </span>
              ))
            ) : (
              <p className="text-gray-400 italic text-sm">---</p>
            )}
          </div>
        </div>
      )}

      {type === "array-with-mapper" && (
        <div className={twMerge("flex flex-col", className?.subContainer)}>
          <p
            className={twMerge(
              "text-gray-800 text-sm font-medium mb-1",
              className?.label
            )}
          >
            {label}
          </p>
          <div className={twMerge("flex flex-wrap gap-2", className?.value)}>
            {Array.isArray(value) && value.length > 0 ? (
              value.map((item: any, idx) => {
                const mainItem = Mapper.find(
                  (m: any) => m.value === item.value
                );
                let subLabel = "";
                if (item.subValue && mainItem?.options) {
                  const subOption = mainItem.options.find(
                    (opt: any) => opt.value === item.subValue
                  );
                  subLabel = subOption ? subOption.label : item.subValue;
                }

                return (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium select-none"
                  >
                    {mainItem ? mainItem.label : item.value}
                    {subLabel ? `: ${subLabel}` : ""}
                  </span>
                );
              })
            ) : (
              <p className="text-gray-400 italic text-sm">---</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
