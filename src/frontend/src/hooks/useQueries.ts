import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  Vehicle, 
  Promotion, 
  Testimonial, 
  BlogPost, 
  Contact, 
  CreditSimulation,
  BlogCommentInput,
  BlogComment,
  BlogInteractionSummary,
  ExtendedVisitorStats,
  UserProfile,
  SiteBanner
} from '../backend';

// Public Vehicles
export function useGetVehicles() {
  const { actor, isFetching } = useActor();

  return useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVehicles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVehicle(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Vehicle | null>({
    queryKey: ['vehicle', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVehicle(id);
    },
    enabled: !!actor && !isFetching && id > 0n,
  });
}

// Public Promotions
export function useGetPromotions() {
  const { actor, isFetching } = useActor();

  return useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPromotions();
    },
    enabled: !!actor && !isFetching,
  });
}

// Public Testimonials
export function useGetTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

// Public Blog Posts
export function useGetBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAndIncrementBlogPostViews(id);
    },
    enabled: !!actor && !isFetching && id > 0n,
  });
}

// Blog Interactions
export function useGetBlogInteractionSummary(blogPostId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogInteractionSummary>({
    queryKey: ['blogInteractionSummary', blogPostId.toString()],
    queryFn: async () => {
      if (!actor) return { likesCount: 0n, sharesCount: 0n, commentsCount: 0n };
      return actor.getBlogInteractionSummary(blogPostId);
    },
    enabled: !!actor && !isFetching && blogPostId > 0n,
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
    },
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
    },
  });
}

// Blog Comments
export function useGetBlogComments(blogPostId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogComment[]>({
    queryKey: ['blogComments', blogPostId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      const allComments = await actor.getBlogComments(blogPostId);
      return allComments.filter(comment => comment.blogPostId === blogPostId);
    },
    enabled: !!actor && !isFetching && blogPostId > 0n,
  });
}

export function useAddBlogComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: BlogCommentInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBlogComment(input);
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', input.blogPostId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['blogInteractionSummary', input.blogPostId.toString()] });
    },
  });
}

// Contact Form
export function useSubmitContact() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (contact: Contact) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addContact(contact);
    },
  });
}

// Credit Simulation
export function useSubmitCreditSimulation() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (simulation: CreditSimulation) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCreditSimulation(simulation);
    },
  });
}

// Visitor Tracking
export function useIncrementVisitor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementVisitor();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footerVisitorStats'] });
    },
  });
}

export function useIncrementPageView() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementPageView();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footerVisitorStats'] });
    },
  });
}

export function useUserActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.userActivity(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footerVisitorStats'] });
    },
  });
}

// Footer Visitor Stats
export function useGetFooterVisitorStats() {
  const { actor, isFetching } = useActor();

  return useQuery<ExtendedVisitorStats>({
    queryKey: ['footerVisitorStats'],
    queryFn: async () => {
      if (!actor) return {
        totalVisitors: 0n,
        pageViews: 0n,
        todayTraffic: 0n,
        yesterdayTraffic: 0n,
        weeklyTraffic: 0n,
        monthlyTraffic: 0n,
        yearlyTraffic: 0n,
        onlineVisitors: 0n,
      };
      return actor.getFooterVisitorStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

// User Profile (Principal-based, for non-admin usage)
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
    },
  });
}

// Public Site Banners
export function useGetPublicSiteBanners() {
  const { actor, isFetching } = useActor();

  return useQuery<{ mainBannerUrls: string[]; ctaBanner: string | null }>({
    queryKey: ['publicSiteBanners'],
    queryFn: async () => {
      if (!actor) return { mainBannerUrls: [], ctaBanner: null };
      
      try {
        // Fetch main banner URLs
        const mainBannerUrls = await actor.getMainBannerImageUrls();
        
        // For CTA banner, we'll need to fetch via the site banner method
        // Since there's no public method, we return null and use fallback
        return { 
          mainBannerUrls: mainBannerUrls || [], 
          ctaBanner: null 
        };
      } catch (error) {
        console.error('Error fetching banners:', error);
        return { mainBannerUrls: [], ctaBanner: null };
      }
    },
    enabled: !!actor && !isFetching,
  });
}
