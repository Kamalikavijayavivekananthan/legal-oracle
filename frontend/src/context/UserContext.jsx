import { createContext, useContext, useState } from "react";
import { getUserKey, getUserData, setUserData, saveRegisteredAccount, findRegisteredAccount } from "../utils/userStorage";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      // First check session storage for active browser session
      const sessionUser = JSON.parse(sessionStorage.getItem("legaloracle_active_session") || "null");
      const rememberedUser = JSON.parse(localStorage.getItem("legaloracle_remember_user") || "null");
      const savedUser = sessionUser || rememberedUser;

      if (savedUser) {
        const key = getUserKey(savedUser);
        const userProfile = getUserData(key, "profile", null);
        const account = findRegisteredAccount(key);
        
        return {
          ...account,
          ...userProfile,
          ...savedUser,
          name: savedUser.name || savedUser.fullName || "User",
          fullName: savedUser.fullName || savedUser.name || "User",
          email: savedUser.email || account?.email || "",
          role: userProfile?.role || savedUser.role || account?.role || "Legal Team Member",
          company: userProfile?.company || savedUser.company || account?.company || "",
          experience: userProfile?.experience || savedUser.experience || account?.experience || "",
          phone: userProfile?.phone || savedUser.phone || account?.phone || "",
          bio: userProfile?.bio || savedUser.bio || account?.bio || "",
          userKey: key,
        };
      }
    } catch (e) {
      console.error("Error initializing user from storage", e);
    }
    return null;
  });

  const userKey = user ? getUserKey(user) : null;

  const login = (userData, rememberMe = false) => {
    const rawKey = getUserKey(userData);
    const existingAccount = findRegisteredAccount(rawKey) || findRegisteredAccount(userData.email) || findRegisteredAccount(userData.name);
    const existingProfile = getUserData(rawKey, "profile", null);

    const formattedUser = {
      ...existingAccount,
      ...existingProfile,
      ...userData,
      name: userData.name || userData.fullName || existingAccount?.name || "User",
      fullName: userData.fullName || userData.name || existingAccount?.fullName || "User",
      email: userData.email || existingAccount?.email || "",
      role: userData.role || existingProfile?.role || existingAccount?.role || "Legal Team Member",
      company: userData.company || existingProfile?.company || existingAccount?.company || "",
      experience: userData.experience || existingProfile?.experience || existingAccount?.experience || "",
      phone: userData.phone || existingProfile?.phone || existingAccount?.phone || "",
      bio: userData.bio || existingProfile?.bio || existingAccount?.bio || "",
      userKey: rawKey,
    };

    // Save to active session (session storage keeps user logged in during current browsing session)
    sessionStorage.setItem("legaloracle_active_session", JSON.stringify(formattedUser));

    if (rememberMe) {
      localStorage.setItem("legaloracle_remember_user", JSON.stringify(formattedUser));
    } else {
      localStorage.removeItem("legaloracle_remember_user");
    }

    localStorage.setItem("legaloracle_active_user_key", rawKey);

    // Save/update account in registry
    saveRegisteredAccount(formattedUser);

    // Persist scoped profile
    setUserData(rawKey, "profile", {
      fullName: formattedUser.fullName,
      email: formattedUser.email,
      role: formattedUser.role,
      phone: formattedUser.phone,
      company: formattedUser.company,
      experience: formattedUser.experience,
      bio: formattedUser.bio,
    });

    setUser(formattedUser);
    return formattedUser;
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      const key = getUserKey(prev);
      const name = updatedFields.fullName || updatedFields.name || prev.name || prev.fullName || "User";
      
      const updated = {
        ...prev,
        ...updatedFields,
        name: name,
        fullName: name,
        role: updatedFields.role || prev.role || "Legal Team Member",
        userKey: key,
      };

      sessionStorage.setItem("legaloracle_active_session", JSON.stringify(updated));
      if (localStorage.getItem("legaloracle_remember_user")) {
        localStorage.setItem("legaloracle_remember_user", JSON.stringify(updated));
      }

      const profileData = {
        fullName: updated.fullName,
        email: updated.email || "",
        role: updated.role,
        phone: updated.phone || "",
        company: updated.company || "",
        experience: updated.experience || "",
        bio: updated.bio || "",
      };

      setUserData(key, "profile", profileData);
      saveRegisteredAccount(updated);

      return updated;
    });
  };

  const logout = () => {
    sessionStorage.removeItem("legaloracle_active_session");
    localStorage.removeItem("legaloracle_remember_user");
    localStorage.removeItem("legaloracle_user");
    localStorage.removeItem("legaloracle_active_user_key");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  const getScopedData = (itemKey, defaultValue = null) => {
    if (!userKey) return defaultValue;
    return getUserData(userKey, itemKey, defaultValue);
  };

  const setScopedData = (itemKey, value) => {
    if (!userKey) return;
    setUserData(userKey, itemKey, value);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userKey, 
      login, 
      updateUser, 
      logout,
      getScopedData,
      setScopedData
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
