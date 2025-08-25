import { useState, ReactNode, useMemo } from "react";
import { PasswordProtection } from "./PasswordProtection";

const STORAGE_KEY = "site_authenticated";

export const Protected = ({ children }: { children: ReactNode }) => {
  const [isAuthed, setIsAuthed] = useState(
    typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "true"
  );

  const onAuthenticated = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsAuthed(true);
  };

  if (!isAuthed) {
    return <PasswordProtection onAuthenticated={onAuthenticated} />;
  }

  return <>{children}</>;
};