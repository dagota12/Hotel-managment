import { Users2 } from "lucide-react";

const employees = [
  ["John Doe", "Front Office", "Receptionist", "Morning", "Active"],
  ["Sarah Ali", "Housekeeping", "Housekeeper", "Evening", "Active"],
  ["Mike Smith", "F&B", "Waiter", "Morning", "Active"],
];

export default function EmployeesPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Employees</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50">Manage employees</h1>
            <p className="mt-2 text-sm text-slate-300">15 employees</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950">
            <Users2 className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500" placeholder="Search employees..." />
          <div className="mt-4 grid gap-3">
            {['Department', 'Role', 'Shift', 'Status'].map((label) => (
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
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Shift</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-100">
              {employees.map(([name, department, role, shift, status]) => (
                <tr key={`${name}-${shift}`}>
                  <td className="px-5 py-4 font-medium">{name}</td>
                  <td className="px-5 py-4 text-slate-300">{department}</td>
                  <td className="px-5 py-4 text-slate-300">{role}</td>
                  <td className="px-5 py-4 text-slate-300">{shift}</td>
                  <td className="px-5 py-4 text-slate-300">{status}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 text-xs font-medium">
                      <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2">View</button>
                      <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Edit</button>
                      <button className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-rose-100">Delete</button>
                    </div>
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