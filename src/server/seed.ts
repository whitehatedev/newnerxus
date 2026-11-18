import { count, eq } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { ensureInitialAdminUser } from '../db/users.ts';
import {
  blogs,
  brands,
  caseStudies,
  coupons,
  printingMachines,
  printingMaterials,
  productCategories,
  products,
  siteSettings,
} from '../db/schema.ts';
import { DEFAULT_PCB_PRICING_CONFIG } from './gerber.ts';

let seededOnce = false;

export const DEFAULT_HOMEPAGE_SECTIONS = [
  {
    id: 'hero',
    type: 'hero',
    visible: true,
    kicker: 'ONLINE HARDWARE, DRONES & ELECTRONICS STORE · PAN-INDIA DISPATCH',
    heading: 'Shop Precision Drone Hardware, Electronics & 3D Parts.',
    subheading:
      'Official e-commerce store of NexusTekFusion Private Limited. Buy agricultural & FPV drone components, embedded electronics, custom 3D printed assemblies, and KRASHIVANTRI UAV platforms with live Razorpay checkout.',
    primaryCtaLabel: 'Shop All Products',
    primaryCtaLink: '/shop',
    secondaryCtaLabel: 'Explore Offers & Sale',
    secondaryCtaLink: '/sale',
    imageUrl: '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg',
  },
  {
    id: 'categories',
    type: 'categories',
    visible: true,
    kicker: 'Engineering & Electronics Store',
    heading: 'Shop by Store Category',
    subheading:
      'Agricultural drone assemblies, FPV flight stacks, robotics hardware, embedded electronics, 3D printed parts, and precision tools.',
  },
  {
    id: 'featured_products',
    type: 'featured_products',
    visible: true,
    kicker: 'Featured Hardware',
    heading: 'Featured Store Products',
    primaryCtaLabel: 'Open Full Store',
    primaryCtaLink: '/shop',
  },
  {
    id: 'bestsellers',
    type: 'bestsellers',
    visible: true,
    kicker: 'Popular Inventory',
    heading: 'Best-Selling Hardware & Components',
    primaryCtaLabel: 'Shop All',
    primaryCtaLink: '/shop',
  },
  {
    id: 'new_arrivals',
    type: 'new_arrivals',
    visible: true,
    kicker: 'Latest Additions',
    heading: 'New Arrivals in Store',
    primaryCtaLabel: 'View New Stock',
    primaryCtaLink: '/shop',
  },
  {
    id: 'agri_fpv_showcase',
    type: 'agri_fpv_showcase',
    visible: true,
    kicker: 'KRASHIVANTRI Agricultural Drones',
    heading: 'KRASHIVANTRI X & KRASHIVANTRI X PRO',
    subheading:
      'Dual indigenous agricultural UAV platforms built for field spraying missions, rapid servicing, and integrated Farmer & Pilot digital operations.',
    primaryCtaLabel: 'Explore KRASHIVANTRI',
    primaryCtaLink: '/krashivantri',
    secondaryCtaLabel: 'Enquire Now',
    secondaryCtaLink: '/krashivantri#enquiry',
    imageUrl: '/src/assets/images/service_agri_drone_1794981061744.jpg',
  },
  {
    id: 'company_intro',
    type: 'company_intro',
    visible: true,
    kicker: 'Transforming Ideas into Reality',
    heading: 'Engineering the Future with Intelligence',
    body: 'NexusTekFusion Private Limited unites KRASHIVANTRI agricultural drone systems, verified electronic & UAV component distribution, additive manufacturing, and multi-disciplinary hardware-software R&D from our Nagpur engineering facility.',
    primaryCtaLabel: 'About NexusTekFusion',
    primaryCtaLink: '/about',
  },
  {
    id: 'services',
    type: 'services',
    visible: true,
    kicker: 'Engineering Capabilities',
    heading: 'Core Engineering Services',
    primaryCtaLabel: 'View All Services',
    primaryCtaLink: '/services',
  },
  {
    id: 'printing_and_projects',
    type: 'printing_and_projects',
    visible: true,
    kicker: 'Additive Lab & R&D',
    heading: 'Custom 3D Printing & Project Enquiry',
  },
  {
    id: 'krashivantri_apps',
    type: 'krashivantri_apps',
    visible: true,
    kicker: 'Connected Mobile Ecosystem',
    heading: 'KRASHIVANTRI Android Applications',
    subheading:
      'Dedicated digital tools for Farmers, Certified Drone Pilots, and Component Buyers — managed centrally by NexusTekFusion.',
    primaryCtaLabel: 'Open KRASHIVANTRI',
    primaryCtaLink: '/krashivantri',
  },
  {
    id: 'case_studies',
    type: 'case_studies',
    visible: true,
    kicker: 'Applied Engineering',
    heading: 'Engineering R&D & Academic Projects',
    primaryCtaLabel: 'View All Projects',
    primaryCtaLink: '/projects',
  },
  {
    id: 'testimonials',
    type: 'testimonials',
    visible: true,
    kicker: 'Verified Client Feedback',
    heading: 'Customer & Institutional Reviews',
  },
  {
    id: 'why_us',
    type: 'why_us',
    visible: true,
    kicker: 'Built for Industrial Reliability',
    heading: 'Why Engineers & Agri-Operators Choose NexusTekFusion',
  },
  {
    id: 'cta',
    type: 'cta',
    visible: true,
    heading: 'Ready to Prototype, Source, or Deploy?',
    subheading:
      'Submit CAD models for instant 3D print slicing, share engineering briefs for project quotations, or contact our KRASHIVANTRI drone specialists.',
    primaryCtaLabel: 'Start Project Enquiry',
    primaryCtaLink: '/project-enquiry',
    secondaryCtaLabel: 'Contact Engineering Team',
    secondaryCtaLink: '/contact',
  },
];

import { DEFAULT_PROJECT_EMAIL_TEMPLATES } from './email.ts';

export const DEFAULT_NAVIGATION_MENUS = {
  header: [
    {
      id: 'shop',
      label: 'Shop Store',
      to: '/shop',
      visible: true,
      sortOrder: 1,
      children: [
        { id: 'shop-all', label: 'All 12 Store Categories', to: '/shop' },
        { id: 'shop-agri', label: 'Agricultural Drones', to: '/shop/category/agricultural-drones' },
        { id: 'shop-kx', label: 'KRASHIVANTRI X Series', to: '/shop/category/krashivantri-x-series' },
        { id: 'shop-kxpro', label: 'KRASHIVANTRI X PRO Series', to: '/shop/category/krashivantri-x-pro-series' },
        { id: 'shop-robotics', label: 'Robotics & Automation', to: '/shop/category/robotics-and-automation' },
        { id: 'shop-iot', label: 'IoT & Embedded Systems', to: '/shop/category/iot-embedded-systems' },
        { id: 'shop-3dp', label: '3D Printers & Materials', to: '/shop/category/3d-printers' },
        { id: 'shop-3dp-store', label: '3D Printed Store', to: '/store/3d-printed-products' },
        { id: 'shop-sale', label: 'Offers & Sale', to: '/sale' },
      ],
    },
    { id: 'sale', label: 'Offers', to: '/sale', visible: true, sortOrder: 2 },
    { id: 'printing', label: '3D Printing', to: '/services/3d-printing', visible: true, sortOrder: 3 },
    {
      id: 'krashivantri',
      label: 'KRASHIVANTRI',
      to: '/krashivantri',
      visible: true,
      sortOrder: 4,
      children: [
        { id: 'krash-overview', label: 'KRASHIVANTRI Drones', to: '/krashivantri' },
        { id: 'krash-x', label: 'KRASHIVANTRI X', to: '/product/krashivantri-x' },
        { id: 'krash-x-pro', label: 'KRASHIVANTRI X PRO', to: '/product/krashivantri-x-pro' },
        { id: 'krash-farmer', label: 'Farmer Spraying Portal', to: '/krashivantri/farmer-portal' },
        { id: 'krash-pilot', label: 'Drone Pilot Portal', to: '/krashivantri/pilot-portal' },
      ],
    },
    {
      id: 'services',
      label: 'Services',
      to: '/services',
      visible: true,
      sortOrder: 5,
      children: [
        { id: 'svc-all', label: 'All Engineering Services', to: '/services' },
        { id: 'svc-repair', label: 'Drone Repair & Service', to: '/services/drone-repair' },
        { id: 'svc-pcb', label: 'PCB Design & Fabrication', to: '/services/pcb-design' },
        { id: 'svc-3dp', label: 'Custom 3D Printing', to: '/services/3d-printing' },
        { id: 'svc-b2b', label: 'B2B Bulk & Institutional', to: '/b2b' },
      ],
    },
    { id: 'track', label: 'Track Order', to: '/track-order', visible: true, sortOrder: 6 },
  ],
};

export const DEFAULT_SERVICES_CATALOG = [
  {
    slug: 'drone-repair',
    title: 'Drone Repair, Diagnostics & Maintenance',
    shortDesc:
      'Complete drone inspection, troubleshooting, repair, component replacement, flight controller configuration, calibration and performance testing for agricultural, commercial and custom-built drones.',
    visible: true,
    imageUrl: '/src/assets/images/service_drone_repair_1794987205295.jpg',
    ctaLabel: 'Book Drone Repair',
  },
  {
    slug: 'pcb-design',
    title: 'PCB Design & Fabrication – Single & Double Layer',
    shortDesc:
      'Professional PCB layout design and prototype fabrication services for students, startups, engineers and industries. Upload your Gerber files and receive an instant price estimate for single-layer and double-layer PCBs.',
    visible: true,
    imageUrl: '/src/assets/images/service_pcb_single_double_1794987204677.jpg',
    ctaLabel: 'Order Single / Double Layer PCB',
  },
];

export const DEFAULT_SITE_SETTINGS: Record<string, unknown> = {
  announcementBar: {
    enabled: true,
    text: 'Free Pan-India Shipping Above ₹2,500 · Live Razorpay Checkout · Customer Care: info@nexustekfusion.in',
    link: '/shop',
    ctaLabel: 'Shop Store',
  },
  companyInfo: {
    legalName: 'NEXUSTEKFUSION PRIVATE LIMITED',
    brandName: 'NexusTekFusion',
    established: '2026',
    founderCeo: 'Sahil Prakash Bhagat',
    email: 'info@nexustekfusion.in',
    customerCareEmail: 'info@nexustekfusion.in',
    website: 'https://nexustekfusion.in',
    address: 'H NO. 565/19 NIT, SANKUL NEW COTTON MARK, Ganjipeth, Nagpur 440018, Maharashtra, India',
    cin: 'U30305ME2026PTC474052',
    gstin: '',
    contactPhone: '',
    businessHours: 'Monday – Saturday, 10:00 AM – 7:00 PM IST',
    primaryTagline: 'Transforming Ideas into Reality',
    secondaryTagline: 'Engineering the Future with Intelligence',
    socialLinks: {
      linkedin: '',
      instagram: '',
      youtube: '',
      github: '',
    },
  },
  seoConfig: {
    defaultTitle: 'NexusTekFusion Private Limited — KRASHIVANTRI Drones, Hardware Store & Engineering',
    defaultDescription:
      'Official platform of NexusTekFusion Private Limited (CIN: U30305ME2026PTC474052, Nagpur). Shop agricultural & FPV drone components, custom 3D printing, PCB design, and KRASHIVANTRI UAV solutions.',
    ga4MeasurementId: '',
  },
  shippingConfig: {
    standardShippingInr: 99,
    freeShippingAboveInr: 2500,
    defaultGstPercent: 18,
  },
  projectSettings: {
    enableGstTax: false,
    defaultGstPercent: 18,
    defaultAdvancePercent: 50,
    quotationValidityDays: 15,
  },
  projectPaymentSettings: {
    defaultPlanType: '50_50_split',
    advancePercent: 50,
    finalPercent: 50,
    allowFullPayment: true,
    enableGstTax: false,
    gstPercent: 18,
    quotationValidityDays: 15,
    quotationPrefix: 'NTF-QTN',
    projectPrefix: 'NTF-PRJ',
    paymentPrefix: 'NTF-PAY',
    invoicePrefix: 'NTF-INV',
    receiptPrefix: 'NTF-RCP',
    clearancePrefix: 'NTF-CLR',
    workOrderPrefix: 'NTF-WRK',
    handoverDownloadExpiryDays: 30,
    reminderIntervalsDays: [3, 7, 14],
    allowHandoverExceptionBySuperAdmin: true,
    cancellationRefundPolicy:
      'Advance covers procurement and engineering mobilization; custom milestone refunds are reviewed case-by-case by Super Admin.',
  },
  projectEmailTemplates: DEFAULT_PROJECT_EMAIL_TEMPLATES,
  krashivantriOpsConfig: {
    baseRatePerAcreInr: 500,
    minimumBookingAcres: 1,
    platformCommissionPercent: 15,
    gpsStaleThresholdMinutes: 10,
    arrivalGeofenceMeters: 250,
    pilotResponseTimeoutMinutes: 30,
    cancellationBeforeDispatchRefundPercent: 100,
    lateArrivalPenaltyInr: 200,
  },
  homepageLayout: {
    draft: DEFAULT_HOMEPAGE_SECTIONS,
    published: DEFAULT_HOMEPAGE_SECTIONS,
    publishedAt: new Date().toISOString(),
  },
  navigationMenus: DEFAULT_NAVIGATION_MENUS,
  servicesCatalog: DEFAULT_SERVICES_CATALOG,
  pcbPricingConfig: DEFAULT_PCB_PRICING_CONFIG,
  krashivantriCatalog: {
    platformName: 'KRASHIVANTRI Agricultural Drone Ecosystem',
    summary:
      'Precision agricultural UAV hardware, IoT field telemetry, and unified Farmer, Pilot, and Buyer operational workflows engineered by NexusTekFusion Private Limited.',
    bannerImageUrl: '/src/assets/images/service_agri_drone_1794981061744.jpg',
    models: [
      {
        id: 'krashivantri-x',
        name: 'KRASHIVANTRI X',
        tagline: 'Smart Agriculture. Precision Spraying.',
        summary:
          'Modular multi-rotor agricultural UAV architecture engineered for field spraying operations, rapid field servicing, and telemetry monitoring. Verified specifications are managed directly by NexusTekFusion engineering administrators.',
        imageUrl: '/src/assets/images/service_agri_drone_1794981061744.jpg',
        specs: [],
        highlights: [
          'Modular airframe and field-serviceable propulsion arms',
          'Integrated telemetry and mission-planning workflow support',
          'Compatible with KRASHIVANTRI Farmer & Pilot mobile workflows',
        ],
      },
      {
        id: 'krashivantri-x-pro',
        name: 'KRASHIVANTRI X PRO',
        tagline: 'Advanced Intelligence. Precision Agriculture.',
        summary:
          'Commercial-grade configuration designed for high-uptime agricultural spraying contractors, institutions, and enterprise operations. Verified operational specs and pricing are controlled in the Admin Dashboard.',
        imageUrl: '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg',
        specs: [],
        highlights: [
          'Reinforced composite structural assemblies & power distribution',
          'Commercial fleet maintenance & spare-part sourcing support',
          'Custom sensor/telemetry integration options via engineering review',
        ],
      },
    ],
  },
  appLinks: [
    {
      id: 'farmer-app',
      name: 'KRASHIVANTRI Farmer App',
      role: 'For Farmers & FPOs',
      description: 'Schedule agricultural drone spraying missions, pin field boundaries, and track service status.',
      comingSoon: true,
      playStoreUrl: '',
      apkDownloadUrl: '',
    },
    {
      id: 'pilot-app',
      name: 'KRASHIVANTRI Drone Pilot App',
      role: 'For Certified Drone Pilots',
      description: 'Manage assigned spraying sorties, pre-flight checklists, field telemetry logs, and mission completion.',
      comingSoon: true,
      playStoreUrl: '',
      apkDownloadUrl: '',
    },
    {
      id: 'buyer-app',
      name: 'NexusTekFusion Buyer App',
      role: 'For Hardware & Component Buyers',
      description: 'Order agricultural/FPV drone spares, electronics, and track custom 3D printing & project milestones.',
      comingSoon: true,
      playStoreUrl: '',
      apkDownloadUrl: '',
    },
  ],
  krashivantriInfo: {
    platformName: 'KRASHIVANTRI Agricultural Drone Platform',
    summary:
      'Indigenous agricultural UAV engineering platform developed for precision crop spraying, IoT field telemetry, and unified Farmer, Pilot & Buyer operations.',
    verifiedSpecs: [],
  },
  faqs: [
    {
      q: 'What file formats are supported for custom 3D printing?',
      a: 'You can upload STL, OBJ, 3MF, and STEP/STP models. STL and OBJ meshes undergo automated dimensional and volumetric slicing; STEP/STP and multi-part assemblies are routed directly for engineering CAD review.',
    },
    {
      q: 'How does the engineering project enquiry and quotation workflow work?',
      a: 'Sign in, submit your project scope along with schematics or PDFs and delivery address, receive an itemized quotation from our engineering team, accept it, and pay the advance via Razorpay to activate your project with milestone tracking.',
    },
    {
      q: 'What PCB types do you fabricate and how do I get a quote?',
      a: 'We fabricate Single Layer PCBs and Double Layer PCBs. Upload your Gerber ZIP or RS-274X files, drill file, and board specs on our PCB Design & Fabrication page for instant calculation or engineering review.',
    },
    {
      q: 'Do you support B2B bulk procurement and institutional orders?',
      a: 'Yes. Colleges, R&D labs, and industrial buyers can submit bulk hardware, drone, robotics, or 3D printing requirements through the B2B portal for custom volume pricing.',
    },
  ],
  testimonials: [],
  policies: {
    shipping:
      'Orders for ready-made components and custom 3D printed parts are dispatched from our Nagpur facility via tracked courier partners. Dispatch timelines depend on stock availability or print/build queue schedules shown on your order summary.',
    returnRefund:
      'Unused hardware components in original anti-static packaging may be requested for return within 7 days of delivery if defective or damaged in transit. Custom 3D printed parts and commissioned engineering prototypes are built to specification and covered for manufacturing defects.',
    privacy:
      'NexusTekFusion Private Limited collects customer identity, address, and technical upload files strictly for fulfilling orders, generating quotations, and delivering engineering services. Uploaded CAD, Gerber, and project files are stored privately and never shared with third parties.',
    terms:
      'All engineering quotations, custom manufacturing work orders, and e-commerce orders are governed by the terms issued with the respective quotation or invoice under the jurisdiction of Nagpur, Maharashtra, India.',
  },
};

const CORE_CATEGORIES = [
  { name: 'Agricultural Drones', slug: 'agricultural-drones', storeScope: 'general', description: 'Complete crop-spraying UAV airframes, propulsion rigs, and agri payloads', sortOrder: 1 },
  { name: 'KRASHIVANTRI X Series', slug: 'krashivantri-x-series', storeScope: 'general', description: 'Modular indigenous KRASHIVANTRI X agricultural spraying drones & kits', sortOrder: 2 },
  { name: 'KRASHIVANTRI X PRO Series', slug: 'krashivantri-x-pro-series', storeScope: 'general', description: 'Commercial enterprise KRASHIVANTRI X PRO fleet platforms', sortOrder: 3 },
  { name: 'Custom Drone Development', slug: 'custom-drone-development', storeScope: 'general', description: 'Custom survey, payload, and autonomous UAV development platforms', sortOrder: 4 },
  { name: 'Robotics and Automation', slug: 'robotics-and-automation', storeScope: 'general', description: 'AMR rover chassis, actuators, planetary gearboxes, and ROS2 hardware', sortOrder: 5 },
  { name: '3D Printers', slug: '3d-printers', storeScope: 'general', description: 'Industrial CoreXY FDM and high-resolution SLA 3D printers', sortOrder: 6 },
  { name: '3D Printing Materials', slug: '3d-printing-materials', storeScope: 'general', description: 'Engineering PLA+, PETG, PA12-CF carbon nylon, TPU 95A & resins', sortOrder: 7 },
  { name: 'Electronic Components', slug: 'electronic-components', storeScope: 'general', description: 'Heavy-copper PDBs, BMS, ESCs, XT90-S harnesses, and power modules', sortOrder: 8 },
  { name: 'IoT and Embedded Systems', slug: 'iot-embedded-systems', storeScope: 'general', description: 'Industrial ESP32-S3, STM32, LoRaWAN, and RS485 telemetry nodes', sortOrder: 9 },
  { name: 'Sensors and Controllers', slug: 'sensors-and-controllers', storeScope: 'general', description: 'Dual-IMU H743 flight controllers, RTK GNSS modules, and LiDAR sensors', sortOrder: 10 },
  { name: 'Drone Accessories and Spare Parts', slug: 'drone-accessories-spare-parts', storeScope: 'general', description: 'High-pressure nozzles, diaphragm pumps, carbon booms, and mounts', sortOrder: 11 },
  { name: 'Engineering Project Kits', slug: 'engineering-project-kits', storeScope: 'general', description: 'Academic & R&D robotics, UAV, and embedded engineering development kits', sortOrder: 12 },
  { name: '3D Printed Products', slug: '3d-printed-products', storeScope: '3d_printed', description: 'Industrial FDM & SLA printed UAV mounts, gearboxes, and custom enclosures', sortOrder: 13 },
];

export async function ensureInitialSeed() {
  if (seededOnce) return;

  try {
    // 0. Ensure initial super admin user if configured via env vars
    await ensureInitialAdminUser();

    // 1. Site Settings (backfill any missing default keys & auto-heal customerCareEmail typo)
    for (const [key, value] of Object.entries(DEFAULT_SITE_SETTINGS)) {
      await db
        .insert(siteSettings)
        .values({ key, value })
        .onConflictDoNothing({ target: siteSettings.key });
    }

    const [existingAnn] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'announcementBar'))
      .limit(1);
    if (existingAnn?.value && JSON.stringify(existingAnn.value).includes('nexusteksuaion.in')) {
      const nextAnn = { ...(existingAnn.value as Record<string, unknown>) };
      nextAnn.text = String(nextAnn.text || '').replace(/info@nexusteksuaion\.in/gi, 'info@nexustekfusion.in');
      await db.update(siteSettings).set({ value: nextAnn, updatedAt: new Date() }).where(eq(siteSettings.key, 'announcementBar'));
    }

    const [existingCompany] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'companyInfo'))
      .limit(1);
    if (existingCompany?.value && JSON.stringify(existingCompany.value).includes('nexusteksuaion.in')) {
      const nextComp = { ...(existingCompany.value as Record<string, unknown>) };
      nextComp.customerCareEmail = 'info@nexustekfusion.in';
      await db.update(siteSettings).set({ value: nextComp, updatedAt: new Date() }).where(eq(siteSettings.key, 'companyInfo'));
    }

    // One-time cleanup: ensure legacy removed service slugs are replaced with Drone Repair & Single/Double Layer PCB
    const [existingCatalog] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'servicesCatalog'))
      .limit(1);
    if (existingCatalog && Array.isArray(existingCatalog.value)) {
      const legacySlugs = new Set(['ai-ml', 'drone-development', 'robotics', 'iot-embedded', 'automation', '3d-printing']);
      const hasLegacy = existingCatalog.value.some((item: any) => legacySlugs.has(String(item?.slug || '')));
      if (hasLegacy || existingCatalog.value.length === 0) {
        await db
          .update(siteSettings)
          .set({ value: DEFAULT_SERVICES_CATALOG, updatedAt: new Date() })
          .where(eq(siteSettings.key, 'servicesCatalog'));
      }
    }

    // 2. Brands
    for (const br of [
      {
        name: 'KRASHIVANTRI',
        slug: 'krashivantri',
        logoUrl: '/assets/aistudio/image_1a5ac752.png',
        description: 'Indigenous agricultural drone & field telemetry product line by NexusTekFusion Private Limited.',
        isActive: true,
      },
      {
        name: 'NexusTekFusion',
        slug: 'nexustekfusion',
        logoUrl: '/assets/aistudio/image_1a5ac752.png',
        description: 'Industrial electronics, UAV avionics, robotics chassis, and precision additive hardware.',
        isActive: true,
      },
    ]) {
      await db.insert(brands).values(br).onConflictDoNothing({ target: brands.slug });
    }

    // 3. 3D Printing Materials & Machines
    const [{ value: matCount }] = await db.select({ value: count() }).from(printingMaterials);
    if (matCount === 0) {
      await db.insert(printingMaterials).values([
        {
          name: 'PLA+',
          technology: 'FDM',
          densityGcm3: 1.24,
          ratePerGramInr: 6,
          availableColors: [
            { name: 'Black', hex: '#18181b' },
            { name: 'White', hex: '#f8fafc' },
            { name: 'Slate Grey', hex: '#64748b' },
            { name: 'Tech Blue', hex: '#2563eb' },
            { name: 'Signal Red', hex: '#dc2626' },
            { name: 'Natural', hex: '#e2e8f0' },
          ],
          layerHeightsMm: [0.1, 0.15, 0.2, 0.3],
          description: 'High-stiffness engineering PLA+ ideal for enclosures, brackets, and rapid prototypes.',
          isActive: true,
        },
        {
          name: 'PETG',
          technology: 'FDM',
          densityGcm3: 1.27,
          ratePerGramInr: 7.5,
          availableColors: [
            { name: 'Black', hex: '#18181b' },
            { name: 'White', hex: '#f8fafc' },
            { name: 'Tech Blue', hex: '#2563eb' },
            { name: 'Natural', hex: '#cbd5e1' },
          ],
          layerHeightsMm: [0.15, 0.2, 0.3],
          description: 'Impact-resistant and weatherproof polymer suited for drone mounts and outdoor IoT housings.',
          isActive: true,
        },
        {
          name: 'ABS',
          technology: 'FDM',
          densityGcm3: 1.04,
          ratePerGramInr: 8.5,
          availableColors: [
            { name: 'Black', hex: '#18181b' },
            { name: 'Slate Grey', hex: '#475569' },
            { name: 'White', hex: '#f8fafc' },
          ],
          layerHeightsMm: [0.15, 0.2, 0.3],
          description: 'High-temperature thermal stability for motor mounts, robotics chassis, and industrial jigs.',
          isActive: true,
        },
        {
          name: 'TPU 95A',
          technology: 'FDM',
          densityGcm3: 1.21,
          ratePerGramInr: 10,
          availableColors: [
            { name: 'Black', hex: '#18181b' },
            { name: 'Signal Red', hex: '#dc2626' },
            { name: 'Tech Blue', hex: '#2563eb' },
          ],
          layerHeightsMm: [0.2, 0.3],
          description: 'Flexible vibration-damping elastomer for UAV camera mounts, bumpers, and gaskets.',
          isActive: true,
        },
        {
          name: 'Nylon PA12-CF',
          technology: 'FDM',
          densityGcm3: 1.18,
          ratePerGramInr: 18,
          availableColors: [{ name: 'Carbon Black', hex: '#0f172a' }],
          layerHeightsMm: [0.15, 0.2],
          description: 'Carbon-fiber reinforced structural nylon for load-bearing drone arms and mechanical gears.',
          isActive: true,
        },
        {
          name: 'Engineering Tough Resin',
          technology: 'SLA',
          densityGcm3: 1.15,
          ratePerGramInr: 15,
          availableColors: [
            { name: 'Matte Grey', hex: '#64748b' },
            { name: 'Clear Natural', hex: '#e2e8f0' },
            { name: 'Obsidian Black', hex: '#0f172a' },
          ],
          layerHeightsMm: [0.05, 0.1],
          description: 'High-resolution photopolymer for intricate microfluidic, dental, and precision fitment parts.',
          isActive: true,
        },
      ]);
    }

    const [{ value: machineCount }] = await db.select({ value: count() }).from(printingMachines);
    if (machineCount === 0) {
      await db.insert(printingMachines).values([
        {
          name: 'NTF-FDM CoreXY 300',
          technology: 'FDM',
          buildVolumeX: 300,
          buildVolumeY: 300,
          buildVolumeZ: 300,
          hourlyRateInr: 120,
          minOrderInr: 250,
          wastagePercent: 8,
          labourFeeInr: 60,
          finishingFeeInr: 140,
          isActive: true,
        },
        {
          name: 'NTF-SLA Precision 8K',
          technology: 'SLA',
          buildVolumeX: 218,
          buildVolumeY: 123,
          buildVolumeZ: 240,
          hourlyRateInr: 180,
          minOrderInr: 450,
          wastagePercent: 12,
          labourFeeInr: 90,
          finishingFeeInr: 180,
          isActive: true,
        },
      ]);
    }

    // 4. Ensure all 12 dedicated store categories + 3d_printed exist cleanly
    for (const cat of CORE_CATEGORIES) {
      await db
        .insert(productCategories)
        .values(cat)
        .onConflictDoNothing({ target: productCategories.slug });
    }

    const allCats = await db.select().from(productCategories);
    const catMap = Object.fromEntries(allCats.map((c) => [c.slug, c.id]));

    // 5. Guarantee KRASHIVANTRI Flagship Products (Series 2 & 3)
    const kxCatId = catMap['krashivantri-x-series'] || catMap['agricultural-drones'] || null;
    const kxProCatId = catMap['krashivantri-x-pro-series'] || catMap['agricultural-drones'] || null;
    const flagshipProducts: Array<typeof products.$inferInsert> = [
      {
        categoryId: kxCatId,
        sku: 'KRASH-X-01',
        name: 'KRASHIVANTRI X',
        slug: 'krashivantri-x',
        brand: 'KRASHIVANTRI',
        productType: 'quote_only',
        modelNumber: 'KRASHIVANTRI-X',
        subcategory: 'KRASHIVANTRI X Series',
        shortDescription: 'Smart Agriculture. Precision Spraying.',
        storeScope: 'general',
        description:
          'KRASHIVANTRI X is NexusTekFusion’s flagship modular agricultural spraying UAV architecture built for dependable field deployment, rapid servicing, and integrated telemetry operations. Contact our Nagpur engineering team for configuration sheets and institutional pricing.',
        technicalSpecs: { Architecture: 'Modular Multi-Rotor UAV', Application: 'Precision Agricultural Spraying', ServiceSupport: 'Nagpur Engineering Facility' },
        features: [
          'Modular agricultural UAV airframe engineered for field maintainability',
          'Supports automated mission planning and field boundary workflows',
          'Compatible with KRASHIVANTRI Farmer & Drone Pilot mobile ecosystem',
          'Backed by Nagpur engineering support and genuine spare-part sourcing',
        ],
        priceInr: 0,
        discountPriceInr: null,
        gstPercent: 18,
        stockQty: 5,
        dimensions: 'Modular Foldable Frame',
        weightGrams: 0,
        deliveryInfo: 'Delivered & commissioned with technical orientation from Nagpur.',
        material: '3K Carbon Fiber & CNC 7075-T6 Aerospace Aluminum',
        availableColors: ['Industrial Navy & Matte Carbon'],
        availableVariants: ['Standard Agricultural Configuration', 'With Field Telemetry Kit'],
        productionTimeDays: 14,
        warrantyInfo: 'Manufacturer warranty & Nagpur service support (terms provided on quotation)',
        imageUrl: '/src/assets/images/service_agri_drone_1794981061744.jpg',
        galleryUrls: [
          '/src/assets/images/service_agri_drone_1794981061744.jpg',
          '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg',
          '/src/assets/images/service_drone_repair_1794987205295.jpg',
        ],
        applications: 'Precision agricultural crop spraying, FPO fleet operations, institutional agritech R&D',
        packageContents: [
          'KRASHIVANTRI X Airframe Assembly',
          'Ground Telemetry & Mission Interface',
          'Operator Onboarding Documentation',
        ],
        tags: ['KRASHIVANTRI', 'Agricultural Drone', 'UAV', 'Flagship'],
        seoTitle: 'KRASHIVANTRI X Agricultural Drone | NexusTekFusion',
        seoDescription: 'KRASHIVANTRI X — Smart Agriculture. Precision Spraying. Request configuration and pricing from NexusTekFusion Private Limited.',
        status: 'published',
        isFeatured: true,
        isBestseller: true,
        isNewArrival: true,
        isPublished: true,
        sortOrder: 1,
      },
      {
        categoryId: kxProCatId,
        sku: 'KRASH-XPRO-01',
        name: 'KRASHIVANTRI X PRO',
        slug: 'krashivantri-x-pro',
        brand: 'KRASHIVANTRI',
        productType: 'quote_only',
        modelNumber: 'KRASHIVANTRI-X-PRO',
        subcategory: 'KRASHIVANTRI X PRO Series',
        shortDescription: 'Advanced Intelligence. Precision Agriculture.',
        storeScope: 'general',
        description:
          'KRASHIVANTRI X PRO is an extended-capability agricultural drone platform engineered for high-uptime commercial spraying operators, research universities, and enterprise agri-fleets. Technical metrics and commercial fleet configurations are maintained directly by NexusTekFusion engineering.',
        technicalSpecs: { Series: 'KRASHIVANTRI X PRO Commercial', PowerSystem: 'High-Efficiency Brushless Propulsion', Telemetry: 'Real-Time Fleet & RTK Ready' },
        features: [
          'Extended-capability multi-rotor platform for commercial spraying contractors',
          'Reinforced composite propulsion arms & industrial power distribution',
          'Prepared for custom sensor integration and fleet management workflows',
          'Dedicated priority spares, training, and engineering support from Nagpur',
        ],
        priceInr: 0,
        discountPriceInr: null,
        gstPercent: 18,
        stockQty: 5,
        dimensions: 'Heavy-Lift Commercial Frame',
        weightGrams: 0,
        deliveryInfo: 'Delivered & commissioned with technical orientation from Nagpur.',
        material: 'Reinforced 3K Carbon Composite & CNC Alloy Hardware',
        availableColors: ['Industrial Navy & Matte Carbon'],
        availableVariants: ['Commercial Fleet Configuration', 'Enterprise R&D Edition'],
        productionTimeDays: 14,
        warrantyInfo: 'Commercial warranty & priority Nagpur service coverage',
        imageUrl: '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg',
        galleryUrls: [
          '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg',
          '/src/assets/images/service_agri_drone_1794981061744.jpg',
          '/src/assets/images/service_drone_repair_1794987205295.jpg',
        ],
        applications: 'Commercial agricultural spraying contractors, university R&D, large-acreage precision farming',
        packageContents: [
          'KRASHIVANTRI X PRO Airframe Assembly',
          'Telemetry & Ground Control Kit',
          'Fleet Documentation & Safety Checklist',
        ],
        tags: ['KRASHIVANTRI X PRO', 'Agricultural Drone', 'Enterprise UAV', 'Flagship'],
        seoTitle: 'KRASHIVANTRI X PRO Agricultural Drone | NexusTekFusion',
        seoDescription: 'KRASHIVANTRI X PRO — Advanced Intelligence. Precision Agriculture. Request quote and fleet briefing from NexusTekFusion.',
        status: 'published',
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        isPublished: true,
        sortOrder: 2,
      },
    ];
    for (const flagship of flagshipProducts) {
      await db
        .insert(products)
        .values(flagship)
        .onConflictDoNothing({ target: products.slug });
    }

    // 6. Seed Real Engineering Catalog Across All 12 Dedicated Categories (idempotent by SKU)
    const catalogProducts: Array<typeof products.$inferInsert> = [
      {
        categoryId: catMap['agricultural-drones'] || null,
        sku: 'NTF-UAV-AG10',
        name: '10L Carbon-Fiber Agri-UAV Frame Kit',
        slug: '10l-carbon-fiber-agri-uav-frame-kit',
        brand: 'KRASHIVANTRI',
        productType: 'variable',
        modelNumber: 'AG-10L-CF',
        shortDescription: 'Foldable 3K carbon-fiber frame kit with CNC 7075 alloy joints.',
        storeScope: 'general',
        description: 'Foldable 3K twill carbon-fiber agricultural frame engineered for 10L payload capacity with CNC 7075 aluminum joints.',
        technicalSpecs: { Wheelbase: '1420 mm', Payload: 'Up to 10 kg', Material: '3K Carbon + 7075-T6 Alloy', FoldedSize: '680 × 680 × 410 mm' },
        features: ['Quick-fold 7075-T6 aluminum arm locks', '3K twill carbon booms for high stiffness', 'Pre-drilled spray pump mounting deck'],
        compatibility: 'Supports 30 mm / 35 mm motor mounts, 6S–12S power systems, and diaphragm spray pumps',
        packageContents: ['Carbon Center Plates & Folding Arms', 'CNC 7075 Landing Gear', '10L Tank Mounting Cradle', 'SS304 Fastener Kit'],
        applications: 'Agricultural spraying drones, custom research UAV airframes',
        tags: ['Agri Drone', 'Carbon Frame', 'KRASHIVANTRI'],
        priceInr: 34500,
        discountPriceInr: 31900,
        gstPercent: 18,
        stockQty: 6,
        dimensions: '1420 × 1420 × 450 mm',
        weightGrams: 4200,
        deliveryInfo: 'Dispatches within 2–3 business days from Nagpur',
        material: '3K Carbon Fiber & 7075 Alloy',
        availableColors: ['Carbon Black'],
        availableVariants: ['Quadcopter 10L', 'Hexacopter 16L'],
        productionTimeDays: 3,
        warrantyInfo: '1-year structural warranty',
        imageUrl: '/src/assets/images/service_agri_drone_1794981061744.jpg',
        galleryUrls: [
          '/src/assets/images/service_agri_drone_1794981061744.jpg',
          '/src/assets/images/service_drone_repair_1794987205295.jpg',
        ],
        status: 'published',
        isFeatured: true,
        isBestseller: true,
        isNewArrival: false,
        isPublished: true,
      },
      {
        categoryId: catMap['sensors-and-controllers'] || null,
        sku: 'NTF-FC-H743',
        name: 'NTF-H743 Dual-IMU Flight Controller',
        slug: 'ntf-h743-dual-imu-flight-controller',
        brand: 'NexusTekFusion',
        productType: 'variable',
        modelNumber: 'NTF-FC-H743-V2',
        shortDescription: 'STM32H743 flight controller with dual redundant IMUs and dual CAN bus.',
        storeScope: 'general',
        description: 'Industrial-grade STM32H743 flight controller with dual redundant IMUs, dual CAN bus, and isolated barometer for autonomous UAVs and FPV rigs.',
        technicalSpecs: { MCU: 'STM32H743VI 480MHz', IMU: 'Dual ICM-42688-P', Interfaces: '2x CAN, 7x UART, I2C', Input: '2S–12S LiPo via PMU' },
        features: ['Dual redundant low-noise IMUs', 'Dual CAN bus for DroneCAN peripherals', 'Integrated barometer & OSD chip'],
        compatibility: 'ArduPilot, PX4, Betaflight, iNav · 30.5×30.5 mm mounting pattern',
        packageContents: ['1x NTF-H743 Flight Controller', '1x Silicone Vibration Grommet Set', '2x JST-GH Telemetry Cables'],
        applications: 'Autonomous agricultural UAVs, long-range survey drones, custom FPV builds',
        productFaqs: [{ q: 'Does it support ArduPilot and PX4 out of the box?', a: 'Yes, it ships with a verified bootloader compatible with ArduPilot and PX4 firmware targets.' }],
        tags: ['Flight Controller', 'STM32H743', 'ArduPilot', 'UAV'],
        priceInr: 12499,
        discountPriceInr: 10999,
        gstPercent: 18,
        stockQty: 18,
        dimensions: '54 × 38 × 12 mm',
        weightGrams: 34,
        deliveryInfo: 'Dispatches within 24–48 hours from Nagpur',
        material: '6-Layer ENIG FR4 PCB',
        availableColors: ['Matte Navy'],
        availableVariants: ['Standard Stack', 'With PMU + GPS Kit'],
        productionTimeDays: 1,
        warrantyInfo: '6-month manufacturing warranty',
        imageUrl: '/src/assets/images/service_pcb_electronics_1794981062614.jpg',
        galleryUrls: [
          '/src/assets/images/service_pcb_electronics_1794981062614.jpg',
          '/src/assets/images/service_pcb_single_double_1794987204677.jpg',
        ],
        status: 'published',
        isFeatured: true,
        isBestseller: true,
        isNewArrival: false,
        isPublished: true,
      },
      {
        categoryId: catMap['custom-drone-development'] || null,
        sku: 'NTF-DEV-HEX800',
        name: 'X800 Custom Mapping & Survey Hexacopter Kit',
        slug: 'x800-custom-mapping-survey-hexacopter-kit',
        brand: 'NexusTekFusion',
        productType: 'variable',
        modelNumber: 'NTF-HEX-800',
        shortDescription: 'Modular hexacopter airframe with dual battery trays and gimbal rails.',
        storeScope: 'general',
        description: 'Custom R&D hexacopter development platform engineered for RTK photogrammetry, LiDAR mapping, and university aerial robotics projects.',
        technicalSpecs: { Wheelbase: '800 mm Hexacopter', PayloadBay: 'Universal 12 mm Gimbal Rail', Propulsion: '6S / 12S Brushless Compatible', Weight: '2.4 kg Airframe' },
        features: ['Tool-free folding carbon booms', 'Isolated avionics bay for NTF-H743 / Pixhawk', 'Modular dual-rail payload mount'],
        compatibility: 'PX4 / ArduPilot stacks, Sony/thermal survey cameras, RTK GNSS pucks',
        packageContents: ['Hexacopter Carbon Frame', 'Retractable Skids', 'CNC Aluminum Motor Mounts'],
        applications: 'Aerial photogrammetry, LiDAR research, autonomous inspection',
        tags: ['Custom Drone', 'Hexacopter', 'Survey UAV'],
        priceInr: 28900,
        discountPriceInr: 25499,
        gstPercent: 18,
        stockQty: 9,
        dimensions: '800 × 800 × 310 mm',
        weightGrams: 2400,
        deliveryInfo: 'Dispatches within 2–4 business days',
        material: '3K Matte Carbon & 6061 Aluminum',
        availableColors: ['Matte Carbon'],
        availableVariants: ['Airframe Only', 'Airframe + Power & Motor Bundle'],
        productionTimeDays: 3,
        warrantyInfo: '6-month structural warranty',
        imageUrl: '/src/assets/images/service_drone_repair_1794987205295.jpg',
        galleryUrls: [
          '/src/assets/images/service_drone_repair_1794987205295.jpg',
          '/src/assets/images/service_agri_drone_1794981061744.jpg',
        ],
        status: 'published',
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        isPublished: true,
      },
      {
        categoryId: catMap['robotics-and-automation'] || null,
        sku: 'NTF-AMR-LIDAR',
        name: 'AMR-200 Autonomous Mobile Robotics Chassis',
        slug: 'amr-200-autonomous-mobile-robotics-chassis',
        brand: 'NexusTekFusion',
        productType: 'variable',
        modelNumber: 'AMR-200',
        shortDescription: 'Omnidirectional ROS2 chassis with encoder motors and LiDAR rail.',
        storeScope: 'general',
        description: 'Mecanum-wheel omnidirectional mobile robot platform with machined aluminum deck, mounting rails for 2D/3D LiDAR, and ROS2 controller bay.',
        technicalSpecs: { Payload: '25 kg', Drive: '4x Planetary Geared Encoders', ComputeBay: 'Jetson Orin / Raspberry Pi 5', Chassis: 'CNC 5052 Aluminum' },
        features: ['Machined aluminum chassis with T-slot rails', 'Quadrature encoder feedback on all 4 wheels', 'Dedicated compute bay for Jetson / Raspberry Pi'],
        compatibility: 'ROS2 Humble/Jazzy, Jetson Orin Nano, Raspberry Pi 5, STM32 motor controllers',
        packageContents: ['CNC Aluminum Chassis', '4x Geared Encoder Motors', '4x Mecanum Wheels', 'Power Switch & Harness'],
        applications: 'Warehouse SLAM, academic robotics R&D, autonomous inspection',
        tags: ['Robotics', 'ROS2', 'AMR', 'Chassis'],
        priceInr: 42000,
        discountPriceInr: 38900,
        gstPercent: 18,
        stockQty: 5,
        dimensions: '460 × 380 × 190 mm',
        weightGrams: 8500,
        deliveryInfo: 'Dispatches within 3–4 business days',
        material: 'Anodized Aluminum',
        availableColors: ['Brushed Silver'],
        availableVariants: ['Base Chassis', 'With 360° LiDAR'],
        productionTimeDays: 4,
        warrantyInfo: '6-month hardware warranty',
        imageUrl: '/src/assets/images/service_robotics_automation_1794981063545.jpg',
        galleryUrls: [
          '/src/assets/images/service_robotics_automation_1794981063545.jpg',
          '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg',
        ],
        status: 'published',
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        isPublished: true,
      },
      {
        categoryId: catMap['3d-printers'] || null,
        sku: 'NTF-3DP-COREXY300',
        name: 'NTF-CoreXY Pro 300 High-Speed 3D Printer',
        slug: 'ntf-corexy-pro-300-high-speed-3d-printer',
        brand: 'NexusTekFusion',
        productType: 'variable',
        modelNumber: 'NTF-CX300',
        shortDescription: 'Enclosed CoreXY 300×300×300mm FDM printer built for PA12-CF & ABS.',
        storeScope: 'general',
        description: 'Industrial enclosed CoreXY 3D printer featuring 320°C hardened-steel all-metal hotend, active chamber heating, and Klipper high-speed kinematics.',
        technicalSpecs: { BuildVolume: '300 × 300 × 300 mm', MaxHotend: '320°C Hardened Nozzle', Kinematics: 'CoreXY Linear Rails', Firmware: 'Klipper Input Shaper' },
        features: ['Enclosed chamber for ABS, ASA & Nylon PA12-CF', 'Auto-leveling 36-point strain gauge bed mesh', 'Direct-drive dual-gear hardened extruder'],
        compatibility: 'PrusaSlicer, OrcaSlicer, UltiMaker Cura · 1.75 mm engineering filaments',
        packageContents: ['NTF-CoreXY Pro 300 Printer', 'PEI Textured Spring Steel Sheet', '0.4mm & 0.6mm Hardened Nozzles', 'Tool Kit'],
        applications: 'In-house drone bracket manufacturing, functional industrial prototyping, college fab labs',
        tags: ['3D Printer', 'CoreXY', 'Industrial FDM'],
        priceInr: 68500,
        discountPriceInr: 63900,
        gstPercent: 18,
        stockQty: 4,
        dimensions: '485 × 490 × 540 mm',
        weightGrams: 18500,
        deliveryInfo: 'Insured wooden-crate dispatch in 2–4 business days',
        material: 'Extruded Aluminum Frame & Steel Enclosure',
        availableColors: ['Graphite Navy'],
        availableVariants: ['Standard 300mm', 'With Filament Dryer Box'],
        productionTimeDays: 3,
        warrantyInfo: '1-year Nagpur engineering warranty',
        imageUrl: '/src/assets/images/service_3d_printing_1794981063445.jpg',
        galleryUrls: [
          '/src/assets/images/service_3d_printing_1794981063445.jpg',
          '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg',
        ],
        status: 'published',
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        isPublished: true,
      },
      {
        categoryId: catMap['3d-printing-materials'] || null,
        sku: 'NTF-FIL-PA12CF-1KG',
        name: 'PA12-CF Carbon-Fiber Reinforced Nylon Spool (1kg)',
        slug: 'pa12-cf-carbon-fiber-nylon-filament-1kg',
        brand: 'NexusTekFusion',
        productType: 'variable',
        modelNumber: 'MAT-PA12CF-175',
        shortDescription: '1.75mm 20% chopped carbon-fiber PA12 engineering filament for drone parts.',
        storeScope: 'general',
        description: 'Vacuum-sealed structural Nylon PA12 infused with 20% high-modulus carbon fiber for high stiffness, low moisture absorption, and dimensional accuracy.',
        technicalSpecs: { Diameter: '1.75 ± 0.02 mm', NozzleTemp: '275°C – 295°C', BedTemp: '90°C – 110°C', NetWeight: '1.0 kg Vacuum Sealed' },
        features: ['Low warp with 185°C heat deflection temperature', 'Matte carbon finish hides layer lines', 'Ideal for load-bearing UAV mounts & gears'],
        compatibility: 'Any FDM printer with hardened steel nozzle (0.4 mm / 0.6 mm) and 275°C+ hotend',
        packageContents: ['1kg PA12-CF Spool with Desiccant', 'Drying & Print Profile Card'],
        applications: 'Drone motor clamps, planetary gears, automotive brackets',
        tags: ['Filament', 'PA12-CF', '3D Printing Material'],
        priceInr: 4490,
        discountPriceInr: 3990,
        gstPercent: 18,
        stockQty: 36,
        dimensions: '200 × 200 × 68 mm',
        weightGrams: 1250,
        deliveryInfo: 'Ships within 24 hours',
        material: 'PA12 + 20% Carbon Fiber',
        availableColors: ['Carbon Black'],
        availableVariants: ['PA12-CF (1 kg)', 'Engineering PETG (1 kg)', 'TPU 95A (1 kg)'],
        productionTimeDays: 1,
        warrantyInfo: 'Vacuum-seal quality guarantee',
        imageUrl: '/src/assets/images/service_3d_printing_1794981063445.jpg',
        galleryUrls: [
          '/src/assets/images/service_3d_printing_1794981063445.jpg',
          '/src/assets/images/service_robotics_automation_1794981063545.jpg',
        ],
        status: 'published',
        isFeatured: false,
        isBestseller: true,
        isNewArrival: true,
        isPublished: true,
      },
      {
        categoryId: catMap['electronic-components'] || null,
        sku: 'NTF-PMU-12S',
        name: '12S Smart UAV Power Distribution & Current Sensor',
        slug: '12s-smart-uav-power-distribution-sensor',
        brand: 'NexusTekFusion',
        productType: 'variable',
        modelNumber: 'NTF-PMU-12S',
        shortDescription: '4oz heavy-copper 6S–14S PDB with CAN/I2C current telemetry.',
        storeScope: 'general',
        description: 'High-current 4oz copper power distribution board supporting 6S–14S LiPo packs with I2C/CAN voltage-current telemetry for flight controllers.',
        technicalSpecs: { VoltageRange: '18V–60V (6S–14S)', PeakCurrent: '240A Continuous / 360A Burst', RegulatedOutputs: '5V/5A + 12V/4A BEC', Telemetry: 'CAN & I2C INA238' },
        features: ['240A continuous heavy-copper bus bars', 'Dual regulated 5V & 12V BEC outputs', 'DroneCAN & I2C real-time telemetry'],
        compatibility: 'Pixhawk, CubePilot, NTF-H743, ArduPilot UAV power ports',
        packageContents: ['1x 12S Smart PMU Board', 'XT90-S Input Pigtail', 'GH 6-Pin Telemetry Lead'],
        applications: 'Agricultural spraying drones, heavy-lift multirotors, robotics power buses',
        tags: ['Power', 'PMU', '12S', 'Electronic Components'],
        priceInr: 4800,
        discountPriceInr: 4350,
        gstPercent: 18,
        stockQty: 22,
        dimensions: '68 × 68 × 14 mm',
        weightGrams: 112,
        deliveryInfo: 'Ships within 24 hours',
        material: '4oz Heavy Copper FR4',
        availableColors: ['Matte Black'],
        availableVariants: ['XT90-S Input', 'AS150 Anti-Spark Input'],
        productionTimeDays: 1,
        warrantyInfo: '6-month warranty',
        imageUrl: '/src/assets/images/service_pcb_electronics_1794981062614.jpg',
        galleryUrls: [
          '/src/assets/images/service_pcb_electronics_1794981062614.jpg',
          '/src/assets/images/service_pcb_single_double_1794987204677.jpg',
        ],
        status: 'published',
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        isPublished: true,
      },
      {
        categoryId: catMap['iot-embedded-systems'] || null,
        sku: 'NTF-IOT-ESP32S3',
        name: 'NTF Industrial ESP32-S3 Telemetry & RS485 Node',
        slug: 'ntf-industrial-esp32s3-telemetry-rs485-node',
        brand: 'NexusTekFusion',
        productType: 'variable',
        modelNumber: 'NTF-IOT-S3',
        shortDescription: 'DIN-rail ESP32-S3 controller with isolated RS485, CAN, and dual relays.',
        storeScope: 'general',
        description: 'DIN-rail and field-enclosure compatible ESP32-S3 industrial IoT controller with isolated RS485 Modbus, CAN bus, and dual relay outputs.',
        technicalSpecs: { MCU: 'ESP32-S3 Dual-Core 240MHz', Comms: 'Wi-Fi, BLE 5, Isolated RS485, CAN', PowerInput: '9V–36V DC Isolated', Protection: 'TVS Surge & Reverse Polarity' },
        features: ['9V–36V wide DC industrial power stage', 'Galvanically isolated RS485 Modbus RTU transceiver', 'Dual industrial relay outputs'],
        compatibility: 'Arduino IDE, ESP-IDF, MicroPython, MQTT / Modbus RTU',
        packageContents: ['1x NTF ESP32-S3 Industrial Node', '1x External 2.4GHz Antenna', 'Screw Terminal Plugs'],
        applications: 'Smart agriculture telemetry, factory sensor acquisition, edge automation',
        tags: ['ESP32', 'IoT', 'RS485', 'Embedded'],
        priceInr: 2850,
        discountPriceInr: 2499,
        gstPercent: 18,
        stockQty: 32,
        dimensions: '90 × 58 × 26 mm',
        weightGrams: 95,
        deliveryInfo: 'Ships same or next business day',
        material: '4-Layer FR4 + ABS Enclosure',
        availableColors: ['Industrial Grey'],
        availableVariants: ['Board Only', 'With DIN-Rail Enclosure'],
        productionTimeDays: 1,
        warrantyInfo: '6-month replacement warranty',
        imageUrl: '/src/assets/images/service_pcb_single_double_1794987204677.jpg',
        galleryUrls: [
          '/src/assets/images/service_pcb_single_double_1794987204677.jpg',
          '/src/assets/images/service_pcb_electronics_1794981062614.jpg',
        ],
        status: 'published',
        isFeatured: true,
        isBestseller: true,
        isNewArrival: true,
        isPublished: true,
      },
      {
        categoryId: catMap['drone-accessories-spare-parts'] || null,
        sku: 'NTF-NOZ-SPRAY4',
        name: 'High-Pressure Agricultural UAV Brushless Pump & Nozzle Kit',
        slug: 'high-pressure-agri-uav-brushless-pump-nozzle-kit',
        brand: 'KRASHIVANTRI',
        productType: 'variable',
        modelNumber: 'NTF-SPRAY-5LPM',
        shortDescription: '5 L/min chemical-resistant brushless diaphragm pump + 4x flat-fan nozzles.',
        storeScope: 'general',
        description: 'Field-serviceable high-pressure agricultural drone spraying pump assembly with PWM flow control, inline mesh filter, and 4 precision flat-fan atomizing nozzles.',
        technicalSpecs: { FlowRate: '5.0 L/min Max', InputVoltage: '22V–52V (6S–12S)', Control: 'PWM 1000–2000 µs', Nozzles: '4x TeeJet-Pattern Flat Fan' },
        features: ['Viton chemical-resistant seals for agrochemicals', 'PWM speed modulation from flight controller', 'Quick-disconnect pneumatic push fittings'],
        compatibility: 'KRASHIVANTRI X / X PRO, standard 10L–20L agricultural UAV platforms',
        packageContents: ['1x Brushless Spray Pump', '4x Atomizing Nozzles + Holders', '3m PU Tubing & Mesh Filter'],
        applications: 'Agricultural spraying drone maintenance, custom spray retrofits',
        tags: ['Agri Nozzle', 'Spray Pump', 'Drone Spares'],
        priceInr: 6490,
        discountPriceInr: 5790,
        gstPercent: 18,
        stockQty: 28,
        dimensions: '140 × 85 × 65 mm',
        weightGrams: 460,
        deliveryInfo: 'Dispatches same day before 4 PM IST',
        material: 'Chemical-Resistant Polymer & SS316',
        availableColors: ['Matte Black'],
        availableVariants: ['Single Pump + 4 Nozzles', 'Dual Pump Commercial Pack'],
        productionTimeDays: 1,
        warrantyInfo: '6-month pump warranty',
        imageUrl: '/src/assets/images/service_agri_drone_1794981061744.jpg',
        galleryUrls: [
          '/src/assets/images/service_agri_drone_1794981061744.jpg',
          '/src/assets/images/service_drone_repair_1794987205295.jpg',
        ],
        status: 'published',
        isFeatured: true,
        isBestseller: true,
        isNewArrival: true,
        isPublished: true,
      },
      {
        categoryId: catMap['engineering-project-kits'] || null,
        sku: 'NTF-KIT-ROVER01',
        name: 'Autonomous IoT & ROS2 Vision Robotics Starter Kit',
        slug: 'autonomous-iot-ros2-vision-robotics-starter-kit',
        brand: 'NexusTekFusion',
        productType: 'variable',
        modelNumber: 'NTF-EDU-ROS2',
        shortDescription: 'Complete B.Tech / R&D lab kit with 4WD encoder deck, ESP32-S3, and camera.',
        storeScope: 'general',
        description: 'Turnkey academic and R&D robotics kit complete with dual-layer motor driver PCB, 4WD encoder base, ESP32-S3 telemetry node, ultrasonic array, and full documentation.',
        technicalSpecs: { Level: 'University / B.Tech / M.Tech R&D', Controller: 'ESP32-S3 + STM32 Co-Processor', Sensors: 'IMU + Ultrasonic + Optical Encoders', SourceCode: 'C++ / MicroPython / ROS2 Bridge' },
        features: ['Pre-tested dual-layer power & motor carrier PCB', 'Full wiring diagram & codebase documentation included', 'Expandable top deck for LiDAR or SBC'],
        compatibility: 'Arduino, ESP-IDF, ROS2 Serial Bridge, MATLAB Simulink',
        packageContents: ['4WD Aluminum Base & Motors', 'Motor Driver & Telemetry PCBs', 'Li-Ion Smart BMS Pack', 'Wiring Guide PDF'],
        applications: 'Engineering capstone projects, robotics workshops, college R&D laboratories',
        tags: ['Engineering Kit', 'Academic Project', 'Robotics Kit'],
        priceInr: 14999,
        discountPriceInr: 12999,
        gstPercent: 18,
        stockQty: 15,
        dimensions: '320 × 260 × 150 mm',
        weightGrams: 2150,
        deliveryInfo: 'Dispatches within 48 hours with lab documentation',
        material: 'Anodized Aluminum & 3D-Printed PA12 Brackets',
        availableColors: ['Navy & Silver'],
        availableVariants: ['Academic Standard Kit', 'With Jetson/Pi Compute Carrier'],
        productionTimeDays: 2,
        warrantyInfo: '6-month component warranty + email support',
        imageUrl: '/src/assets/images/service_robotics_automation_1794981063545.jpg',
        galleryUrls: [
          '/src/assets/images/service_robotics_automation_1794981063545.jpg',
          '/src/assets/images/service_pcb_electronics_1794981062614.jpg',
        ],
        status: 'published',
        isFeatured: true,
        isBestseller: true,
        isNewArrival: true,
        isPublished: true,
      },
      {
        categoryId: catMap['3d-printed-products'] || null,
        sku: 'NTF-3DP-GEAR01',
        name: 'PA12-CF Planetary Gearbox Prototype Assembly',
        slug: 'pa12-cf-planetary-gearbox-prototype',
        brand: 'NexusTekFusion',
        productType: 'made_to_order',
        modelNumber: '3DP-PG51',
        shortDescription: '5:1 planetary gearbox printed in carbon-reinforced Nylon PA12.',
        storeScope: '3d_printed',
        description: 'Precision 3D printed 5:1 planetary reduction gearbox in carbon-fiber reinforced Nylon PA12 for robotics actuators and educational demos.',
        technicalSpecs: { Ratio: '5:1 Single Stage', Material: 'PA12 Carbon Fiber', Bore: '8 mm D-Shaft', LayerHeight: '0.15 mm' },
        features: ['Carbon-fiber reinforced wear-resistant gear teeth', '0.15 mm precision layer resolution', 'Ready-to-mount NEMA 17 / 23 pattern'],
        compatibility: 'NEMA 17 / NEMA 23 stepper flanges & 8 mm D-shaft couplers',
        packageContents: ['1x Pre-Assembled PA12-CF Gearbox', 'M3 Mounting Bolts'],
        applications: 'Robotic joints, educational cutaways, custom automation actuators',
        tags: ['3D Printed', 'Gearbox', 'PA12-CF'],
        priceInr: 1850,
        discountPriceInr: 1490,
        gstPercent: 18,
        stockQty: 24,
        dimensions: '98 × 98 × 42 mm',
        weightGrams: 165,
        deliveryInfo: 'Printed to order in 2 business days',
        material: 'Nylon PA12-CF',
        availableColors: ['Carbon Black', 'Slate Grey'],
        availableVariants: ['5:1 Ratio', '10:1 Compound'],
        productionTimeDays: 2,
        warrantyInfo: 'Replacement on transit damage',
        imageUrl: '/src/assets/images/service_3d_printing_1794981063445.jpg',
        galleryUrls: ['/src/assets/images/service_3d_printing_1794981063445.jpg'],
        status: 'published',
        isFeatured: true,
        isBestseller: true,
        isNewArrival: false,
        isPublished: true,
      },
      {
        categoryId: catMap['3d-printed-products'] || null,
        sku: 'NTF-3DP-GPSMNT',
        name: 'TPU Vibration-Isolated RTK GPS & Telemetry Mast',
        slug: 'tpu-vibration-isolated-rtk-gps-mast',
        brand: 'KRASHIVANTRI',
        productType: 'customizable',
        modelNumber: '3DP-GPS-ISO',
        shortDescription: 'Foldable UAV GNSS mast with TPU 95A shock isolator collar.',
        storeScope: '3d_printed',
        description: 'Lightweight carbon-reinforced base with 95A TPU shock-absorbing collar designed for agricultural and survey drone GNSS pucks.',
        technicalSpecs: { Mount: '25 mm Tube Clamp', Dampener: 'TPU 95A', Hardware: 'M3 SS304 Inserts', Height: '140 mm' },
        features: ['Dual-durometer vibration isolation collar', 'SS304 brass heat-set threaded inserts', 'Tool-free foldable hinge'],
        compatibility: 'Fits standard 22 mm and 25 mm carbon fiber UAV booms',
        packageContents: ['1x Foldable Mast Assembly', '1x TPU 95A Isolator Ring', 'M3 Hardware Pack'],
        applications: 'Agricultural drones, RTK survey UAVs',
        tags: ['3D Printed', 'GPS Mast', 'UAV'],
        priceInr: 890,
        discountPriceInr: null,
        gstPercent: 18,
        stockQty: 40,
        dimensions: '75 × 55 × 140 mm',
        weightGrams: 62,
        deliveryInfo: 'Ships within 1–2 business days',
        material: 'PETG + TPU 95A',
        availableColors: ['Black', 'Tech Blue'],
        availableVariants: ['22 mm Boom', '25 mm Boom'],
        productionTimeDays: 1,
        warrantyInfo: 'Replacement on transit damage',
        imageUrl: '/src/assets/images/service_3d_printing_1794981063445.jpg',
        galleryUrls: ['/src/assets/images/service_3d_printing_1794981063445.jpg'],
        status: 'published',
        isFeatured: false,
        isBestseller: false,
        isNewArrival: true,
        isPublished: true,
      },
    ];

    for (const item of catalogProducts) {
      await db
        .insert(products)
        .values(item)
        .onConflictDoNothing({ target: products.sku });
    }

    // 7. Starter Coupons
    const [{ value: couponCount }] = await db.select({ value: count() }).from(coupons);
    if (couponCount === 0) {
      await db.insert(coupons).values([
        { code: 'NTFWELCOME', discountType: 'percent', discountValue: 5, minOrderInr: 1000, isActive: true },
      ]);
    }

    // 8. Starter Engineering Blogs
    const [{ value: blogCount }] = await db.select({ value: count() }).from(blogs);
    if (blogCount === 0) {
      await db.insert(blogs).values([
        {
          title: 'Designing High-Vibration Agricultural UAV Frames with Carbon-Nylon Composites',
          slug: 'designing-agricultural-uav-frames-carbon-nylon',
          category: 'Drone Technology',
          tags: ['Agricultural Drones', '3D Printing', 'Carbon Fiber'],
          excerpt: 'How topological bracket optimization and TPU damping improve IMU stability on heavy-lift agricultural spraying platforms.',
          content:
            'Heavy-lift agricultural drones operate under sustained rotor vibration and field exposure. At NexusTekFusion in Nagpur, combining 3K twill carbon booms with PA12-CF printed junction brackets and TPU 95A isolator collars reduces resonant noise reaching the flight controller IMU.\n\nKey engineering considerations include keeping resonant modes away from blade-pass frequencies, sealing ESC bays against agrochemical mist, and selecting fasteners with nylon-insert locknuts.',
          coverImageUrl: '/src/assets/images/service_agri_drone_1794981061744.jpg',
          seoTitle: 'Agricultural UAV Frame Engineering | NexusTekFusion Nagpur',
          seoDescription: 'Engineering guide on vibration damping and carbon-nylon composite brackets for agricultural drones.',
          isPublished: true,
        },
        {
          title: 'Single & Double-Layer PCB Layout Practices for Reliable Power & Sensor Boards',
          slug: 'double-layer-pcb-layout-best-practices',
          category: 'PCB & Embedded',
          tags: ['PCB Design', 'Single Layer PCB', 'Double Layer PCB'],
          excerpt: 'Optimizing trace clearance, ground return paths, and Gerber DFM checks for single-layer and double-layer prototype boards.',
          content:
            'When prototyping controller boards, telemetry carriers, or drone power distribution accessories in single-layer or double-layer FR4, clean trace widths and solid ground pours minimize voltage drop and EMI.\n\nBefore exporting Gerber RS-274X and Excellon drill files, verify minimum annular rings, solder mask expansion, and clear silkscreen polarity markings for fast fabrication turnaround.',
          coverImageUrl: '/src/assets/images/service_pcb_single_double_1794987204677.jpg',
          seoTitle: 'Single & Double-Layer PCB Design Guide | NexusTekFusion',
          seoDescription: 'DFM layout guidelines for single-layer and double-layer PCB fabrication.',
          isPublished: true,
        },
      ]);
    }

    // 9. Starter Engineering R&D & Academic Projects (Case Studies)
    const [{ value: caseCount }] = await db.select({ value: count() }).from(caseStudies);
    if (caseCount === 0) {
      await db.insert(caseStudies).values([
        {
          title: 'KRASHIVANTRI Agricultural Spraying UAV Architecture',
          slug: 'krashivantri-agricultural-spraying-uav',
          technologyUsed: 'Autonomous Flight Control, Brushless Propulsion, Telemetry Link, Carbon-Alloy Airframe',
          applications: 'Precision crop spraying, field boundary mapping, automated mission waypoints',
          outcomes: 'Modular airframe architecture designed for rapid field servicing and configurable payload tanks.',
          relatedServices: ['Drone Repair & Diagnostics', 'PCB Fabrication', '3D Printing'],
          description: 'An integrated agricultural UAV engineering platform combining custom power distribution PCBs, ruggedized landing assemblies, and automated mission planning workflows.',
          imageUrl: '/src/assets/images/service_agri_drone_1794981061744.jpg',
          videoUrl: '',
          isPublished: true,
        },
        {
          title: 'ROS2 Autonomous Inspection Rover with 6-DOF Manipulator',
          slug: 'ros2-autonomous-inspection-rover',
          technologyUsed: 'ROS2, 360° LiDAR SLAM, STM32 Motor Control, PA12-CF Actuators',
          applications: 'Warehouse navigation, laboratory automation, academic robotics research',
          outcomes: 'Unified hardware-software testbed combining omnidirectional mobility with precision end-effector actuation.',
          relatedServices: ['Custom Engineering', 'Double Layer PCB', '3D Printing'],
          description: 'Custom mobile robotics chassis integrating encoder feedback, LiDAR localization, and modular gripper tooling for research and industrial prototyping.',
          imageUrl: '/src/assets/images/service_robotics_automation_1794981063545.jpg',
          videoUrl: '',
          isPublished: true,
        },
      ]);
    }

    seededOnce = true;
  } catch (error) {
    console.error('Error during ensureInitialSeed:', error);
  }
}
