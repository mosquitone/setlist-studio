export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number | null;
  key: string | null;
  tempo: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SetlistItem {
  id: string;
  title: string;
  note: string | null;
  order: number;
}

export interface Setlist {
  id: string;
  title: string;
  artistName: string | null;
  eventName: string | null;
  eventDate: string | null;
  openTime: string | null;
  startTime: string | null;
  theme: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  items: SetlistItem[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface GetSetlistsResponse {
  setlists: Setlist[];
}

export interface NewSongInfo {
  count: number;
  titles: string[];
}

export interface CreateSetlistResult {
  setlist: Setlist;
  newSongs: NewSongInfo;
}

export interface UpdateSetlistResult {
  setlist: Setlist;
  newSongs: NewSongInfo;
}

// GraphQL mutation response types
export interface CreateSetlistData {
  createSetlist: CreateSetlistResult;
}

export interface UpdateSetlistData {
  updateSetlist: UpdateSetlistResult;
}

export interface GetSongsResponse {
  songs: Song[];
}

export interface GetSetlistResponse {
  setlist: Setlist;
}

// Authentication Response Types
export interface RegistrationResponse {
  success: boolean;
  message: string;
  email: string;
  requiresEmailVerification: boolean;
  token?: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export interface EmailVerificationStatusResponse {
  isVerified: boolean;
  canLogin?: boolean;
}

export interface EmailChangeResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface PasswordResetTokenInfo {
  email: string;
  isValid: boolean;
}

// GraphQL mutation response wrapper types
export interface LoginData {
  login: AuthPayload;
}

export interface RegisterData {
  register: RegistrationResponse;
}

export interface ResetPasswordData {
  resetPassword: PasswordResetResponse;
}

export interface RequestPasswordResetData {
  requestPasswordReset: PasswordResetResponse;
}

export interface VerifyEmailData {
  verifyEmail: EmailVerificationResponse;
}

export interface ResendVerificationEmailData {
  resendVerificationEmail: EmailVerificationResponse;
}

export interface CheckEmailVerificationStatusData {
  checkEmailVerificationStatus: EmailVerificationStatusResponse;
}

export interface ConfirmEmailChangeData {
  confirmEmailChange: EmailChangeResponse;
}

export interface RequestEmailChangeData {
  requestEmailChange: EmailChangeResponse;
}

export interface ChangePasswordData {
  changePassword: ChangePasswordResponse;
}

export interface UpdateUserData {
  updateUser: User;
}

export interface ToggleSetlistVisibilityData {
  toggleSetlistVisibility: Setlist;
}
