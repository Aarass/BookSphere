export interface UserRecommendationListDto {
  _id?: string;
  neo4jUserId: string;
  description: string;
  bookIsbns: string[];
  createdAt: Date;
}