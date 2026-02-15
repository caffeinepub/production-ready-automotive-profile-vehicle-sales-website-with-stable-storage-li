import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { getAdminToken } from '../auth/adminSession';
import type { Vehicle, Promotion, Testimonial, BlogPost, Contact, CreditSimulation, MediaAsset, VisitorStats, BlogComment } from '../../backend';

export function useGetMediaAssets() {
  const { actor, isFetching } = useActor();
  const token = getAdminToken();

  return useQuery<MediaAsset[]>({
    queryKey: ['mediaAssets', token],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin session required');
      const result = await actor.getMediaAssets(token);
      if (result === null) throw new Error('Session expired or unauthorized');
      return result;
    },
    enabled: !!actor && !isFetching && !!token
  });
}

export function useCreateMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (asset: MediaAsset) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.createMediaAsset(token, asset);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    }
  });
}

export function useDeleteMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.deleteMediaAsset(token, id);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    }
  });
}

export function useGetContacts() {
  const { actor, isFetching } = useActor();
  const token = getAdminToken();

  return useQuery<Contact[]>({
    queryKey: ['contacts', token],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin session required');
      const result = await actor.getContacts(token);
      if (result === null) throw new Error('Session expired or unauthorized');
      return result;
    },
    enabled: !!actor && !isFetching && !!token
  });
}

export function useDeleteContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.deleteContact(token, id);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });
}

export function useGetCreditSimulations() {
  const { actor, isFetching } = useActor();
  const token = getAdminToken();

  return useQuery<CreditSimulation[]>({
    queryKey: ['creditSimulations', token],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin session required');
      const result = await actor.getCreditSimulations(token);
      if (result === null) throw new Error('Session expired or unauthorized');
      return result;
    },
    enabled: !!actor && !isFetching && !!token
  });
}

export function useDeleteCreditSimulation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.deleteCreditSimulation(token, id);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditSimulations'] });
    }
  });
}

export function useGetVisitorStats() {
  const { actor, isFetching } = useActor();
  const token = getAdminToken();

  return useQuery<VisitorStats>({
    queryKey: ['visitorStats', token],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin session required');
      const result = await actor.getVisitorStats(token);
      if (result === null) throw new Error('Session expired or unauthorized');
      return result;
    },
    enabled: !!actor && !isFetching && !!token
  });
}

export function useUpdateVisitorStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stats: VisitorStats) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.updateVisitorStats(token, stats);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitorStats'] });
    }
  });
}

export function useCreateVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.createVehicle(token, vehicle);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}

export function useUpdateVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.updateVehicle(token, vehicle);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}

export function useDeleteVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.deleteVehicle(token, id);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}

export function useCreatePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotion: Promotion) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.createPromotion(token, promotion);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
}

export function useUpdatePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotion: Promotion) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.updatePromotion(token, promotion);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
}

export function useDeletePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.deletePromotion(token, id);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
}

export function useCreateTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.createTestimonial(token, testimonial);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    }
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.updateTestimonial(token, testimonial);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    }
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.deleteTestimonial(token, id);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    }
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.createBlogPost(token, post);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    }
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.updateBlogPost(token, post);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    }
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      const result = await actor.deleteBlogPost(token, id);
      if (result === false) throw new Error('Session expired or unauthorized');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    }
  });
}

// Blog comment admin hooks

export function useGetBlogCommentsAdmin(blogPostId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  const token = getAdminToken();

  return useQuery<BlogComment[]>({
    queryKey: ['adminBlogComments', blogPostId?.toString(), token],
    queryFn: async () => {
      if (!actor || !blogPostId) return [];
      if (!token) throw new Error('Admin session required');
      return actor.getBlogComments(blogPostId);
    },
    enabled: !!actor && !isFetching && !!token && !!blogPostId
  });
}

export function useDeleteBlogComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      await actor.deleteBlogComment(token, commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogComments'] });
      queryClient.invalidateQueries({ queryKey: ['blogInteractionSummary'] });
    }
  });
}

export function useApproveBlogComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      await actor.approveBlogComment(token, commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogComments'] });
      queryClient.invalidateQueries({ queryKey: ['blogComments'] });
    }
  });
}
