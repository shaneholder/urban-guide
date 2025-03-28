export interface AzureSubscription {
  id: string;
  subscriptionId: string;
  displayName: string;
  state: string;
  subscriptionPolicies: {
    locationPlacementId: string;
    quotaId: string;
    spendingLimit: string;
  };
}

export interface AzureResourceGroup {
  id: string;
  name: string;
  location: string;
  type: string;
  properties: {
    provisioningState: string;
  };
  tags?: Record<string, string>;
}

export interface AzureListResponse<T> {
  value: T[];
  nextLink?: string;
}
