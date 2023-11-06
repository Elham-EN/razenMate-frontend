import React, { ReactElement, useState } from "react";
import { useGeneralStore } from "../../store/generalStore";
import { useUserStore } from "../../store/userStore";
import {
  AppShell,
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  Flex,
} from "@mantine/core";

import {
  IconUser,
  IconLogout,
  IconBrandMessenger,
  IconBrandWechat,
  IconLogin,
  IconHome2,
  Icon,
  IconSwitchHorizontal,
  IconBrandHipchat,
} from "@tabler/icons-react";

import classes from "./Sidebar.module.css";

import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "../../graphql/mutations/Logout";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [{ icon: IconBrandWechat, label: "Chatrooms" }];

export default function Sidebar(): ReactElement {
  const toggleProfileSettingsModal = useGeneralStore(
    (state) => state.toggleProfileSettingModal
  );
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  const userId = useUserStore((state) => state.id);
  const user = useUserStore((state) => state);
  const setUser = useUserStore((state) => state.setUser);

  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal);

  const [logoutUser, { loading, error }] = useMutation(LOGOUT_USER, {
    onCompleted: () => {
      toggleLoginModal();
    },
  });

  const handleLogout = async () => {
    await logoutUser();
    setUser({
      id: undefined,
      fullname: "",
      avatarUrl: null,
      email: "",
    });
  };

  return (
    <Flex w={rem(100)} p={"md"} className={classes.navbar}>
      <Center>
        <IconBrandHipchat type="mark" size={50} />
      </Center>
      <Flex className={classes.navbarSection} mt={50}>
        <Stack justify="center">{userId && links}</Stack>
      </Flex>
      <Flex>
        <Stack justify="center">
          {userId && (
            <NavbarLink
              icon={IconUser}
              label={"Profile(" + user.fullname + ")"}
              onClick={toggleProfileSettingsModal}
            />
          )}
          {userId ? (
            <NavbarLink
              icon={IconLogout}
              label="Logout"
              onClick={handleLogout}
            />
          ) : (
            <NavbarLink
              icon={IconLogin}
              label="Login"
              onClick={toggleLoginModal}
            />
          )}
        </Stack>
      </Flex>
    </Flex>
  );
}
