import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(process.env.REACT_APP_BASE_URL+"/api/products/all");
				setProducts(response.data.products);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	return <ProductContext.Provider value={{ products, loading, error }}>{children}</ProductContext.Provider>;
};
