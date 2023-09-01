import { Dispatch, ReactNode, SetStateAction } from "react";
import { User } from "@/types/user";

export type UserContextProviderType = {
  userData: User;
  setUserData: Dispatch<SetStateAction<UserContextProviderType["userData"]>>;
};

export type UserContextProviderProps = {
  children: ReactNode;
};
