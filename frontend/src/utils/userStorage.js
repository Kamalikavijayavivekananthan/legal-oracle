/**
 * Multi-user storage utility for Legal Oracle.
 * Ensures complete data isolation per user account.
 */

// Helper to generate a consistent storage key from user email or username
export function getUserKey(userOrIdentifier) {
  if (!userOrIdentifier) return "guest";
  if (typeof userOrIdentifier === "string") {
    return userOrIdentifier.toLowerCase().trim().replace(/[^a-z0-9_@.-]/g, "_");
  }
  const identifier = userOrIdentifier.email || userOrIdentifier.name || userOrIdentifier.fullName || "guest";
  return String(identifier).toLowerCase().trim().replace(/[^a-z0-9_@.-]/g, "_");
}

// Get user-scoped data
export function getUserData(userOrKey, itemKey, defaultValue = null) {
  const key = getUserKey(userOrKey);
  try {
    const raw = localStorage.getItem(`legaloracle_data_${key}_${itemKey}`);
    if (raw === null || raw === undefined) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${itemKey} for user ${key}:`, e);
    return defaultValue;
  }
}

// Set user-scoped data and dispatch custom event for instant sync
export function setUserData(userOrKey, itemKey, value) {
  const key = getUserKey(userOrKey);
  try {
    localStorage.setItem(`legaloracle_data_${key}_${itemKey}`, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("legaloracle_user_data_changed", {
      detail: { userKey: key, itemKey, value }
    }));
  } catch (e) {
    console.error(`Error saving ${itemKey} for user ${key}:`, e);
  }
}

// Remove user-scoped data
export function removeUserData(userOrKey, itemKey) {
  const key = getUserKey(userOrKey);
  try {
    localStorage.removeItem(`legaloracle_data_${key}_${itemKey}`);
    window.dispatchEvent(new CustomEvent("legaloracle_user_data_changed", {
      detail: { userKey: key, itemKey, value: null }
    }));
  } catch (e) {
    console.error(`Error removing ${itemKey} for user ${key}:`, e);
  }
}

// User accounts registry helpers
export function getRegisteredAccounts() {
  try {
    return JSON.parse(localStorage.getItem("legaloracle_registered_accounts") || "{}");
  } catch (e) {
    return {};
  }
}

export function saveRegisteredAccount(account) {
  try {
    const accounts = getRegisteredAccounts();
    const primaryKey = getUserKey(account.email || account.name || account.username);
    const secondaryKey = account.name ? getUserKey(account.name) : null;
    
    accounts[primaryKey] = {
      ...accounts[primaryKey],
      ...account,
      userKey: primaryKey,
      updatedAt: new Date().toISOString()
    };

    if (secondaryKey && secondaryKey !== primaryKey) {
      accounts[secondaryKey] = accounts[primaryKey];
    }

    localStorage.setItem("legaloracle_registered_accounts", JSON.stringify(accounts));
    return accounts[primaryKey];
  } catch (e) {
    console.error("Error saving registered account:", e);
    return account;
  }
}

export function findRegisteredAccount(identifier) {
  if (!identifier) return null;
  const accounts = getRegisteredAccounts();
  const key = getUserKey(identifier);
  return accounts[key] || null;
}

// Migrate legacy un-scoped data to existing default user if present
export function runInitialMigration() {
  try {
    const legacyResults = localStorage.getItem("globalResults");
    const legacyReports = localStorage.getItem("savedReports");
    const legacyPinned = localStorage.getItem("pinnedReports");
    const legacyProfile = localStorage.getItem("settings_profile");

    const defaultKey = "kamalikavijay2803@gmail.com";
    const defaultAltKey = "kamalika";

    if (legacyResults && !localStorage.getItem(`legaloracle_data_${defaultKey}_results`)) {
      localStorage.setItem(`legaloracle_data_${defaultKey}_results`, legacyResults);
      localStorage.setItem(`legaloracle_data_${defaultAltKey}_results`, legacyResults);
    }

    if (legacyReports && !localStorage.getItem(`legaloracle_data_${defaultKey}_saved_reports`)) {
      localStorage.setItem(`legaloracle_data_${defaultKey}_saved_reports`, legacyReports);
      localStorage.setItem(`legaloracle_data_${defaultAltKey}_saved_reports`, legacyReports);
    }

    if (legacyPinned && !localStorage.getItem(`legaloracle_data_${defaultKey}_pinned_reports`)) {
      localStorage.setItem(`legaloracle_data_${defaultKey}_pinned_reports`, legacyPinned);
      localStorage.setItem(`legaloracle_data_${defaultAltKey}_pinned_reports`, legacyPinned);
    }

    if (legacyProfile && !localStorage.getItem(`legaloracle_data_${defaultKey}_profile`)) {
      localStorage.setItem(`legaloracle_data_${defaultKey}_profile`, legacyProfile);
      localStorage.setItem(`legaloracle_data_${defaultAltKey}_profile`, legacyProfile);
    }

    // Ensure default account exists in registry
    const accounts = getRegisteredAccounts();
    if (!accounts[defaultKey]) {
      accounts[defaultKey] = {
        name: "Kamalika",
        fullName: "Kamalika",
        email: "kamalikavijay2803@gmail.com",
        password: "password123",
        role: "Legal Team Member",
        company: "Legal Oracle Corp",
        experience: "3-5 years (Mid-Level)",
        userKey: defaultKey
      };
      accounts[defaultAltKey] = accounts[defaultKey];
      localStorage.setItem("legaloracle_registered_accounts", JSON.stringify(accounts));
    } else if (!accounts[defaultKey].password) {
      accounts[defaultKey].password = "password123";
      accounts[defaultAltKey].password = "password123";
      localStorage.setItem("legaloracle_registered_accounts", JSON.stringify(accounts));
    }
  } catch (e) {
    console.error("Migration error:", e);
  }
}

// Run migration once on import
runInitialMigration();
