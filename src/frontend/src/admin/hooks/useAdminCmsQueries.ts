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
  SimpleMediaAsset,
  ExtendedVisitorStats,
  UserProfile,
  SiteBanner,
  BlogComment,
} from '../../backend';

function getSessionToken(): string {
  const session = getAdminSession();
  if (!session?.token) {
    throw new Error('No admin session found');
  }
  return session.token;
}

// Vehicles
export function useCreateVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.createVehicle(token, vehicle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useUpdateVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.updateVehicle(token, vehicle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useDeleteVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.deleteVehicle(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

// Promotions
export function useCreatePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotion: Promotion) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.createPromotion(token, promotion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
}

export function useUpdatePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotion: Promotion) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.updatePromotion(token, promotion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
}

export function useDeletePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.deletePromotion(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
}

// Testimonials
export function useCreateTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.createTestimonial(token, testimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.updateTestimonial(token, testimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.deleteTestimonial(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

// Blog Posts
export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.createBlogPost(token, post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.updateBlogPost(token, post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.deleteBlogPost(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

// Contacts
export function useGetContacts() {
  const { actor, isFetching } = useActor();

  return useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      const result = await actor.getContacts(token);
      return result || [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.deleteContact(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// Credit Simulations
export function useGetCreditSimulations() {
  const { actor, isFetching } = useActor();

  return useQuery<CreditSimulation[]>({
    queryKey: ['creditSimulations'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      const result = await actor.getCreditSimulations(token);
      return result || [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteCreditSimulation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.deleteCreditSimulation(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditSimulations'] });
    },
  });
}

// Media Assets - now using SimpleMediaAsset type from backend
export function useGetMediaAssets() {
  const { actor, isFetching } = useActor();

  return useQuery<SimpleMediaAsset[]>({
    queryKey: ['mediaAssets'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();

      // Fetch media assets in smaller pages with deduplication
      const PAGE_SIZE = 30n;
      const MAX_PAGES = 100;
      const allAssets: SimpleMediaAsset[] = [];
      const seenIds = new Set<string>();
      let offset = 0n;
      let pageCount = 0;

      while (pageCount < MAX_PAGES) {
        const page = await actor.getMediaAssets(token, offset, PAGE_SIZE);
        
        if (page.length === 0) {
          break;
        }

        // Deduplicate by ID
        let newItemsCount = 0;
        for (const asset of page) {
          const idStr = asset.id.toString();
          if (!seenIds.has(idStr)) {
            seenIds.add(idStr);
            allAssets.push(asset);
            newItemsCount++;
          }
        }

        // If no new items were added, we're seeing duplicates - stop
        if (newItemsCount === 0) {
          break;
        }

        offset += BigInt(page.length);
        pageCount++;

        // If we got fewer items than requested, we've reached the end
        if (page.length < Number(PAGE_SIZE)) {
          break;
        }
      }

      return allAssets;
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useCreateMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (asset: MediaAsset) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.createMediaAsset(token, asset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    },
  });
}

export function useDeleteMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.deleteMediaAsset(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    },
  });
}

// Visitor Stats
export function useGetExtendedVisitorStats() {
  const { actor, isFetching } = useActor();

  return useQuery<ExtendedVisitorStats>({
    queryKey: ['extendedVisitorStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.getExtendedVisitorStats(token);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

// Admin User Profile
export function useGetAdminUserProfile(adminUserId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['adminUserProfile', adminUserId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.getAdminUserProfile(token, adminUserId);
    },
    enabled: !!actor && !isFetching && adminUserId > 0n,
  });
}

export function useSaveAdminUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ adminUserId, profile }: { adminUserId: bigint; profile: UserProfile }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.saveAdminUserProfile(token, adminUserId, profile);
    },
    onSuccess: (_, { adminUserId }) => {
      queryClient.invalidateQueries({ queryKey: ['adminUserProfile', adminUserId.toString()] });
    },
  });
}

// Site Banners
export function useGetAllSiteBanners() {
  const { actor, isFetching } = useActor();

  return useQuery<SiteBanner[]>({
    queryKey: ['siteBanners'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.getAllSiteBanners(token);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSiteBanner(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SiteBanner | null>({
    queryKey: ['siteBanner', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.getSiteBanner(token, id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useUpdateSiteBanner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, imageUrl }: { id: string; imageUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.updateSiteBanner(token, id, imageUrl);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['siteBanner', id] });
      queryClient.invalidateQueries({ queryKey: ['siteBanners'] });
      queryClient.invalidateQueries({ queryKey: ['publicSiteBanners'] });
    },
  });
}

// Main Banner Image URLs
export function useGetMainBannerImageUrls() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['mainBannerImageUrls'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.getMainBannerImageUrls();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateMainBannerImageUrls() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (urls: string[]) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.updateMainBannerImageUrls(token, urls);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainBannerImageUrls'] });
      queryClient.invalidateQueries({ queryKey: ['publicSiteBanners'] });
    },
  });
}

// Blog Comments Admin
export function useGetBlogCommentsAdmin(blogPostId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogComment[]>({
    queryKey: ['blogCommentsAdmin', blogPostId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBlogComments(blogPostId);
    },
    enabled: !!actor && !isFetching && blogPostId > 0n,
  });
}

export function useDeleteBlogComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blogPostId, commentId }: { blogPostId: bigint; commentId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.deleteBlogComment(token, blogPostId, commentId);
    },
    onSuccess: (_, { blogPostId }) => {
      queryClient.invalidateQueries({ queryKey: ['blogCommentsAdmin', blogPostId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['blogComments', blogPostId.toString()] });
    },
  });
}

export function useUpdateBlogComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blogPostId,
      commentId,
      content,
    }: {
      blogPostId: bigint;
      commentId: bigint;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getSessionToken();
      return actor.updateBlogComment(token, blogPostId, commentId, content);
    },
    onSuccess: (_, { blogPostId }) => {
      queryClient.invalidateQueries({ queryKey: ['blogCommentsAdmin', blogPostId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['blogComments', blogPostId.toString()] });
    },
  });
}
