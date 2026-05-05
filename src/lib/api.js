const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "digifacil_token";
const USER_KEY = "digifacil_user";

function handleUnauthorized() {
  let role = "";
  try {
    const raw = localStorage.getItem(USER_KEY);
    role = raw ? JSON.parse(raw)?.role || "" : "";
  } catch {
    role = "";
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  const target = role === "ADMIN" ? "/admin/login" : "/intranet/login";
  if (window.location.pathname !== target) {
    window.location.replace(target);
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ocurrio un error inesperado.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getCourses() {
    return request("/courses");
  },
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  loginAdmin(payload) {
    return request("/admin/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getAdminCourses(token) {
    return request("/admin/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getAdminCategories(token) {
    return request("/admin/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  createAdminCategory(token, payload) {
    return request("/admin/categories", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  },
  createCourse(token, payload) {
    return request("/admin/courses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
  updateCourse(token, id, payload) {
    return request(`/admin/courses/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
  deleteCourse(token, id) {
    return request(`/admin/courses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getAdminGroups(token) {
    return request("/admin/groups", { headers: { Authorization: `Bearer ${token}` } });
  },
  createAdminGroup(token, payload) {
    return request("/admin/groups", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  },
  getAdminStudents(token) {
    return request("/admin/users/students", { headers: { Authorization: `Bearer ${token}` } });
  },
  createAdminStudent(token, payload) {
    return request("/admin/users/students", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  },
  updateAdminStudent(token, id, payload) {
    return request(`/admin/users/students/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  },
  deleteAdminStudent(token, id) {
    return request(`/admin/users/students/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  },
  getAdminTeachers(token) {
    return request("/admin/users/teachers", { headers: { Authorization: `Bearer ${token}` } });
  },
  createAdminTeacher(token, payload) {
    return request("/admin/users/teachers", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  },
  updateAdminTeacher(token, id, payload) {
    return request(`/admin/users/teachers/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  },
  deleteAdminTeacher(token, id) {
    return request(`/admin/users/teachers/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  },
  updateAdminGroup(token, id, payload) {
    return request(`/admin/groups/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  },
  deleteAdminGroup(token, id) {
    return request(`/admin/groups/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  },
  assignTeacherToGroup(token, groupId, teacherId) {
    return request(`/admin/groups/${groupId}/assign-teacher`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ teacherId }) });
  },
  assignStudentToGroup(token, groupId, studentId) {
    return request(`/admin/groups/${groupId}/assign-student`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ studentId }) });
  },
  removeStudentFromGroup(token, groupId, studentId) {
    return request(`/admin/groups/${groupId}/students/${studentId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  },
  deleteGroupSession(token, groupId, sessionId) {
    return request(`/admin/groups/${groupId}/sessions/${sessionId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  },
  uploadStudentCertificate(token, groupId, studentId, payload) {
    return request(`/admin/groups/${groupId}/students/${studentId}/certificate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  },
  deleteStudentCertificate(token, groupId, studentId) {
    return request(`/admin/groups/${groupId}/students/${studentId}/certificate`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getTeacherDashboard(token) {
    return request("/intranet/teacher/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getTeacherGroups(token) {
    return request("/intranet/teacher/groups", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getTeacherGroupSessions(token, groupId) {
    return request(`/intranet/teacher/groups/${groupId}/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getStudentDashboard(token) {
    return request("/intranet/student/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getStudentCourses(token) {
    return request("/intranet/student/courses", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getStudentCalendar(token) {
    return request("/intranet/student/calendar", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getStudentCertificates(token) {
    return request("/intranet/student/certificates", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  updateTeacherGroupSessions(token, groupId, sessions) {
    return request(`/intranet/teacher/groups/${groupId}/sessions`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sessions }),
    });
  },
  deleteTeacherGroupSession(token, groupId, sessionId) {
    return request(`/intranet/teacher/groups/${groupId}/sessions/${sessionId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
