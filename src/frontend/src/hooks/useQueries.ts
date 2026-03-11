import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InstagramEntry } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<InstagramEntry[]>({
    queryKey: ["entries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      instagramUsername: string;
      area: string;
      pin: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addEntry(
        data.name,
        data.instagramUsername,
        data.area,
        data.pin,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; pin: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteEntry(data.id, data.pin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}
