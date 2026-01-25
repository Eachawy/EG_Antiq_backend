import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Send, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { sendNewsletter } from "./newsletter.reducer";
import { toast } from "react-toastify";

interface SendNewsletterDialogProps {
  visible: boolean;
  onHide: () => void;
  onSuccess: () => void;
  subscriberCount: number;
}

const SendNewsletterDialog: React.FC<SendNewsletterDialogProps> = ({
  visible,
  onHide,
  onSuccess,
  subscriberCount,
}) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    htmlContent: "",
  });

  const sendingNewsletter = useAppSelector(
    (state) => state.Newsletter.sendingNewsletter,
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSend = () => {
    // Validation
    if (!formData.subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!formData.htmlContent.trim()) {
      toast.error("HTML Content is required");
      return;
    }

    // Auto-generate plain text content from HTML if not provided
    let plainTextContent = formData.content.trim();
    if (!plainTextContent) {
      // Strip HTML tags to create plain text fallback
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = formData.htmlContent;
      plainTextContent =
        tempDiv.textContent || tempDiv.innerText || formData.subject;
    }

    const newsletterData = {
      subject: formData.subject,
      content: plainTextContent,
      htmlContent: formData.htmlContent,
    };

    confirmDialog({
      message: `Are you sure you want to send this newsletter to ${subscriberCount} subscribers? This action cannot be undone.`,
      header: "Confirm Send Newsletter",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      async accept() {
        try {
          await dispatch(sendNewsletter(newsletterData)).unwrap();

          // Reset form
          setFormData({
            subject: "",
            content: "",
            htmlContent: "",
          });

          onSuccess();
        } catch (error: any) {
          toast.error(error?.message || "Failed to send newsletter");
        }
      },
    });
  };

  const handleClose = () => {
    setFormData({
      subject: "",
      content: "",
      htmlContent: "",
    });
    onHide();
  };

  const getDefaultHtmlTemplate = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.subject || "Newsletter"}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #007bff;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    h1 {
      margin: 0;
      font-size: 24px;
    }
    h2 {
      color: #007bff;
      font-size: 20px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    a {
      color: #007bff;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>EG Antiq Newsletter</h1>
    <p>Ancient Egypt Discoveries & Insights</p>
  </div>
  <div class="content">
    <h2>${formData.subject || "Newsletter Title"}</h2>
    <p>${formData.content || "Your newsletter content goes here..."}</p>

    <!-- Add your content sections here -->

  </div>
  <div class="footer">
    <p>© 2026 EG Antiq. All rights reserved.</p>
  </div>
</body>
</html>`;
  };

  const useTemplate = () => {
    setFormData((prev) => ({
      ...prev,
      htmlContent: getDefaultHtmlTemplate(),
    }));
    toast.success("Template applied! You can now customize the HTML.");
  };

  const footer = (
    <div className="flex justify-between">
      <Button
        label="Cancel"
        icon={<X size={16} />}
        onClick={handleClose}
        className="p-button-text"
        disabled={sendingNewsletter}
      />
      <Button
        label={`Send to ${subscriberCount} Subscribers`}
        icon={<Send size={16} />}
        onClick={handleSend}
        loading={sendingNewsletter}
        disabled={!formData.subject || !formData.htmlContent}
      />
    </div>
  );

  return (
    <>
      <ConfirmDialog />
      <Dialog
        visible={visible}
        onHide={handleClose}
        header="Compose Newsletter"
        footer={footer}
        style={{ width: "90vw", maxWidth: "900px" }}
        modal
        closable={!sendingNewsletter}
      >
        <div className="space-y-4">
          {/* Subject Line */}
          <div className="field">
            <label htmlFor="subject" className="font-semibold">
              Subject Line <span className="text-red-500">*</span>
            </label>
            <InputText
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="e.g., Ancient Egypt Discoveries - January 2026"
              className="w-full mt-2"
              maxLength={500}
              disabled={sendingNewsletter}
            />
            <small className="text-gray-500">
              {formData.subject.length}/500 characters
            </small>
          </div>

          <Divider />

          {/* Content Tabs */}
          <TabView>
            <TabPanel header="Plain Text Content">
              <div className="field">
                <label htmlFor="content" className="font-semibold">
                  Plain Text Content{" "}
                  <span className="text-gray-400">(Optional)</span>
                </label>
                <small className="block text-gray-500 mb-2">
                  Fallback for email clients that don&apos;t support HTML. If
                  empty, will be auto-generated from HTML content.
                </small>
                <InputTextarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="Enter your newsletter content in plain text..."
                  rows={10}
                  className="w-full"
                  disabled={sendingNewsletter}
                />
              </div>
            </TabPanel>

            <TabPanel header="HTML Content">
              <div className="field">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="htmlContent" className="font-semibold">
                    HTML Content <span className="text-red-500">*</span>
                  </label>
                  <Button
                    label="Use Template"
                    size="small"
                    className="p-button-sm p-button-outlined"
                    onClick={useTemplate}
                    disabled={sendingNewsletter}
                  />
                </div>
                <small className="block text-gray-500 mb-2">
                  Write or paste your HTML newsletter content. You can use the
                  template button to get started.
                </small>
                <InputTextarea
                  id="htmlContent"
                  value={formData.htmlContent}
                  onChange={(e) => handleChange("htmlContent", e.target.value)}
                  placeholder="<html>...</html>"
                  rows={15}
                  className="w-full font-mono text-sm"
                  disabled={sendingNewsletter}
                  style={{ fontFamily: "monospace" }}
                />
              </div>
            </TabPanel>

            <TabPanel header="Preview">
              <div className="field">
                <label className="font-semibold">HTML Preview</label>
                <div
                  className="mt-2 p-4 border rounded bg-white"
                  style={{
                    minHeight: "400px",
                    maxHeight: "600px",
                    overflow: "auto",
                  }}
                  dangerouslySetInnerHTML={{ __html: formData.htmlContent }}
                />
              </div>
            </TabPanel>
          </TabView>

          <Divider />

          {/* Help Text */}
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              Tips for Writing Newsletters:
            </h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>
                Keep subject lines under 50 characters for better open rates
              </li>
              <li>Include a clear call-to-action (CTA)</li>
              <li>Make it mobile-friendly with responsive design</li>
              <li>
                Recommended frequency: Once per month for cultural/educational
                content
              </li>
              <li>Best sending time: Tuesday or Wednesday, 10-11 AM</li>
              <li>Unsubscribe links are automatically added to all emails</li>
            </ul>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SendNewsletterDialog;
