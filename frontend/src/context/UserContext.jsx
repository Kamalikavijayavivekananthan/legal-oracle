import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("legaloracle_user") || "null");
      const savedProfile = JSON.parse(localStorage.getItem("settings_profile") || "null");
      
      if (savedProfile && (savedProfile.fullName || savedProfile.email)) {
        return {
          name: savedProfile.fullName || savedUser?.name || "User",
          fullName: savedProfile.fullName || savedUser?.name || "User",
          email: savedProfile.email || savedUser?.email || "",
          role: savedProfile.role || savedUser?.role || "Legal Team Member",
          phone: savedProfile.phone || savedUser?.phone || "",
          company: savedProfile.company || savedUser?.company || "",
          bio: savedProfile.bio || savedUser?.bio || "",
        };
      }
      
      if (savedUser) {
        return {
          ...savedUser,
          fullName: savedUser.fullName || savedUser.name || "User",
          name: savedUser.name || savedUser.fullName || "User",
          role: savedUser.role || "Legal Team Member",
        };
      }
    } catch (e) {
      console.error("Error reading user from localStorage", e);
    }
    return {
      name: "Kamalika",
      fullName: "Kamalika",
      email: "kamalikavijay2803@gmail.com",
      role: "Legal Team Member",
      phone: "",
      company: "",
      bio: "",
    };
  });

  const login = (userData) => {
    const formattedUser = {
      ...userData,
      name: userData.name || userData.fullName || "User",
      fullName: userData.fullName || userData.name || "User",
      role: userData.role || "Legal Team Member",
    };
    localStorage.setItem("legaloracle_user", JSON.stringify(formattedUser));

    const savedProfile = JSON.parse(localStorage.getItem("settings_profile") || "{}");
    const updatedProfile = {
      ...savedProfile,
      fullName: formattedUser.name,
      email: formattedUser.email || savedProfile.email || "",
      role: formattedUser.role || savedProfile.role || "Legal Team Member",
    };
    localStorage.setItem("settings_profile", JSON.stringify(updatedProfile));

    setUser(formattedUser);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const name = updatedFields.fullName || updatedFields.name || prev?.name || prev?.fullName || "User";
      const updated = {
        ...prev,
        ...updatedFields,
        name: name,
        fullName: name,
        role: updatedFields.role || prev?.role || "Legal Team Member",
      };
      
      localStorage.setItem("legaloracle_user", JSON.stringify(updated));

      const profileData = {
        fullName: updated.name,
        email: updated.email || "",
        role: updated.role,
        phone: updated.phone || "",
        company: updated.company || "",
        bio: updated.bio || "",
      };
      localStorage.setItem("settings_profile", JSON.stringify(profileData));

      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem("legaloracle_user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
