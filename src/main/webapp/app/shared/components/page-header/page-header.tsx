import React from "react";
import { Button } from "primereact/button";
import { Plus } from "lucide-react";

const PageHeader = (props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-1 kemetra-text-primary">
          {props.title}
        </h1>
        {props.description && (
          <div className="text-sm kemetra-text-secondary">
            {props.description}
          </div>
        )}
      </div>
      {props.actionLabel && props.onAction && (
        <Button
          label={props.actionLabel}
          icon={<Plus size={18} />}
          onClick={props.onAction}
          className="kemetra-btn-primary"
        />
      )}
    </div>
  );
};

export default PageHeader;
