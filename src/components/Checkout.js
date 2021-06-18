import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import cartApi from "../api/cart.api";

export default function Checkout() {
	const history = useHistory();

	const orderCheckout = () => {
		cartApi.checkout().then(() => {
			history.push("/myorders");
		});
	};

	return (
		<>
			<Button onClick={orderCheckout}>Check out</Button>
		</>
	);
}
