import { ReactNode } from "react";
import { User } from "@/types/user";

export type UserContextProviderType = {
  userData: User;
  setUserData: Function;
};

export type UserContextProviderProps = {
  children: ReactNode;
};
