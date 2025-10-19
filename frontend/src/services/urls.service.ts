import { Response } from '@/types/response';
import { ShortenedUrl } from '@/types/url';

import { axios } from '../utils/custom-axios';

const API_URL = import.meta.env.VITE_API_URL;

const createUrlGuest = async (longUrl: string) => {
  const queryString = `${API_URL}/urls`;

  const res = await axios.post(queryString, {
    longUrl,
  });

  const data: Response<Omit<ShortenedUrl, 'deleted'>> = res.data;
  return data;
};

const getAllUrls = async (type = 'all') => {
  const queryString = `${API_URL}/urls?type=${type}`;

  const res = await axios.get(queryString);

  const data: Response<{
    records: number;
    items: Array<ShortenedUrl>;
    page: number;
    totalPages: number;
  }> = res.data;
  return data;
};

const getUrlByHash = async (hash: string) => {
  const queryString = `${API_URL}/urls/${hash}`;

  const res = await axios.get(queryString);

  const data: Response<ShortenedUrl> = res.data;
  return data;
};

const updateUrlByHash = async (hash: string, alias: string) => {
  const queryString = `${API_URL}/urls/${hash}`;

  const res = await axios.put(queryString, { alias });

  const data: Response<ShortenedUrl> = res.data;
  return data;
};

const deleteUrlByHash = async (hash: string) => {
  const queryString = `${API_URL}/urls/${hash}`;

  await axios.delete(queryString);
};

const createUrlUser = async (
  userId: string,
  longUrl: string,
  alias?: string,
) => {
  const queryString = `${API_URL}/users/${userId}/urls`;

  const res = await axios.post(queryString, {
    longUrl,
    alias,
  });

  const data: Response<ShortenedUrl & 'userId'> = res.data;
  return data;
};

const getAllUrlsUser = async (
  userId: string,
  type = 'all',
  page = 1,
  size = 10,
) => {
  const queryString = `${API_URL}/users/${userId}/urls?type=${type}&page=${page}&size=${size}`;

  const res = await axios.get(queryString);

  const data: Response<{
    records: number;
    items: Array<ShortenedUrl>;
    page: number;
    totalPages: number;
  }> = res.data;
  return data;
};

const getUrlByHashUser = async (userId: string, hash: string) => {
  const queryString = `${API_URL}/users/${userId}/urls/${hash}`;

  const res = await axios.get(queryString);

  const data: Response<ShortenedUrl> = res.data;
  return data;
};

const updateUrlByHashUser = async (
  userId: string,
  hash: string,
  alias: string,
) => {
  const queryString = `${API_URL}/users/${userId}/urls/${hash}`;

  const res = await axios.put(queryString, { alias });

  const data: Response<ShortenedUrl> = res.data;
  return data;
};

const deleteUrlByHashUser = async (userId: string, hash: string) => {
  const queryString = `${API_URL}/users/${userId}/urls/${hash}`;

  const res = await axios.delete(queryString);

  const data: Response<ShortenedUrl> = res.data;
  return data;
};

const createUrlCampaign = async (
  userId: string,
  campaignId: string,
  longUrl: string,
  alias?: string,
) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/${campaignId}/urls`;

  const res = await axios.post(queryString, {
    longUrl,
    alias,
  });

  const data: Response<ShortenedUrl & 'userId'> = res.data;
  return data;
};

const getCampaignStats = async (userId: string, campaignId: string) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/${campaignId}/urls/stats`;

  const res = await axios.get(queryString);

  const data: Response<{
    urls: Array<ShortenedUrl>;
    totalClickCount: number;
    totalShortenedLinks: number;
  }> = res.data;
  return data;
};

const getAllUrlsCampaign = async (
  userId: string,
  campaignId: string,
  type = 'all',
  page = 1,
  size = 10,
) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/${campaignId}/urls?type=${type}&page=${page}&size=${size}`;

  const res = await axios.get(queryString);

  const data: Response<{
    records: number;
    items: Array<ShortenedUrl>;
    page: number;
    totalPages: number;
  }> = res.data;
  return data;
};

const getAllUrlClicksCampaign = async (
  userId: string,
  campaignId: string,
  hash: string,
  page = 1,
  size = 10,
) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/${campaignId}/urls/${hash}/clicks?&page=${page}&size=${size}`;

  const res = await axios.get(queryString);

  const data: Response<{
    records: number;
    items: Array<{
      clickedAt: string;
      platform: string;
      userAgent: string;
    }>;
    page: number;
    totalPages: number;
  }> = res.data;
  return data;
};

const getUrlByHashCampaign = async (
  userId: string,
  campaignId: string,
  hash: string,
) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/${campaignId}/urls/${hash}`;

  const res = await axios.get(queryString);

  const data: Response<ShortenedUrl> = res.data;
  return data;
};

const updateUrlByHashCampaign = async (
  userId: string,
  campaignId: string,
  hash: string,
  alias: string,
) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/${campaignId}/urls/${hash}`;

  const res = await axios.put(queryString, { alias });

  const data: Response<ShortenedUrl> = res.data;
  return data;
};

const deleteUrlByHashCampaign = async (
  userId: string,
  campaignId: string,
  hash: string,
) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/${campaignId}/urls/${hash}`;

  const res = await axios.delete(queryString);

  const data: Response<ShortenedUrl> = res.data;
  return data;
};

const UrlsService = {
  createUrlGuest,
  getAllUrls,
  getUrlByHash,
  updateUrlByHash,
  deleteUrlByHash,

  createUrlUser,
  getAllUrlsUser,
  getUrlByHashUser,
  updateUrlByHashUser,
  deleteUrlByHashUser,

  createUrlCampaign,
  getCampaignStats,
  getAllUrlsCampaign,
  getAllUrlClicksCampaign,
  getUrlByHashCampaign,
  updateUrlByHashCampaign,
  deleteUrlByHashCampaign,
};

export default UrlsService;
