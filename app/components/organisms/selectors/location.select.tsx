import { useEffect, useState } from "react";

import REGION from "@/assets/ph/region.json";
import PROVINCE from "@/assets/ph/province.json";
import CITY from "@/assets/ph/city.json";
import BARANGAY from "@/assets/ph/barangay.json";

interface Region {
  region_code: string;
  region_name: string;
}

interface Province {
  province_code: string;
  province_name: string;
  region_code: string;
}

interface City {
  city_code: string;
  city_name: string;
  province_code: string;
}

interface Barangay {
  brgy_code: string;
  brgy_name: string;
  city_code: string;
}

interface LocationData {
  lat: string;
  lng: string;
  address: string;
  details: {
    region: { name: string; code: string };
    province: { name: string; code: string };
    city: { name: string; code: string };
    barangay: { name: string; code: string };
  };
}

interface LocationSelectProps {
  onChange: (locationValue: LocationData) => void;
  onRemove?: () => void;
  defaultRegionCode?: string;
  defaultProvinceCode?: string;
  defaultCityCode?: string;
  defaultBarangayCode?: string;
  title?: string;
}

const regionData: Region[] = REGION as Region[];
const provinceData: Province[] = PROVINCE as Province[];
const cityData: City[] = CITY as City[];
const barangayData: Barangay[] = BARANGAY as Barangay[];

const LocationSelect = ({
  onChange,
  defaultRegionCode = "",
  defaultProvinceCode = "",
  defaultCityCode = "",
  defaultBarangayCode = "",
}: LocationSelectProps) => {
  const [selectedRegion, setSelectedRegion] = useState(defaultRegionCode);
  const [selectedProvince, setSelectedProvince] = useState(defaultProvinceCode);
  const [selectedCity, setSelectedCity] = useState(defaultCityCode);
  const [selectedBarangay, setSelectedBarangay] = useState(defaultBarangayCode);

  const [provinceOptions, setProvinceOptions] = useState<Province[]>([]);
  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<Barangay[]>([]);

  useEffect(() => {
    if (selectedRegion) {
      const filtered = provinceData.filter(
        (p) => p.region_code === selectedRegion
      );
      setProvinceOptions(filtered);
    } else {
      setProvinceOptions([]);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedProvince) {
      const filtered = cityData.filter(
        (c) => c.province_code === selectedProvince
      );
      setCityOptions(filtered);
    } else {
      setCityOptions([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      const filtered = barangayData.filter((b) => b.city_code === selectedCity);
      setBarangayOptions(filtered);
    } else {
      setBarangayOptions([]);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (
      selectedRegion &&
      selectedProvince &&
      selectedCity &&
      selectedBarangay
    ) {
      const region = regionData.find((r) => r.region_code === selectedRegion);
      const province = provinceData.find(
        (p) => p.province_code === selectedProvince
      );
      const city = cityData.find((c) => c.city_code === selectedCity);
      const barangay = barangayData.find(
        (b) => b.brgy_code === selectedBarangay
      );

      const fullAddress = `${barangay?.brgy_name}, ${city?.city_name}, ${province?.province_name}, ${region?.region_name}`;

      const locationData: LocationData = {
        lat: "",
        lng: "",
        address: fullAddress,
        details: {
          region: { name: region?.region_name || "", code: selectedRegion },
          province: {
            name: province?.province_name || "",
            code: selectedProvince,
          },
          city: { name: city?.city_name || "", code: selectedCity },
          barangay: { name: barangay?.brgy_name || "", code: selectedBarangay },
        },
      };

      onChange(locationData);

      // Optional geocoding API fetch
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.length > 0) {
            const { lat, lon } = data[0];
            onChange({
              ...locationData,
              lat: lat.toString(),
              lng: lon.toString(),
            });
          }
        })
        .catch(console.error);
    }
  }, [selectedRegion, selectedProvince, selectedCity, selectedBarangay]);

  return (
    <div className=" bg-white ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Region */}
        <select
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setSelectedProvince("");
            setSelectedCity("");
            setSelectedBarangay("");
          }}
          className="select-box uppercase w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>
            Choose Region
          </option>
          {regionData.map((region) => (
            <option key={region.region_code} value={region.region_code}>
              {region.region_name}
            </option>
          ))}
        </select>

        {/* Province */}
        <select
          value={selectedProvince}
          onChange={(e) => {
            setSelectedProvince(e.target.value);
            setSelectedCity("");
            setSelectedBarangay("");
          }}
          disabled={!selectedRegion}
          className="select-box uppercase w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>
            Choose Province
          </option>
          {provinceOptions.map((province) => (
            <option key={province.province_code} value={province.province_code}>
              {province.province_name}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedBarangay("");
          }}
          disabled={!selectedProvince}
          className="select-box uppercase w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>
            Choose City/Municipality
          </option>
          {cityOptions.map((city) => (
            <option key={city.city_code} value={city.city_code}>
              {city.city_name}
            </option>
          ))}
        </select>

        {/* Barangay */}
        <select
          value={selectedBarangay}
          onChange={(e) => setSelectedBarangay(e.target.value)}
          disabled={!selectedCity}
          className="select-box uppercase w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>
            Choose Barangay
          </option>
          {barangayOptions.map((barangay) => (
            <option key={barangay.brgy_code} value={barangay.brgy_code}>
              {barangay.brgy_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelect;
