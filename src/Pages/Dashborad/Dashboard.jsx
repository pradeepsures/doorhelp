// import React, { useEffect, useState } from "react";
// import { getDashboardStats } from "../../Services/dashboard";
// import {
//   FaTruck,
//   FaRecycle,
//   FaUsers,
//   FaMapMarkerAlt,
//   FaMoneyBillWave,
//   FaStore,
//   FaTrash,
// } from "react-icons/fa";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { name: "Mon", Payments: 40 },
//   { name: "Tue", Payments: 30 },
//   { name: "Wed", Payments: 50 },
//   { name: "Thu", Payments: 70 },
//   { name: "Fri", Payments: 60 },
//   { name: "Sat", Payments: 90 },
//   { name: "Sun", Payments: 100 },
// ];

// // 🔹 Reusable Stat Card Component
// const StatCard = ({
//   icon: Icon,
//   title,
//   value,
//   color,
//   gradientFrom,
//   gradientTo,
// }) => (
//   <div className="relative group overflow-hidden shadow-xl rounded-2xl bg-white p-6 flex items-center gap-5 hover:shadow-2xl transition duration-300">
//     <div
//       className={`flex items-center justify-center w-16 h-16 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
//       style={{ backgroundColor: color }}
//     >
//       <Icon className="text-3xl" />
//     </div>
//     <div>
//       <h2 className="text-lg font-semibold text-gray-700 group-hover:text-green-700 transition-colors">
//         {title}
//       </h2>
//       <p className="text-3xl font-extrabold text-green-800 mt-1 group-hover:scale-110 transition-transform duration-300">
//         {value}
//       </p>
//     </div>
//     {/* Decorative gradient blur */}
//     <div
//       className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 blur-2xl"
//       style={{
//         background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
//       }}
//     ></div>
//     <div
//       className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20 blur-3xl"
//       style={{
//         background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
//       }}
//     ></div>
//   </div>
// );

// export default function WasteDashboard() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-green-800">
//           Bharat Metal Grid Dashboard
//         </h1>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           icon={FaUsers}
//           title="Total Members"
//           value="1,220"
//           color="#16a34a"
//           gradientFrom="#22c55e"
//           gradientTo="#86efac"
//         />
//         <StatCard
//           icon={FaStore}
//           title="Total Associations"
//           value="120"
//           color="#f97316"
//           gradientFrom="#fb923c"
//           gradientTo="#fed7aa"
//         />
//         <StatCard
//           icon={FaMoneyBillWave}
//           title="Payment  Collections"
//           value="₹10,020"
//           color="#eab308"
//           gradientFrom="#facc15"
//           gradientTo="#fef08a"
//         />
//         <StatCard
//           icon={FaTruck}
//           title="Payment Due"
//           value="24"
//           color="#16a34a"
//           gradientFrom="#22c55e"
//           gradientTo="#bbf7d0"
//         />
//       </div>

//       {/* Chart */}
//       <div className="shadow-lg rounded-2xl bg-white p-6">
//         <h2 className="text-xl font-semibold mb-4 text-green-800">
//           Payment Collection
//         </h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={data}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="Payments" fill="#16a34a" radius={[8, 8, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../Services/dashboard";
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
  { name: "Mon", Payments: 40 },
  { name: "Tue", Payments: 30 },
  { name: "Wed", Payments: 50 },
  { name: "Thu", Payments: 70 },
  { name: "Fri", Payments: 60 },
  { name: "Sat", Payments: 90 },
  { name: "Sun", Payments: 100 },
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
      className="flex items-center justify-center w-16 h-16 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300"
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
  const [stats, setStats] = useState({
    activeMembers: 0,
    activeAssociations: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();

      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Dashboard API Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

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
          title="Total Members"
          value={ stats.activeMembers}
          color="#16a34a"
          gradientFrom="#22c55e"
          gradientTo="#86efac"
        />
        <StatCard
          icon={FaStore}
          title="Total Associations"
          value={ stats.activeAssociations}
          color="#f97316"
          gradientFrom="#fb923c"
          gradientTo="#fed7aa"
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Payment  Collections"
          value="₹10,020"
          color="#eab308"
          gradientFrom="#facc15"
          gradientTo="#fef08a"
        />
        <StatCard
          icon={FaTruck}
          title="Payment Due"
          value="24"
          color="#16a34a"
          gradientFrom="#22c55e"
          gradientTo="#bbf7d0"
        />
      </div>

      {/* Chart */}
      <div className="shadow-lg rounded-2xl bg-white p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-800">
          Payment Collection
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Payments" fill="#16a34a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
