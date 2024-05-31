import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

function AuthProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userId = localStorage.getItem("uid");
    if (storedUser && userId) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
      setUid(JSON.parse(userId));
    }
    setLoading(false);
  }, []);

  const login = (info) => {
    setIsLoggedIn(true);
    console.log(info);
    setUser(info.user.name);
    setUid(info.user.id);
    localStorage.setItem("user", JSON.stringify(info.user.name));
    localStorage.setItem("uid", JSON.stringify(info.user.id));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUid(null);
    localStorage.removeItem("user");
    localStorage.removeItem("uid");
  };

  const value = {
    isLoggedIn,
    user,
    uid,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value} {...props} />;
}

export { AuthContext, AuthProvider };
