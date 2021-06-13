import API from "../axios";

class AddressAPI {
	getAddresses() {
		return API.get("/addresses/");
	}

	addAddress(data) {
		return API.post("/addresses/add", data);
	}

	setAsDefault(id) {
		return API.post("/addresses/default", { id });
	}

	getAddress(id) {
		return API.get(`/addresses/${id}`);
	}

	editAddress(id, data) {
		return API.patch(`/addresses/${id}`, data);
	}

	remove(id) {
		return API.delete(`/addresses/${id}`);
	}
}

export default new AddressAPI();
