import axios from "axios";
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Chip } from "@material-ui/core";

const useStyles = makeStyles({
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
	root: {
		maxWidth: 345,
		minWidth: 300,
		margin: 10,
	},
	chipContainer: {
		margin: "10px 0",
	},
	chip: {
		margin: 2,
	},
});

export default function Dashboard() {
	const [products, setProducts] = React.useState([]);
	const [rerender, setRerender] = React.useState(0);

	const classes = useStyles();

	useEffect(() => {
		axios
			.get("http://localhost:8000/products")
			.then((res) => {
				setProducts(res.data);
			})
			.catch((e) => {
				console.log(e.response);
			});
	}, []);

	const setChipColor = (hex) => {
		return {
			background: hex,
		};
	};

	const getItemCount = (id) => {
		const num = localStorage.getItem("Product" + id);
		return !num ? 0 : num;
	};

	const addToCart = (e) => {
		const id = e.target.closest("button").id;
		let num = localStorage.getItem("Product" + id);
		if (!num) num = 0;
		localStorage.setItem("Product" + id, parseInt(num) + 1);
		setRerender(rerender + 1);
	};

	const removeFromCart = (e) => {
		const id = e.target.closest("button").id;
		localStorage.removeItem("Product" + id);
		setRerender(rerender + 1);
	};

	return (
		<div className={classes.container}>
			{products.map((product) => (
				<Card className={classes.root} key={product._id}>
					{console.log(product)}
					<CardMedia
						component="img"
						alt="Product image could not be loaded"
						height="200"
						image="http://beepeers.com/assets/images/commerces/default-image.jpg"
					/>
					<CardContent>
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
							Available colors:
							{product.colors.map((value) => (
								<Chip
									key={value._id}
									label={value.name}
									style={setChipColor(value.hex)}
									className={classes.chip}
								/>
							))}
						</Typography>
						<Typography variant="subtitle2" component="p">
							Price in cents: {product.price}
						</Typography>
					</CardContent>
					<CardActions>
						<Button
							size="small"
							color="primary"
							onClick={addToCart}
							id={product._id}
						>
							Add to cart
						</Button>
						<Button
							size="small"
							color="secondary"
							onClick={removeFromCart}
							id={product._id}
						>
							Remove from cart ({getItemCount(product._id)})
						</Button>
					</CardActions>
				</Card>
			))}
		</div>
	);
}
