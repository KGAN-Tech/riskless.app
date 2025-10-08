import { Checkbox } from "@/components/atoms/checkbox";
import React, { useEffect } from "react";
import LocationSelect from "./location.select";

export interface Address {
  houseNo: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
  type: "current" | "permanent";
}

interface AddressSelectProps {
  value: Address;
  onChange: (address: Address) => void;
  sameAsCurrentAddress?: boolean;
  onSameAsCurrentAddressChange?: (checked: boolean) => void;
  isPermanent?: boolean;
  parentData?: any;
  inputTextCase?: any;
}

const AddressSelect: React.FC<AddressSelectProps> = ({
  value,
  onChange,
  sameAsCurrentAddress = false,
  onSameAsCurrentAddressChange,
  isPermanent = false,
  parentData,
  inputTextCase,
}) => {
  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, street: e.target.value });
  };

  const handleHouseNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, houseNo: e.target.value });
  };

  const handleLocationChange = (location: any) => {
    onChange({
      ...value,
      barangay: location.details.barangay.name,
      city: location.details.city.name,
      province: location.details.province.name,
    });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, zipCode: e.target.value });
  };

  useEffect(() => {
    if (isPermanent && sameAsCurrentAddress && parentData?.current) {
      const newAddress: Address = {
        ...parentData.current,
        type: "permanent",
      };

      // Only call onChange if the value is actually different
      const isDifferent = JSON.stringify(value) !== JSON.stringify(newAddress);
      if (isDifferent) {
        onChange(newAddress);
      }
    }
  }, [sameAsCurrentAddress, isPermanent, parentData, onChange, value]);

  const handleLocationRemove = () => {
    onChange({
      ...value,
      barangay: "",
      city: "",
      province: "",
    });
  };

  return (
    <div className="space-y-2">
      {/* Same as current address toggle (only for permanent address) */}
      {isPermanent && (
        <div className="flex items-center justify-between text-sm mb-2">
          <p className="text-gray-500 text-sm">Same as your Current Address?</p>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={sameAsCurrentAddress}
              onCheckedChange={(checked: boolean) => {
                onSameAsCurrentAddressChange &&
                  onSameAsCurrentAddressChange(checked);
              }}
            />
            <span>Yes</span>
          </div>
        </div>
      )}

      {/* Hide inputs if sameAsCurrentAddress is true */}
      {!(isPermanent && sameAsCurrentAddress) && (
        <>
          <div className={`grid grid-cols-2 gap-4 ${inputTextCase}`}>
            {" "}
            <input
              type="text"
              name="houseNo"
              value={value.houseNo}
              onChange={handleHouseNoChange}
              placeholder="House No."
              className={`w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputTextCase}`}
            />
            <input
              type="text"
              name="street"
              value={value.street}
              onChange={handleStreetChange}
              placeholder="Street"
              className={`w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputTextCase}`}
            />
          </div>

          <LocationSelect
            onChange={handleLocationChange}
            onRemove={handleLocationRemove}
          />
          <input
            type="text"
            name="zipCode"
            value={value.zipCode}
            onChange={handleZipCodeChange}
            placeholder="Zip Code"
            className={` w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputTextCase}`}
          />
        </>
      )}
    </div>
  );
};

export default AddressSelect;
