import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { toast } from "sonner";
import type { Item } from "../../../../store/items/types";
import type { Product } from "../../../../store/products/types";

type Option = {
	id: number;
	name: string;
};

const isOption = (v: unknown): v is Required<Option> =>
	typeof v === "object" && v !== null && "id" in v && typeof v.id === "number";

const isNewOption = (v: unknown): v is Required<string> =>
	typeof v === "string";

type ItemInputProps = {
	products: Array<Product>;
	items: Array<Item & { productName?: string }>;
	addItemById: ({ id }: { id: number }) => Promise<void>;
	addItemByName: ({ name }: { name: string }) => Promise<void>;
};

export function ItemInput({
	products,
	items,
	addItemById,
	addItemByName,
}: ItemInputProps) {
	const [value, setValue] = useState<Option | null>(null);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(false);

	const onChange = async (
		_: React.SyntheticEvent,
		v: string | Option | null,
	) => {
		if (v == null) return;

		setLoading(true);
		try {
			if (isOption(v)) {
				await addItemById({ id: v.id });
			}
			if (isNewOption(v)) {
				const trimmed = v.trim();
				const alreadyExists = items.some((i) => i.productName === trimmed);
				if (alreadyExists) {
					toast.info(
						<Typography>{`${trimmed} steht schon in der Liste`}</Typography>,
					);
					return;
				}
				await addItemByName({ name: trimmed });
			}
		} finally {
			setLoading(false);
			setValue(null);
			setInputValue("");
		}
	};

	return (
		<Autocomplete
			freeSolo
			options={products}
			getOptionLabel={(o) => (isNewOption(o) ? o : o.name)}
			renderInput={(params) => (
				<TextField
					{...params}
					slotProps={{
						...params.slotProps,
						input: {
							...params.slotProps.input,
							endAdornment: (
								<>
									{loading ? (
										<CircularProgress color="inherit" size={20} />
									) : null}
								</>
							),
						},
					}}
				/>
			)}
			onChange={onChange}
			value={value}
			inputValue={inputValue}
			onInputChange={(_, v) => setInputValue(v)}
			clearOnBlur
			loading={loading}
		/>
	);
}
