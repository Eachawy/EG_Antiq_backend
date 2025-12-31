import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { History, X } from "lucide-react";

const UserHistoryDetailDialog = (props) => {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "-";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes > 0 ? `${minutes}m ` : ""}${secs}s`;
  };

  return (
    <Dialog
      visible={props.visible}
      className="kemetra-dialog-width-50"
      header={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center kemetra-dialog-header-icon-box">
            <History size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="text-xl font-semibold kemetra-dialog-title-text">
              Visit Details
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              View detailed information about this monument visit
            </p>
          </div>
        </div>
      }
      modal
      onHide={props.onHide}
      draggable={false}
    >
      {props.selectedHistory && (
        <div className="space-y-4 pt-4">
          <div>
            <label className="kemetra-field-label">Portal User</label>
            <p className="kemetra-field-value">
              {props.selectedHistory.portalUser?.firstName}{" "}
              {props.selectedHistory.portalUser?.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {props.selectedHistory.portalUser?.email}
            </p>
          </div>

          <div>
            <label className="kemetra-field-label">Monument Visited</label>
            <p className="kemetra-field-value">
              {props.selectedHistory.monument?.monumentNameEn}
            </p>
            <p className="text-sm text-gray-500">
              {props.selectedHistory.monument?.monumentNameAr}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="kemetra-field-label">Visit Date</label>
              <p className="kemetra-field-value">
                {new Date(props.selectedHistory.visitedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="kemetra-field-label">Visit Time</label>
              <p className="kemetra-field-value">
                {new Date(props.selectedHistory.visitedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div>
            <label className="kemetra-field-label">Duration</label>
            <p className="kemetra-field-value">
              {formatDuration(props.selectedHistory.durationSeconds)}
            </p>
          </div>

          <div>
            <label className="kemetra-field-label">Visit ID</label>
            <p className="kemetra-field-value text-sm font-mono text-gray-500">
              {props.selectedHistory.id}
            </p>
          </div>
        </div>
      )}

      <div className="kemetra-dialog-footer">
        <Button
          label="Close"
          icon={<X size={18} />}
          onClick={props.onHide}
          className="kemetra-btn-secondary"
        />
      </div>
    </Dialog>
  );
};

export default UserHistoryDetailDialog;
