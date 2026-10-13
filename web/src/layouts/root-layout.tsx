import { Outlet } from 'react-router';
import { Header } from './components/header';
import { WorkspaceSidebar } from './components/workspace-sidebar';

export function RootLayoutContainer({ children }: React.PropsWithChildren) {
  return (
    <div className="grid size-full min-w-0 grid-cols-1 overflow-hidden bg-bg-base lg:grid-cols-[216px_minmax(0,1fr)]">
      <WorkspaceSidebar />
      <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)]">
        <Header className="border-b border-border-button px-5 py-2" />
        <main className="size-full min-h-0 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout() {
  return (
    <RootLayoutContainer>
      <Outlet />
    </RootLayoutContainer>
  );
}
