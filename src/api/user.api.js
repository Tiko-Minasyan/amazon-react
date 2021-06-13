import API, { setAuthToken } from "../axios";

class UserAPI {
	register(data) {
		return API.post("/users/register", data).catch((e) => {
			if (e.response.status === 409) {
				return 409;
			}
		});
	}

	getProfile() {
		return API.get("/users/profile").catch((e) => {
			//
		});
	}

	login(data) {
		return API.post("/users/login", data)
			.then((res) => {
				setAuthToken(res.data);
				return res.data;
			})
			.catch((e) => {
				if (e.response.status === 404) return 404;
				if (e.response.status === 403) return 403;
			});
	}

	edit(data) {
		API.patch("/users/edit", data).catch((e) => {
			if (e.response.status === 403) return 403;
		});
	}
}

export default new UserAPI();
