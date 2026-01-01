"use client";

import { getCurrentOrganization } from "@/actions/organization";
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";

type OrgQueryKey = [string, ...any[]];

export function useOrgQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
>(
  baseQueryKey: OrgQueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, QueryKey>,
    "queryKey" | "queryFn"
  >
) {
  const { data: orgContext, isLoading: isLoadingOrgContext } = useQuery({
    queryKey: ["org-context"],
    queryFn: () => getCurrentOrganization(),
    staleTime: Infinity,
    retry: 1,
  });

  const organizationId = orgContext?.id;
  const environment = orgContext?.environment;

  // Construct query key with org context
  const queryKey: QueryKey =
    organizationId && environment
      ? [...baseQueryKey, organizationId, environment]
      : baseQueryKey;

  const result = useQuery<TQueryFnData, TError, TData>({
    queryKey,
    queryFn,
    enabled:
      !isLoadingOrgContext &&
      !!organizationId &&
      !!environment &&
      (options?.enabled ?? true),
    ...options,
  });

  // Combine loading states
  return {
    ...result,
    isLoading: isLoadingOrgContext || result.isLoading,
    isPending: isLoadingOrgContext || result.isPending,
  };
}
