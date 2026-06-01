import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export const FullSizeLoader = ({ open }: { open: boolean }) => {
	return (
		<Backdrop
			data-testid="loader-backdrop"
			open={open}
			sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
		>
			<CircularProgress size={75} />
		</Backdrop>
	);
};
