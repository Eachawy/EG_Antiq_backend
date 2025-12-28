import React from "react";
import { Button } from "primereact/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actionLabel,
  actionIcon = "pi-plus",
  onAction,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 kemetra-page-header">
      <div>
        <h1 className="kemetra-page-title">{title}</h1>
        {description && (
          <p className="kemetra-page-description">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          icon={<Plus size={18} />}
          onClick={onAction}
          className="p-button-rounded kemetra-primary-btn"
        />
      )}
    </div>
  );
};
