import "./dropdown-component.scss";

import React from "react";
import { Dropdown } from "primereact/dropdown";

export interface DropdownOption {
  label: string;
  value: any;
}

export interface DropdownComponentProps {
  id?: string;
  name?: string;
  label?: string | React.ReactNode;
  value?: any;
  options: DropdownOption[];
  onChange?: (value: any) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  filter?: boolean;
  filterPlaceholder?: string;
  showClear?: boolean;
  optionLabel?: string;
  "data-cy"?: string;
}

export const DropdownComponent: React.FC<DropdownComponentProps> = ({
  id,
  name,
  label,
  value,
  options,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  placeholder,
  className = "",
  filter = false,
  filterPlaceholder,
  showClear = false,
  optionLabel = "label",
  "data-cy": dataCy,
}) => {
  const handleChange = (e: { value: any }) => {
    if (onChange) {
      onChange(e.value);
    }
  };

  return (
    <div className={`dropdown-component flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="mb-2 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Dropdown
        id={id}
        name={name}
        value={value}
        options={options}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${error ? "p-invalid" : ""}`}
        filter={filter}
        filterPlaceholder={filterPlaceholder}
        showClear={showClear}
        optionLabel={optionLabel}
        data-cy={dataCy}
      />
      {error && <small className="mt-1 text-red-600">{error}</small>}
    </div>
  );
};

export default DropdownComponent;
