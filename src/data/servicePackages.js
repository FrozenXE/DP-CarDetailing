export const servicePackages = [
  {
    id: 'paint-correction',
    name: 'Multi-Stage Paint Correction',
    tagline: 'Flawless Mirror Depth Restoration',
    price: '$450',
    base_price: 450,
    duration: '6 - 8 Hours',
    badge: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
    features: [
      'Dual-action micro-compound cutting stage',
      'Jeweling polish steps to reveal true optical clarity',
      'Removes up to 90% of spiderweb clear coat swirls',
      'Includes synthetic SiO2 gloss sealant barrier'
    ]
  },
  {
    id: 'ceramic-shield',
    name: 'Certified 9H Ceramic Shield',
    tagline: 'Permanent Nanotech Sacrificial Layer',
    price: '$890',
    base_price: 890,
    duration: '1.5 - 2 Days',
    badge: 'Elite Protection',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    features: [
      'Full initial paint decontamination prep',
      'Certified dual-layer high-solid SiO2 application',
      'Hydrophobic anti-static self-cleaning properties',
      'Infrared climate curing validation inside studio'
    ]
  },
  {
    id: 'executive-interior',
    name: 'Executive Interior Suite',
    tagline: 'Microbial Extraction & Purification',
    price: '$250',
    base_price: 250,
    duration: '3 - 4 Hours',
    badge: 'Deep Cleanse',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80',
    features: [
      'Thermodynamic hot steam injection extraction',
      'Fine detailing brushes on sensitive switches & trim vents',
      'Ph-neutral premium leather reconditioning feeds',
      'Ozone odor neutralization gas sanitation cycle'
    ]
  },
  {
    id: 'maintenance-cleanse',
    name: 'Signature Studio Cleanse',
    tagline: 'Precision Care For Coated Vehicles',
    price: '$120',
    base_price: 120,
    duration: '1.5 Hours',
    badge: 'Regular Upkeep',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    features: [
      'Three-bucket hand matrix wash method using grit guards',
      'Forced multi-port filtered heated air blow-dry lines',
      'Wheels deep barrel iron fallout chemical brake strip',
      'Streak-free interior dash and clear glass treatment'
    ]
  }
];

export function getServicePackageById(packageId) {
  return servicePackages.find((pkg) => pkg.id === packageId) || null;
}
