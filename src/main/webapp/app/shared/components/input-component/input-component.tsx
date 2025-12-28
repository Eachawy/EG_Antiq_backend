import "./input-component.scss";

import React from "react";
import { InputText } from "primereact/inputtext";

export interface InputComponentProps {
  id?: string;
  name?: string;
  label?: string | React.ReactNode;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  autoComplete?: string;
  type?: string;
  "data-cy"?: string;
}

export const InputComponent: React.FC<InputComponentProps> = ({
  id,
  name,
  label,
  value,
  placeholder,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  className = "",
  autoComplete,
  type = "text",
  "data-cy": dataCy,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`input-component flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="mb-2 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <InputText
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${error ? "p-invalid" : ""}`}
        autoComplete={autoComplete}
        type={type}
        data-cy={dataCy}
      />
      {error && <small className="mt-1 text-red-600">{error}</small>}
    </div>
  );
};

export default InputComponent;
