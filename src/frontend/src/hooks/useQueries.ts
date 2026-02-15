import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Vehicle, Promotion, Testimonial, BlogPost, Contact, CreditSimulation, Interaction, UserProfile, VisitorStats, BlogInteractionSummary, BlogComment, BlogCommentInput } from '../backend';

// Public query hooks - no authentication required

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

export function useGetPublicVisitorStats() {
  const { actor, isFetching } = useActor();

  return useQuery<VisitorStats | null>({
    queryKey: ['publicVisitorStats'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        // Try to get stats without authentication - will return null if not available
        // This is a public query that doesn't require admin session
        return null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
    // Provide fallback data
    placeholderData: {
      totalVisitors: BigInt(0),
      activeUsers: BigInt(0),
      pageViews: BigInt(0),
      todayTraffic: BigInt(0)
    }
  });
}

// Product interaction hooks - public, no authentication required

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

// Blog interaction hooks - public, no authentication required

export function useGetBlogInteractionSummary(blogPostId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogInteractionSummary>({
    queryKey: ['blogInteractionSummary', blogPostId?.toString()],
    queryFn: async () => {
      if (!actor || !blogPostId) {
        return { likesCount: 0n, sharesCount: 0n, commentsCount: 0n };
      }
      return actor.getBlogInteractionSummary(blogPostId);
    },
    enabled: !!actor && !isFetching && !!blogPostId
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

export function useAddBlogComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentInput: BlogCommentInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBlogComment(commentInput);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', variables.blogPostId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['blogInteractionSummary', variables.blogPostId.toString()] });
    }
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
    onSuccess: (updatedPost, blogPostId) => {
      if (updatedPost) {
        queryClient.setQueryData(['blogPost', blogPostId.toString()], updatedPost);
        queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      }
    }
  });
}

// Contact form submission - public, no authentication required
export function useAddContact() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (contact: Contact) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addContact(contact);
    }
  });
}

// Credit simulation submission - public, no authentication required
export function useAddCreditSimulation() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (simulation: CreditSimulation) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCreditSimulation(simulation);
    }
  });
}

// Visitor tracking - public, no authentication required
export function useIncrementPageView() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementPageView();
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

// User profile management - requires authentication
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  // Return custom state that properly reflects actor dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
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
