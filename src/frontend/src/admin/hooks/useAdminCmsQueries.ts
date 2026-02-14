import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { getAdminToken } from '../auth/adminSession';
import type { Vehicle, Promotion, Testimonial, BlogPost, Contact, CreditSimulation, MediaAsset, VisitorStats } from '../../backend';

export function useGetMediaAssets() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaAsset[]>({
    queryKey: ['mediaAssets'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      return actor.getMediaAssets(token);
    },
    enabled: !!actor && !isFetching
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
      return actor.createMediaAsset(token, asset);
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
      return actor.deleteMediaAsset(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    }
  });
}

export function useGetContacts() {
  const { actor, isFetching } = useActor();

  return useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      return actor.getContacts(token);
    },
    enabled: !!actor && !isFetching
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
      return actor.deleteContact(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });
}

export function useGetCreditSimulations() {
  const { actor, isFetching } = useActor();

  return useQuery<CreditSimulation[]>({
    queryKey: ['creditSimulations'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      return actor.getCreditSimulations(token);
    },
    enabled: !!actor && !isFetching
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
      return actor.deleteCreditSimulation(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditSimulations'] });
    }
  });
}

export function useGetVisitorStats() {
  const { actor, isFetching } = useActor();

  return useQuery<VisitorStats>({
    queryKey: ['visitorStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminToken();
      if (!token) throw new Error('Admin session required');
      return actor.getVisitorStats(token);
    },
    enabled: !!actor && !isFetching
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
      return actor.updateVisitorStats(token, stats);
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
      return actor.createVehicle(token, vehicle);
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
      return actor.updateVehicle(token, vehicle);
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
      return actor.deleteVehicle(token, id);
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
      return actor.createPromotion(token, promotion);
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
      return actor.updatePromotion(token, promotion);
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
      return actor.deletePromotion(token, id);
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
      return actor.createTestimonial(token, testimonial);
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
      return actor.updateTestimonial(token, testimonial);
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
      return actor.deleteTestimonial(token, id);
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
      return actor.createBlogPost(token, post);
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
      return actor.updateBlogPost(token, post);
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
      return actor.deleteBlogPost(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    }
  });
}
