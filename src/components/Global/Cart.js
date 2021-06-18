import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core";
import productApi from "../../api/product.api";
import { useHistory } from "react-router";
import cartApi from "../../api/cart.api";

const useStyles = makeStyles({
	root: {
		width: "100%",
		margin: 10,
		display: "grid",
		gridTemplateColumns: "1.5fr 3fr 1fr",
	},
	chipContainer: {
		margin: "10px 0",
	},
	chip: {
		margin: 2,
	},
	count: {
		width: "30px",
		marginLeft: "10px",
	},
	countText: {
		display: "flex",
	},
	cardImg: {
		display: "inline-block",
		maxWidth: 345,
	},
	cardContent: {
		paddingTop: "5px",
	},
	cardActions: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",

		"& button": {
			marginBottom: "20px",
		},
	},
});

export default function Cart({ cartNum, addCartNum }) {
	const [cart, setCart] = React.useState([]);
	const [products, setProducts] = React.useState([]);
	const [newCount, setNewCount] = React.useState({});
	const [totalCount, setTotalCount] = React.useState(0);
	const [guest, setGuest] = React.useState(false);
	const [imageRendered, setImageRendered] = React.useState(false);

	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		setImageRendered(false);
		if (!localStorage.token) {
			let cart = JSON.parse(localStorage.getItem("guestCart"));
			if (!cart) cart = [];
			productApi.guestCart(cart).then((res) => {
				let total = 0;
				res.data.forEach((item) => {
					item.Colors = item.Colors.filter(
						(color) => color.id === cart[item.id].color
					);

					total += item.price * item.count;
				});

				setGuest(true);
				setProducts(res.data);
				setTotalCount(total);
			});
		} else {
			cartApi.getCart().then((res) => {
				const cart = res.data;
				const arr = [];
				let total = 0;

				for (let item of cart) {
					arr.push(item.Product);
					total += item.count * item.Product.price;
				}

				setCart(res.data);
				setProducts(arr);
				setTotalCount(total);
			});
		}
	}, []);

	useEffect(() => {
		if (products.length === 0) return;
		else if (!imageRendered) {
			productApi.getDefaultImages().then((res) => {
				const images = res.data;
				const newProducts = [...products];
				newProducts.forEach((product) => {
					for (let image of images) {
						if (product.id === image.ProductId) {
							product["defaultImg"] = image.name;
						}
					}
				});
				setProducts(newProducts);
				setImageRendered(true);
			});
		} // eslint-disable-next-line
	}, [products]);

	const setChipColor = (hex) => {
		return {
			background: hex,
		};
	};

	console.log(products);
	const editCount = (id, index) => {
		const newProducts = JSON.parse(JSON.stringify(products));
		newProducts.forEach((item) => {
			if (item.id === id) {
				item.editCount = true;
				const countObj = { ...newCount };
				if (guest) countObj[id] = item.count;
				else countObj[id] = cart[index].count;
				setNewCount(countObj);
			}
		});
		setProducts(newProducts);
	};

	const onCountChange = (e, id) => {
		if (
			isNaN(e.target.value) || // eslint-disable-next-line
			(e.target.value[0] == 0 && e.target.value.length > 1) ||
			e.target.value > 9999
		)
			return;

		const countObj = { ...newCount };
		countObj[id] = e.target.value;
		setNewCount(countObj);
	};

	const saveCount = (id, itemIndex) => {
		const newProducts = [...products];
		let count;
		let countDiff;

		newProducts.forEach((item, index) => {
			if (item.id === id) {
				item.editCount = false;
				countDiff = newCount[id] - (guest ? item.count : cart[itemIndex].count);
				if (guest) item.count = newCount[id];
				else cart[itemIndex].count = newCount[id];

				count = parseInt(newCount[id]);

				setTotalCount(totalCount + countDiff * item.price);

				if (count === 0) {
					newProducts.splice(index, 1);
					if (!guest) {
						const newCart = JSON.parse(JSON.stringify(cart));
						newCart.splice(index, 1);
						setCart(newCart);
					}
				}
				addCartNum(countDiff);
			}
		});
		setProducts(newProducts);

		if (!localStorage.token) {
			let cart = JSON.parse(localStorage.getItem("guestCart"));
			cart[id].count = count;
			if (count === 0) delete cart[id];
			localStorage.guestCart = JSON.stringify(cart);
		} else {
			if (count === 0) {
				cartApi.removeItem(id);
			} else {
				cartApi.update(id, countDiff);
			}
		}
	};

	const remove = (id, index) => {
		let newProducts = [...products];
		newProducts = newProducts.filter((item, itemIndex) => {
			if (item.id === id) {
				setTotalCount(
					totalCount - (guest ? item.count : cart[index].count) * item.price
				);

				if (!guest) {
					let newCart = JSON.parse(JSON.stringify(cart));
					newCart.splice(itemIndex, 1);
					setCart(newCart);
				}
				return false;
			}

			return true;
		});

		setProducts(newProducts);

		if (!localStorage.token) {
			let guestCart = JSON.parse(localStorage.getItem("guestCart"));
			addCartNum(-guestCart[id].count);
			delete guestCart[id];
			localStorage.guestCart = JSON.stringify(guestCart);
		} else {
			addCartNum(-cart[index].count);
			cartApi.removeItem(id);
		}
	};

	const checkout = () => {
		if (!localStorage.token) {
			history.push("/login");
		} else {
			history.push("/checkout");
		}
	};

	return (
		<>
			<Button onClick={checkout}>Proceed to Checkout</Button>
			<Typography gutterBottom variant="h5" component="h2">
				Subtotal ({cartNum} items): {totalCount} cents
			</Typography>
			<div>
				{products.map((product, index) => (
					<Card
						className={classes.root}
						key={guest ? product.id : cart[index].id}
					>
						<CardMedia
							component="img"
							alt="Product image could not be loaded"
							height="200"
							image={
								product.defaultImg
									? `http://localhost:8000/${product.defaultImg}`
									: "http://beepeers.com/assets/images/commerces/default-image.jpg"
							}
							className={classes.cardImg}
						/>
						<CardContent className={classes.cardContent}>
							<Typography gutterBottom variant="h5" component="h2">
								{product.name}
							</Typography>
							<Typography gutterBottom variant="subtitle1">
								{product.brand}
							</Typography>
							<Typography variant="body2" color="textSecondary" component="p">
								{product.description}
							</Typography>
							<Typography variant="caption" className={classes.chipContainer}>
								{"Selected product color: "}
								{guest ? (
									product.Colors.map((value) => (
										<Chip
											key={value.id}
											label={value.name}
											style={setChipColor(value.hex)}
											className={classes.chip}
										/>
									))
								) : (
									<Chip
										key={cart[index].Color.id}
										label={cart[index].Color.name}
										style={setChipColor(cart[index].Color.hex)}
										className={classes.chip}
									/>
								)}
							</Typography>
							<Typography variant="subtitle2" component="p">
								Price in cents:{" "}
								{guest
									? product.price * product.count
									: product.price * cart[index].count}{" "}
								({product.price} each)
							</Typography>
							{product.editCount ? (
								<Typography variant="body2" className={classes.countText}>
									{"Count: "}
									<input
										className={classes.count}
										value={newCount[product.id]}
										onChange={(e) => onCountChange(e, product.id)}
									/>
								</Typography>
							) : (
								<Typography variant="body2">
									Count: {guest ? product.count : cart[index].count}
								</Typography>
							)}
						</CardContent>
						<CardActions className={classes.cardActions}>
							{product.editCount ? (
								<Button
									size="small"
									color="primary"
									onClick={() => saveCount(product.id, index)}
								>
									Save count
								</Button>
							) : (
								<Button
									size="small"
									color="primary"
									onClick={() => editCount(product.id, index)}
								>
									Edit count
								</Button>
							)}
							<Button
								size="small"
								color="secondary"
								onClick={() => remove(product.id, index)}
							>
								Remove from cart
							</Button>
						</CardActions>
					</Card>
				))}
			</div>
		</>
	);
}
