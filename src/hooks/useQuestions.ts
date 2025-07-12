import { useApp } from '@/contexts/AppContext';
import type { Question, Answer } from '@/contexts/AppContext';

export function useQuestions() {
  const { state, dispatch } = useApp();

  const createQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'answers'>) => {
    const newQuestion: Question = {
      ...questionData,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      votes: 0,
      answers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_QUESTION', payload: newQuestion });
    return newQuestion;
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    const question = state.questions.find(q => q.id === questionId);
    if (!question) return null;

    const updatedQuestion = {
      ...question,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_QUESTION', payload: updatedQuestion });
    return updatedQuestion;
  };

  const deleteQuestion = (questionId: string) => {
    dispatch({ type: 'DELETE_QUESTION', payload: questionId });
  };

  const voteQuestion = (questionId: string, vote: 'up' | 'down' | null) => {
    dispatch({ type: 'VOTE_QUESTION', payload: { questionId, vote } });
  };

  const addAnswer = (questionId: string, answerData: Omit<Answer, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'comments'>) => {
    const newAnswer: Answer = {
      ...answerData,
      id: `a_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      votes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_ANSWER', payload: { questionId, answer: newAnswer } });
    
    // Add notification to question author
    if (state.currentUser && answerData.author.id !== getQuestionAuthorId(questionId)) {
      const notification = {
        id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: getQuestionAuthorId(questionId) || '',
        type: 'answer' as const,
        message: `${answerData.author.username} answered your question`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: questionId,
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }

    return newAnswer;
  };

  const voteAnswer = (answerId: string, vote: 'up' | 'down' | null) => {
    dispatch({ type: 'VOTE_ANSWER', payload: { answerId, vote } });
  };

  const acceptAnswer = (questionId: string, answerId: string) => {
    dispatch({ type: 'ACCEPT_ANSWER', payload: { questionId, answerId } });
  };

  const getQuestionAuthorId = (questionId: string) => {
    const question = state.questions.find(q => q.id === questionId);
    return question?.author.id;
  };

  const filterQuestions = (searchTerm: string, tags: string[], sortBy: 'newest' | 'votes' | 'answers') => {
    let filtered = state.questions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tags
    if (tags.length > 0) {
      filtered = filtered.filter(q =>
        tags.some(tag => q.tags.includes(tag))
      );
    }

    // Sort questions
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'votes':
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case 'answers':
        filtered.sort((a, b) => b.answers.length - a.answers.length);
        break;
    }

    return filtered;
  };

  const getAllTags = () => {
    const tagCounts = new Map<string, number>();
    
    state.questions.forEach(question => {
      question.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ name: tag, count }))
      .sort((a, b) => b.count - a.count);
  };

  return {
    questions: state.questions,
    loading: state.loading,
    error: state.error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    voteQuestion,
    addAnswer,
    voteAnswer,
    acceptAnswer,
    filterQuestions,
    getAllTags,
  };
}