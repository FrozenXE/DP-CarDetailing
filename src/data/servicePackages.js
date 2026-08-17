import opaImg from "/public/opa.jpg";
import keramickoImg from "/keramicko.png";
import popIMG from "/pop.png";
import tinIMG from "/tin.png";

export const servicePackages = [
  {
    id: "paint-correction",

    name: "service.paint.name",
    tagline: "service.paint.tagline",
    price: "$450",
    base_price: 450,

    duration: "service.paint.duration",
    badge: "service.paint.badge",

    image: opaImg,
    summary: "service.paint.summary",
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

    image: keramickoImg,
    summary: "service.ceramic.summary",
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

    image: popIMG,
    summary: "service.interior.summary",

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

    image: tinIMG,
    summary: "service.maintenance.summary",

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
