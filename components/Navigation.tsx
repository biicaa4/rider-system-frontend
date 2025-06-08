"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Navigation() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-gray-900">
              All Orders
            </Link>
            <Link href="/orders/new" className="text-gray-700 hover:text-gray-900">
              New Order
            </Link>
            <Link href="/income" className="text-gray-700 hover:text-gray-900">
              Income
            </Link>
          </div>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
