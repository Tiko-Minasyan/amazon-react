import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import productApi from "../../api/product.api";
import { useHistory, useLocation } from "react-router";

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

export default function Search({ addCartNum }) {
	const [products, setProducts] = React.useState([]);

	const classes = useStyles();
	const history = useHistory();
	const query = new URLSearchParams(useLocation().search);

	useEffect(() => {
		const searchData = {};
		if (query.get("category")) searchData["category"] = query.get("category");
		if (query.get("text")) searchData["text"] = query.get("text");

		productApi.searchProducts(searchData).then((res) => {
			setProducts(res.data);
		}); // eslint-disable-next-line
	}, [query.get("text"), query.get("category")]);

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
							image="http://beepeers.com/assets/images/commerces/default-image.jpg"
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
