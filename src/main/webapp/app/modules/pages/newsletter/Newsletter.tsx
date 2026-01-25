import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import {
  Mail,
  Users,
  Send,
  FileDown,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import SendNewsletterDialog from "./SendNewsletterDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getSubscribers,
  deleteSubscriber,
  exportSubscribers,
  getCampaigns,
  getCampaignDetails,
} from "./newsletter.reducer";
import { toast } from "react-toastify";
import { APP_DATE_FORMAT } from "app/config/constants";
import dayjs from "dayjs";

const NewsletterPage = () => {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sendDialogVisible, setSendDialogVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const $Subscribers = useAppSelector((state) => state.Newsletter.subscribers);
  const $Campaigns = useAppSelector((state) => state.Newsletter.campaigns);
  const loading = useAppSelector((state) => state.Newsletter.loading);

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if ($Subscribers?.data) {
      setSubscribers($Subscribers.data);
    }
  }, [$Subscribers]);

  useEffect(() => {
    if ($Campaigns?.data) {
      setCampaigns($Campaigns.data);
    }
  }, [$Campaigns]);

  const fetchSubscribers = async () => {
    await dispatch(
      getSubscribers({
        page: 1,
        limit: 100,
        search: searchTerm,
        status: statusFilter,
      }),
    );
  };

  const fetchCampaigns = async () => {
    await dispatch(getCampaigns({ page: 1, limit: 50 }));
  };

  const handleDeleteSubscriber = (subscriber: any) => {
    confirmDialog({
      message: `Are you sure you want to remove ${subscriber.email} from the newsletter?`,
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      async accept() {
        try {
          await dispatch(deleteSubscriber(subscriber.id)).unwrap();
          toast.success("Subscriber removed successfully");
          fetchSubscribers();
        } catch (error) {
          toast.error("Failed to remove subscriber");
        }
      },
    });
  };

  const handleExport = async (format: "csv" | "excel") => {
    try {
      await dispatch(exportSubscribers(format)).unwrap();
      toast.success(`Subscribers exported to ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export subscribers");
    }
  };

  const handleSearch = () => {
    fetchSubscribers();
  };

  const handleSendSuccess = () => {
    setSendDialogVisible(false);
    fetchCampaigns();
    toast.success("Newsletter sent successfully!");
  };

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Subscribed", value: "subscribed" },
    { label: "Unsubscribed", value: "unsubscribed" },
  ];

  const nameBodyTemplate = (rowData: any) => {
    const name =
      rowData.portalUser?.firstName || rowData.portalUser?.lastName
        ? `${rowData.portalUser?.firstName || ""} ${rowData.portalUser?.lastName || ""}`.trim()
        : "N/A";
    return <span>{name}</span>;
  };

  const statusBodyTemplate = (rowData: any) => {
    return (
      <span
        className={`px-2 py-1 rounded text-xs ${
          rowData.isSubscribed
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {rowData.isSubscribed ? "Subscribed" : "Unsubscribed"}
      </span>
    );
  };

  const dateBodyTemplate = (rowData: any) => {
    return dayjs(rowData.subscribedAt).format(APP_DATE_FORMAT);
  };

  const actionsBodyTemplate = (rowData: any) => {
    return (
      <Button
        icon={<Trash2 size={16} />}
        className="p-button-rounded p-button-text p-button-danger"
        onClick={() => handleDeleteSubscriber(rowData)}
        tooltip="Remove"
      />
    );
  };

  const campaignDateBodyTemplate = (rowData: any) => {
    return dayjs(rowData.sentAt).format(APP_DATE_FORMAT);
  };

  const campaignStatsBodyTemplate = (rowData: any) => {
    return <span className="text-sm">{rowData.recipientCount} recipients</span>;
  };

  return (
    <div className="newsletter-page">
      <PageHeader
        title="Newsletter Management"
        subtitle="Manage newsletter subscribers and campaigns"
        icon={<Mail className="w-6 h-6" />}
      />

      <ConfirmDialog />

      <SendNewsletterDialog
        visible={sendDialogVisible}
        onHide={() => setSendDialogVisible(false)}
        onSuccess={handleSendSuccess}
        subscriberCount={subscribers.filter((s: any) => s.isSubscribed).length}
      />

      <div className="mt-6">
        <TabView
          activeIndex={activeTab}
          onTabChange={(e) => setActiveTab(e.index)}
        >
          {/* Subscribers Tab */}
          <TabPanel
            header={
              <span className="flex items-center gap-2">
                <Users size={16} />
                Subscribers ({subscribers.length})
              </span>
            }
          >
            <Card>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex-1">
                  <InputText
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by email..."
                    className="w-full"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Dropdown
                  value={statusFilter}
                  options={statusOptions}
                  onChange={(e) => {
                    setStatusFilter(e.value);
                    setTimeout(fetchSubscribers, 100);
                  }}
                  placeholder="Filter by status"
                />
                <Button
                  label="Search"
                  icon={<Eye size={16} />}
                  onClick={handleSearch}
                />
                <Button
                  label="Export CSV"
                  icon={<FileDown size={16} />}
                  className="p-button-secondary"
                  onClick={() => handleExport("csv")}
                />
                <Button
                  label="Export Excel"
                  icon={<FileDown size={16} />}
                  className="p-button-secondary"
                  onClick={() => handleExport("excel")}
                />
              </div>

              <DataTable
                value={subscribers}
                paginator
                rows={20}
                loading={loading}
                emptyMessage="No subscribers found"
                className="p-datatable-sm"
              >
                <Column field="email" header="Email" sortable />
                <Column header="Name" body={nameBodyTemplate} sortable />
                <Column header="Status" body={statusBodyTemplate} sortable />
                <Column
                  header="Subscribed Date"
                  body={dateBodyTemplate}
                  sortable
                />
                <Column
                  header="Actions"
                  body={actionsBodyTemplate}
                  style={{ width: "100px" }}
                />
              </DataTable>
            </Card>
          </TabPanel>

          {/* Send Newsletter Tab */}
          <TabPanel
            header={
              <span className="flex items-center gap-2">
                <Send size={16} />
                Send Newsletter
              </span>
            }
          >
            <Card>
              <div className="text-center py-8">
                <Mail size={64} className="mx-auto text-blue-500 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">
                  Send Newsletter to All Subscribers
                </h3>
                <p className="text-gray-600 mb-6">
                  You have <strong>{subscribers.filter((s: any) => s.isSubscribed).length}</strong> active
                  subscribers ready to receive your newsletter.
                </p>
                <Button
                  label="Compose Newsletter"
                  icon={<Plus size={16} />}
                  className="p-button-lg"
                  onClick={() => setSendDialogVisible(true)}
                  disabled={subscribers.filter((s: any) => s.isSubscribed).length === 0}
                />
                {subscribers.filter((s: any) => s.isSubscribed).length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    No active subscribers to send newsletter to
                  </p>
                )}
              </div>
            </Card>
          </TabPanel>

          {/* Campaign History Tab */}
          <TabPanel
            header={
              <span className="flex items-center gap-2">
                <Mail size={16} />
                Campaign History
              </span>
            }
          >
            <Card>
              <DataTable
                value={campaigns}
                paginator
                rows={20}
                loading={loading}
                emptyMessage="No campaigns found"
                className="p-datatable-sm"
              >
                <Column field="subject" header="Subject" sortable />
                <Column
                  header="Sent Date"
                  body={campaignDateBodyTemplate}
                  sortable
                />
                <Column
                  header="Recipients"
                  body={campaignStatsBodyTemplate}
                  sortable
                />
                <Column field="status" header="Status" sortable />
              </DataTable>
            </Card>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default NewsletterPage;
