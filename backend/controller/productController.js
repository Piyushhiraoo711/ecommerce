import Product from "../model/productModel.js";
import cloudinaryModule from "../database/cloudinary.js";
const cloudinary = cloudinaryModule.v2;

// get all products
export const getProduct = async (req, res) => {
  try {
    const product = await Product.find();
    console.log("product");
    return res.json({ success: true, product });
  } catch (error) {
    res.status(500).send(error);
  }
};

// update product seller and admin dono kr skta hai
export const updateProduct = async (req, res) => {
  try {
    // only seller and admin update krega
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    if (
      req.user.role !== "admin" &&
      product.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for updating product",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json({
      success: false,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// create product only seller kr skta hai
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock } = req.body;

    if (!name || !description || !price || !category || !brand || !stock) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinaryModule.uploader.upload(file.path, {
          folder: "products",
        });
        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      stock,
      images,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// get product by id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    return res.json(product);
  } catch (error) {
    console.log("jhskjdhsd");
    res.status(500).json({ success: false, message: error });
  }
};

// delete product seller and admin dono kr skta hai
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ succes: false, message: "Product not found" });
    }

    if (
      req.user.role !== "admin" &&
      product.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for updating product",
      });
    }

    const deleteProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
