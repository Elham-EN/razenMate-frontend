import React from "react";
import { Modal, Paper, Text } from "@mantine/core";
import { useGeneralStore } from "../../store/generalStore";
import Register from "../Register/Register";
import Login from "../Login/Login";

export default function AuthOverlay(): React.ReactElement {
  const isLoginModalOpen = useGeneralStore((state) => state.isLoginModalOpen);
  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal);
  const [isRegister, setIsRegister] = React.useState(true);
  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <Modal
      size={"70%"}
      centered
      opened={isLoginModalOpen}
      onClose={toggleLoginModal}
      radius={"10px"}
    >
      {isRegister ? (
        <Register toggleForm={toggleForm} />
      ) : (
        <Login toggleForm={toggleForm} />
      )}
    </Modal>
  );
}
