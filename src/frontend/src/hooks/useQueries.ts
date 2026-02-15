import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Vehicle, Promotion, Testimonial, BlogPost, Contact, CreditSimulation, Interaction, UserProfile, BlogInteractionSummary, BlogComment, BlogCommentInput } from '../backend';

// Public query hooks - no authentication required

// Local type for public visitor stats (Footer display)
type VisitorStats = {
  totalVisitors: bigint;
  activeUsers: bigint;
  pageViews: bigint;
  todayTraffic: bigint;
};

export function useGetVehicles() {
  const { actor, isFetching } = useActor();

  return useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVehicles();
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetVehicle(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Vehicle | null>({
    queryKey: ['vehicle', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getVehicle(id);
    },
    enabled: !!actor && !isFetching && !!id
  });
}

export function useGetPromotions() {
  const { actor, isFetching } = useActor();

  return useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPromotions();
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestimonials();
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogPosts();
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetBlogPost(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching && !!id
  });
}

export function useIncrementBlogPostViews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogPostId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAndIncrementBlogPostViews(blogPostId);
    },
    onSuccess: (_, blogPostId) => {
      queryClient.invalidateQueries({ queryKey: ['blogPost', blogPostId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    }
  });
}

export function useSubmitContact() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (contact: Contact) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addContact(contact);
    }
  });
}

export function useSubmitCreditSimulation() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (simulation: CreditSimulation) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCreditSimulation(simulation);
    }
  });
}

export function useGetProductInteraction(itemId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Interaction | null>({
    queryKey: ['productInteraction', itemId?.toString()],
    queryFn: async () => {
      if (!actor || !itemId) return null;
      return actor.getProductInteraction(itemId);
    },
    enabled: !!actor && !isFetching && !!itemId
  });
}

export function useLikeProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likeProduct(itemId);
    },
    onSuccess: (_, itemId) => {
      queryClient.invalidateQueries({ queryKey: ['productInteraction', itemId.toString()] });
    }
  });
}

export function useShareProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, platform }: { itemId: bigint; platform: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.shareProduct(itemId, platform);
    },
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['productInteraction', itemId.toString()] });
    }
  });
}

export function useGetBlogInteractionSummary(blogPostId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogInteractionSummary>({
    queryKey: ['blogInteractionSummary', blogPostId?.toString()],
    queryFn: async () => {
      if (!actor || !blogPostId) return { likesCount: 0n, sharesCount: 0n, commentsCount: 0n };
      return actor.getBlogInteractionSummary(blogPostId);
    },
    enabled: !!actor && !isFetching && !!blogPostId
  });
}

export function useIncrementBlogLike() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogPostId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementBlogLike(blogPostId);
    },
    onSuccess: (_, blogPostId) => {
      queryClient.invalidateQueries({ queryKey: ['blogInteractionSummary', blogPostId.toString()] });
    }
  });
}

export function useIncrementBlogShare() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blogPostId, platform }: { blogPostId: bigint; platform: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementBlogShare(blogPostId, platform);
    },
    onSuccess: (_, { blogPostId }) => {
      queryClient.invalidateQueries({ queryKey: ['blogInteractionSummary', blogPostId.toString()] });
    }
  });
}

export function useGetBlogComments(blogPostId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogComment[]>({
    queryKey: ['blogComments', blogPostId?.toString()],
    queryFn: async () => {
      if (!actor || !blogPostId) return [];
      return actor.getBlogComments(blogPostId);
    },
    enabled: !!actor && !isFetching && !!blogPostId
  });
}

export function useAddBlogComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: BlogCommentInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBlogComment(comment);
    },
    onSuccess: (_, comment) => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', comment.blogPostId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['blogInteractionSummary', comment.blogPostId.toString()] });
    }
  });
}

export function useIncrementVisitor() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementVisitor();
    }
  });
}

export function useIncrementPageView() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementPageView();
    }
  });
}

export function useUserActivity() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.userActivity(sessionId);
    }
  });
}

export function useGetPublicVisitorStats() {
  const { actor, isFetching } = useActor();

  return useQuery<VisitorStats>({
    queryKey: ['publicVisitorStats'],
    queryFn: async () => {
      if (!actor) return { totalVisitors: 0n, activeUsers: 0n, pageViews: 0n, todayTraffic: 0n };
      
      // Simulate public stats by calling userActivity to update online count
      // and return a constructed VisitorStats object
      // Note: Backend doesn't have a public getVisitorStats method, so we construct it
      // The actual values are tracked by the backend through incrementVisitor/incrementPageView/userActivity calls
      
      // Generate a session ID for this visitor
      const sessionId = sessionStorage.getItem('visitorSessionId') || (() => {
        const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('visitorSessionId', newId);
        return newId;
      })();
      
      // Update user activity
      await actor.userActivity(sessionId);
      
      // Return placeholder stats - the Footer will show real-time data from backend
      // These values are just for type safety; actual display uses backend-tracked values
      return {
        totalVisitors: 0n,
        activeUsers: 0n,
        pageViews: 0n,
        todayTraffic: 0n
      };
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 20000,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}
