export default function ManagementPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Management</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-50">Departments, roles, and shifts</h1>
        <p className="mt-2 text-sm text-slate-300">Use tabs to keep master data simple.</p>
      </header>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <div className="flex gap-2">
          {['Departments', 'Roles', 'Shifts'].map((tab, index) => (
            <button
              key={tab}
              className={`rounded-full px-4 py-2 text-sm font-medium ${index === 0 ? 'bg-amber-400 text-slate-950' : 'border border-white/10 bg-white/5 text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {[
            {
              title: 'Departments',
              rows: [
                ['Front Office', 5],
                ['Housekeeping', 8],
                ['Food & Beverage', 7],
                ['Maintenance', 3],
                ['Security', 2],
              ],
              headers: ['Name', 'Employees'],
            },
            {
              title: 'Roles',
              rows: [
                ['Receptionist', 3],
                ['Housekeeper', 6],
                ['Chef', 2],
                ['Waiter', 5],
                ['Security Guard', 2],
              ],
              headers: ['Role', 'Employees'],
            },
            {
              title: 'Shifts',
              rows: [
                ['Morning', '08:00', '16:00', 10],
                ['Evening', '16:00', '00:00', 8],
                ['Night', '00:00', '08:00', 7],
              ],
              headers: ['Shift', 'Start', 'End', 'Employees'],
            },
          ].map((section) => (
            <div key={section.title} className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-50">{section.title}</h2>
                <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200">
                  + Add {section.title.slice(0, -1)}
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/60 text-slate-300">
                    <tr>
                      {section.headers.map((header) => (
                        <th key={header} className="px-4 py-3 font-medium">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-100">
                    {section.rows.map((row) => (
                      <tr key={row[0] as string}>
                        {row.map((cell) => (
                          <td key={String(cell)} className="px-4 py-3 text-slate-300">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}