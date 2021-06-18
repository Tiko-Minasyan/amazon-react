import API from "../axios";

class CartAPI {
	addCarts(data) {
		return API.post("/carts/", data);
	}

	getCart() {
		return API.get("/carts/");
	}

	update(id, count) {
		return API.patch("/carts/", { id, count });
	}

	addCart(data) {
		return API.post("/carts/addOne", data);
	}

	removeItem(id) {
		return API.delete(`/carts/${id}`);
	}

	checkout() {
		return API.get("/orders/checkout");
	}

	getOrders() {
		return API.get("/orders/myorders");
	}
}

export default new CartAPI();
