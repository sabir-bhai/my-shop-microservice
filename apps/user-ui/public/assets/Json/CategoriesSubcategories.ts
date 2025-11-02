import CleansersImage from "@/public/assets/images/cleanser.png";
import TonerImage from "@/public/assets/images/toner.png";
import SerumImage from "@/public/assets/images/serum.png";
import MasksImage from "@/public/assets/images/mask.png";
import ShampooImage from "@/public/assets/images/shampoo.png";
import ConditionerImage from "@/public/assets/images/conditioner.png";
import HairSerumsImage from "@/public/assets/images/hair_serums.png";
import HairOilsImage from "@/public/assets/images/hair_oils.png";
import BeardOilsImage from "@/public/assets/images/beard-oil.png";
import MoisturizerImage from "@/public/assets/images/moisturizer.png";
import { StaticImageData } from "next/image";

interface SubCategory {
  name: string;
  image: string | StaticImageData;
  link: string;
}

interface ViewAll {
  text: string;
  link: string;
}

interface CategoryRoute {
  title: string;
  subCategories: SubCategory[];
  viewAll?: ViewAll;
}

interface CategoryData {
  [route: string]: CategoryRoute;
}

export const categoryData: CategoryData = {
  "/": {
    title: "Popular Categories",
    subCategories: [
      { name: "Toners", image: TonerImage, link: "/category/skin-care/toners" },
      {
        name: "Shampoos",
        image: ShampooImage,
        link: "/category/hair-care/shampoo",
      },
      {
        name: "Moisturizers",
        image: MoisturizerImage,
        link: "/category/skin-care/moisturizers",
      },
      {
        name: "Beard Oils",
        image: BeardOilsImage,
        link: "/category/hair-care/beard-oils",
      },
      { name: "Toners", image: TonerImage, link: "/category/skin-care/toners" },
      {
        name: "Shampoos",
        image: ShampooImage,
        link: "/category/hair-care/shampoo",
      },
      {
        name: "Moisturizers",
        image: MoisturizerImage,
        link: "/category/skin-care/moisturizers",
      },
      {
        name: "Beard Oils",
        image: BeardOilsImage,
        link: "/category/hair-care/beard-oils",
      },
    ],
  },
  "/category/skin-care": {
    title: "Categories",
    subCategories: [
      {
        name: "Cleansers",
        image: CleansersImage,
        link: "/category/skin-care/cleansers",
      },
      { name: "Toners", image: TonerImage, link: "/category/skin-care/toners" },
      { name: "Serums", image: SerumImage, link: "/category/skin-care/serums" },
      { name: "Masks", image: MasksImage, link: "/category/skin-care/masks" },
      { name: "Toners", image: TonerImage, link: "/category/skin-care/toners" },
      { name: "Serums", image: SerumImage, link: "/category/skin-care/serums" },
      { name: "Masks", image: MasksImage, link: "/category/skin-care/masks" },
    ],
    viewAll: {
      text: "VIEW ALL PRODUCTS",
      link: "/category/skin-care/all-products",
    },
  },
  "/category/hair-care": {
    title: "Categories",
    subCategories: [
      {
        name: "Shampoo",
        image: ShampooImage,
        link: "/category/hair-care/shampoo",
      },
      {
        name: "Conditioner",
        image: ConditionerImage,
        link: "/category/hair-care/conditioner",
      },
      {
        name: "Serums",
        image: HairSerumsImage,
        link: "/category/hair-care/serums",
      },
      { name: "Oils", image: HairOilsImage, link: "/category/hair-care/oils" },
    ],
    viewAll: {
      text: "VIEW ALL PRODUCTS",
      link: "/category/hair-care/all-products",
    },
  },
  "/category/body-care": {
    title: "Categories",
    subCategories: [
      {
        name: "Shampoo",
        image: ShampooImage,
        link: "/category/hair-care/shampoo",
      },
      {
        name: "Conditioner",
        image: ConditionerImage,
        link: "/category/hair-care/conditioner",
      },
      {
        name: "Serums",
        image: HairSerumsImage,
        link: "/category/hair-care/serums",
      },
      { name: "Oils", image: HairOilsImage, link: "/category/hair-care/oils" },
    ],
    viewAll: {
      text: "VIEW ALL PRODUCTS",
      link: "/category/hair-care/all-products",
    },
  },
};
