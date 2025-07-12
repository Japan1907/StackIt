import React from 'react';
import { Home, Tags, Users, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuestions } from '@/hooks/useQuestions';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export default function Sidebar({ selectedTags, onTagSelect }: SidebarProps) {
  const { questions, getAllTags } = useQuestions();
  const { currentUser } = useAuth();
  
  const popularTags = getAllTags().slice(0, 10);
  
  const unansweredCount = questions.filter(q => q.answers.length === 0).length;
  const myQuestionsCount = currentUser 
    ? questions.filter(q => q.author.id === currentUser.id).length 
    : 0;
  const myAnswersCount = currentUser 
    ? questions.reduce((count, q) => 
        count + q.answers.filter(a => a.author.id === currentUser.id).length, 0
      )
    : 0;

  const handleTagClick = (tagName: string) => {
    onTagSelect(tagName);
  };

  return (
    <aside className="w-64 border-r bg-muted/30 p-6 space-y-6">
      <nav className="space-y-2">
        <div className="space-y-1">
          <Button variant="default" className="w-full justify-start" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Questions
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Tags className="mr-2 h-4 w-4" />
            Tags
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
        </div>
      </nav>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Filters
        </h3>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-left" size="sm">
            <span className="truncate">Unanswered</span>
            <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
              {unansweredCount}
            </span>
          </Button>
          {currentUser && (
            <>
              <Button variant="ghost" className="w-full justify-start text-left" size="sm">
                <span className="truncate">My Questions</span>
                <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                  {myQuestionsCount}
                </span>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left" size="sm">
                <span className="truncate">My Answers</span>
                <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                  {myAnswersCount}
                </span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Popular Tags
        </h3>
        <div className="space-y-2">
          {popularTags.length > 0 ? (
            popularTags.map((tag) => (
              <Button
                key={tag.name}
                variant={selectedTags.includes(tag.name) ? "default" : "ghost"}
                className="w-full justify-between text-left p-2 h-auto"
                size="sm"
                onClick={() => handleTagClick(tag.name)}
              >
                <span className="font-medium">{tag.name}</span>
                <span className="text-xs text-muted-foreground">{tag.count}</span>
              </Button>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No tags yet</p>
          )}
        </div>
      </div>
    </aside>
  );
}