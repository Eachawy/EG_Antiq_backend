import axios from "axios";

export const getVerifiedRequest = async (url) => {
  const response = await axios.get(url);
  return response;
};

export const postVerifiedRequest = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

export const putVerifiedRequest = async (url, data) => {
  const response = await axios.patch(url, data);
  return response;
};

export const deleteVerifiedRequest = async (url, data) => {
  const response = await axios.delete(url, { data });
  return response;
};
