import "./css/App.css";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Edit from "./components/Edit";
import axiosSetup from "./axios.setup";
import CreateProduct from "./components/CreateProduct";
import MyProducts from "./components/MyProducts";
import EditProduct from "./components/EditProduct";
import Dashboard from "./components/Dashboard";

function App() {
	axiosSetup();

	return (
		<Router>
			<Switch>
				<Route path="/" exact={true}>
					<SignIn />
				</Route>
				<Route path="/register">
					<Register />
				</Route>
				<Route path="/profile">
					<Profile />
				</Route>
				<Route path="/edit">
					<Edit />
				</Route>
				<Route path="/create">
					<CreateProduct />
				</Route>
				<Route path="/myproducts" exact={true}>
					<MyProducts />
				</Route>
				<Route path="/myproducts/:id">
					<EditProduct />
				</Route>
				<Route path="/dashboard">
					<Dashboard />
				</Route>
				<Route path="/">
					<Redirect to="/profile" />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
