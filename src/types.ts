export interface AppConfig {
  profileTitle: string; // Title shown at the top (e.g. name of the owner)
  profileImage: string; // URL of a profile photo or avatar
  description: string;  // Custom details written by the owner
  backgroundImage: string; // URL of the background image
  musicUrl: string; // URL of the background music
  musicTitle: string; // Name of the song
  tiktokUrl: string; // TikTok link
  steamUrl: string; // Steam link
  discordUrl: string; // Discord link (server or profile)
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
