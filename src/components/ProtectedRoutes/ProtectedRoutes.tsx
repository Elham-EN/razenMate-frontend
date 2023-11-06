import React, { ReactElement, ReactNode, useEffect } from "react";
import { useUserStore } from "../../store/userStore";
import { useGeneralStore } from "../../store/generalStore";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

function ProtectedRoutes({ children }: ProtectedRoutesProps): ReactElement {
  // Access Global state & action
  const userId = useUserStore((state) => state.id);
  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal);

  useEffect(() => {
    // If user is not logged in then opne the login modal
    if (!userId) toggleLoginModal();
  }, [toggleLoginModal, userId]);

  return userId ? <>{children}</> : <>Protected</>;
}

export default ProtectedRoutes;
