
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { 
  Home, 
  Library, 
  Search, 
  BookOpen, 
  PlusCircle,
  Settings, 
  LayoutDashboard,
  Clock,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-display font-medium text-lg"
          onClick={onClose}
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground overflow-hidden">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-4 w-4"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </span>
          <span>Bibliophile</span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto md:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 py-4 px-3">
        <motion.div
          className="flex flex-col gap-1"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <NavLink
              to="/"
              className={({ isActive }) => cn(
                "sidebar-item",
                isActive && "active"
              )}
              onClick={onClose}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </NavLink>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <NavLink
              to="/books"
              className={({ isActive }) => cn(
                "sidebar-item",
                isActive && "active"
              )}
              onClick={onClose}
            >
              <Library className="h-4 w-4" />
              <span>Book Catalog</span>
            </NavLink>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <NavLink
              to="/search"
              className={({ isActive }) => cn(
                "sidebar-item",
                isActive && "active"
              )}
              onClick={onClose}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </NavLink>
          </motion.div>
          
          {user && (
            <>
              <Separator className="my-2" />
              
              <motion.div variants={itemVariants}>
                <NavLink
                  to="/borrowed"
                  className={({ isActive }) => cn(
                    "sidebar-item",
                    isActive && "active"
                  )}
                  onClick={onClose}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>My Borrowed Books</span>
                </NavLink>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink
                  to="/history"
                  className={({ isActive }) => cn(
                    "sidebar-item",
                    isActive && "active"
                  )}
                  onClick={onClose}
                >
                  <Clock className="h-4 w-4" />
                  <span>Borrowing History</span>
                </NavLink>
              </motion.div>
            </>
          )}
          
          {user && user.role === 'admin' && (
            <>
              <Separator className="my-2" />
              <p className="px-4 py-2 text-xs font-medium text-muted-foreground">Admin</p>
              
              <motion.div variants={itemVariants}>
                <NavLink
                  to="/admin/books"
                  className={({ isActive }) => cn(
                    "sidebar-item",
                    isActive && "active"
                  )}
                  onClick={onClose}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </NavLink>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink
                  to="/admin/books/new"
                  className={({ isActive }) => cn(
                    "sidebar-item",
                    isActive && "active"
                  )}
                  onClick={onClose}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add New Book</span>
                </NavLink>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) => cn(
                    "sidebar-item",
                    isActive && "active"
                  )}
                  onClick={onClose}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </NavLink>
              </motion.div>
            </>
          )}
        </motion.div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-screen w-64 border-r bg-background">
        <SidebarContent />
      </div>

      {/* Mobile sidebar (drawer) */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
