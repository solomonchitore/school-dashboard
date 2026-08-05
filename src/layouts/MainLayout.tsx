import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

type MainLayoutProps = {
  children: React.ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 bg-slate-100 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;