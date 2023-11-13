import React, { ReactDOM, ReactElement, ReactNode } from "react";
import { Flex } from "@mantine/core";

interface MainLayoutProps {
  children: ReactElement;
}

function MainLayout({ children }: MainLayoutProps): ReactElement {
  return (
    <Flex>
      <Flex>{children}</Flex>
    </Flex>
  );
}

export default MainLayout;
