import React from 'react';
import { ArrowUp, ArrowDown, DollarSign, Users, Package, TrendingUp } from 'lucide-react';

const data = [
  { id: 1, product: 'Product A', sales: 1234, status: 'In Stock', trend: 'up' },
  { id: 2, product: 'Product B', sales: 856, status: 'Low Stock', trend: 'down' },
  { id: 3, product: 'Product C', sales: 2341, status: 'In Stock', trend: 'up' },
  { id: 4, product: 'Product D', sales: 654, status: 'Out of Stock', trend: 'down' },
  { id: 5, product: 'Product E', sales: 1789, status: 'In Stock', trend: 'up' },
];

function Dashboard() {
  return (
    <div className="space-y-6 pb-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-green-600">+12.5%</span>
          </div>
          <p className="mt-2 text-2xl font-bold">$24.5k</p>
          <p className="text-gray-500 text-sm">Total Sales</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-blue-600">+8.1%</span>
          </div>
          <p className="mt-2 text-2xl font-bold">1,234</p>
          <p className="text-gray-500 text-sm">Customers</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-purple-600">+23.4%</span>
          </div>
          <p className="mt-2 text-2xl font-bold">789</p>
          <p className="text-gray-500 text-sm">Products</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="bg-orange-100 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-orange-600">+15.2%</span>
          </div>
          <p className="mt-2 text-2xl font-bold">92.6%</p>
          <p className="text-gray-500 text-sm">Growth</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Product Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.product}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${item.sales}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'In Stock'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'Low Stock'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.trend === 'up' ? (
                      <ArrowUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowDown className="h-5 w-5 text-red-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;