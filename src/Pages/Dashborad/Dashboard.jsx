import React from "react";
import {
  FaTruck,
  FaRecycle,
  FaUsers,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaStore,
  FaTrash,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", waste: 40 },
  { name: "Tue", waste: 30 },
  { name: "Wed", waste: 50 },
  { name: "Thu", waste: 70 },
  { name: "Fri", waste: 60 },
  { name: "Sat", waste: 90 },
  { name: "Sun", waste: 100 },
];

// 🔹 Reusable Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
  gradientFrom,
  gradientTo,
}) => (
  <div className="relative group overflow-hidden shadow-xl rounded-2xl bg-white p-6 flex items-center gap-5 hover:shadow-2xl transition duration-300">
    <div
      className={`flex items-center justify-center w-16 h-16 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
      style={{ backgroundColor: color }}
    >
      <Icon className="text-3xl" />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-700 group-hover:text-green-700 transition-colors">
        {title}
      </h2>
      <p className="text-3xl font-extrabold text-green-800 mt-1 group-hover:scale-110 transition-transform duration-300">
        {value}
      </p>
    </div>
    {/* Decorative gradient blur */}
    <div
      className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 blur-2xl"
      style={{
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
      }}
    ></div>
    <div
      className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20 blur-3xl"
      style={{
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
      }}
    ></div>
  </div>
);

export default function WasteDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">
          Bharat Metal Grid Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaUsers}
          title="Total Customers"
          value="1,220"
          color="#16a34a"
          gradientFrom="#22c55e"
          gradientTo="#86efac"
        />
        <StatCard
          icon={FaStore}
          title="Total Vendors"
          value="120"
          color="#f97316"
          gradientFrom="#fb923c"
          gradientTo="#fed7aa"
        />
        <StatCard
          icon={FaTrash}
          title="Total Waste Collection"
          value="1,020"
          color="#0ea5e9"
          gradientFrom="#38bdf8"
          gradientTo="#bae6fd"
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Total Payment"
          value="₹10,020"
          color="#eab308"
          gradientFrom="#facc15"
          gradientTo="#fef08a"
        />
        <StatCard
          icon={FaTruck}
          title="Active Trucks"
          value="24"
          color="#16a34a"
          gradientFrom="#22c55e"
          gradientTo="#bbf7d0"
        />
        <StatCard
          icon={FaRecycle}
          title="Waste Collected"
          value="12.5 Tons"
          color="#0d9488"
          gradientFrom="#14b8a6"
          gradientTo="#99f6e4"
        />
        <StatCard
          icon={FaUsers}
          title="Households Served"
          value="8,932"
          color="#a855f7"
          gradientFrom="#c084fc"
          gradientTo="#f3e8ff"
        />
        <StatCard
          icon={FaMapMarkerAlt}
          title="Zones Covered"
          value="12"
          color="#dc2626"
          gradientFrom="#ef4444"
          gradientTo="#fecaca"
        />
      </div>

      {/* Chart */}
      <div className="shadow-lg rounded-2xl bg-white p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-800">
          Weekly Waste Collection (Tons)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="waste" fill="#16a34a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
