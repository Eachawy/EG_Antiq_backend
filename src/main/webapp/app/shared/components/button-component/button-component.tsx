import "./button-component.scss";

import React from "react";
import { Button } from "primereact/button";

export type ButtonSeverity =
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "help"
  | "danger"
  | "contrast";

export interface ButtonComponentProps {
  label?: string | React.ReactNode;
  icon?: string;
  iconPos?: "left" | "right" | "top" | "bottom";
  severity?: ButtonSeverity;
  outlined?: boolean;
  text?: boolean;
  raised?: boolean;
  rounded?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  "data-cy"?: string;
  children?: React.ReactNode;
}

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  label,
  icon,
  iconPos = "left",
  severity,
  outlined = false,
  text = false,
  raised = false,
  rounded = false,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  "data-cy": dataCy,
  children,
}) => {
  return (
    <Button
      label={typeof label === "string" ? label : undefined}
      icon={icon}
      iconPos={iconPos}
      severity={severity}
      outlined={outlined}
      text={text}
      raised={raised}
      rounded={rounded}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
      data-cy={dataCy}
    >
      {typeof label !== "string" ? label : null}
      {children}
    </Button>
  );
};

export default ButtonComponent;
