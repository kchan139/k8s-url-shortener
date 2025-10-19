import { Campaign } from '@/types/campaign';
import { Response } from '@/types/response';

import { axios } from '../utils/custom-axios';

const API_URL = import.meta.env.VITE_API_URL;

const createCampaign = async (
  userId: string,
  name: string,
  endDate: string,
  description: string,
) => {
  const queryString = `${API_URL}/users/${userId}/campaigns`;

  const res = await axios.post(queryString, {
    name,
    endDate,
    description,
  });

  const data: Response<Campaign> = res.data;
  return data;
};

const getAllCampaigns = async (userId: string, page: number) => {
  const queryString = `${API_URL}/users/${userId}/campaigns?type=not_deleted&page=${page}`;

  const res = await axios.get(queryString);

  const data: Response<any> = res.data;
  console.log(data);
  return data;
};

const searchCampaigns = async (userId: string, campaignName: string) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/search?name=${campaignName}`;

  const res = await axios.get(queryString);

  const data: Response<any> = res.data;
  return data;
};

const getCampaignById = async (userId: string, campaignId: string) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/${campaignId}`;

  const res = await axios.get(queryString);

  const data: Response<Campaign> = res.data;
  return data;
};

const updateCampaign = async (
  userId: string,
  campaignId: string,
  name: string,
  endDate: string,
  description: string,
) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/${campaignId}`;

  const res = await axios.put(queryString, {
    name,
    endDate,
    description,
  });

  const data: Response<Campaign> = res.data;
  return data;
};

const deleteCampaign = async (userId: string, campaignId: string) => {
  const queryString = `${API_URL}/users/${userId}/campaigns/${campaignId}`;

  console.log(queryString);
  const res = await axios.delete(queryString);

  const data: Response<null> = res.data;
  return data;
};

const CampaignService = {
  createCampaign,
  getAllCampaigns,
  searchCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};

export default CampaignService;
