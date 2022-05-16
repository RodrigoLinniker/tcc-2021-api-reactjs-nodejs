import React, { createContext, useCallback, useState, useContext } from "react";
import ICredentialsDev from "../interfaces/credentialsDev";
import api from "../services/api";

interface IUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  telefone: string;
  active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

interface IAuthState {
  token: string;
  user: IUser;
}

interface IAuthContextState {
  user: IUser;
  signInDev(credentials: ICredentialsDev): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): void;
}

export const AuthContext = createContext<IAuthContextState>(
  {} as IAuthContextState
);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IAuthState>(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return {
        token,
        user: JSON.parse(user),
      };
    }

    return {} as IAuthState;
  });
  const signInDev = useCallback(async (credentials: ICredentialsDev) => {
    const response = await api.post("/login", credentials);
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setData({
      token,
      user,
    });
  }, []);

  const updateUser = useCallback(
    async (user: IUser) => {
      localStorage.setItem("user", JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [data.token]
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers = {};
    setData({} as IAuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInDev,
        user: data.user,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContextState => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
