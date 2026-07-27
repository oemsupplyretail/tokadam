export const shippingRates = {
  "Johor": 12,
  "Kedah": 12,
  "Kelantan": 12,
  "Kuala Lumpur": 12,
  "Labuan": 18,
  "Melaka": 12,
  "Negeri Sembilan": 12,
  "Pahang": 12,
  "Perak": 12,
  "Perlis": 12,
  "Pulau Pinang": 12,
  "Putrajaya": 12,
  "Sabah": 18,
  "Sarawak": 18,
  "Selangor": 12,
  "Terengganu": 12,
} as const;

export type MalaysianState = keyof typeof shippingRates;
export const malaysianStates = Object.keys(shippingRates) as MalaysianState[];

export function getShippingRate(state: string): number | undefined {
  return shippingRates[state as MalaysianState];
}
