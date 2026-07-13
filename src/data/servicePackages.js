export const servicePackages = [
  {
    id: "paint-correction",

    name: "service.paint.name",
    tagline: "service.paint.tagline",
    price: "$450",
    base_price: 450,

    duration: "service.paint.duration",
    badge: "service.paint.badge",

    image:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80",

    features: [
      "service.paint.feature1",
      "service.paint.feature2",
      "service.paint.feature3",
      "service.paint.feature4",
    ],
  },

  {
    id: "ceramic-shield",

    name: "service.ceramic.name",
    tagline: "service.ceramic.tagline",
    price: "$890",
    base_price: 890,

    duration: "service.ceramic.duration",
    badge: "service.ceramic.badge",

    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",

    features: [
      "service.ceramic.feature1",
      "service.ceramic.feature2",
      "service.ceramic.feature3",
      "service.ceramic.feature4",
    ],
  },

  {
    id: "executive-interior",

    name: "service.interior.name",
    tagline: "service.interior.tagline",
    price: "$250",
    base_price: 250,

    duration: "service.interior.duration",
    badge: "service.interior.badge",

    image:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80",

    features: [
      "service.interior.feature1",
      "service.interior.feature2",
      "service.interior.feature3",
      "service.interior.feature4",
    ],
  },

  {
    id: "maintenance-cleanse",

    name: "service.maintenance.name",
    tagline: "service.maintenance.tagline",
    price: "$120",
    base_price: 120,

    duration: "service.maintenance.duration",
    badge: "service.maintenance.badge",

    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",

    features: [
      "service.maintenance.feature1",
      "service.maintenance.feature2",
      "service.maintenance.feature3",
      "service.maintenance.feature4",
    ],
  },
];

export function getServicePackageById(packageId) {
  return servicePackages.find((pkg) => pkg.id === packageId) || null;
}
