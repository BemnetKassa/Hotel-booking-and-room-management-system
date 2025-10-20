export default function AdminHeader() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Hotel Management Dashboard</h1>
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-500">Admin User</p>
        <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
          Logout
        </button>
      </div>
    </header>
  );
}
