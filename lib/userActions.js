const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8006";

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
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch admin data");
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
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch all admins data");
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
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create admin");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    const response = await fetch(
      `${serverUrl}/api/admin/delete-admin/${adminId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete admin");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${serverUrl}/api/admin/logout`, {
      method: "GET",
      mode: "cors",
      credentials: "include", // 🔑 ensures cookie is sent/cleared
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Logout failed");

    return data;
  } catch (err) {
    console.error("Logout error:", err);
  }
};

// Inventory route

export const getInventoryStats = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/inventory/dashboard/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch all inventory stats");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all admins data:", error);
    throw error;
  }
};

export const getAllInventorys = async ({page}) => {
  try {
    const response = await fetch(`${serverUrl}/api/inventory?page=${page}&`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch all inventory");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all admins data:", error);
    throw error;
  }
};

export const createInventory = async (form) => {
  try {
    const response = await fetch(`${serverUrl}/api/inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create inventory");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

export const updateInventory = async (form, id) => {
  try {
    const response = await fetch(`${serverUrl}/api/inventory/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update inventory");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

export const deleteInventory = async (id) => {
  try {
    const response = await fetch(`${serverUrl}/api/inventory/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete inventory");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};

// Inventory History route

export const getInventoryHistory = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/inventory-history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch all admins data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all admins data:", error);
    throw error;
  }
};

export const reverseInventoryAction = async (id) => {
  try {
    const response = await fetch(
      `${serverUrl}/api/inventory-history/${id}/reverse`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({}),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed reversing inventory action");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};
