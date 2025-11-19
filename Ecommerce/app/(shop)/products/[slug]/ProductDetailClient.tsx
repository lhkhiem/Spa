'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { FiHeart, FiShare2, FiStar } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import AddToCartButton from '@/components/product/AddToCartButton/AddToCartButton';
import ProductCard from '@/components/product/ProductCard/ProductCard';

const FALLBACK_IMAGE = '/images/placeholder-product.jpg';

interface ProductImage {
  id: string;
  url: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
}

interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

interface ProductVariantOption {
  optionId: string | null;
  optionName: string;
  optionPosition: number;
  valueId: string | null;
  value: string;
  valueCode: string | null;
  valuePosition: number;
}

interface ProductVariantAttribute {
  id: string | null;
  name: string;
  value: string | null;
}

interface ProductVariant {
  id: string;
  sku: string | null;
  slug: string;
  summary: string | null;
  price: number;
  comparePrice: number | null;
  stock: number;
  status: string;
  optionValues: ProductVariantOption[];
  attributes: ProductVariantAttribute[];
  titleOverride?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  thumbnailUrl?: string | null;
}

interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  comparePrice: number | null;
  thumbnailUrl: string | null;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  inStock: boolean;
}

interface ProductDetailForClient {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  baseName: string;
  baseSlug: string;
  baseSku: string | null;
  description: string | null;
  richContent: unknown;
  price: number;
  comparePrice: number | null;
  stock: number;
  rating: number;
  reviewCount: number;
  brandName: string | null;
  breadcrumb: { label: string; href?: string }[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  variantCount: number;
  selectedVariantId: string | null;
  selectedVariantSlug: string | null;
  variants: ProductVariant[];
  relatedProducts: RelatedProduct[];
}

interface ProductDetailClientProps {
  product: ProductDetailForClient;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const hasVariants = product.variantCount > 1 && variants.length > 0;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const defaultVariant = useMemo(() => {
    if (!variants.length) {
      return null;
    }

    const matched = product.selectedVariantId
      ? variants.find((variant) => variant.id === product.selectedVariantId)
      : null;

    if (matched) {
      return matched;
    }

    if (variants.length === 1) {
      return variants[0];
    }

    return null;
  }, [product.selectedVariantId, variants]);

  useEffect(() => {
    if (!hasVariants || !variants.length) {
      setSelectedOptions({});
      return;
    }

    if (!defaultVariant) {
      setSelectedOptions({});
      return;
    }

    const initialSelections: Record<string, string> = {};
    defaultVariant.optionValues.forEach((option) => {
      if (option.optionName) {
        initialSelections[option.optionName] = option.value;
      }
    });
    setSelectedOptions(initialSelections);
  }, [defaultVariant, hasVariants, product.id, variants.length]);

  const variantMatchesSelection = useCallback(
    (variant: ProductVariant, selection: Record<string, string>) => {
      const entries = Object.entries(selection);
      if (!entries.length) {
        return true;
      }

      return entries.every(([name, value]) => {
        const option = variant.optionValues.find((opt) => opt.optionName === name);
        return option?.value === value;
      });
    },
    []
  );

  const hasVariantMatch = useCallback(
    (selection: Record<string, string>) => {
      if (!variants.length) {
        return false;
      }
      const entries = Object.entries(selection);
      if (!entries.length) {
        return true;
      }

      return variants.some((variant) => variantMatchesSelection(variant, selection));
    },
    [variantMatchesSelection, variants]
  );

  const pruneSelection = useCallback(
    (selection: Record<string, string>, lockedKey?: string) => {
      if (!Object.keys(selection).length) {
        return selection;
      }

      let working = { ...selection };

      if (hasVariantMatch(working)) {
        return working;
      }

      let changed = true;
      while (changed) {
        changed = false;
        if (hasVariantMatch(working)) {
          return working;
        }

        for (const key of Object.keys(working)) {
          if (lockedKey && key === lockedKey) {
            continue;
          }

          const candidate = { ...working };
          delete candidate[key];

          if (hasVariantMatch(candidate)) {
            working = candidate;
            changed = true;
            break;
          }
        }
      }

      if (lockedKey && working[lockedKey] !== undefined) {
        const lockedOnly: Record<string, string> = {
          [lockedKey]: working[lockedKey],
        };

        if (hasVariantMatch(lockedOnly)) {
          return lockedOnly;
        }
      }

      return {};
    },
    [hasVariantMatch]
  );

  const variantOptionGroups = useMemo(() => {
    const optionMap = new Map<string, Set<string>>();

    variants.forEach((variant) => {
      variant.optionValues.forEach((option) => {
        if (!option.optionName) {
          return;
        }

        if (!optionMap.has(option.optionName)) {
          optionMap.set(option.optionName, new Set());
        }
        optionMap.get(option.optionName)!.add(option.value);
      });
    });

    return Array.from(optionMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values).sort((a, b) => a.localeCompare(b)),
    }));
  }, [variants]);

  const matchingVariants = useMemo(
    () => (hasVariants ? variants.filter((variant) => variantMatchesSelection(variant, selectedOptions)) : []),
    [hasVariants, selectedOptions, variantMatchesSelection, variants]
  );

  const activeVariant = useMemo(() => {
    if (!hasVariants || !matchingVariants.length) {
      return null;
    }

    if (matchingVariants.length === 1) {
      const [only] = matchingVariants;
      const requiredNames = only.optionValues
        .filter((option) => option.optionName)
        .map((option) => option.optionName as string);

      const hasAllSelections = requiredNames.every(
        (name) => name && selectedOptions[name] !== undefined
      );

      return hasAllSelections ? only : null;
    }

    return null;
  }, [hasVariants, matchingVariants, selectedOptions]);

  const selectedVariantId = activeVariant?.id ?? null;
  const currentStock = hasVariants
    ? activeVariant
      ? activeVariant.stock
      : 0
    : Number.isFinite(Number(product.stock))
      ? Number(product.stock)
      : 0;

  useEffect(() => {
    if (!hasVariants) {
      return;
    }

    if (!activeVariant || !activeVariant.slug) {
      return;
    }

    if (activeVariant.slug === product.slug) {
      return;
    }

    router.replace(`/products/${activeVariant.slug}`, { scroll: false });
  }, [activeVariant, hasVariants, product.slug, router]);

  useEffect(() => {
    setQuantity((prev) => {
      if (!hasVariants) {
        if (currentStock <= 0) {
          return 1;
        }
        return Math.min(prev, currentStock);
      }

      if (!activeVariant || activeVariant.stock <= 0) {
        return 1;
      }

      return Math.min(prev, activeVariant.stock);
    });
  }, [activeVariant, currentStock, hasVariants]);

  const handleSelectOption = useCallback(
    (optionName: string, value: string) => {
      setSelectedOptions((prev) => {
        const isSameSelection = prev[optionName] === value;

        if (isSameSelection) {
          const nextSelection = { ...prev };
          delete nextSelection[optionName];
          return pruneSelection(nextSelection);
        }

        const tentative: Record<string, string> = {
          ...prev,
          [optionName]: value,
        };

        return pruneSelection(tentative, optionName);
      });
    },
    [pruneSelection]
  );

  const images = product.images.length > 0 ? product.images : [{
    id: 'fallback',
    url: productImagesFallback(product),
    width: null,
    height: null,
    format: null,
  }];

  const { displayPrice, salePrice, discountPercentage, comparePrice } = useMemo(() => {
    if (activeVariant) {
      const variantPrice = Number(activeVariant.price);
      const variantCompare =
        activeVariant.comparePrice !== null && activeVariant.comparePrice !== undefined
          ? Number(activeVariant.comparePrice)
          : null;

      const hasDiscount = variantCompare !== null && variantCompare > variantPrice;

      return {
        displayPrice: hasDiscount && variantCompare !== null ? variantCompare : variantPrice,
        salePrice: hasDiscount ? variantPrice : null,
        comparePrice: hasDiscount ? variantCompare : null,
        discountPercentage:
          hasDiscount && variantCompare
            ? Math.round(((variantCompare - variantPrice) / variantCompare) * 100)
            : 0,
      };
    }

    const relevantVariants = matchingVariants.length ? matchingVariants : variants;

    if (!relevantVariants.length) {
      const basePrice = Number(product.price);
      const baseCompare =
        product.comparePrice !== null && product.comparePrice !== undefined
          ? Number(product.comparePrice)
          : null;

      const hasDiscount = baseCompare !== null && baseCompare > basePrice;

      return {
        displayPrice: hasDiscount && baseCompare !== null ? baseCompare : basePrice,
        salePrice: hasDiscount ? basePrice : null,
        comparePrice: hasDiscount ? baseCompare : null,
        discountPercentage:
          hasDiscount && baseCompare
            ? Math.round(((baseCompare - basePrice) / baseCompare) * 100)
            : 0,
      };
    }

    const prices = relevantVariants.map((variant) => Number(variant.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      displayPrice: minPrice,
      salePrice: null,
      comparePrice: maxPrice !== minPrice ? maxPrice : null,
      discountPercentage: 0,
    };
  }, [activeVariant, matchingVariants, product.comparePrice, product.price, variants]);

  const isOptionValueDisabled = useCallback(
    (optionName: string, value: string) => {
      const currentValue = selectedOptions[optionName];
      if (currentValue === value) {
        return false;
      }

      const tentative: Record<string, string> = {
        ...selectedOptions,
        [optionName]: value,
      };

      return !hasVariantMatch(tentative);
    },
    [hasVariantMatch, selectedOptions]
  );

  const getVariantSummary = useCallback(
    (variant: ProductVariant) =>
      (variant.summary && variant.summary.length > 0
        ? variant.summary
        : variant.optionValues
            .filter((option) => option.optionName)
            .map((option) => `${option.optionName}: ${option.value}`)
            .join(' • ')),
    []
  );

  const productSkuForDisplay = hasVariants
    ? activeVariant?.sku ?? product.baseSku ?? product.sku ?? undefined
    : product.sku ?? product.baseSku ?? undefined;

  const productTitleForDisplay = useMemo(() => {
    const baseTitle = product.baseName ?? product.name;

    if (!hasVariants || !activeVariant) {
      return baseTitle;
    }

    const summary = getVariantSummary(activeVariant);
    if (!summary) {
      return baseTitle;
    }

    return `${baseTitle} (${summary})`;
  }, [activeVariant, getVariantSummary, hasVariants, product.baseName, product.name]);

  const relatedCards = product.relatedProducts.map((related) => ({
    id: related.id,
    productId: related.id,
    variantId: undefined,
    slug: related.slug,
    name: related.name,
    price: related.comparePrice && related.comparePrice > related.price ? related.comparePrice : related.price,
    salePrice: related.comparePrice && related.comparePrice > related.price ? related.price : undefined,
    image: related.thumbnailUrl ?? FALLBACK_IMAGE,
    rating: related.rating,
    reviewCount: related.reviewCount,
    badge: related.isBestSeller
      ? 'Bán chạy'
      : related.isFeatured
        ? 'Nổi bật'
        : undefined,
    inStock: related.inStock,
  }));

  const attributeList = product.attributes.filter((attr) => attr.name && attr.value);

  const reviewLabel = product.reviewCount > 0
    ? `${product.reviewCount} đánh giá`
    : 'Chưa có đánh giá';

  const priceForCart = useMemo(
    () => Number(salePrice ?? displayPrice),
    [displayPrice, salePrice]
  );

  const imageForCart = images[selectedImage]?.url ?? productImagesFallback(product);

  const renderDescription = () => {
    if (!product.description) {
      return (
        <p className="text-gray-600">
          Product description is being updated. Please contact support if you need more details.
        </p>
      );
    }

    const normalizeMediaPaths = (html: string) =>
      html.replace(/src="([^"]+)"/g, (_, src) => `src="${src.replace(/\\/g, '/')}"`);

    const isHtml = /<\/?[a-z][\s\S]*>/i.test(product.description);

    if (isHtml) {
      const sanitizedHtml = normalizeMediaPaths(product.description);
      return (
        <div
          className="prose max-w-none text-gray-700"
          // Ghi chú: Nội dung miêu tả lấy từ CMS (đã được biên tập), render trực tiếp dưới dạng HTML
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      );
    }

    return <p className="whitespace-pre-line text-gray-700">{product.description}</p>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <Breadcrumb items={product.breadcrumb} className="mb-6" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              {discountPercentage > 0 && (
                <div className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                  {/* Ghi chú: hiển thị % giảm giá nếu sản phẩm đang khuyến mãi */}
                  Tiết kiệm {discountPercentage}%
                </div>
              )}
              <Image
                src={images[selectedImage]?.url ?? FALLBACK_IMAGE}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={image.id ?? index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? 'border-brand-purple-600 ring-2 ring-brand-purple-600 ring-offset-2'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.url ?? FALLBACK_IMAGE}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex flex-col gap-1 text-sm text-gray-600 md:flex-row md:items-center md:gap-2">
                <span>{product.brandName ?? 'Sản phẩm chuyên nghiệp'}</span>
                {productSkuForDisplay && (
                  <span className="text-sm font-medium text-brand-purple-600">SKU: {productSkuForDisplay}</span>
                )}
                {hasVariants && (
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {activeVariant ? 'Đã chọn biến thể' : 'Chọn biến thể để xem chi tiết'}
                  </span>
                )}
              </div>
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {productTitleForDisplay}
              </h1>

              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{reviewLabel}</span>
              </div>

              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {/* Ghi chú: giá hiển thị ưu tiên giá khuyến mãi nếu có */}
                  {formatCurrency(salePrice ?? displayPrice)}
                </span>
                {comparePrice && salePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{formatCurrency(comparePrice)}</span>
                    <span className="text-sm font-semibold text-red-600">Tiết kiệm {discountPercentage}%</span>
                  </>
                )}
              </div>

              {hasVariants && variantOptionGroups.length > 0 && (
                <div className="mb-6 space-y-4 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {/* Ghi chú: hiển thị các lựa chọn biến thể (variant) lấy từ CMS */}
                    Chọn biến thể sản phẩm
                  </h3>
                  <p className="text-xs text-gray-500">
                    Nhấn để chọn hoặc bỏ chọn. Các tùy chọn sẽ tự động lọc để luôn tạo được biến thể hợp lệ.
                  </p>
                  {variantOptionGroups.map((group) => (
                    <div key={group.name}>
                      <p className="text-xs font-medium uppercase text-gray-500">{group.name}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {group.values.map((value) => {
                          const isSelected = selectedOptions[group.name] === value;
                          const isDisabled = isOptionValueDisabled(group.name, value);
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleSelectOption(group.name, value)}
                              disabled={isDisabled}
                              className={`rounded-full border px-4 py-2 text-sm transition ${
                                isSelected
                                  ? 'border-brand-purple-600 bg-brand-purple-50 text-brand-purple-700 shadow-sm'
                                  : 'border-gray-300 text-gray-700 hover:border-brand-purple-400 hover:text-brand-purple-600'
                              } ${isDisabled ? 'cursor-not-allowed opacity-40 grayscale' : ''}`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {!activeVariant && (
                    <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                      {matchingVariants.length > 1 && Object.keys(selectedOptions).length > 0 ? (
                        <span>
                          Đang có {matchingVariants.length} biến thể khả dụng. Chọn thêm tùy chọn để xác định
                          chính xác.
                        </span>
                      ) : matchingVariants.length === 1 ? (
                        <span>Chọn thêm tùy chọn để xác nhận biến thể.</span>
                      ) : (
                        <span>Vui lòng chọn các tùy chọn để tìm biến thể phù hợp.</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <AddToCartButton
                  productId={product.id}
                  variantId={selectedVariantId ?? undefined}
                  name={productTitleForDisplay}
                  price={priceForCart}
                  image={imageForCart}
                  quantity={quantity}
                  fullWidth
                  size="lg"
                  disabled={hasVariants ? !activeVariant || currentStock <= 0 : currentStock <= 0}
                />
                <div className="flex gap-3">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50">
                    <FiHeart className="h-5 w-5" />
                    Lưu vào danh sách yêu thích
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50">
                    <FiShare2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                {hasVariants ? (
                  activeVariant ? (
                    <>
                      <span className="font-medium text-gray-900">
                        {currentStock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                      <span>Số lượng sẵn có: {Math.max(currentStock, 0)}</span>
                    </>
                  ) : (
                    <span className="font-medium text-gray-900">
                      Chọn biến thể để xem tình trạng tồn kho
                    </span>
                  )
                ) : (
                  <>
                    <span className="font-medium text-gray-900">
                      {currentStock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                    <span>Số lượng sẵn có: {Math.max(currentStock, 0)}</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-gray-900">
                Số lượng
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-md border border-gray-300">
                  <button
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, Math.min(prev - 1, currentStock > 0 ? currentStock : 1)))
                    }
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    max={currentStock > 0 ? currentStock : undefined}
                    onChange={(e) => {
                      const rawValue = parseInt(e.target.value, 10);
                      const normalized = Number.isFinite(rawValue) ? rawValue : 1;
                      const bounded = Math.max(1, normalized);
                      setQuantity(currentStock > 0 ? Math.min(bounded, currentStock) : 1);
                    }}
                    className="w-16 border-x border-gray-300 py-2 text-center"
                  />
                  <button
                    onClick={() =>
                      setQuantity((prev) => {
                        if (currentStock <= 0) {
                          return 1;
                        }
                        return Math.min(prev + 1, currentStock);
                      })
                    }
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {attributeList.length > 0 && (
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  {/* Ghi chú: liệt kê thông số/thuộc tính sản phẩm từ CMS */}
                  Thông số sản phẩm
                </h3>
                <dl className="grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                  {attributeList.map((attr) => (
                    <div key={attr.id} className="flex flex-col rounded bg-gray-50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-gray-500">{attr.name}</dt>
                      <dd className="mt-1">{attr.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`border-b-2 pb-4 text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'border-brand-purple-600 text-brand-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Chi tiết
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`border-b-2 pb-4 text-sm font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-brand-purple-600 text-brand-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Đánh giá từ khách hàng
              </button>
            </div>
          </div>

          <div className="mt-8">
            {activeTab === 'details' && (
              <div className="prose max-w-none">
                {renderDescription()}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="rounded-lg bg-gray-100 p-6 text-gray-600">
                <p>Tính năng đánh giá sẽ sớm ra mắt.</p>
              </div>
            )}
          </div>
        </div>

        {relatedCards.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCards.map((productCard) => (
                <ProductCard key={productCard.id} product={productCard} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function productImagesFallback(product: ProductDetailForClient) {
  return product.images[0]?.url ?? FALLBACK_IMAGE;
}


