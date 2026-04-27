import React from 'react'
import { Link, Routes, Route, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Search } from 'lucide-react'

// Dummy Admin Components
function DashboardHome() {
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: '$24,500' },
          { label: 'Total Orders', value: '142' },
          { label: 'Total Products', value: '86' },
          { label: 'Total Users', value: '310' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-lg border border-brand-100 shadow-sm">
            <h3 className="text-brand-500 text-sm font-medium mb-2">{stat.label}</h3>
            <p className="text-2xl font-semibold text-brand-950">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-brand-100 shadow-sm">
        <h3 className="text-brand-950 font-serif font-bold text-lg mb-4">Recent Orders</h3>
        <table className="w-full text-left text-sm text-brand-600">
          <thead className="bg-brand-50 text-brand-950 uppercase text-xs tracking-wider border-b border-brand-100">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {[
              { id: '#ORD-001', name: 'John Doe', date: 'Oct 24, 2026', amount: '$120.00', status: 'Delivered' },
              { id: '#ORD-002', name: 'Jane Smith', date: 'Oct 23, 2026', amount: '$450.00', status: 'Processing' },
              { id: '#ORD-003', name: 'Alice Johnson', date: 'Oct 22, 2026', amount: '$85.00', status: 'Shipped' },
            ].map(order => (
              <tr key={order.id} className="hover:bg-brand-50 transition-colors">
                <td className="px-6 py-4 font-medium text-brand-950">{order.id}</td>
                <td className="px-6 py-4">{order.name}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4 font-medium text-brand-950">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className="bg-brand-100 text-brand-950 px-2 py-1 text-xs rounded-sm">{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProductsManager() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold">Products Management</h2>
        <button className="btn-primary py-2 text-sm">Add Product</button>
      </div>
      <div className="bg-white p-8 rounded-lg border border-brand-100 shadow-sm text-center">
        <p className="text-brand-500">Products table integration goes here.</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-brand-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-950 text-white flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-brand-800">
          <Link to="/" className="text-xl font-serif font-bold tracking-wider text-white">LAKSHMI ADMIN</Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-md bg-brand-800 text-white">
            <LayoutDashboard size={18} /><span>Dashboard</span>
          </Link>
          <Link to="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-md text-brand-400 hover:text-white hover:bg-brand-800 transition-colors">
            <Package size={18} /><span>Products</span>
          </Link>
          <Link to="/admin/orders" className="flex items-center space-x-3 px-4 py-3 rounded-md text-brand-400 hover:text-white hover:bg-brand-800 transition-colors">
            <ShoppingCart size={18} /><span>Orders</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-3 px-4 py-3 rounded-md text-brand-400 hover:text-white hover:bg-brand-800 transition-colors">
            <Users size={18} /><span>Customers</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-md text-brand-400 hover:text-white hover:bg-brand-800 transition-colors">
            <Settings size={18} /><span>Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-brand-800">
          <button className="flex items-center space-x-3 px-4 py-3 w-full text-left text-brand-400 hover:text-white transition-colors">
            <LogOut size={18} /><span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-brand-100 flex items-center justify-between px-8">
          <div className="flex items-center bg-brand-50 rounded-md px-3 py-2 w-64 border border-brand-200">
            <Search size={16} className="text-brand-400 mr-2" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <div className="flex items-center space-x-4 text-brand-600">
            <div className="w-8 h-8 bg-brand-950 text-white flex items-center justify-center rounded-full text-sm font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="*" element={<DashboardHome />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
