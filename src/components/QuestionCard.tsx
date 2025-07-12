import React from 'react';
import { ArrowUp, ArrowDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuestions } from '@/hooks/useQuestions';
import { useAuth } from '@/hooks/useAuth';
import type { Question } from '@/contexts/AppContext';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const { voteQuestion } = useQuestions();
  const { isAuthenticated } = useAuth();

  const handleVote = (vote: 'up' | 'down') => {
    if (!isAuthenticated) return;
    
    // Toggle vote if same vote, otherwise set new vote
    const newVote = question.userVote === vote ? null : vote;
    voteQuestion(question.id, newVote);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary/20 hover:border-l-primary/60">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-2 min-w-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 transition-colors ${
                question.userVote === 'up' 
                  ? 'bg-success/20 text-success hover:bg-success/30' 
                  : 'hover:bg-success/10 hover:text-success'
              }`}
              onClick={() => handleVote('up')}
              disabled={!isAuthenticated}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-center">{question.votes}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 transition-colors ${
                question.userVote === 'down' 
                  ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' 
                  : 'hover:bg-destructive/10 hover:text-destructive'
              }`}
              onClick={() => handleVote('down')}
              disabled={!isAuthenticated}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Answer Count */}
          <div className="flex flex-col items-center justify-center min-w-0">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
              question.acceptedAnswerId 
                ? 'bg-success text-success-foreground' 
                : question.answers.length > 0 
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground'
            }`}>
              {question.acceptedAnswerId && <Check className="h-3 w-3" />}
              <span>{question.answers.length}</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">answers</span>
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer transition-colors">
              {question.title}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {question.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Author and Meta */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <img
                  src={question.author.avatar || '/placeholder.svg'}
                  alt={question.author.username}
                  className="h-6 w-6 rounded-full"
                />
                <span className="font-medium">{question.author.username}</span>
                <span className="text-xs">({question.author.reputation})</span>
              </div>
              <time className="text-xs">
                {formatDate(question.createdAt)}
              </time>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}