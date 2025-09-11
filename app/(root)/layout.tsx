import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Fixed Navbar overlaying all sections with transparent background */}
            <Navbar />
            {/* Main content area with sections */}
            <main className="relative">
                {children}
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
}