import { type ReactElement } from "react";
import VerticalLayout from "./VerticalLayout";
import LayoutWrapper from "../layout-wrapper";

type LayoutProps = {
  children: ReactElement;
};

const Layout = ({ children, ...props }: LayoutProps) => {
  return (
    <VerticalLayout {...props}>
      <LayoutWrapper>{children}</LayoutWrapper>
    </VerticalLayout>
  );
};

export default Layout;
