import { useEffect, useRef } from 'react';
import { useIncrementPageView, useIncrementVisitor, useUserActivity } from './useQueries';
import { useActor } from './useActor';

export function useVisitorTracking() {
  const { actor, isFetching } = useActor();
  const incrementPageView = useIncrementPageView();
  const incrementVisitor = useIncrementVisitor();
  const userActivity = useUserActivity();
  const hasTrackedVisitor = useRef(false);
  const hasTrackedPageView = useRef(false);
  const presenceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const visitorSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Wait for actor to be ready
    if (!actor || isFetching) {
      return;
    }

    // Get or create a stable visitor session ID
    if (!visitorSessionIdRef.current) {
      let visitorSessionId = sessionStorage.getItem('visitorSessionId');
      if (!visitorSessionId) {
        visitorSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('visitorSessionId', visitorSessionId);
      }
      visitorSessionIdRef.current = visitorSessionId;
    }

    // Track unique visitor once per browser session
    const visitorTracked = sessionStorage.getItem('visitorTracked');
    if (!visitorTracked && !hasTrackedVisitor.current) {
      incrementVisitor.mutate(undefined, {
        onSuccess: () => {
          sessionStorage.setItem('visitorTracked', 'true');
          hasTrackedVisitor.current = true;
        },
        onError: (error) => {
          console.error('Failed to track visitor:', error);
        }
      });
    }

    // Track page view on every mount (once per component mount)
    if (!hasTrackedPageView.current) {
      incrementPageView.mutate(undefined, {
        onSuccess: () => {
          hasTrackedPageView.current = true;
        },
        onError: (error) => {
          console.error('Failed to track page view:', error);
        }
      });
    }

    // Update presence immediately
    if (visitorSessionIdRef.current) {
      userActivity.mutate(visitorSessionIdRef.current, {
        onError: (error) => {
          console.error('Failed to update user activity:', error);
        }
      });

      // Set up periodic presence ping (every 5 minutes to stay within 15-minute expiry window)
      if (!presenceIntervalRef.current) {
        presenceIntervalRef.current = setInterval(() => {
          if (visitorSessionIdRef.current) {
            userActivity.mutate(visitorSessionIdRef.current, {
              onError: (error) => {
                console.error('Failed to update user activity:', error);
              }
            });
          }
        }, 5 * 60 * 1000); // 5 minutes
      }
    }

    // Cleanup interval on unmount
    return () => {
      if (presenceIntervalRef.current) {
        clearInterval(presenceIntervalRef.current);
        presenceIntervalRef.current = null;
      }
    };
  }, [actor, isFetching]);
}
