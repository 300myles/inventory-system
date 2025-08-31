const serverUrl = process.env.SERVER_URL;

// Admin management routes

export const getAdmin = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch admin data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching admin data:", error);
    throw error;
  }
};

export const getAllAdmins = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/admin/get-all-admins`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch all admins data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all admins data:", error);
    throw error;
  }
};

export const createAdmin = async (adminData) => {
  try {
    const response = await fetch(`${serverUrl}/api/admin/create-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(adminData),
    });
    if (!response.ok) {
      throw new Error("Failed to create admin");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
}

export const deleteAdmin = async (adminId) => {
  try {
    const response = await fetch(`${serverUrl}/api/admin/delete-admin/${adminId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to delete admin");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
}

export const logout = async () => {
  try {
    const res = await fetch(`${serverUrl}/api/admin/logout`, {
      method: "GET",
      mode: "cors",
      credentials: "include", // 🔑 ensures cookie is sent/cleared
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Logout failed");
    
    return data;
  } catch (err) {
    console.error("Logout error:", err);
  }
};
