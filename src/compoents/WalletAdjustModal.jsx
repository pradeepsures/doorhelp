import React, { useState, useEffect } from "react";
import { FiX, FiSearch, FiUser, FiCheck, FiAlertCircle } from "react-icons/fi";
import { adjustUserWallet, getUsers } from "../Services/userService";
import { adjustVendorWallet, getVendors } from "../Services/vendorService";
import toast from "react-hot-toast";

export default function WalletAdjustModal({
  isOpen,
  onClose,
  entityType = "user", // "user" or "vendor"
  targetEntity = null, // pre-selected entity object
  onSuccess
}) {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [type, setType] = useState("credit"); // "credit" or "debit"
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (targetEntity) {
        setSelectedEntity(targetEntity);
        setSearchQuery(`${targetEntity.name || ""} (${targetEntity.phoneNumber || ""})`);
      } else {
        setSelectedEntity(null);
        setSearchQuery("");
      }
      setType("credit");
      setAmount("");
      setDescription("");
      setIsDropdownOpen(false);
    }
  }, [isOpen, targetEntity]);

  // Handle live search for searchable dropdown
  useEffect(() => {
    if (!isOpen || selectedEntity) return;

    const delaySearch = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        setSearching(true);
        if (entityType === "user") {
          const res = await getUsers(1, searchQuery.trim());
          setSearchResults(res.data || []);
        } else {
          const res = await getVendors(1, searchQuery.trim());
          setSearchResults(res.data || []);
        }
        setIsDropdownOpen(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, entityType, isOpen, selectedEntity]);

  if (!isOpen) return null;

  const currentBalance = Number(selectedEntity?.walletBalance) || 0;
  const numAmount = Number(amount) || 0;
  const previewBalance = type === "credit"
    ? Math.round((currentBalance + numAmount) * 100) / 100
    : Math.round((currentBalance - numAmount) * 100) / 100;

  const isDebitExceeded = type === "debit" && numAmount > currentBalance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEntity?._id) {
      toast.error(`Please select a ${entityType === "user" ? "user" : "partner"}`);
      return;
    }

    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }

    if (isDebitExceeded) {
      toast.error(`Cannot debit ₹${numAmount}. Current balance is only ₹${currentBalance}`);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        amount: numAmount,
        type,
        description: description.trim() || `Admin manual ${type}`
      };

      if (entityType === "user") {
        await adjustUserWallet(selectedEntity._id, payload);
        toast.success(`User wallet ${type === "credit" ? "credited" : "debited"} with ₹${numAmount}`);
      } else {
        await adjustVendorWallet(selectedEntity._id, payload);
        toast.success(`Partner wallet ${type === "credit" ? "credited" : "debited"} with ₹${numAmount}`);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Error adjusting wallet:", err);
      toast.error(err.message || "Failed to update wallet balance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0D877F]/10 text-[#0D877F]">
              <FiUser size={20} />
            </span>
            Manage {entityType === "user" ? "User" : "Partner"} Wallet
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Credit or debit balance directly to {entityType === "user" ? "user's" : "partner's"} DoorHelp wallet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Searchable Dropdown / Target Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Select {entityType === "user" ? "Customer" : "Partner"}
            </label>

            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-gray-50/50 focus-within:ring-2 focus-within:ring-[#0D877F] focus-within:border-transparent transition-all">
                <FiSearch className="text-gray-400 mr-2" size={16} />
                <input
                  type="text"
                  placeholder={`Search ${entityType === "user" ? "user" : "partner"} by name or phone...`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedEntity(null);
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0) setIsDropdownOpen(true);
                  }}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                />
                {selectedEntity && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEntity(null);
                      setSearchQuery("");
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 font-semibold ml-2"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && !selectedEntity && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto z-50 divide-y divide-gray-100">
                  {searching ? (
                    <div className="p-3 text-center text-xs text-gray-400">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          setSelectedEntity(item);
                          setSearchQuery(`${item.name || "N/A"} (${item.phoneNumber || "N/A"})`);
                          setIsDropdownOpen(false);
                        }}
                        className="p-2.5 hover:bg-[#0D877F]/5 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.name || "N/A"}</p>
                          <p className="text-xs text-gray-500">{item.phoneNumber || "No phone"} | {item.email || ""}</p>
                        </div>
                        <span className="text-xs font-bold text-[#0D877F] bg-[#0D877F]/10 px-2 py-0.5 rounded-md">
                          ₹{item.walletBalance !== undefined ? item.walletBalance : 0}
                        </span>
                      </div>
                    ))
                  ) : searchQuery.trim() ? (
                    <div className="p-3 text-center text-xs text-gray-500">No {entityType} found</div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Selected Info Card */}
            {selectedEntity && (
              <div className="mt-2.5 p-3 bg-[#0D877F]/5 border border-[#0D877F]/20 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#0D877F] uppercase tracking-wider block">Target Account</span>
                  <p className="text-sm font-bold text-gray-800">{selectedEntity.name || "N/A"}</p>
                  <p className="text-xs text-gray-500">{selectedEntity.phoneNumber || "N/A"}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase block">Current Wallet</span>
                  <span className="text-base font-extrabold text-[#0D877F]">₹{currentBalance}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Type: Credit or Debit */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Action Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("credit")}
                className={`py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === "credit"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs ring-1 ring-emerald-500"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Credit (+ Add)
              </button>

              <button
                type="button"
                onClick={() => setType("debit")}
                className={`py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === "debit"
                    ? "bg-rose-50 border-rose-500 text-rose-700 shadow-xs ring-1 ring-rose-500"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Debit (- Deduct)
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base">₹</span>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="e.g. 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[#0D877F] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Reason / Remarks (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Promotional bonus, cancellation refund, penalty adjustment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-[#0D877F] focus:border-transparent outline-none transition-all placeholder-gray-400"
            />
          </div>

          {/* Preview Warning / Summary */}
          {numAmount > 0 && selectedEntity && (
            <div className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
              isDebitExceeded
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}>
              <div className="flex items-center gap-2">
                {isDebitExceeded ? (
                  <FiAlertCircle className="text-rose-600 shrink-0" size={16} />
                ) : (
                  <FiCheck className="text-emerald-600 shrink-0" size={16} />
                )}
                <span>
                  {isDebitExceeded
                    ? "Debit amount exceeds current wallet balance!"
                    : `Resulting balance after ${type}:`}
                </span>
              </div>
              <strong className="text-sm font-extrabold ml-2">
                ₹{previewBalance}
              </strong>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || isDebitExceeded || !numAmount || !selectedEntity}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                type === "credit"
                  ? "bg-[#0D877F] hover:bg-[#0B726B]"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {submitting ? "Processing..." : type === "credit" ? `Credit ₹${numAmount || 0}` : `Debit ₹${numAmount || 0}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
