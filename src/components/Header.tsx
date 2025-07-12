import React, { useState } from 'react';
import { Search, Bell, Plus, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import AuthModal from './AuthModal';
import QuestionForm from './QuestionForm';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAskQuestion = () => {
    if (!isAuthenticated) {
      handleAuthClick('login');
      return;
    }
    setIsQuestionFormOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <div className="h-6 w-6 rounded bg-gradient-primary"></div>
              <span className="hidden font-bold sm:inline-block">StackIt</span>
            </a>
          </div>
          
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  className="pl-8 md:w-[300px] lg:w-[400px]"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>
            
            <nav className="flex items-center space-x-2">
              <Button variant="default" size="sm" onClick={handleAskQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
              
              {isAuthenticated && (
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              )}
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <img
                        src={currentUser?.avatar || '/placeholder.svg'}
                        alt={currentUser?.username}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="hidden sm:inline">{currentUser?.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleAuthClick('login')}>
                    Sign In
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAuthClick('register')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />

      {isQuestionFormOpen && (
        <QuestionForm
          onClose={() => setIsQuestionFormOpen(false)}
        />
      )}
    </>
  );
}