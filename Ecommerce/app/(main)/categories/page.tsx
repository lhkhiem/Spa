import Image from 'next/image';
import Link from 'next/link';
import { fetchProductCategories } from '@/lib/api/categories';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);

export default async function CategoriesPage() {
  const categories = await fetchProductCategories();

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Shop by Category
        </h1>
        <p className="text-gray-600">
          Browse our comprehensive selection of spa and salon categories
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="card card-hover flex flex-col items-center p-6 text-center transition-all"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-50 text-brand-purple-600">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold">{getInitials(category.name)}</span>
              )}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600">
              {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
            </p>
          </Link>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full rounded-lg bg-gray-50 p-6 text-center text-gray-600">
            No categories available.
          </div>
        )}
      </div>
    </div>
  );
}
