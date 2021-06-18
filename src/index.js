import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import AppHeader from "./AppHeader";
import reportWebVitals from "./reportWebVitals";

const maxProfit = (arr) => {
	if (arr.length === 0) return 0;

	let min = arr[0];
	let totalProfit = 0;
	let currentProfit = 0;

	for (let i = 1; i < arr.length; i++) {
		if (arr[i] < min) min = arr[i];
		else {
			if (currentProfit === 0) currentProfit = arr[i] - min;
			else {
				if (arr[i] - min > currentProfit) currentProfit = arr[i] - min;
				else {
					min = arr[i];
					totalProfit += currentProfit;
					currentProfit = 0;
				}
			}
		}
	}

	if (currentProfit > 0) totalProfit += currentProfit;
	return totalProfit;
};
maxProfit([]);

const findIndices = (arr, target) => {
	let index = 0;

	while (index < arr.length - 1 || arr[index] >= target) {
		for (let i = 1; i < arr.length; i++) {
			if (arr[index] + arr[i] === target) return [index + 1, i + 1];
			else if (arr[index] + arr[i] > target) index += 1;
		}
		index += 1;
	}

	return null;
};
findIndices([]);

ReactDOM.render(
	<React.StrictMode>
		<AppHeader />
	</React.StrictMode>,
	document.getElementById("root")
);

reportWebVitals();
