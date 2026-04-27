const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

export const API_URLS = {
  AUTH: {
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGIN: `${BASE_URL}/auth/login`,
    VERIFY_TWO_FACTOR: `${BASE_URL}/auth/verify-2fa`,
    SEND_TWO_FACTOR_CODE: `${BASE_URL}/auth/send-2fa-code`,
    RESEND_TWO_FACTOR_CODE: `${BASE_URL}/auth/resend-2fa`,
    GET_AUTH_DETAILS: `${BASE_URL}/auth/details`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    // Forgot password (unauthenticated — magic link)
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    VERIFY_FORGOT_PASSWORD: `${BASE_URL}/auth/verify-forgot-password`,
    // Reset password (authenticated — OTP)
    SEND_RESET_OTP: `${BASE_URL}/auth/send-reset-otp`,
    VERIFY_RESET_PASSWORD: `${BASE_URL}/auth/verify-reset-password`,
  },
  USERS: {
    COMPLETE_PROFILE: `${BASE_URL}/users/complete-profile`,
    UPDATE_PROFILE:   `${BASE_URL}/users/update-profile`,
  },
};
