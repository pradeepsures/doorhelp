const BASE_URL = import.meta.env.VITE_BASE_URL;

export const sendDeletionOtp = async (phoneNumber, role) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/public/delete-account/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber, role }),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to send OTP");
  }
  return result;
};

export const verifyAndPerformDeletion = async (phoneNumber, role, otp) => {
  const res = await fetch(`${BASE_URL}/api/v1/admin/public/delete-account/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber, role, otp }),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || result?.message || "Failed to verify OTP and delete account");
  }
  return result;
};
