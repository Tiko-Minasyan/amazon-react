import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import productApi from "../../../api/product.api";

const useStyles = makeStyles({
	root: {
		minWidth: 275,
		width: 315,
		margin: 10,
	},
	title: {
		fontWeight: "bold",
		fontSize: 18,
	},
	field: {
		marginBottom: 10,
		width: "100%",
	},
	pos: {
		marginBottom: 12,
	},
	chip: {
		margin: 4,
		marginLeft: 0,
	},
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
});

export default function MyProducts() {
	const [products, setProducts] = React.useState([]);
	const [imageRendered, setImageRendered] = React.useState(false);
	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		setImageRendered(false);
		productApi.myProducts().then((res) => {
			setProducts(res.data);
		});
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

	const editProduct = (e) => {
		history.push("/myproducts/" + e.target.closest("button").id);
	};

	const setChipColor = (hex) => {
		return {
			background: hex,
		};
	};

	return products ? (
		<div>
			<Link to="/profile">Back to profile</Link> <br />
			<Link to="/create">Create product</Link>
			<div className={classes.container}>
				{products.map((product) => (
					<Card className={classes.root} variant="outlined" key={product.id}>
						<CardMedia
							component="img"
							alt="Product image could not be loaded"
							height="200"
							image={
								product.defaultImg
									? `http://localhost:8000/${product.defaultImg}`
									: "http://beepeers.com/assets/images/commerces/default-image.jpg"
							}
						/>
						<CardContent>
							<Typography className={classes.title} gutterBottom>
								{product.name}
							</Typography>
							<Typography className={classes.pos}>
								Brand: {product.brand}
							</Typography>
							<Typography color="textSecondary" gutterBottom>
								{product.description}
							</Typography>
							<Typography variant="body2" component="p" gutterBottom>
								Price in cents: {product.price}
							</Typography>
							<Typography variant="body2">
								Category: {product.Category.name}
							</Typography>

							{product.Colors.map((value) => (
								<Chip
									key={value.id}
									label={value.name}
									style={setChipColor(value.hex)}
									className={classes.chip}
								/>
							))}

							<Typography variant="body2" component="p">
								Published: {product.published ? "Yes" : "No"}
							</Typography>
						</CardContent>
						<CardActions>
							<Button size="small" id={product.id} onClick={editProduct}>
								Edit product
							</Button>
						</CardActions>
					</Card>
				))}
			</div>
		</div>
	) : (
		<></>
	);
}
