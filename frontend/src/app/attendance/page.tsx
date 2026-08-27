const attendanceRows = [
  ["John Doe", "Front Office", "Morning", "08:03", "—", "Late"],
  ["Sarah Ali", "Housekeeping", "Morning", "07:55", "—", "Present"],
  ["Mike Smith", "F&B", "Evening", "—", "—", "Not Marked"],
  ["David Brown", "Security", "Night", "00:02", "08:01", "Present"],
];

export default function AttendancePage() {
  return (
    <section className="space-y-6">
      <header className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Today&apos;s Attendance</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-50">Thursday, August 27, 2026</h1>
        <p className="mt-2 text-sm text-slate-300">19 / 25 employees checked in</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500" placeholder="Search employee..." />
          <div className="mt-4 grid gap-3">
            {['Department', 'Shift', 'Status'].map((label) => (
              <select key={label} className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none">
                <option>{label}</option>
              </select>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/55 text-slate-300">
              <tr>
                <th className="px-5 py-4 font-medium">Employee</th>
                <th className="px-5 py-4 font-medium">Department</th>
                <th className="px-5 py-4 font-medium">Shift</th>
                <th className="px-5 py-4 font-medium">Check In</th>
                <th className="px-5 py-4 font-medium">Check Out</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-100">
              {attendanceRows.map(([name, department, shift, checkIn, checkOut, status]) => (
                <tr key={`${name}-${shift}`}>
                  <td className="px-5 py-4 font-medium">{name}</td>
                  <td className="px-5 py-4 text-slate-300">{department}</td>
                  <td className="px-5 py-4 text-slate-300">{shift}</td>
                  <td className="px-5 py-4 text-slate-300">{checkIn}</td>
                  <td className="px-5 py-4 text-slate-300">{checkOut}</td>
                  <td className="px-5 py-4 text-slate-300">{status}</td>
                  <td className="px-5 py-4">
                    <button className="rounded-full border border-amber-400/20 bg-amber-400 px-3 py-2 text-xs font-semibold text-slate-950">
                      Check In
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}