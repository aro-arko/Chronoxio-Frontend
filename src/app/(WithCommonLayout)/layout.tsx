import Footer from "@/components/shared/Footer";
import NavBar from "@/components/shared/Navbar";
// import Navbar from "@/components/shared/Navbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavBar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
};

export default CommonLayout;
