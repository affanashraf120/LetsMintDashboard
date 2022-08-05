import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebaseClient";

const AuthContext = React.createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = (props: Props) => {
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  const signup = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signup
    }}>
      {loading ? null : props.children}
    </AuthContext.Provider>
  );
};
