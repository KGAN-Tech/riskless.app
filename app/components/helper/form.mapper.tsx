import { useEffect, useState } from "react";
import { FormSection } from "../organisms/sections/form.section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/select";
import AddressSelect, {
  type Address,
} from "../organisms/selectors/address.select";
import { Checkbox } from "../atoms/checkbox";
import { Eye, EyeOff } from "lucide-react";

type RenderSelectProps = {
  title: string;
  subTitle?: string;
  description: string;
  placeholder: string;
  value:
    | string
    | number
    | Address
    | { isTrue?: boolean; value: string }
    | { height: any; weight: any; bmi: number }
    | any;
  otherValue?: string;
  onOtherChange?: (value: string | any) => void;
  onChange?: (value: string | string[] | any) => void;
  subOptionsLabel?: string;
  subOptionsValue?: string;
  subOptionsOnChange?: (value: string) => void;
  options?: {
    value: string;
    label: string;
    color?: string;
    options?: { value: string; label: string; color?: string }[];
  }[];
  customOptions?: any[];
  required?: boolean;
  isTrueFieldName?: string;
  unit?: string;
  fieldType?:
    | "dropdown"
    | "dropdown-with-sub-options"
    | "short-text"
    | "name"
    | "long-text"
    | "number"
    | "lrn"
    | "id"
    | "student-name"
    | "date"
    | "birthDate"
    | "ip-community"
    | "4Ps"
    | "pwd"
    | "address-current"
    | "address-permanent"
    | "checkbox-multiple"
    | "yes-no-with-input-text"
    | "yes-no-with-input-short-text"
    | "yes-no-with-input-number"
    | "yes-no-with-dropdown"
    | "yes-no-with-mutiple-select-checkbox"
    | "psaNo"
    | "phoneNumber"
    | "email"
    | "philhealth-number"
    | "bmi"
    | "input-with-units"
    | "blood-pressure"
    | "mpin-6"
    | "dropdown-with-unit-inputs"
    | "password";

  parentData?: any;
  inputTextCase?: "uppercase" | "lowercase" | "capitalize";
  subOptionsLoading?: boolean;
  subOptionsError?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
  max?: any;
  maxLength?: number;
};

export const FormMapper = ({
  title,
  subTitle,
  description,
  placeholder,
  value,
  otherValue,
  onOtherChange,
  subOptionsLabel,
  subOptionsValue,
  subOptionsOnChange,
  onChange,
  options,
  customOptions,
  required,
  fieldType,
  isTrueFieldName,
  parentData,
  inputTextCase,
  subOptionsLoading,
  subOptionsError,
  ref,
  unit,
  max,
  maxLength,
}: RenderSelectProps) => {
  const [showPin, setShowPin] = useState(false);

  const matchedOption = options?.find((option) => option.value === value);
  const hasSubOptions =
    matchedOption?.options && matchedOption.options.length > 0;
  const [isTrue, setIsTrue] = useState<Record<string, boolean | undefined>>({});
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [heightUnit, setHeightUnit] = useState<"cm" | "m" | "in" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [showPassword, setShowPassword] = useState(false);

  // Simple strength check
  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) return { label: "Weak", color: "text-red-500" };
    if (strength === 2) return { label: "Fair", color: "text-yellow-500" };
    if (strength === 3) return { label: "Good", color: "text-blue-500" };
    return { label: "Strong", color: "text-green-500" };
  };

  const strength = getStrength(value);

  const convertHeightToMeters = (
    value: number,
    unit: "cm" | "m" | "in" | "ft"
  ): number => {
    switch (unit) {
      case "cm":
        return value / 100;
      case "m":
        return value;
      case "in":
        return value * 0.0254;
      case "ft":
        return value * 0.3048;
      default:
        return value;
    }
  };

  // Convert weight based on selected unit
  const convertWeightToKg = (value: number, unit: "kg" | "lb"): number => {
    return unit === "lb" ? value * 0.453592 : value;
  };

  // Recalculate BMI using converted height and weight
  const heightInMeters = convertHeightToMeters(height, heightUnit);
  const weightInKg = convertWeightToKg(weight, weightUnit);
  const bmi =
    heightInMeters && weightInKg
      ? weightInKg / (heightInMeters * heightInMeters)
      : 0;

  // BMI Status Text
  const getBmiStatus = (bmi: number): string => {
    if (bmi === 0) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
  };

  // Utility to convert between height units
  const convertHeightBetweenUnits = (
    value: number,
    from: "cm" | "m" | "in" | "ft",
    to: "cm" | "m" | "in" | "ft"
  ): number => {
    const meters = convertHeightToMeters(value, from);
    switch (to) {
      case "cm":
        return meters * 100;
      case "m":
        return meters;
      case "in":
        return meters / 0.0254;
      case "ft":
        return meters / 0.3048;
      default:
        return meters;
    }
  };

  // Utility to convert between weight units
  const convertWeightBetweenUnits = (
    value: number,
    from: "kg" | "lb",
    to: "kg" | "lb"
  ): number => {
    const kg = convertWeightToKg(value, from);
    return to === "lb" ? kg / 0.453592 : kg;
  };

  // When user inputs height/weight
  const handleInputChange = (newHeight: number, newWeight: number) => {
    const hInMeters = convertHeightToMeters(newHeight, heightUnit);
    const wInKg = convertWeightToKg(newWeight, weightUnit);
    const computedBmi =
      hInMeters && wInKg ? wInKg / (hInMeters * hInMeters) : 0;

    onChange?.({
      height: {
        centimeter: hInMeters * 100,
        inches: hInMeters * 39.3701,
      },
      weight: {
        kilograms: wInKg,
        pounds: wInKg * 2.20462,
      },
      bmi: parseFloat(computedBmi.toFixed(2)),
    });
  };

  useEffect(() => {
    if (
      value !== undefined &&
      typeof value === "object" &&
      "isTrue" in value &&
      typeof isTrueFieldName === "string"
    ) {
      setIsTrue((prev) => ({
        ...prev,
        [isTrueFieldName]: value.isTrue ?? undefined,
      }));
    }
  }, [value, isTrueFieldName]);

  return (
    <FormSection
      ref={ref}
      title={title}
      description={description}
      required={required}
    >
      {fieldType === "dropdown" && (
        <>
          <Select value={value as string} onValueChange={onChange}>
            <SelectTrigger className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-400">
              {/* <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger> */}
              {options?.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  {option && option.color && (
                    <span
                      className="rounded-full p-1 inline-block"
                      style={{ backgroundColor: option.color }}
                    ></span>
                  )}{" "}
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {value === "other" && (
            <input
              type="text"
              className={`w-full mt-2 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
              placeholder="Please specify"
              value={otherValue}
              onChange={(e) => onOtherChange && onOtherChange(e.target.value)}
            />
          )}
        </>
      )}
      {fieldType === "dropdown-with-unit-inputs" && (
        <div className="w-full">
          <Select
            value={
              value?.status === "other"
                ? "other"
                : customOptions
                    ?.find((opt) => opt.status === value?.status)
                    ?.value?.toString() ?? ""
            }
            onValueChange={(selected) => {
              const selectedOption = customOptions?.find(
                (opt) => opt.value?.toString() === selected
              );
              if (selected === "other") {
                onChange?.({ status: "other", value: "" });
              } else if (selectedOption) {
                onChange?.({
                  status: selectedOption.status,
                  value: selectedOption.value,
                });
              }
            }}
          >
            <SelectTrigger className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-400">
              {customOptions?.map((option, index) => (
                <SelectItem key={index} value={option.value.toString()}>
                  {option && option.color && (
                    <span
                      className="rounded-full p-1 inline-block"
                      style={{ backgroundColor: option.color }}
                    ></span>
                  )}{" "}
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {value?.status === "other" && (
            <div className="relative w-full mt-2">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otherValue?.toString() ?? ""}
                onChange={(e) =>
                  onOtherChange?.({
                    status: "other",
                    value: e.target.value,
                  })
                }
                placeholder={`Enter ${title?.toLowerCase()}`}
                className={`w-full px-4 py-2 pr-14 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
              />
              {unit && (
                <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 pointer-events-none">
                  {unit}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {fieldType === "dropdown-with-sub-options" && (
        <div className="space-y-2">
          <Select value={value as string} onValueChange={onChange}>
            <SelectTrigger className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-400">
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sub-options loading/error/selection */}
          {value && hasSubOptions && (
            <>
              <label className="block text-sm font-medium text-gray-700">
                {subOptionsLabel}
              </label>

              {subOptionsLoading ? (
                <div className="text-sm text-blue-500">Please wait...</div>
              ) : subOptionsError ? (
                <div className="text-sm text-red-500">
                  Error: Network connection
                </div>
              ) : (
                <Select
                  value={subOptionsValue as string}
                  onValueChange={subOptionsOnChange}
                >
                  <SelectTrigger className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder={`Select ${subOptionsLabel}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {matchedOption.options!.map((subOption) => (
                      <SelectItem key={subOption.value} value={subOption.value}>
                        {subOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          )}
        </div>
      )}

      {fieldType === "short-text" && (
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || "Enter text"}
          maxLength={100}
          className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
        />
      )}
      {fieldType === "name" && (
        <input
          type="text"
          value={value as string}
          onChange={(e) => {
            const input = e.target.value;

            // Count digits
            const digits = (input.match(/[0-9]/g) || []).length;

            // Count symbols (non-letter, non-digit)
            const symbols = (input.match(/[^a-zA-Z0-9]/g) || []).length;

            if (digits <= 5 && symbols <= 5) {
              onChange?.(input);
            }
          }}
          placeholder={placeholder || "Enter text"}
          maxLength={150}
          className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
        />
      )}

      {fieldType === "long-text" && (
        <textarea
          value={value as string} // ensures a string is always passed
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || "Enter text"}
          className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
          rows={4}
        />
      )}

      {fieldType === "number" && (
        <input
          type="number"
          value={value as string}
          onChange={(e) => {
            const val = e.target.value;
            const num = Number(val);

            if (max !== undefined && num > max) {
              onChange?.(max);
            } else {
              onChange?.(val);
            }
          }}
          placeholder={placeholder || "Enter Number"}
          className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
        />
      )}

      {fieldType === "input-with-units" && (
        <div className="relative w-full">
          <input
            type="number"
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder || "Enter Number"}
            className={`w-full px-4 py-2 pr-14 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 pointer-events-none">
            {unit}
          </span>
        </div>
      )}
      {fieldType === "blood-pressure" && (
        <>
          {value?.category !== "other" ? (
            <Select
              value={value?.category ?? ""}
              onValueChange={(selected) => {
                if (selected === "other") {
                  onChange?.({
                    category: "other",
                    systolic: "",
                    diastolic: "",
                  });
                } else {
                  const selectedOption =
                    customOptions &&
                    customOptions.find((opt) => opt.value === selected);
                  if (selectedOption) {
                    onChange?.({
                      category: selectedOption.value,
                      systolic: selectedOption.systolicDefaultValue,
                      diastolic: selectedOption.diastolicDefaultValue,
                    });
                  }
                }
              }}
            >
              <SelectTrigger className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-400">
                {customOptions &&
                  customOptions.map((option, index) => (
                    <SelectItem key={index} value={option.value}>
                      <span
                        className="rounded-full p-1 inline-block"
                        style={{ backgroundColor: option.color }}
                      ></span>{" "}
                      {option.label}
                    </SelectItem>
                  ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={value?.systolic ?? ""}
                  onChange={(e) =>
                    onChange?.({
                      ...value,
                      systolic: e.target.value,
                    })
                  }
                  placeholder="Systolic"
                  className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
                />
                <span className="text-gray-700 font-semibold">/</span>
                <input
                  type="number"
                  value={value?.diastolic ?? ""}
                  onChange={(e) =>
                    onChange?.({
                      ...value,
                      diastolic: e.target.value,
                    })
                  }
                  placeholder="Diastolic"
                  className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
                />
                <span className="text-sm text-gray-500 ml-1">mmHg</span>
              </div>
              <button
                type="button"
                className="mt-2 text-blue-600 text-sm underline hover:text-blue-800"
                onClick={() =>
                  onChange?.({
                    category: "",
                    systolic: "",
                    diastolic: "",
                  })
                }
              >
                ← Back to Options
              </button>
            </>
          )}
        </>
      )}

      {fieldType === "bmi" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {/* Height Unit Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height Unit
              </label>
              <select
                value={heightUnit}
                onChange={(e) => {
                  const newUnit = e.target.value as "cm" | "m" | "in" | "ft";
                  const convertedHeight = convertHeightBetweenUnits(
                    height,
                    heightUnit,
                    newUnit
                  );
                  setHeight(convertedHeight);
                  setHeightUnit(newUnit);
                }}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="cm">Centimeters (cm)</option>
                <option value="m">Meters (m)</option>
                <option value="in">Inches (in)</option>
                <option value="ft">Feet (ft)</option>
              </select>
            </div>

            {/* Height Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="height"
              >
                Height ({heightUnit})
              </label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => {
                  const h = parseFloat(e.target.value);
                  setHeight(h);
                  const heightInMeters = convertHeightToMeters(h, heightUnit);
                  const weightInKg = convertWeightToKg(weight, weightUnit);
                  handleInputChange(heightInMeters, weightInKg);
                }}
                placeholder={`e.g. ${
                  heightUnit === "cm"
                    ? "175"
                    : heightUnit === "ft"
                    ? "5.8"
                    : "1.75"
                }`}
                className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Weight Unit Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight Unit
              </label>
              <select
                value={weightUnit}
                onChange={(e) => {
                  const newUnit = e.target.value as "kg" | "lb";
                  const convertedWeight = convertWeightBetweenUnits(
                    weight,
                    weightUnit,
                    newUnit
                  );
                  setWeight(convertedWeight);
                  setWeightUnit(newUnit);
                }}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lb">Pounds (lbs)</option>
              </select>
            </div>
            {/* Weight Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="weight"
              >
                Weight ({weightUnit})
              </label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => {
                  const w = parseFloat(e.target.value);
                  setWeight(w);
                  const heightInMeters = convertHeightToMeters(
                    height,
                    heightUnit
                  );
                  const weightInKg = convertWeightToKg(w, weightUnit);
                  handleInputChange(heightInMeters, weightInKg);
                }}
                placeholder="e.g. 68"
                className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
              />
            </div>{" "}
          </div>

          {/* BMI Output */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="bmi"
            >
              BMI (auto-calculated)
            </label>
            <input
              id="bmi"
              type="text"
              readOnly
              value={bmi ? bmi.toFixed(2) : ""}
              placeholder="BMI"
              className="w-full px-4 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-lg"
            />
            {bmi > 0 && (
              <p className="mt-1 text-sm font-medium text-blue-600">
                Status: {getBmiStatus(bmi)}
              </p>
            )}
          </div>
        </div>
      )}

      {fieldType === "phoneNumber" && (
        <div className="w-full">
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 text-sm">
              +63
            </span>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={(value as string).replace(/^63/, "")} // keep internal value without +63
              onChange={(e) => {
                const digitsOnly = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10); // only 10 digits after +63
                onChange?.(`63${digitsOnly}`);
              }}
              placeholder={placeholder || "XXX XXX XXXX"}
              className={`w-full pl-14 pr-4 py-2 text-sm text-gray-900 bg-white border ${
                (value as string).length > 0 && (value as string).length !== 12
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
            />
          </div>
          {(value as string).length > 0 && (value as string).length !== 12 && (
            <p className="text-xs text-red-500 mt-1">
              Phone number must be exactly 10 digits after +63.
            </p>
          )}
        </div>
      )}
      {fieldType === "philhealth-number" && (
        <input
          type="text"
          value={value as string}
          onChange={(e) => {
            // Optional: strip non-digits and apply format (basic client-side formatting)
            const raw = e.target.value.replace(/\D/g, "").slice(0, 12); // Max 12 digits
            const formatted = raw.replace(
              /^(\d{2})(\d{0,9})(\d{0,1})$/,
              (match, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join("")
            );
            onChange?.(formatted);
          }}
          placeholder={placeholder || "123456789012"}
          className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
          inputMode="numeric"
          pattern="\d{2}\d{7,9}\d{1}"
        />
      )}

      {fieldType === "mpin-6" && (
        <div className="flex gap-2 items-start">
          <div className="gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                id={`mpin-input-${index}`}
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={value[index] || ""}
                onChange={(e) => {
                  const newVal = e.target.value.replace(/\D/g, "").slice(0, 1);
                  const newPin = value.split("");
                  newPin[index] = newVal;
                  const updatedPin = newPin.join("").padEnd(6, "");
                  onChange?.(updatedPin);

                  if (newVal) {
                    const nextInput = document.getElementById(
                      `mpin-input-${index + 1}`
                    );
                    nextInput?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace") {
                    const newPin = value.split("");
                    if (!value[index] && index > 0) {
                      const prevInput = document.getElementById(
                        `mpin-input-${index - 1}`
                      );
                      prevInput?.focus();
                    }
                    newPin[index] = "";
                    onChange?.(newPin.join("").padEnd(6, ""));
                  }
                }}
                className={`w-10 h-10 text-center text-lg border ${
                  value.length > 0 && value.length !== 6
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded focus:ring-2 focus:ring-blue-500`}
              />
            ))}

            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="ml-2 mt-1 text-gray-500 hover:text-gray-700"
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {value.length > 0 && value.length !== 6 && (
            <p className="text-xs text-red-500 mt-1">
              MPIN must be exactly 6 digits.
            </p>
          )}
        </div>
      )}
      {fieldType === "password" && (
        <div className="w-full">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder || "Enter password"}
              maxLength={8} // ✅ Limited to 8 characters
              className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 ${inputTextCase}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {value && (
            <p className={`mt-1 text-xs font-medium ${strength.color}`}>
              Strength: {strength.label}
            </p>
          )}
        </div>
      )}

      {fieldType === "email" && (
        <div className="w-full">
          <input
            type="email"
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder || "Enter your email"}
            className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border ${
              (value as string).length > 0 &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
          />
          {(value as string).length > 0 &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string) && (
              <p className="text-xs text-red-500 mt-1">
                Please enter a valid email address.
              </p>
            )}
        </div>
      )}

      {fieldType === "psaNo" && (
        <div className="w-full">
          <input
            type="text"
            value={value as string}
            onChange={(e) => {
              const rawValue = e.target.value;
              const onlyNumbers = rawValue.replace(/\D/g, "").slice(0, 12); // Keep only up to 12 digits
              onChange?.(onlyNumbers);
            }}
            placeholder={placeholder || "Enter 10-12 digit PSA No."}
            className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border ${
              (value as string).length > 0 &&
              ((value as string).length < 10 || (value as string).length > 12)
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
          />
          {(value as string).length > 0 &&
            ((value as string).length < 10 ||
              (value as string).length > 12) && (
              <p className="text-xs text-red-500 mt-1">
                PSA Number must be between 10 and 12 digits.
              </p>
            )}
        </div>
      )}

      {fieldType === "date" && (
        <input
          type="date"
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || "Enter Date"}
          max={max && max}
          className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      )}

      {fieldType === "birthDate" && (
        <input
          type="date"
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || "Enter Date"}
          max={new Date().toISOString().split("T")[0]} // Blocks future dates
          className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      )}

      {fieldType === "address-current" && (
        <AddressSelect
          value={value as Address}
          onChange={(val) => onChange?.(val as any)}
          isPermanent={false}
          inputTextCase={inputTextCase}
        />
      )}

      {fieldType === "address-permanent" && (
        <AddressSelect
          value={value as Address}
          onChange={(val) => onChange?.(val as any)}
          isPermanent={true}
          parentData={parentData}
          onSameAsCurrentAddressChange={(e) => {
            setIsTrue({
              ...isTrue,
              sameAsCurrentAddress: e,
            });
          }}
          sameAsCurrentAddress={isTrue.sameAsCurrentAddress}
          inputTextCase={inputTextCase}
        />
      )}
      {fieldType === "checkbox-multiple" && (
        <div className="space-y-2">
          <div className="space-y-2">
            {options?.map((option) => {
              const isChecked =
                Array.isArray(value) &&
                value.some((v) => v.value === option.value);

              return (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      let updatedValues: any[] = Array.isArray(value)
                        ? [...value]
                        : [];

                      if (e.target.checked) {
                        updatedValues.push({ value: option.value });
                      } else {
                        updatedValues = updatedValues.filter(
                          (v) => v.value !== option.value
                        );
                      }

                      onChange && onChange(updatedValues);
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
      {fieldType === "yes-no-with-input-text" && isTrueFieldName && (
        <div className="space-y-3">
          {/* Yes / No Checkboxes */}
          <div className="flex items-center gap-4">
            {/* Yes Option */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isTrue[isTrueFieldName] === true}
                onCheckedChange={() => {
                  setIsTrue((prev) => ({
                    ...prev,
                    [isTrueFieldName]: true,
                  }));
                  onChange?.({ isTrue: true, value: "" }); // Reset explanation text
                }}
              />
              <span className="text-sm">Yes</span>
            </div>

            {/* No Option */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isTrue[isTrueFieldName] === false}
                onCheckedChange={() => {
                  setIsTrue((prev) => ({
                    ...prev,
                    [isTrueFieldName]: false,
                  }));
                  onChange?.({ isTrue: false, value: "" }); // Reset explanation text
                  subOptionsOnChange?.("");
                }}
              />
              <span className="text-sm">No</span>
            </div>
          </div>
          <p className="text-xs">
            {isTrue[isTrueFieldName] === true && subTitle && subTitle}
          </p>
          {/* Textarea appears only if 'Yes' is selected */}
          {isTrue[isTrueFieldName] === true && (
            <textarea
              value={
                typeof value === "object" &&
                "value" in value &&
                typeof value.value === "string"
                  ? value.value
                  : ""
              }
              onChange={(e) =>
                onChange?.({ isTrue: true, value: e.target.value })
              }
              placeholder={placeholder || "Enter details"}
              className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
              rows={4}
            />
          )}
        </div>
      )}
      {fieldType === "yes-no-with-input-short-text" && isTrueFieldName && (
        <div className="space-y-3">
          {/* Yes / No Checkboxes */}
          <div className="flex items-center gap-4">
            {/* Yes Option */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isTrue[isTrueFieldName] === true}
                onCheckedChange={() => {
                  setIsTrue((prev) => ({
                    ...prev,
                    [isTrueFieldName]: true,
                  }));
                  onChange?.({ isTrue: true, value: "" }); // Reset explanation text
                }}
              />
              <span className="text-sm">Yes</span>
            </div>

            {/* No Option */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isTrue[isTrueFieldName] === false}
                onCheckedChange={() => {
                  setIsTrue((prev) => ({
                    ...prev,
                    [isTrueFieldName]: false,
                  }));
                  onChange?.({ isTrue: false, value: "" }); // Reset explanation text
                  subOptionsOnChange?.("");
                }}
              />
              <span className="text-sm">No</span>
            </div>
          </div>
          <p className="text-xs">
            {isTrue[isTrueFieldName] === true && subTitle && subTitle}
          </p>
          {/* Textarea appears only if 'Yes' is selected */}
          {isTrue[isTrueFieldName] === true && (
            <input
              type="text"
              value={
                typeof value === "object" &&
                "value" in value &&
                typeof value.value === "string"
                  ? value.value
                  : ""
              }
              onChange={(e) =>
                onChange?.({ isTrue: true, value: e.target.value })
              }
              placeholder={placeholder || "Enter details"}
              className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
            />
          )}
        </div>
      )}
      {fieldType === "yes-no-with-input-number" && isTrueFieldName && (
        <div className="space-y-3">
          {/* Yes/No checkboxes */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isTrue[isTrueFieldName] === true}
                onCheckedChange={() => {
                  setIsTrue((prev) => ({ ...prev, [isTrueFieldName]: true }));
                  onChange?.({ isTrue: true, value: "0" }); // default to string "0"
                }}
              />
              <span className="text-sm">Yes</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isTrue[isTrueFieldName] === false}
                onCheckedChange={() => {
                  setIsTrue((prev) => ({ ...prev, [isTrueFieldName]: false }));
                  onChange?.({ isTrue: false, value: "" });
                  subOptionsOnChange?.("");
                }}
              />
              <span className="text-sm">No</span>
            </div>
          </div>

          {/* Subtitle if applicable */}
          <p className="text-xs">
            {isTrue[isTrueFieldName] === true && subTitle}
          </p>

          {/* Number input if 'Yes' is selected */}
          {isTrue[isTrueFieldName] === true && (
            <input
              type="number"
              value={
                typeof value === "object" && "value" in value ? value.value : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                const num = Number(val);
                const capped =
                  typeof max === "number" && num > max ? Number(max) : val;

                onChange?.({ isTrue: true, value: capped });
              }}
              placeholder={placeholder || "Enter details"}
              className={`w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputTextCase}`}
            />
          )}
        </div>
      )}

      {fieldType === "yes-no-with-dropdown" && (
        <div className="space-y-3">
          {/* Yes / No Checkboxes */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isTrue[isTrueFieldName as string] === true}
                onCheckedChange={() => {
                  setIsTrue((prev) => ({
                    ...prev,
                    [isTrueFieldName as string]: true,
                  }));
                }}
              />
              <span className="text-sm">Yes</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isTrue[isTrueFieldName as string] === false}
                onCheckedChange={() => {
                  setIsTrue((prev) => ({
                    ...prev,
                    [isTrueFieldName as string]: false,
                  }));
                  onChange?.(""); // clear main value
                  subOptionsOnChange?.(""); // clear sub-option
                }}
              />
              <span className="text-sm">No</span>
            </div>
          </div>

          {/* Main Dropdown if Yes */}
          {isTrue[isTrueFieldName as string] === true && (
            <>
              <Select value={value as string} onValueChange={onChange}>
                <SelectTrigger className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <SelectValue
                    placeholder={placeholder || "Select type of disability"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sub-options if available */}
              {options?.find((opt) => opt.value === value)?.options && (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    {subOptionsLabel}
                  </label>
                  <Select
                    value={subOptionsValue}
                    onValueChange={subOptionsOnChange}
                  >
                    <SelectTrigger className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder={`Select ${subOptionsLabel}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {options
                        .find((opt) => opt.value === value)
                        ?.options?.map((sub) => (
                          <SelectItem key={sub.value} value={sub.value}>
                            {sub.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </>
          )}
        </div>
      )}
      {fieldType === "yes-no-with-mutiple-select-checkbox" && (
        <div className="space-y-3">
          {/* Yes / No Checkboxes */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isTrue[isTrueFieldName as string] === true}
                onCheckedChange={() => {
                  setIsTrue((prev) => ({
                    ...prev,
                    [isTrueFieldName as string]: true,
                  }));
                }}
              />
              <span className="text-sm">Yes</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isTrue[isTrueFieldName as string] === false}
                onCheckedChange={() => {
                  setIsTrue((prev) => ({
                    ...prev,
                    [isTrueFieldName as string]: false,
                  }));
                  onChange?.([]); // clear diagnoses array
                }}
              />
              <span className="text-sm">No</span>
            </div>
          </div>

          {/* Diagnosis checkboxes if Yes */}
          {isTrue[isTrueFieldName as string] === true && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select diagnosis
              </label>

              {options?.map((option) => {
                // Narrow value to array safely
                const diagnosisArray = Array.isArray(value) ? value : [];

                const isChecked = diagnosisArray.some(
                  (d: { value: string }) => d.value === option.value
                );

                return (
                  <div key={option.value} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          let newDiagnoses;
                          if (checked) {
                            // add new diagnosis with empty subValue
                            newDiagnoses = [
                              ...diagnosisArray,
                              { value: option.value, subValue: "" },
                            ];
                          } else {
                            // remove diagnosis by value
                            newDiagnoses = diagnosisArray.filter(
                              (d: { value: string }) => d.value !== option.value
                            );
                          }
                          onChange?.(newDiagnoses);
                        }}
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>

                    {/* Sub-value checkboxes if option has sub-options and is checked */}
                    {isChecked &&
                      option.options &&
                      option.options.length > 0 && (
                        <div className="ml-6 space-y-1">
                          <label className="block text-xs text-gray-500">
                            {subOptionsLabel || "Sub-type"}
                          </label>
                          {option.options.map((sub) => {
                            // Find the current diagnosis object to get subValue
                            const currentDiagnosis = diagnosisArray.find(
                              (d: { value: string }) => d.value === option.value
                            );
                            const isSubChecked =
                              currentDiagnosis?.subValue === sub.value;

                            return (
                              <div
                                key={sub.value}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  checked={isSubChecked}
                                  onCheckedChange={() => {
                                    const updatedDiagnoses = diagnosisArray.map(
                                      (d: any) =>
                                        d.value === option.value
                                          ? { ...d, subValue: sub.value }
                                          : d
                                    );
                                    onChange?.(updatedDiagnoses);
                                  }}
                                />
                                <span className="text-sm">{sub.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </FormSection>
  );
};

FormMapper.displayName = "FormMapper";
