import {
  getVerifiedRequest,
  postVerifiedRequest,
  deleteVerifiedRequest,
} from "app/config/network-server-reducer";
import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { serializeAxiosError } from "app/shared/reducers/reducer.utils";
import {
  GET_Newsletter_Subscribers_API,
  GET_Newsletter_Statistics_API,
  DELETE_Newsletter_Subscriber_API,
  EXPORT_Newsletter_Subscribers_API,
  SEND_Newsletter_API,
  GET_Newsletter_Campaigns_API,
  GET_Newsletter_Campaign_Details_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  subscribers: null,
  statistics: null,
  campaigns: null,
  campaignDetails: null,
  sendingNewsletter: false,
};

export type INewsletterState = Readonly<typeof initialState>;

// Actions
export const getSubscribers = createAsyncThunk(
  "Newsletter/GET_SUBSCRIBERS",
  async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const url =
      queryParams.toString() !== ""
        ? `${GET_Newsletter_Subscribers_API}?${queryParams.toString()}`
        : GET_Newsletter_Subscribers_API;

    return getVerifiedRequest(url);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const getStatistics = createAsyncThunk(
  "Newsletter/GET_STATISTICS",
  async () => getVerifiedRequest(GET_Newsletter_Statistics_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteSubscriber = createAsyncThunk(
  "Newsletter/DELETE_SUBSCRIBER",
  async (id: string) =>
    deleteVerifiedRequest(`${DELETE_Newsletter_Subscriber_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const exportSubscribers = createAsyncThunk(
  "Newsletter/EXPORT_SUBSCRIBERS",
  async (format: "csv" | "excel") => {
    const url = `${EXPORT_Newsletter_Subscribers_API}?format=${format}`;
    // This will download the file
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `subscribers.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    return { success: true };
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const sendNewsletter = createAsyncThunk(
  "Newsletter/SEND_NEWSLETTER",
  async (data: { subject: string; content: string; htmlContent: string }) =>
    postVerifiedRequest(SEND_Newsletter_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const sendNewsletterWithTemplate = createAsyncThunk(
  "Newsletter/SEND_NEWSLETTER_TEMPLATE",
  async () => postVerifiedRequest(SEND_Newsletter_API, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const getCampaigns = createAsyncThunk(
  "Newsletter/GET_CAMPAIGNS",
  async (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url =
      queryParams.toString() !== ""
        ? `${GET_Newsletter_Campaigns_API}?${queryParams.toString()}`
        : GET_Newsletter_Campaigns_API;

    return getVerifiedRequest(url);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const getCampaignDetails = createAsyncThunk(
  "Newsletter/GET_CAMPAIGN_DETAILS",
  async (id: string) =>
    getVerifiedRequest(`${GET_Newsletter_Campaign_Details_API}/${id}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const NewsletterState = createSlice({
  name: "Newsletter",
  initialState: initialState as INewsletterState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get Subscribers
      .addCase(getSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload.data;
      })
      // Get Statistics
      .addCase(getStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      // Delete Subscriber
      .addCase(deleteSubscriber.fulfilled, (state) => {
        state.loading = false;
      })
      // Export Subscribers
      .addCase(exportSubscribers.fulfilled, (state) => {
        state.loading = false;
      })
      // Send Newsletter
      .addCase(sendNewsletter.pending, (state) => {
        state.sendingNewsletter = true;
        state.errorMessage = null;
      })
      .addCase(sendNewsletter.fulfilled, (state) => {
        state.sendingNewsletter = false;
      })
      .addCase(sendNewsletter.rejected, (state, action) => {
        state.sendingNewsletter = false;
        state.errorMessage = action.error.message;
      })
      // Send Newsletter with Template
      .addCase(sendNewsletterWithTemplate.pending, (state) => {
        state.sendingNewsletter = true;
        state.errorMessage = null;
      })
      .addCase(sendNewsletterWithTemplate.fulfilled, (state) => {
        state.sendingNewsletter = false;
      })
      .addCase(sendNewsletterWithTemplate.rejected, (state, action) => {
        state.sendingNewsletter = false;
        state.errorMessage = action.error.message;
      })
      // Get Campaigns
      .addCase(getCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data;
      })
      // Get Campaign Details
      .addCase(getCampaignDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignDetails = action.payload.data;
      })
      // Pending states
      .addMatcher(
        isPending(
          getSubscribers,
          getStatistics,
          deleteSubscriber,
          exportSubscribers,
          getCampaigns,
          getCampaignDetails,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getSubscribers,
          getStatistics,
          deleteSubscriber,
          exportSubscribers,
          getCampaigns,
          getCampaignDetails,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = NewsletterState.actions;

// Reducer
export default NewsletterState.reducer;
