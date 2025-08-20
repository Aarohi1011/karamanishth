"use client";

import { useEffect, useState } from "react";

export default function MarkAttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState("");
  const [log, setLog] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(""); // ✅ date-time input

  // ✅ Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/Industry/attendance-test");
        const data = await res.json();

        if (res.ok) {
          setEmployees(data.employees);
          if (data.employees.length > 0) {
            setBusinessId(data.employees[0].business);
          }
        } else {
          setLog((prev) => [...prev, { error: data.error }]);
        }
      } catch (err) {
        setLog((prev) => [...prev, { error: "Connection error" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // ✅ Mark Attendance (IN/OUT)
  const markAttendance = async (empId, type) => {
    // use selected date-time, or fallback to current
    const now = selectedDateTime
      ? new Date(selectedDateTime).toISOString()
      : new Date().toISOString();

    try {
      const res = await fetch("/api/Industry/attendance-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: empId,
          businessId,
          date: now,
          type,
          time: now,
          deviceInfo: "Web Test UI",
          notes: `Marked ${type.toUpperCase()} from test panel`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLog((prev) => [
          { success: `✅ ${type.toUpperCase()} marked for ${empId} at ${now}` },
          ...prev,
        ]);
      } else {
        setLog((prev) => [
          { error: `❌ Failed for ${empId}: ${data.error}` },
          ...prev,
        ]);
      }
    } catch (err) {
      setLog((prev) => [
        { error: `❌ Network error while marking ${type}` },
        ...prev,
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          📝 Mark Employee Attendance
        </h1>

        {/* ✅ Date & Time Picker */}
        <div className="mb-6 flex items-center space-x-4">
          <label className="font-medium text-gray-700">
            Select Date & Time:
          </label>
          <input
            type="datetime-local"
            value={selectedDateTime}
            onChange={(e) => setSelectedDateTime(e.target.value)}
            className="border rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
          />
        </div>

        {loading ? (
          <p className="text-gray-600">Loading employees...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {emp.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {emp.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {emp.role}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => markAttendance(emp._id, "in")}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm shadow hover:bg-green-700"
                      >
                        Mark IN
                      </button>
                      <button
                        onClick={() => markAttendance(emp._id, "out")}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm shadow hover:bg-red-700"
                      >
                        Mark OUT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Logs */}
        <div className="mt-6 bg-gray-50 border rounded-lg p-4 max-h-64 overflow-auto text-sm">
          <h2 className="font-semibold text-gray-800 mb-2">📋 Logs</h2>
          {log.length === 0 ? (
            <p className="text-gray-500">No actions yet.</p>
          ) : (
            <ul className="space-y-1">
              {log.map((entry, idx) => (
                <li
                  key={idx}
                  className={
                    entry.success
                      ? "text-green-700"
                      : entry.error
                      ? "text-red-700"
                      : "text-gray-700"
                  }
                >
                  {entry.success || entry.error}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
