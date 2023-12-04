import React from "react";
import {
  UserContextProviderProps,
  UserContextProviderType,
} from "@/types/usercontext";
import { User } from "@/types/user";

export const UserContext = React.createContext<
  UserContextProviderType | undefined
>(undefined);

export function UserContextProvider(props: UserContextProviderProps) {
  const [userData, setUserData] = React.useState<User>({
    email: null,
    name: null,
  });

  return (
    <UserContext.Provider
      value={{ userData: userData, setUserData: setUserData }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
