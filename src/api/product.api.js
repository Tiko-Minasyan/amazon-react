import API from "../axios";

class ProductAPI {
	myProducts() {
		return API.get("/products/myproducts");
	}

	createProduct(data) {
		return API.post("/products/create", data);
	}

	getProduct(id) {
		return API.get(`/products/${id}`);
	}

	editProduct(id, data) {
		return API.patch(`/products/${id}`, data);
	}

	deleteProduct(id) {
		return API.delete(`/products/${id}`);
	}

	getProducts() {
		return API.get("/products");
	}

	searchProducts(data) {
		return API.post("/products/search", data);
	}

	guestCart(data) {
		return API.post("/products/guestCart", data);
	}
}

export default new ProductAPI();
