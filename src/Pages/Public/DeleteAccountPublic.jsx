import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { 
  ShieldAlert, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft, 
  Phone, 
  KeyRound, 
  Users, 
  UserCheck 
} from "lucide-react";
import { sendDeletionOtp, verifyAndPerformDeletion } from "../../Services/deleteAccountService";

const DeleteAccountPublic = () => {
  const [role, setRole] = useState("user"); // 'user' or 'vendor'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = input phone, 2 = verify OTP, 3 = deleted success
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setLoading(true);
    try {
      await sendDeletionOtp(phoneNumber.trim(), role);
      toast.success(`OTP sent to ${phoneNumber}`);
      setStep(2);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP. Please check the number.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndDelete = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      await verifyAndPerformDeletion(phoneNumber.trim(), role, otp.trim());
      toast.success("Account deleted successfully!");
      setStep(3);
    } catch (error) {
      toast.error(error.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-550 flex items-center justify-center p-4 md:p-8 font-sans bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-zinc-950">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-6 md:p-8 relative z-10 text-slate-200">
        
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-rose-500/10 text-rose-500 rounded-full mb-3">
                <Trash2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Delete Account</h1>
              <p className="text-slate-400 text-sm mt-1">
                Initiate account deletion for Users and Vendors
              </p>
            </div>

            {/* Warning Alert Block */}
            {/* <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6 flex gap-3 text-slate-350 text-xs leading-relaxed">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <strong className="text-rose-400 block font-semibold mb-0.5">Warning: This action is permanent!</strong>
                Deleting your account will result in the loss of all your booking history, profile details, and any active wallet balance. This cannot be undone.
              </div>
            </div> */}

            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Role Toggle Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      role === "user"
                        ? "bg-teal-600 text-white shadow-md shadow-teal-900/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-zinc-900"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("vendor")}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      role === "vendor"
                        ? "bg-teal-600 text-white shadow-md shadow-teal-900/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-zinc-900"
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    Vendor
                  </button>
                </div>
              </div>

              {/* Identifier Input */}
              <div>
                <label htmlFor="phone" className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Phone Number or Registered Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <Phone className="w-4.5 h-4.5" />
                  </span>
                  <input
                    id="phone"
                    type="text"
                    placeholder="Enter phone number or name"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-slate-650 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-555 active:bg-teal-700 disabled:bg-teal-800 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-teal-900/30 transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Request Verification OTP"
                )}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-teal-550/10 text-teal-400 rounded-full mb-3">
                <KeyRound className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Verify Deletion</h1>
              <p className="text-slate-400 text-sm mt-1">
                We've sent a code to <span className="text-teal-400 font-semibold">{phoneNumber}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyAndDelete} className="space-y-5">
              <div>
                <label htmlFor="otp" className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                  Enter 4-Digit OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 text-center tracking-widest text-xl font-bold text-white placeholder-slate-700 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 disabled:bg-rose-800 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-rose-900/30 transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      Deleting Account...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4.5 h-4.5" />
                      Confirm Permanent Deletion
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="w-full bg-transparent hover:bg-zinc-800 border border-zinc-800 text-slate-300 font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Account Deleted</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The {role} account linked with <span className="text-slate-200 font-semibold">{phoneNumber}</span> has been soft deleted successfully.
            </p>
            <button
              onClick={() => {
                setPhoneNumber("");
                setOtp("");
                setStep(1);
              }}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 text-sm cursor-pointer"
            >
              Start New Deletion
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DeleteAccountPublic;
