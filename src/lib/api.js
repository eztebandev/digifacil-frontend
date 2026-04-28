const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
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
};
