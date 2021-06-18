import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import productApi from "../../api/product.api";
import { useHistory } from "react-router";

const useStyles = makeStyles({
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
	root: {
		maxWidth: 315,
		minWidth: 300,
		margin: 10,
	},
	chipContainer: {
		margin: "10px 0",
	},
	chip: {
		margin: 2,
	},
	img: {
		width: 315,
	},
});

export default function Dashboard() {
	const [products, setProducts] = React.useState([]);
	const [imageRendered, setImageRendered] = React.useState(false);

	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		setImageRendered(false);
		productApi.getProducts().then((res) => {
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

	const productPage = (id) => {
		history.push("/products/" + id);
	};

	return (
		<div className={classes.container}>
			{products.map((product) => (
				<Card className={classes.root} key={product.id}>
					<CardActionArea onClick={() => productPage(product.id)}>
						<CardMedia
							component="img"
							alt="Product image could not be loaded"
							height="200"
							className={classes.img}
							image={
								product.defaultImg
									? `http://localhost:8000/${product.defaultImg}`
									: "http://beepeers.com/assets/images/commerces/default-image.jpg"
							}
						/>
						<CardContent>
							<Typography gutterBottom variant="h5" component="h2">
								{product.name}
							</Typography>
							<Typography gutterBottom variant="subtitle1">
								{product.brand}
							</Typography>
							<Typography variant="subtitle2" component="p">
								Price in cents: {product.price}
							</Typography>
							<Typography variant="body2">
								Category: {product.Category.name}
							</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			))}
		</div>
	);
}
