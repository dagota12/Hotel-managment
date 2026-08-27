const state = {
  departments: [],
  roles: [],
  shifts: [],
  employees: [],
  attendance: [],
};

const toastEl = document.getElementById("toast");
const departmentForm = document.getElementById("departmentForm");
const roleForm = document.getElementById("roleForm");
const shiftForm = document.getElementById("shiftForm");
const employeeForm = document.getElementById("employeeForm");
const attendanceForm = document.getElementById("attendanceForm");
const reportForm = document.getElementById("reportForm");

const elements = {
  departmentList: document.getElementById("departmentsList"),
  roleList: document.getElementById("rolesList"),
  shiftList: document.getElementById("shiftsList"),
  employeeList: document.getElementById("employeesList"),
  attendanceList: document.getElementById("attendanceList"),
  reportBody: document.getElementById("reportBody"),
  employeeSelects: employeeForm.querySelectorAll(
    'select[name="departmentId"], select[name="roleId"], select[name="shiftId"], select[name="employeeId"]',
  ),
};

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : (payload.message ?? "Request failed");
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return payload;
};

const formatDate = (value) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const showToast = (message, isError = false) => {
  toastEl.textContent = message;
  toastEl.style.borderColor = isError
    ? "rgba(248, 113, 113, 0.45)"
    : "rgba(148, 163, 184, 0.18)";
  toastEl.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(
    () => toastEl.classList.remove("show"),
    2400,
  );
};

const refreshSelectOptions = () => {
  const departmentOptions = [
    '<option value="">Select a department</option>',
    ...state.departments.map(
      (department) =>
        `<option value="${department.id}">${department.name}</option>`,
    ),
  ].join("");
  const roleOptions = [
    '<option value="">Select a role</option>',
    ...state.roles.map(
      (role) => `<option value="${role.id}">${role.name}</option>`,
    ),
  ].join("");
  const shiftOptions = [
    '<option value="">Select a shift</option>',
    ...state.shifts.map(
      (shift) =>
        `<option value="${shift.id}">${shift.name} (${shift.startTime} - ${shift.endTime})</option>`,
    ),
  ].join("");
  const employeeOptions = [
    '<option value="">Select an employee</option>',
    ...state.employees.map(
      (employee) =>
        `<option value="${employee.id}">${employee.fullName}</option>`,
    ),
  ].join("");

  employeeForm.querySelector('select[name="departmentId"]').innerHTML =
    departmentOptions;
  employeeForm.querySelector('select[name="roleId"]').innerHTML = roleOptions;
  employeeForm.querySelector('select[name="shiftId"]').innerHTML = shiftOptions;
  attendanceForm.querySelector('select[name="employeeId"]').innerHTML =
    employeeOptions;
};

const renderList = (target, items, template) => {
  target.innerHTML = items.length
    ? items.map(template).join("")
    : '<div class="item"><small>No records yet.</small></div>';
};

const refreshCounters = () => {
  document.getElementById("employeeCount").textContent = state.employees.length;
  document.getElementById("attendanceCount").textContent =
    state.attendance.length;
  document.getElementById("departmentCount").textContent =
    state.departments.length;
};

const renderDashboard = () => {
  renderList(
    elements.departmentList,
    state.departments,
    (department) =>
      `<div class="item"><strong>${department.name}</strong><small>${department.id}</small></div>`,
  );
  renderList(
    elements.roleList,
    state.roles,
    (role) =>
      `<div class="item"><strong>${role.name}</strong><small>${role.id}</small></div>`,
  );
  renderList(
    elements.shiftList,
    state.shifts,
    (shift) =>
      `<div class="item"><strong>${shift.name}</strong><small>${shift.startTime} - ${shift.endTime}</small></div>`,
  );
  renderList(
    elements.employeeList,
    state.employees,
    (employee) => `
      <div class="item">
        <strong>${employee.fullName}</strong>
        <span>${employee.email}</span>
        <small>${employee.department?.name ?? "No department"} · ${employee.role?.name ?? "No role"} · ${employee.shift?.name ?? "No shift"}</small>
      </div>
    `,
  );
  renderList(
    elements.attendanceList,
    state.attendance,
    (row) => `
      <div class="item">
        <strong>${row.employee.fullName}</strong>
        <span>${formatDate(row.date)} · ${row.status}</span>
        <small>${row.checkIn ?? "--:--"} to ${row.checkOut ?? "--:--"}</small>
      </div>
    `,
  );
  refreshSelectOptions();
  refreshCounters();
};

const loadAll = async () => {
  const [departments, roles, shifts, employees, attendance] = await Promise.all(
    [
      api("/departments"),
      api("/roles"),
      api("/shifts"),
      api("/employees"),
      api("/attendance"),
    ],
  );

  state.departments = departments;
  state.roles = roles;
  state.shifts = shifts;
  state.employees = employees;
  state.attendance = attendance;
  renderDashboard();
};

departmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(departmentForm);
  await api("/departments", {
    method: "POST",
    body: JSON.stringify({ name: formData.get("name") }),
  });
  departmentForm.reset();
  showToast("Department created");
  await loadAll();
});

roleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(roleForm);
  await api("/roles", {
    method: "POST",
    body: JSON.stringify({ name: formData.get("name") }),
  });
  roleForm.reset();
  showToast("Role created");
  await loadAll();
});

shiftForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(shiftForm);
  await api("/shifts", {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
    }),
  });
  shiftForm.reset();
  showToast("Shift created");
  await loadAll();
});

employeeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(employeeForm);
  await api("/employees", {
    method: "POST",
    body: JSON.stringify({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      departmentId: formData.get("departmentId"),
      roleId: formData.get("roleId"),
      shiftId: formData.get("shiftId"),
    }),
  });
  employeeForm.reset();
  showToast("Employee created");
  await loadAll();
});

attendanceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(attendanceForm);
  await api("/attendance", {
    method: "POST",
    body: JSON.stringify({
      employeeId: formData.get("employeeId"),
      date: formData.get("date"),
      checkIn: formData.get("checkIn") || undefined,
      checkOut: formData.get("checkOut") || undefined,
      status: formData.get("status"),
      note: formData.get("note") || undefined,
    }),
  });
  attendanceForm.reset();
  showToast("Attendance recorded");
  await loadAll();
});

reportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(reportForm);
  const rows = await api(
    `/reports/attendance?from=${formData.get("from")}&to=${formData.get("to")}`,
  );
  elements.reportBody.innerHTML = rows.length
    ? rows
        .map(
          (row) => `
            <tr>
              <td>${row.employeeName}</td>
              <td>${row.department}</td>
              <td>${row.present}</td>
              <td>${row.absent}</td>
              <td>${row.late}</td>
              <td>${row.rate}%</td>
            </tr>
          `,
        )
        .join("")
    : '<tr><td colspan="6">No employees found.</td></tr>';
  showToast("Report generated");
});

window.addEventListener("DOMContentLoaded", async () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  reportForm.querySelector('input[name="from"]').value = firstDay
    .toISOString()
    .slice(0, 10);
  reportForm.querySelector('input[name="to"]').value = today
    .toISOString()
    .slice(0, 10);

  try {
    await loadAll();
    showToast("Ready");
  } catch (error) {
    showToast(error.message, true);
  }
});
