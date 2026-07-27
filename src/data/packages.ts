export const packages = [
  { id: "package-1", quantity: 1, price: 49, image: "/images/package-01.png", bestSeller: false },
  { id: "package-2", quantity: 2, price: 89, image: "/images/package-02.png", bestSeller: false },
  { id: "package-3", quantity: 3, price: 119, image: "/images/package-03.png", bestSeller: true },
  { id: "package-4", quantity: 4, price: 149, image: "/images/package-04.png", bestSeller: false },
] as const;

export type PackageId = (typeof packages)[number]["id"];

export function getPackage(packageId: string) {
  return packages.find((item) => item.id === packageId);
}
