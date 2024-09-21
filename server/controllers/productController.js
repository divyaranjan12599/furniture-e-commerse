import Product from "../models/productModel.js";


//public contorllers
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            message: "Products fetched successfully",
            products,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

export const getProductById = async (req, res) => {
	const { productId } = req.params;

	try {
		const product = await Product.findOne({ _id: productId });

		if (!product) {
			return res.status(404).json({ message: "Product not found or not authorized" });
		}

		res.status(200).json({
			message: "Product found",
			product,
		});
	} catch (error) {
		res.status(500).json({ message: "Error fetching product", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		const featured = await Product.find({ isFeatured: true });
		if (!featured || featured.length == 0) {
			res.status(404).json({ message: "Not Products to be featured" });
		} else {
			res.status(201).json({ message: "Featured Products found!!", featured });
		}
	} catch (error) {
		res.status(500).json({ message: "Error getting featured product", error: error.message });
	}
};

// private controllers
export const createProduct = async (req, res) => {
	const { name, description, price, image, category, isFeatured } = req.body;

	try {
		const newProduct = await Product.create({
			name,
			description,
			price,
			image,
			category,
			isFeatured,
			belongsTo: req.user.userId,
		});

		res.status(201).json({
			message: "Product created successfully",
			product: newProduct,
		});
	} catch (error) {
		res.status(500).json({ message: "Error creating product", error: error.message });
	}
};

export const getUserProducts = async (req, res) => {
	try {
		const products = await Product.find({ belongsTo: req.user.userId });

		res.status(200).json({
			message: "Products fetched successfully",
			products,
		});
	} catch (error) {
		res.status(500).json({ message: "Error fetching products", error: error.message });
	}
};

export const getProductByIdProtected = async (req, res) => {
	const { productId } = req.params;

	try {
		const product = await Product.findOne({ _id: productId, belongsTo: req.user.userId });

		if (!product) {
			return res.status(404).json({ message: "Product not found or not authorized" });
		}

		res.status(200).json({
			message: "Product found",
			product,
		});
	} catch (error) {
		res.status(500).json({ message: "Error fetching product", error: error.message });
	}
};

export const updateProduct = async (req, res) => {
	const { productId } = req.params;
	const { name, description, price, image, category, isFeatured } = req.body;

	try {
		const product = await Product.findOne({ _id: productId, belongsTo: req.user.userId });

		if (!product) {
			return res.status(404).json({ message: "Product not found or not authorized" });
		}

		product.name = name || product.name;
		product.description = description || product.description;
		product.price = price || product.price;
		product.image = image || product.image;
		product.category = category || product.category;
		product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

		const updatedProduct = await product.save();

		res.status(200).json({
			message: "Product updated successfully",
			product: updatedProduct,
		});
	} catch (error) {
		res.status(500).json({ message: "Error updating product", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	const { productId } = req.params;

	try {
		const product = await Product.findOne({ _id: productId, belongsTo: req.user.userId });

		if (!product) {
			return res.status(404).json({ message: "Product not found or not authorized" });
		}

		await product.remove();

		res.status(200).json({
			message: "Product deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ message: "Error deleting product", error: error.message });
	}
};

export const setFeatured = async (req, res) => {
	const { productId } = req.params;
	const userId = req.user.userId;
	try {
		const product = await Product.findOne({ belongsTo: userId, _id: productId });
		if (!product) {
			return res.status(404).json({ message: "Product not found or not authorized" });
		}
        
        product.isFeatured = !product.isFeatured;
        product.save();
        if (product.isFeatured) {
            res.status(201).json({message: "Products added to Featured", product})
        }
        if(!product.isFeatured){
            res.status(201).json({message: "Products removed from Featured", product})
        }

	} catch (error) {
		res.status(500).json({ message: "Error setting featured product", error: error.message });
	}
};
