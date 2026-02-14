import { useEffect, useRef } from 'react';
import { useIncrementPageView, useIncrementVisitor } from './useQueries';

export function useVisitorTracking() {
  const incrementPageView = useIncrementPageView();
  const incrementVisitor = useIncrementVisitor();
  const hasTrackedVisitor = useRef(false);

  useEffect(() => {
    const visitorTracked = sessionStorage.getItem('visitorTracked');
    
    if (!visitorTracked && !hasTrackedVisitor.current) {
      incrementVisitor.mutate();
      sessionStorage.setItem('visitorTracked', 'true');
      hasTrackedVisitor.current = true;
    }

    incrementPageView.mutate();
  }, []);
}
