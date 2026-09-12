import { Outlet, useLocation } from 'react-router-dom'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'
import { Header } from './Header'

export function Shell() {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-background text-text-main flex-col md:flex-row">
      <DesktopNav />
      <div className="flex flex-1 flex-col pb-20 md:pb-0">
        <Header />
        {/* Page Transition Wrapper */}
        <main 
          key={location.pathname}
          className="flex-1 p-6 md:p-10 lg:p-16 w-full max-w-6xl mx-auto animate-fade-in"
        >
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
