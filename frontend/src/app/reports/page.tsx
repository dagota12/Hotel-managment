export default function ReportsPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Reports</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-50">Attendance reports</h1>
        <p className="mt-2 text-sm text-slate-300">Generate summary reports by employee and department.</p>
      </header>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="date" className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none" />
            <input type="date" className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none" />
          </div>
          <button className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950">
            Generate Report
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/35">
            <div className="border-b border-white/10 px-4 py-3 text-sm font-medium text-slate-200">
              Employee attendance report
            </div>
            <div className="overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Employee</th>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium">Present</th>
                    <th className="px-4 py-3 font-medium">Late</th>
                    <th className="px-4 py-3 font-medium">Absent</th>
                    <th className="px-4 py-3 font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-100">
                  {[
                    ["John Doe", "Front Office", 20, 2, 1, "95.2%"],
                    ["Sarah Ali", "Housekeeping", 18, 1, 3, "81.8%"],
                    ["Mike Smith", "F&B", 21, 0, 0, "100%"],
                  ].map(([employee, department, present, late, absent, rate]) => (
                    <tr key={`${employee}-${department}`}>
                      <td className="px-4 py-3 font-medium">{employee}</td>
                      <td className="px-4 py-3 text-slate-300">{department}</td>
                      <td className="px-4 py-3 text-slate-300">{present}</td>
                      <td className="px-4 py-3 text-slate-300">{late}</td>
                      <td className="px-4 py-3 text-slate-300">{absent}</td>
                      <td className="px-4 py-3 text-slate-300">{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/35">
            <div className="border-b border-white/10 px-4 py-3 text-sm font-medium text-slate-200">
              Department summary
            </div>
            <div className="overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium">Employees</th>
                    <th className="px-4 py-3 font-medium">Present</th>
                    <th className="px-4 py-3 font-medium">Late</th>
                    <th className="px-4 py-3 font-medium">Absent</th>
                    <th className="px-4 py-3 font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-100">
                  {[
                    ["Front Office", 5, 95, 3, 2, "95%"],
                    ["Housekeeping", 8, 140, 9, 11, "87.5%"],
                    ["F&B", 7, 130, 4, 5, "93%"],
                  ].map(([department, employees, present, late, absent, rate]) => (
                    <tr key={department as string}>
                      <td className="px-4 py-3 font-medium">{department}</td>
                      <td className="px-4 py-3 text-slate-300">{employees}</td>
                      <td className="px-4 py-3 text-slate-300">{present}</td>
                      <td className="px-4 py-3 text-slate-300">{late}</td>
                      <td className="px-4 py-3 text-slate-300">{absent}</td>
                      <td className="px-4 py-3 text-slate-300">{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}