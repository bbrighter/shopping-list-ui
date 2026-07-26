import Box from "@mui/material/Box";
import emptyCartSvg from "./empty-cart.svg";

type NoDataProps = { show: boolean };

export const NoData = ({ show }: NoDataProps) => {
	if (show) {
		return (
			<Box
				sx={{
					alignContent: "center",
					justifyContent: "center",
					display: "flex",
				}}
			>
				<Box component="img" sx={{ width: "50%" }} src={emptyCartSvg} />
			</Box>
		);
	} else {
		return null;
	}
};
