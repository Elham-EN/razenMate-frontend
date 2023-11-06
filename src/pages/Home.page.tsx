import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar/Sidebar";
import ProtectedRoutes from "../components/ProtectedRoutes/ProtectedRoutes";

export function HomePage() {
  return (
    <MainLayout>
      <>
        <Sidebar />
        Home Page
      </>
    </MainLayout>
  );
}
