import { Request, Response } from "express";
import { prisma } from "../../../../packages/libs/prisma";
import { imagekit } from "../../../../packages/libs/imagekit";
import { publishEvent } from "../../../../packages/libs/events/publisher";
// Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      description,
      regularPrice,
      salePrice,
      warranty,
      category,
      sku,
      stockQuantity,
      discountCode,
      tags,
      publicationStatus,
      featuredProduct,
    } = req.body;

    // Expect frontend to send Base64 strings for images
    const images: string[] = req.body.images || [];

    // Upload images to ImageKit
    const uploadedImages = await Promise.all(
      images.map(async (base64, index) => {
        const uploadResponse = await imagekit.upload({
          file: base64, // Base64 string from frontend
          fileName: `${slug}-${Date.now()}-${index}.jpg`,
        });
        return { url: uploadResponse.url };
      })
    );

    // Save product with ImageKit URLs
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        regularPrice: parseFloat(regularPrice),
        salePrice: parseFloat(salePrice),
        warranty,
        category,
        sku,
        stockQuantity: parseInt(stockQuantity, 10),
        discountCode,
        tags,
        publicationStatus,
        featuredProduct,
        images: { create: uploadedImages },
      },
      include: { images: true },
    });
    await publishEvent("productCreated", product);
    res.status(201).json(product);
  } catch (error: any) {
    console.error("Create Product Error:", error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

// Get All Products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
    });
    res.status(200).json(products);
  } catch (error: any) {
    console.error("Get Products Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Get Single Product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error: any) {
    console.error("Get Product Error:", error);
    return res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      description,
      regularPrice,
      salePrice,
      warranty,
      category,
      sku,
      stockQuantity,
      discountCode,
      tags,
      publicationStatus,
      featuredProduct,
      images,
    } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        regularPrice: parseFloat(regularPrice),
        salePrice: parseFloat(salePrice),
        warranty,
        category,
        sku,
        stockQuantity: parseInt(stockQuantity, 10),
        discountCode,
        tags,
        publicationStatus,
        featuredProduct,
        images: {
          deleteMany: {}, // remove old images
          create: images?.map((url: string) => ({ url })) || [],
        },
      },
      include: { images: true },
    });

    res.status(200).json(product);
  } catch (error: any) {
    console.error("Update Product Error:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.productImage.deleteMany({ where: { productId: id } }); // cleanup images
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};
