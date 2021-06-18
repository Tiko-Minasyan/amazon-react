import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import cartApi from "../../api/cart.api";
import { makeStyles } from "@material-ui/core";
import productApi from "../../api/product.api";

const useStyles = makeStyles({
	root: {
		maxWidth: 315,
		minWidth: 300,
		margin: 10,
	},
	img: {
		width: 315,
	},
	container: {
		border: "1px solid gray",
		margin: 5,
	},
	order: {
		display: "flex",
		flexWrap: "wrap",
	},
	orderDetails: {
		margin: 10,
	},
});

export default function MyOrders() {
	const [orders, setOrders] = React.useState();
	const [imageRendered, setImageRendered] = React.useState(false);

	const classes = useStyles();

	useEffect(() => {
		setImageRendered(false);

		cartApi.getOrders().then((res) => {
			setOrders(res.data);
		});
	}, []);

	useEffect(() => {
		if (imageRendered) return;

		let ids = [];
		for (let key in orders) {
			orders[key].forEach((item) => {
				if (!ids.includes(item.ProductId)) ids.push(item.ProductId);
			});
		}

		productApi.getOrderImages(ids).then((res) => {
			const newOrders = JSON.parse(JSON.stringify(orders));
			for (let key in newOrders) {
				newOrders[key].forEach((item) => {
					res.data.forEach((img) => {
						if (img.ProductId === item.ProductId) {
							item.defaultImg = img.name;
						}
					});
				});
			}

			setImageRendered(true);
			setOrders(newOrders);
		}); // eslint-disable-next-line
	}, [orders]);

	const timeFormat = (str) => {
		let date = str.split("T")[0].split("-");
		let time = str.split("T")[1].split(".")[0];

		date = date[2] + "/" + date[1] + "/" + date[0];

		return date + " " + time;
	};

	const totalPrice = (order) => {
		let price = 0;

		order.forEach((item) => {
			price += item.count * item.Product.price;
		});

		return price;
	};

	return orders ? (
		<>
			<h1>My Orders</h1>

			{Object.entries(orders).map(([key, value], index) => (
				<div className={classes.container} key={index}>
					<h2 className={classes.orderDetails}>
						Order time: {timeFormat(value[0].createdAt)}
					</h2>
					<h2 className={classes.orderDetails}>
						Total order price: {totalPrice(value)}
					</h2>
					<div className={classes.order}>
						{value.map((item) => (
							<Card className={classes.root} key={item.id}>
								<CardMedia
									component="img"
									alt="Product image could not be loaded"
									height="200"
									className={classes.img}
									image={
										item.defaultImg
											? `http://localhost:8000/${item.defaultImg}`
											: "http://beepeers.com/assets/images/commerces/default-image.jpg"
									}
								/>
								<CardContent>
									<Typography gutterBottom variant="h5" component="h2">
										{item.Product.name}
									</Typography>
									<Typography gutterBottom variant="subtitle1">
										{item.Product.brand}
									</Typography>
									<Typography gutterBottom variant="subtitle1">
										Price: {item.Product.price} cents
									</Typography>
									<Typography gutterBottom variant="subtitle1">
										Count: {item.count}
									</Typography>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			))}
		</>
	) : (
		<></>
	);
}
