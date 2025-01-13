export interface BookClub {
  id: string;
  tittle: string;
  description: string;
}

export interface BookClubWithMembershipStatus extends BookClub {
  isJoined: boolean;
}
