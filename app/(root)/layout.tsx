import Navbar from "@/components/Navbar";
export default function layout(
    { children }: { children: React.ReactNode }
) {
    return (
        <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
            <Navbar />
            {children}
        </main>
    );
}