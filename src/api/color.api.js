import API from "../axios";

class ColorAPI {
	getColors() {
		return API.get("/colors/");
	}
}

export default new ColorAPI();
