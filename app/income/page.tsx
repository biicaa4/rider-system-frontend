"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface IncomeSummary {
  year: number;
  month: number;
  total_deliveries: number;
  total_income: string;
}

export default function IncomePage() {
  const [incomeData, setIncomeData] = useState<IncomeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchIncome();
  }, [selectedYear]);

  const fetchIncome = async () => {
    try {
      const response = await api.get("/orders/income/monthly", {
        params: { year: selectedYear },
      });
      setIncomeData(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch income data");
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month - 1];
  };

  const calculateTotal = () => {
    return incomeData.reduce((sum, item) => sum + parseFloat(item.total_income), 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Income Report</h1>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 font-semibold p-3 border-2">
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Year {selectedYear} Summary</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-semibold text-gray-700">Total Deliveries</dt>
              <dd className="mt-2 text-4xl font-bold text-gray-900">{incomeData.reduce((sum, item) => sum + item.total_deliveries, 0)}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-700">Total Income</dt>
              <dd className="mt-2 text-4xl font-bold text-green-700">RM {calculateTotal().toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-700">Average per Month</dt>
              <dd className="mt-2 text-4xl font-bold text-gray-900">RM {incomeData.length > 0 ? (calculateTotal() / incomeData.length).toFixed(2) : "0.00"}</dd>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-xl leading-6 font-bold text-gray-900">Monthly Breakdown</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {incomeData.length === 0 ? (
              <li className="px-4 py-4 sm:px-6">
                <p className="text-gray-700 text-center text-lg">No income data for {selectedYear}</p>
              </li>
            ) : (
              incomeData.map((item) => (
                <li key={`${item.year}-${item.month}`} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold">{getMonthName(item.month)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-base font-semibold text-gray-900">
                          {getMonthName(item.month)} {item.year}
                        </div>
                        <div className="text-sm text-gray-700 font-medium">{item.total_deliveries} deliveries</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-900">RM {parseFloat(item.total_income).toFixed(2)}</div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2">
                    <div className="relative">
                      <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-300">
                        <div
                          style={{
                            width: `${(parseFloat(item.total_income) / calculateTotal()) * 100}%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
