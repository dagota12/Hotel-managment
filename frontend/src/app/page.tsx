import { ArrowRight, Building2, Clock3, Users2 } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
              Hotel HR Console
            </p>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                Hotel Employee Management
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage employees, attendance, departments, roles, and reports from one
                clean dashboard built for fast hotel operations.
              </p>
            </div>
          </div>

          <a
            href="/attendance"
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
          >
            Open Today&apos;s Attendance
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Employees", value: "25", icon: Users2 },
          { label: "Present Today", value: "19", icon: Clock3 },
          { label: "Late Today", value: "3", icon: Building2 },
          { label: "Not Checked In", value: "3", icon: Users2 },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span className="text-sm">{label}</span>
              <Icon className="h-5 w-5 text-amber-300" />
            </div>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-slate-50">
              {value}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-300">
                Today&apos;s attendance
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-50">
                Operational snapshot
              </h2>
            </div>
            <a href="/attendance" className="text-sm text-slate-300 hover:text-slate-50">
              View All Attendance →
            </a>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Shift</th>
                  <th className="px-4 py-3 font-medium">Check In</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/30 text-slate-100">
                {[
                  ["John Doe", "Front Office", "Morning", "08:03", "Late"],
                  ["Sarah Ali", "Housekeeping", "Morning", "07:55", "Present"],
                  ["Mike Smith", "F&B", "Evening", "—", "Not Marked"],
                ].map(([employee, department, shift, checkIn, status]) => (
                  <tr key={`${employee}-${shift}`}>
                    <td className="px-4 py-3 font-medium">{employee}</td>
                    <td className="px-4 py-3 text-slate-300">{department}</td>
                    <td className="px-4 py-3 text-slate-300">{shift}</td>
                    <td className="px-4 py-3 text-slate-300">{checkIn}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-200">
                        {status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-300">
            Department overview
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-50">Quick summary</h2>

          <div className="mt-5 space-y-3 text-sm">
            {[
              ["Front Office", 5, 5],
              ["Housekeeping", 8, 6],
              ["Food & Beverage", 7, 5],
              ["Maintenance", 3, 2],
              ["Security", 2, 1],
            ].map(([name, employees, present]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
              >
                <span className="font-medium text-slate-100">{name}</span>
                <span className="text-slate-300">
                  {employees as number} employees · {present as number} present
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
