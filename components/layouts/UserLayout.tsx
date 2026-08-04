import UserSidebar from "../navigation/UserSidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <main className="flex-1 bg-gray-50 dark:bg-[#0f0f0f]">
        {children}
      </main>
    </div>
  );
}