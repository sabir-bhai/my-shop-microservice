import { StaticImageData } from "next/image";

export interface Subcategory {
  name: string;
  icon: string | StaticImageData;
}

export const subcategories: Subcategory[] = [
  {
    name: "All Products",
    icon: "/assets/icons/Categories/SubCategories/moisturizers-icon.png",
  },
  {
    name: "Cleansers",
    icon: "/assets/icons/Categories/SubCategories/cleansers-icon.png",
  },
  {
    name: "Moisturizers",
    icon: "/assets/icons/Categories/SubCategories/moisturizers-icon.png",
  },
  {
    name: "Serums",
    icon: "/assets/icons/Categories/SubCategories/serums-icon.png",
  },
  {
    name: "Toners",
    icon: "/assets/icons/Categories/SubCategories/toner-icon.png",
  },
  {
    name: "Suncream",
    icon: "/assets/icons/Categories/SubCategories/suncream-icon.png",
  },
  {
    name: "Lip Care",
    icon: "/assets/icons/Categories/SubCategories/lipcare-icon.png",
  },

  // Just to handle edge case
  {
    name: "All Products",
    icon: "/assets/icons/Categories/SubCategories/all-products.png",
  },
  {
    name: "Cleansers",
    icon: "/assets/icons/Categories/SubCategories/cleansers-icon.png",
  },
  {
    name: "Moisturizers",
    icon: "/assets/icons/Categories/SubCategories/moisturizers-icon.png",
  },
  {
    name: "Serums",
    icon: "/assets/icons/Categories/SubCategories/serums-icon.png",
  },
  {
    name: "Toners",
    icon: "/assets/icons/Categories/SubCategories/toner-icon.png",
  },
  {
    name: "Suncream",
    icon: "/assets/icons/Categories/SubCategories/suncream-icon.png",
  },
  {
    name: "Lip Care",
    icon: "/assets/icons/Categories/SubCategories/lipcare-icon.png",
  },
];
