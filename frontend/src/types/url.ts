export type ShortenedUrl = {
  longUrl: string;
  hash: string;
  clickCount: number;
  createdAt: string;
  expiresAt: string;
  campaignId?: string;
  deleted: boolean;
};
