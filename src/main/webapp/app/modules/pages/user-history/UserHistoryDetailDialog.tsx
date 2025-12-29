import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { History, X } from "lucide-react";

const UserHistoryDetailDialog = (props) => {
  const getActionTypeSeverity = (type: string) => {
    switch (type) {
      case "Create":
        return "success";
      case "Update":
        return "info";
      case "Delete":
        return "danger";
      case "Login":
        return "success";
      case "Logout":
        return "warning";
      default:
        return "secondary";
    }
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
              Activity Details
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              View detailed information about this user activity
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="kemetra-field-label">User Name</label>
              <p className="kemetra-field-value">
                {props.selectedHistory.userName}
              </p>
            </div>
            <div>
              <label className="kemetra-field-label">User Email</label>
              <p className="kemetra-field-value">
                {props.selectedHistory.userEmail}
              </p>
            </div>
          </div>

          <div>
            <label className="kemetra-field-label">Action</label>
            <p className="kemetra-field-value">
              {props.selectedHistory.action}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="kemetra-field-label">Action Type</label>
              <div className="mt-2">
                <Tag
                  value={props.selectedHistory.actionType}
                  severity={
                    getActionTypeSeverity(
                      props.selectedHistory.actionType,
                    ) as any
                  }
                />
              </div>
            </div>
            <div>
              <label className="kemetra-field-label">Timestamp</label>
              <p className="kemetra-field-value">
                {new Date(props.selectedHistory.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {props.selectedHistory.targetEntity && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="kemetra-field-label">Target Entity</label>
                <p className="kemetra-field-value">
                  {props.selectedHistory.targetEntity}
                </p>
              </div>
              <div>
                <label className="kemetra-field-label">Target ID</label>
                <p className="kemetra-field-value">
                  {props.selectedHistory.targetId || "-"}
                </p>
              </div>
            </div>
          )}

          {props.selectedHistory.ipAddress && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="kemetra-field-label">IP Address</label>
                <p className="kemetra-field-value">
                  {props.selectedHistory.ipAddress}
                </p>
              </div>
              {props.selectedHistory.userAgent && (
                <div>
                  <label className="kemetra-field-label">User Agent</label>
                  <p className="kemetra-field-value text-sm truncate">
                    {props.selectedHistory.userAgent}
                  </p>
                </div>
              )}
            </div>
          )}

          {props.selectedHistory.details && (
            <div>
              <label className="kemetra-field-label">Additional Details</label>
              <div className="kemetra-field-value-box">
                <p className="text-sm">{props.selectedHistory.details}</p>
              </div>
            </div>
          )}
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
