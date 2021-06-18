import API from "../axios";

class ProductAPI {
	myProducts() {
		return API.get("/products/myproducts");
	}

	createProduct(data) {
		return API.post("/products/create", data).catch((e) => {
			return e.response.status;
		});
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

	addImage(data, id) {
		return API.post(`/products/addImage/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}).catch((e) => {
			return e.response.status;
		});
	}

	getDefaultImages() {
		return API.get("/products/images/defaults");
	}

	getProductImages(id) {
		return API.get(`/products/images/all/${id}`);
	}

	makeDefaultImg(id, imgId) {
		return API.post(`/products/images/makeDefault/${imgId}`, { id });
	}

	deleteImg(id, imgId) {
		return API.post(`/products/images/delete/${imgId}`, { id });
	}

	getOrderImages(data) {
		return API.post(`/products/images/orders`, data);
	}
}

export default new ProductAPI();
