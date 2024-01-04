import React, { useEffect, useState } from "react";
import Help from "@mui/icons-material/QuestionMark";
import ArrowUp from "@mui/icons-material/ExpandLess";
import { IconButton } from "@mui/material";
function Movement() {
	const [help, setHelp] = useState(false);
	const [arrowKeys, setArrowKeys] = useState({
		ArrowUp: false,
		ArrowDown: false,
		ArrowLeft: false,
		ArrowRight: false,
	});
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key in arrowKeys) {
				setArrowKeys((prevKeys) => ({
					...prevKeys,
					[event.key]: true,
				}));
			}
		};

		const handleKeyUp = (event) => {
			if (event.key in arrowKeys) {
				setArrowKeys((prevKeys) => ({
					...prevKeys,
					[event.key]: false,
				}));
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [arrowKeys]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-around",
				alignItems: "center",
				position: "relative",
				boxShadow: "0px 0px 5px 3px rgba(0,0,0,0.75)",
			}}
		>
			{help && (
				<p
					style={{
						position: "absolute",
						color: "red",
						top: -45,
						color: "red",
						fontWeight: "bold",
					}}
				>
					Key up
				</p>
			)}
			<div>
				<ArrowUp
					sx={{
						transform: "scale(2)",
						cursor: "pointer",
						color: arrowKeys.ArrowUp ? "red" : "black",
					}}
				/>
			</div>
			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "space-around",
				}}
			>
				{help && (
					<p
						style={{
							position: "absolute",
							color: "red",
							left: -70,
							top: 10,
							fontWeight: "bold",
						}}
					>
						Key Left
					</p>
				)}
				<div>
					<ArrowUp
						sx={{
							transform: "scale(2) rotate(-90deg)",
							cursor: "pointer",
							color: arrowKeys.ArrowLeft ? "red" : "black",
						}}
					/>
				</div>
				{help && (
					<p
						style={{
							position: "absolute",
							color: "red",
							right: -75,
							top: 10,
							fontWeight: "bold",
						}}
					>
						Key Right
					</p>
				)}
				<div>
					<ArrowUp
						sx={{
							transform: "scale(2) rotate(90deg)",
							cursor: "pointer",
							color: arrowKeys.ArrowRight ? "red" : "black",
						}}
					/>
				</div>
			</div>

			<div>
				<ArrowUp
					sx={{
						transform: "scale(2) rotate(180deg)",
						cursor: "pointer",
						color: arrowKeys.ArrowDown ? "red" : "black",
					}}
				/>
			</div>
			{help && (
				<p
					style={{
						position: "absolute",
						color: "red",
						top: 70,
						fontWeight: "bold",
					}}
				>
					Key Down
				</p>
			)}
			<IconButton 
				sx={{
					transform: "scale(0.7)",
					position: "absolute",
					bottom: -4,
					right: -4,
					color: help ? "red" : "black",
				}}
				onClick={() => setHelp((prev) => !prev)}
			>
				<Help />
			</IconButton>
		</div>
	);
}

export default Movement;
