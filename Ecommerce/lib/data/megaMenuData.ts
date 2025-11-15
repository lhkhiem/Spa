import { MegaMenuData } from '@/lib/types/megaMenu';

export const equipmentSuppliesMegaMenu: MegaMenuData = {
  id: 'equipment-supplies',
  columns: [
    {
      id: 'disposable-supplies',
      title: 'Disposable Supplies',
      items: [
        { id: 'skin-care', title: 'Skin Care', href: '/categories/skin-care' },
        { id: 'lash-brow', title: 'Lash & Brow', href: '/categories/lash-brow' },
        { id: 'makeup', title: 'Makeup', href: '/categories/makeup' },
        { id: 'waxing', title: 'Waxing', href: '/categories/waxing' },
        { id: 'massage', title: 'Massage', href: '/categories/massage' },
        { id: 'body-treatments', title: 'Body Treatments', href: '/categories/body-treatments' },
        { id: 'mani-pedi', title: 'Mani Pedi', href: '/categories/mani-pedi' },
        { id: 'hair-salon', title: 'Hair/Salon', href: '/categories/hair-salon' },
        { id: 'sustainable', title: 'Sustainable', href: '/categories/sustainable' },
        { id: 'locker-room', title: 'Locker Room', href: '/categories/locker-room' },
      ],
    },
    {
      id: 'tools-implements',
      title: 'Tools & Implements',
      items: [
        { id: 'skin-care-tools', title: 'Skin Care', href: '/categories/skin-care-tools' },
        { id: 'lash-brow-tools', title: 'Lash & Brow', href: '/categories/lash-brow-tools' },
        { id: 'makeup-tools', title: 'Makeup', href: '/categories/makeup-tools' },
        { id: 'massage-tools', title: 'Massage', href: '/categories/massage-tools' },
        { id: 'body-treatments-tools', title: 'Body Treatments', href: '/categories/body-treatments-tools' },
        { id: 'mani-pedi-tools', title: 'Mani Pedi', href: '/categories/mani-pedi-tools' },
        { id: 'hair-care-tools', title: 'Hair Care', href: '/categories/hair-care-tools' },
        { id: 'bowls-dishes', title: 'Bowls, Dishes & Blending', href: '/categories/bowls-dishes' },
        { id: 'containers', title: 'Containers & Dispensers', href: '/categories/containers' },
        { id: 'shop-all-tools', title: 'SHOP ALL Tools & Implements', href: '/products?category=tools' },
      ],
    },
    {
      id: 'linens-apparel',
      title: 'Linens, Client Apparel & Uniforms',
      items: [
        { id: 'treatment-sheets', title: 'Treatment Sheets', href: '/categories/treatment-sheets' },
        { id: 'treatment-towels', title: 'Treatment Towels', href: '/categories/treatment-towels' },
        { id: 'table-covers', title: 'Table Covers & Accents', href: '/categories/table-covers' },
        { id: 'client-apparel', title: 'Client Apparel', href: '/categories/client-apparel' },
        { id: 'uniforms', title: 'Uniforms', href: '/categories/uniforms' },
        { id: 'shop-all-linens', title: 'SHOP ALL Linens, Client Apparel & Uniforms', href: '/products?category=linens' },
      ],
    },
    {
      id: 'cleaning-sanitation',
      title: 'Cleaning & Sanitation',
      items: [
        { id: 'surface-sanitation', title: 'Surface Sanitation', href: '/categories/surface-sanitation' },
        { id: 'tool-implement-sanitation', title: 'Tool & Implement Sanitation', href: '/categories/tool-sanitation' },
        { id: 'hand-protection', title: 'Hand Protection', href: '/categories/hand-protection' },
        { id: 'face-eye-protection', title: 'Face & Eye Protection', href: '/categories/face-protection' },
        { id: 'body-protection', title: 'Body Protection', href: '/categories/body-protection' },
        { id: 'waterproof-covers', title: 'Waterproof Covers', href: '/categories/waterproof-covers' },
        { id: 'shop-all-cleaning', title: 'SHOP ALL Cleaning & Sanitation', href: '/products?category=cleaning' },
      ],
    },
    {
      id: 'ambiance-refreshments',
      title: 'Ambiance & Refreshments',
      items: [
        { id: 'candles-diffusers', title: 'Candles, Diffusers & Lamps', href: '/categories/candles-diffusers' },
        { id: 'refreshment-supplies', title: 'Refreshment Supplies', href: '/categories/refreshment-supplies' },
      ],
    },
    {
      id: 'sustainable-supplies',
      title: 'Sustainable',
      items: [
        { id: 'sustainable-supplies', title: 'Supplies', href: '/categories/sustainable-supplies' },
        { id: 'cleaning', title: 'Cleaning', href: '/categories/sustainable-cleaning' },
      ],
    },
  ],
};

export const productsMegaMenu: MegaMenuData = {
  id: 'products',
  columns: [
    {
      id: 'skin-care',
      title: 'Skin Care',
      items: [
        { id: 'cleansers', title: 'Cleansers', href: '/products?category=cleansers' },
        { id: 'toners', title: 'Toners & Essences', href: '/products?category=toners' },
        { id: 'serums', title: 'Serums & Treatments', href: '/products?category=serums' },
        { id: 'moisturizers', title: 'Moisturizers', href: '/products?category=moisturizers' },
        { id: 'masks', title: 'Masks & Peels', href: '/products?category=masks' },
        { id: 'eye-care', title: 'Eye Care', href: '/products?category=eye-care' },
        { id: 'sun-protection', title: 'Sun Protection', href: '/products?category=sun-protection' },
        { id: 'acne', title: 'Acne Solutions', href: '/products?category=acne' },
      ],
    },
    {
      id: 'body-care',
      title: 'Body Care',
      items: [
        { id: 'body-lotions', title: 'Body Lotions & Creams', href: '/products?category=body-lotions' },
        { id: 'body-scrubs', title: 'Body Scrubs', href: '/products?category=body-scrubs' },
        { id: 'body-wraps', title: 'Body Wraps', href: '/products?category=body-wraps' },
        { id: 'bath-products', title: 'Bath Products', href: '/products?category=bath-products' },
      ],
    },
    {
      id: 'massage',
      title: 'Massage',
      items: [
        { id: 'massage-oils', title: 'Massage Oils', href: '/products?category=massage-oils' },
        { id: 'massage-lotions', title: 'Massage Lotions', href: '/products?category=massage-lotions' },
        { id: 'massage-creams', title: 'Massage Creams', href: '/products?category=massage-creams' },
        { id: 'hot-stones', title: 'Hot Stone Therapy', href: '/products?category=hot-stones' },
      ],
    },
    {
      id: 'waxing',
      title: 'Waxing',
      items: [
        { id: 'hard-wax', title: 'Hard Wax', href: '/products?category=hard-wax' },
        { id: 'soft-wax', title: 'Soft Wax', href: '/products?category=soft-wax' },
        { id: 'pre-wax', title: 'Pre-Wax Products', href: '/products?category=pre-wax' },
        { id: 'post-wax', title: 'Post-Wax Products', href: '/products?category=post-wax' },
      ],
    },
    {
      id: 'lash-brow',
      title: 'Lash & Brow',
      items: [
        { id: 'lash-extensions', title: 'Lash Extensions', href: '/products?category=lash-extensions' },
        { id: 'lash-tinting', title: 'Lash & Brow Tinting', href: '/products?category=lash-tinting' },
        { id: 'brow-products', title: 'Brow Products', href: '/products?category=brow-products' },
      ],
    },
    {
      id: 'nails',
      title: 'Nails',
      items: [
        { id: 'nail-polish', title: 'Nail Polish', href: '/products?category=nail-polish' },
        { id: 'gel-polish', title: 'Gel Polish', href: '/products?category=gel-polish' },
        { id: 'nail-care', title: 'Nail Care', href: '/products?category=nail-care' },
        { id: 'pedicure', title: 'Pedicure Products', href: '/products?category=pedicure' },
      ],
    },
  ],
};

export const equipmentMegaMenu: MegaMenuData = {
  id: 'equipment',
  columns: [
    {
      id: 'facial-equipment',
      title: 'Facial Equipment',
      items: [
        { id: 'steamers', title: 'Steamers', href: '/equipment/steamers' },
        { id: 'magnifying-lamps', title: 'Magnifying Lamps', href: '/equipment/magnifying-lamps' },
        { id: 'galvanic', title: 'Galvanic Machines', href: '/equipment/galvanic' },
        { id: 'microdermabrasion', title: 'Microdermabrasion', href: '/equipment/microdermabrasion' },
        { id: 'ultrasonic', title: 'Ultrasonic Devices', href: '/equipment/ultrasonic' },
      ],
    },
    {
      id: 'furniture',
      title: 'Furniture',
      items: [
        { id: 'treatment-tables', title: 'Treatment Tables', href: '/equipment/treatment-tables' },
        { id: 'stools', title: 'Stools & Chairs', href: '/equipment/stools' },
        { id: 'trolleys', title: 'Trolleys & Carts', href: '/equipment/trolleys' },
        { id: 'storage', title: 'Storage Solutions', href: '/equipment/storage' },
      ],
    },
    {
      id: 'waxing-equipment',
      title: 'Waxing Equipment',
      items: [
        { id: 'wax-warmers', title: 'Wax Warmers', href: '/equipment/wax-warmers' },
        { id: 'wax-pots', title: 'Wax Pots', href: '/equipment/wax-pots' },
      ],
    },
    {
      id: 'nail-equipment',
      title: 'Nail Equipment',
      items: [
        { id: 'uv-lamps', title: 'UV/LED Lamps', href: '/equipment/uv-lamps' },
        { id: 'nail-stations', title: 'Nail Stations', href: '/equipment/nail-stations' },
        { id: 'pedicure-chairs', title: 'Pedicure Chairs', href: '/equipment/pedicure-chairs' },
      ],
    },
  ],
};

export const brandsMegaMenu: MegaMenuData = {
  id: 'brands',
  columns: [
    {
      id: 'featured-brands',
      title: 'Featured Brands',
      items: [
        { id: 'cirepil', title: 'Cirepil', href: '/brands/cirepil' },
        { id: 'bio-therapeutic', title: 'Bio-Therapeutic', href: '/brands/bio-therapeutic' },
        { id: 'intensive', title: 'Intensive', href: '/brands/intensive' },
        { id: 'intrinsics', title: 'Intrinsics', href: '/brands/intrinsics' },
        { id: 'sposh', title: 'Sposh', href: '/brands/sposh' },
        { id: 'ess', title: 'ESS Aromatherapy', href: '/brands/ess' },
      ],
    },
    {
      id: 'skin-care-brands',
      title: 'Skin Care Brands',
      items: [
        { id: 'dermalogica', title: 'Dermalogica', href: '/brands/dermalogica' },
        { id: 'image-skincare', title: 'Image Skincare', href: '/brands/image-skincare' },
        { id: 'gm-collin', title: 'GM Collin', href: '/brands/gm-collin' },
      ],
    },
    {
      id: 'massage-brands',
      title: 'Massage Brands',
      items: [
        { id: 'biotone', title: 'Biotone', href: '/brands/biotone' },
        { id: 'bon-vital', title: 'Bon Vital', href: '/brands/bon-vital' },
      ],
    },
    {
      id: 'all-brands',
      title: '',
      items: [
        { id: 'view-all', title: 'View All Brands', href: '/brands' },
      ],
    },
  ],
};
