import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getSlotById, createSlot, updateSlot } from "../../Services/slotService";

const SlotForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [date, setDate] = useState("");
  const [slotType, setSlotType] = useState("morning");
  const [startTime, setStartTime] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    const getLocalDateString = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const today = new Date();
    setMinDate(getLocalDateString(today));
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    setMaxDate(getLocalDateString(nextWeek));
  }, []);

  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";
    const parts = time12h.split(" ");
    if (parts.length !== 2) return time12h;
    const [time, modifier] = parts;
    let [hours, minutes] = time.split(":");
    if (!hours || !minutes) return time12h;
    if (hours === "12") hours = "00";
    if (modifier.toUpperCase() === "PM") hours = parseInt(hours, 10) + 12;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const convertTo12Hour = (time24h) => {
    if (!time24h) return "";
    let [hours, minutes] = time24h.split(":");
    if (!hours || !minutes) return time24h;
    hours = parseInt(hours, 10);
    const modifier = hours >= 12 ? "PM" : "AM";
    if (hours === 0) hours = 12;
    else if (hours > 12) hours = hours - 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${modifier}`;
  };

  useEffect(() => {
    if (isEdit) {
      const fetchSlotDetails = async () => {
        setLoading(true);
        try {
          const res = await getSlotById(id);
          if (res.success) {
            // format date to YYYY-MM-DD
            if (res.data.date) {
              const formattedDate = new Date(res.data.date).toISOString().split("T")[0];
              setDate(formattedDate);
            }
            setSlotType(res.data.slotType || "morning");
            
            const timeStr = res.data.timeSlot || "";
            if (timeStr.includes("-")) {
              const [start] = timeStr.split("-");
              setStartTime(convertTo24Hour(start.trim()));
            } else if (timeStr) {
              setStartTime(convertTo24Hour(timeStr.trim()));
            } else {
              setStartTime("");
            }
            
            setStatus(res.data.status !== false);
          } else {
            toast.error(res.message || "Failed to load slot details");
            navigate("/home/slot");
          }
        } catch (err) {
          toast.error("Failed to fetch slot details");
          navigate("/home/slot");
        } finally {
          setLoading(false);
        }
      };

      fetchSlotDetails();
    } else {
      // Set default time slot for the morning type
      setStartTime("06:00");
    }
  }, [id, isEdit]);

  const handleSlotTypeChange = (newType) => {
    setSlotType(newType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      return toast.error("Date is required");
    }

    if (date < minDate || date > maxDate) {
      return toast.error("Date must be between today and the next 7 days");
    }

    if (!startTime) {
      return toast.error("Time is required");
    }

    setSubmitting(true);
    const payload = {
      date,
      slotType,
      timeSlot: convertTo12Hour(startTime),
      status
    };

    try {
      const res = isEdit
        ? await updateSlot(id, payload)
        : await createSlot(payload);

      if (res.success) {
        toast.success(`Slot ${isEdit ? "updated" : "created"} successfully`);
        navigate("/home/slot");
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 min-h-screen flex justify-center items-center">
        Loading slot details...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Time Slot" : "Add Time Slot"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEdit ? "Modify time slot settings" : "Create a new booking time slot"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Input */}
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700 bg-white"
                required
              />
            </div>

            {/* Slot Type */}
            <div>
              <label htmlFor="slotType" className="block text-sm font-semibold text-gray-700 mb-2">
                Slot Type
              </label>
              <select
                id="slotType"
                value={slotType}
                onChange={(e) => handleSlotTypeChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700 bg-white"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            {/* Time Picker */}
            <div>
              <label htmlFor="startTime" className="block text-sm font-semibold text-gray-700 mb-2">
                Time
              </label>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700 bg-white"
                required
              />
            </div>

            {/* Status Selector */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={status ? "true" : "false"}
                onChange={(e) => setStatus(e.target.value === "true")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700 bg-white"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/home/slot"
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#0D877F] text-white text-sm font-medium rounded-lg hover:bg-[#0b6f69] transition-all disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Time Slot"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SlotForm;
