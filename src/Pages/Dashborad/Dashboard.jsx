import React from "react";
import { FiUsers, FiBriefcase, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { motion } from "framer-motion";

const earningData = [
  { day: "Mon", earnings: 4000 },
  { day: "Tue", earnings: 5500 },
  { day: "Wed", earnings: 3200 },
  { day: "Thu", earnings: 6800 },
  { day: "Fri", earnings: 7100 },
  { day: "Sat", earnings: 8500 },
  { day: "Sun", earnings: 9300 },
];

const stats = [
  { title: "Total Users", value: "12,450", icon: FiUsers, color: "bg-blue-100 text-blue-600" },
  { title: "Total Partners", value: "3,820", icon: FiBriefcase, color: "bg-[#0D877F]/20 text-[#0D877F]" },
  { title: "Total Earnings", value: "₹4,25,000", icon: FiDollarSign, color: "bg-yellow-100 text-yellow-600" },
  { title: "Active Bookings", value: "842", icon: FiTrendingUp, color: "bg-purple-100 text-purple-600" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's a summary of DoorHelp's performance.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-4 rounded-full ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Weekly Earnings</h2>
              <p className="text-sm text-gray-500">Revenue generated over the last 7 days</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#0D877F] focus:border-[#0D877F] block p-2 outline-none">
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D877F" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0D877F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 14 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 14 }}
                  tickFormatter={(value) => `₹${value}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                  formatter={(value) => [`₹${value}`, "Earnings"]}
                  labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#0D877F" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEarnings)" 
                  activeDot={{ r: 8, fill: "#0D877F", stroke: "#fff", strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
