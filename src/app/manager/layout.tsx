import ManagerSidebar from "@/components/manager/manager-sidebar";
import ManagerHeader from "@/components/manager/manager-header";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      <ManagerHeader />
      <div className="flex flex-1 mx-4">
        <ManagerSidebar />
        <main className="flex-1 overflow-auto m-4 container mx-auto md:ml-4">
          {children}
        </main>
      </div>
    </div>
  )
}
