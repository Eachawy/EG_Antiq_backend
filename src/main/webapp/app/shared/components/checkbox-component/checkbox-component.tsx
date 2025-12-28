import "./checkbox-component.scss";

import React from "react";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";

export interface CheckboxComponentProps {
  id?: string;
  name?: string;
  label?: string | React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  "data-cy"?: string;
}

export const CheckboxComponent: React.FC<CheckboxComponentProps> = ({
  id,
  name,
  label,
  checked = false,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  className = "",
  "data-cy": dataCy,
}) => {
  const handleChange = (e: CheckboxChangeEvent) => {
    if (onChange) {
      onChange(e.checked ?? false);
    }
  };

  return (
    <div className={`checkbox-component flex flex-col ${className}`}>
      <div className="flex items-center">
        <Checkbox
          inputId={id || name}
          checked={checked}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={error ? "p-invalid" : ""}
          data-cy={dataCy}
        />
        {label && (
          <label
            htmlFor={id || name}
            className="ml-2 text-sm text-gray-900 cursor-pointer"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      {error && <small className="mt-1 text-red-600 ml-6">{error}</small>}
    </div>
  );
};

export default CheckboxComponent;
