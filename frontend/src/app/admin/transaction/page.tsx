"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get("/transactions")
      .then(res => setTransactions(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Room</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx: any, i: number) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{tx.customerName}</td>
                <td className="p-3">{tx.roomName}</td>
                <td className="p-3 text-blue-600">${tx.amount}</td>
                <td className="p-3">{tx.paymentMethod}</td>
                <td className="p-3">{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tx.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
