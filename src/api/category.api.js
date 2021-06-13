import API from "../axios";

class CategoryAPI {
	getCategories() {
		return API.get("/categories/");
	}
}

export default new CategoryAPI();
