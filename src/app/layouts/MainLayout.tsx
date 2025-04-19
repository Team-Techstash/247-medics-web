import Header from "./../components/Header";
import Footer from "./../components/Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="pt-18 overflow-hidden">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayout;