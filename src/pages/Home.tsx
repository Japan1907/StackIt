import React, { useState, useEffect } from 'react';
import { Filter, TrendingUp, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionCard from '@/components/QuestionCard';
import { useQuestions } from '@/hooks/useQuestions';

type SortOption = 'newest' | 'votes' | 'answers';

interface HomeProps {
  searchTerm: string;
  selectedTags: string[];
}

export default function Home({ searchTerm, selectedTags }: HomeProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  
  const { questions, filterQuestions } = useQuestions();

  useEffect(() => {
    const filtered = filterQuestions(searchTerm, selectedTags, sortBy);
    setFilteredQuestions(filtered);
  }, [searchTerm, selectedTags, sortBy, questions, filterQuestions]);

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Questions</h1>
          <p className="text-muted-foreground">
            {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
            {(searchTerm || selectedTags.length > 0) && (
              <span> • Filtered results</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-wrap gap-2">
        <Button 
          variant={sortBy === 'votes' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleSortChange('votes')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Hot
        </Button>
        <Button 
          variant={sortBy === 'newest' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleSortChange('newest')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Recent
        </Button>
        <Button 
          variant={sortBy === 'answers' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleSortChange('answers')}
        >
          <Users className="h-4 w-4 mr-2" />
          Most Answers
        </Button>
      </div>

      {searchTerm && (
        <div className="text-sm text-muted-foreground">
          Searching for: "<span className="font-medium">{searchTerm}</span>"
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Filtered by tags:</span>
          {selectedTags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded-md">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || selectedTags.length > 0 
                ? 'No questions found matching your criteria.' 
                : 'No questions yet. Be the first to ask one!'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}