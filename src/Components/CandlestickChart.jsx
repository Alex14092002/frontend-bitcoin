import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const CandlestickChart = () => {
	const chartRef = useRef();

	useEffect(() => {
		const ctx = chartRef.current.getContext("2d");
		const myChart = new Chart(ctx, {
			type: "candlestick",
			data: {
				datasets: [
					{
						label: "Candlestick Chart",
						data: [
							{ t: 1, o: 10, h: 15, l: 5, c: 10 },
							{ t: 2, o: 12, h: 16, l: 8, c: 11 },
							{ t: 3, o: 11, h: 14, l: 7, c: 9 },
							// Add more data here as needed
						],
					},
				],
			},
			options: {
				scales: {
					x: {
						type: "linear",
						position: "bottom",
					},
					y: {
						type: "linear",
						position: "left",
					},
				},
			},
		});

		return () => {
			myChart.destroy();
		};
	}, []);

	return (
		<div>
			<canvas ref={chartRef} />
		</div>
	);
};

export default CandlestickChart;
