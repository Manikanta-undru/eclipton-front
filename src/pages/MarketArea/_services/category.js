export const category = [
  {
    name: 'Classifieds',
    slug: 'classifieds',
    sub_category: [
      {
        name: 'Matrimonial',
        slug: 'matrimonial',
      },
      {
        name: 'Property',
        slug: 'property',
      },
      {
        name: 'Recruitment',
        slug: 'recruitment',
      },
    ],
  },
  {
    name: 'Clothing & Accessories',
    slug: 'clothing_and_accessories',
    sub_category: [
      {
        name: 'Ethenic Wear',
        slug: 'ethenic_wear',
      },
      {
        name: 'Western Wear',
        slug: 'western_wear',
      },
    ],
  },
  {
    name: 'Books',
    slug: 'books',
    sub_category: [
      {
        name: 'Fiction Books',
        slug: 'fiction_books',
      },
      {
        name: 'Exam Books',
        slug: 'exam_books',
      },
    ],
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    sub_category: [
      {
        name: 'Cameras',
        slug: 'cameras',
      },
      {
        name: 'Televisions',
        slug: 'televisions',
      },
    ],
  },
  {
    name: 'Computers',
    slug: 'computers',
    sub_category: [
      {
        name: 'Desktops',
        slug: 'desktops',
      },
      {
        name: 'Laptops',
        slug: 'laptops',
      },
    ],
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    sub_category: [
      {
        name: 'Movie',
        slug: 'movie',
      },
      {
        name: 'TV Show',
        slug: 'tv_show',
      },
      {
        name: 'Video Game',
        slug: 'video_game',
      },
    ],
  },
];

export function getCategory() {
  return category;
}

export function getSubCategory(slug) {
  const result = category.find((v, i) => v.slug === slug);
  return result.sub_category;
}

export function getSubCategories() {
  const sub_categories = [];
  category.map((v, i) => {
    v.sub_category.map((item, i) => {
      sub_categories.push(item);
    });
  });
  return sub_categories;
}
