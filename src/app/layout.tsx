import { UserProvider } from '@auth0/nextjs-auth0/client';
import Navbar from '@/components/Navbar';
import SidebarWrapper from '@/components/SidebarWrapper';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>
        <body className="bg-zinc-950 text-white min-h-screen flex flex-col">
          <Navbar />
          <SidebarWrapper>{children}</SidebarWrapper>
        </body>
      </UserProvider>
    </html>
  );
}
