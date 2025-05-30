// Converted from TypeScript: removed interfaces
// AzureSubscription, AzureResourceGroup, AzureListResponse are now just for reference as JSDoc
/**
 * @typedef {Object} AzureSubscription
 * @property {string} id
 * @property {string} subscriptionId
 * @property {string} displayName
 * @property {string} state
 * @property {Object} subscriptionPolicies
 * @property {string} subscriptionPolicies.locationPlacementId
 * @property {string} subscriptionPolicies.quotaId
 * @property {string} subscriptionPolicies.spendingLimit
 */

/**
 * @typedef {Object} AzureResourceGroup
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} type
 * @property {Object} properties
 * @property {string} properties.provisioningState
 * @property {Object<string, string>} [tags]
 */

/**
 * @typedef {Object} AzureListResponse
 * @property {Array} value
 * @property {string} [nextLink]
 */
