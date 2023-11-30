export interface User {
  xp: number;
  level: number;
  warnings: {
    id: string;
    guildId: string;
    moderatorId: string;
    reason: string;
    createdAt: number;
  }[];
}
