import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Usuario } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
  usuario: Usuario;
}

export default function DashboardLayout({
  children,
  usuario,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar rol={usuario.rol} />
      <div className="lg:pl-64">
        <Header usuario={usuario} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
