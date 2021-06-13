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
	const [products, setProducts] = React.useState([]);
	const [newCount, setNewCount] = React.useState({});
	const [totalCount, setTotalCount] = React.useState(0);

	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		if (!localStorage.token) {
			let cart = JSON.parse(localStorage.getItem("guestCart"));
			if (!cart) cart = [];
			productApi.guestCart(cart).then((res) => {
				let total = 0;
				res.data.forEach((item, index) => {
					item.Colors = item.Colors.filter(
						(color) => color.id === cart[item.id].color
					);

					total += item.price * item.count;
				});

				setProducts(res.data);
				setTotalCount(total);
			});
		}
	}, []);

	const setChipColor = (hex) => {
		return {
			background: hex,
		};
	};

	const editCount = (id) => {
		const newProducts = JSON.parse(JSON.stringify(products));
		newProducts.forEach((item) => {
			if (item.id === id) {
				item.editCount = true;
				const countObj = { ...newCount };
				countObj[id] = item.count;
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

	const saveCount = (id) => {
		const newProducts = [...products];
		let count;

		newProducts.forEach((item, index) => {
			if (item.id === id) {
				item.editCount = false;
				const countDiff = newCount[id] - item.count;
				item.count = newCount[id];
				count = parseInt(newCount[id]);

				setTotalCount(totalCount + countDiff * item.price);

				if (count === 0) newProducts.splice(index, 1);
				addCartNum(countDiff);
			}
		});
		setProducts(newProducts);

		if (!localStorage.token) {
			let cart = JSON.parse(localStorage.getItem("guestCart"));
			cart[id].count = count;
			if (count === 0) delete cart[id];
			localStorage.guestCart = JSON.stringify(cart);
		}
	};

	const remove = (id) => {
		let newProducts = [...products];
		newProducts = newProducts.filter((item) => {
			if (item.id === id) {
				setTotalCount(totalCount - item.count * item.price);
				return false;
			}

			return true;
		});

		setProducts(newProducts);

		if (!localStorage.token) {
			let cart = JSON.parse(localStorage.getItem("guestCart"));
			addCartNum(-cart[id].count);
			delete cart[id];
			localStorage.guestCart = JSON.stringify(cart);
		}
	};

	const checkout = () => {
		if (!localStorage.token) {
			history.push("/login");
		}
	};

	return (
		<>
			<Button onClick={checkout}>Proceed to Checkout</Button>
			<Typography gutterBottom variant="h5" component="h2">
				Subtotal ({cartNum} items): {totalCount} cents
			</Typography>
			<div>
				{products.map((product) => (
					<Card className={classes.root} key={product.id}>
						<CardMedia
							component="img"
							alt="Product image could not be loaded"
							height="200"
							image="http://beepeers.com/assets/images/commerces/default-image.jpg"
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
								{product.Colors.map((value) => (
									<Chip
										key={value.id}
										label={value.name}
										style={setChipColor(value.hex)}
										className={classes.chip}
									/>
								))}
							</Typography>
							<Typography variant="subtitle2" component="p">
								Price in cents: {product.price * product.count} ({product.price}{" "}
								each)
							</Typography>
							<Typography variant="body2">
								Category: {product.Category.name}
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
								<Typography variant="body2">Count: {product.count}</Typography>
							)}
						</CardContent>
						<CardActions className={classes.cardActions}>
							{product.editCount ? (
								<Button
									size="small"
									color="primary"
									onClick={() => saveCount(product.id)}
								>
									Save count
								</Button>
							) : (
								<Button
									size="small"
									color="primary"
									onClick={() => editCount(product.id)}
								>
									Edit count
								</Button>
							)}
							<Button
								size="small"
								color="secondary"
								onClick={() => remove(product.id)}
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
