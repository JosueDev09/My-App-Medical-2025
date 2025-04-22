import '../styles/globals.css';
import TopBar from "@/components/topbar/topbar";
import Sidebar from '@/components/sidebar';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
    <body className="min-h-screen flex">
      <Sidebar />

      <div className="flex flex-col flex-1 h-screen overflow-hidden ml-64">
        <TopBar />     
        <main className="flex-1 p-6 w-full overflow-auto">
          {children}
        </main>
      </div>
    </body>

    </html>
  );
}
