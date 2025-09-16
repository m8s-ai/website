import { ReactNode } from "react";

export const Protected = ({ children }: { children: ReactNode }) => {
  // Temporarily disable password protection for development
  return <>{children}</>;
};