import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { getAdminSession } from '../auth/adminSession';
import type { 
  Vehicle, 
  Promotion, 
  Testimonial, 
  BlogPost, 
  Contact, 
  CreditSimulation, 
  MediaAsset,
  ExtendedVisitorStats,
  BlogComment,
  UserProfile,
  SiteBanner
} from '../../backend';

function useAdminSessionToken() {
  const session = getAdminSession();
  if (!session?.token) {
    throw new Error('No admin session found');
  }
  return session.token;
}

// Visitor Stats
export function useGetExtendedVisitorStats() {
  const { actor, isFetching } = useActor();
  const sessionToken = useAdminSessionToken();

  return useQuery<ExtendedVisitorStats>({
    queryKey: ['extendedVisitorStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getExtendedVisitorStats(sessionToken);
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    refetchInterval: 10000,
  });
}

// Vehicles
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

export function useCreateVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createVehicle(sessionToken, vehicle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useUpdateVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateVehicle(sessionToken, vehicle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useDeleteVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVehicle(sessionToken, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

// Promotions
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

export function useCreatePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (promotion: Promotion) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPromotion(sessionToken, promotion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
}

export function useUpdatePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (promotion: Promotion) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePromotion(sessionToken, promotion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
}

export function useDeletePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePromotion(sessionToken, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
}

// Testimonials
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

export function useCreateTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTestimonial(sessionToken, testimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTestimonial(sessionToken, testimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTestimonial(sessionToken, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

// Blog Posts
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

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBlogPost(sessionToken, post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlogPost(sessionToken, post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBlogPost(sessionToken, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

// Blog Comments (Admin)
export function useGetBlogCommentsAdmin(blogPostId: bigint) {
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

export function useDeleteBlogComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async ({ blogPostId, commentId }: { blogPostId: bigint; commentId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBlogComment(sessionToken, blogPostId, commentId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', variables.blogPostId.toString()] });
    },
  });
}

export function useUpdateBlogComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async ({ blogPostId, commentId, content }: { blogPostId: bigint; commentId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlogComment(sessionToken, blogPostId, commentId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', variables.blogPostId.toString()] });
    },
  });
}

// Contacts
export function useGetContacts() {
  const { actor, isFetching } = useActor();
  const sessionToken = useAdminSessionToken();

  return useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getContacts(sessionToken);
      return result || [];
    },
    enabled: !!actor && !isFetching && !!sessionToken,
  });
}

export function useDeleteContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteContact(sessionToken, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// Credit Simulations
export function useGetCreditSimulations() {
  const { actor, isFetching } = useActor();
  const sessionToken = useAdminSessionToken();

  return useQuery<CreditSimulation[]>({
    queryKey: ['creditSimulations'],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getCreditSimulations(sessionToken);
      return result || [];
    },
    enabled: !!actor && !isFetching && !!sessionToken,
  });
}

export function useDeleteCreditSimulation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCreditSimulation(sessionToken, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditSimulations'] });
    },
  });
}

// Media Assets
export function useGetMediaAssets() {
  const { actor, isFetching } = useActor();
  const sessionToken = useAdminSessionToken();

  return useQuery<MediaAsset[]>({
    queryKey: ['mediaAssets'],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getMediaAssets(sessionToken);
      return result || [];
    },
    enabled: !!actor && !isFetching && !!sessionToken,
  });
}

export function useCreateMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (asset: MediaAsset) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMediaAsset(sessionToken, asset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    },
  });
}

export function useDeleteMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMediaAsset(sessionToken, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    },
  });
}

// Admin User Profile
export function useGetAdminUserProfile(adminUserId: number) {
  const { actor, isFetching } = useActor();
  const sessionToken = useAdminSessionToken();

  return useQuery<UserProfile | null>({
    queryKey: ['adminUserProfile', adminUserId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminUserProfile(sessionToken, BigInt(adminUserId));
    },
    enabled: !!actor && !isFetching && !!sessionToken && adminUserId > 0,
    retry: false,
  });
}

export function useSaveAdminUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async ({ adminUserId, profile }: { adminUserId: number; profile: UserProfile }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveAdminUserProfile(sessionToken, BigInt(adminUserId), profile);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminUserProfile', variables.adminUserId] });
    },
  });
}

// Site Banners
export function useGetAllSiteBanners() {
  const { actor, isFetching } = useActor();
  const sessionToken = useAdminSessionToken();

  return useQuery<SiteBanner[]>({
    queryKey: ['siteBanners'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSiteBanners(sessionToken);
    },
    enabled: !!actor && !isFetching && !!sessionToken,
  });
}

export function useGetSiteBanner(id: string) {
  const { actor, isFetching } = useActor();
  const sessionToken = useAdminSessionToken();

  return useQuery<SiteBanner | null>({
    queryKey: ['siteBanner', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSiteBanner(sessionToken, id);
    },
    enabled: !!actor && !isFetching && !!sessionToken && !!id,
  });
}

export function useUpdateSiteBanner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionToken = useAdminSessionToken();

  return useMutation({
    mutationFn: async ({ id, imageUrl }: { id: string; imageUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSiteBanner(sessionToken, id, imageUrl);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['siteBanners'] });
      queryClient.invalidateQueries({ queryKey: ['siteBanner', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['publicSiteBanners'] });
    },
  });
}
