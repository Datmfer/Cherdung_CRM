import SupportSidebar from "../navigation/SupportSidebar";

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SupportSidebar />
      <main className="flex-1 bg-gray-50 dark:bg-[#0f0f0f]">
        {children}
      </main>
    </div>
  );
}