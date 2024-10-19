import { Chip } from "@nextui-org/react";

export default function ToolTipImport() {
	return (
		<div className="flex flex-col items-center justify-center mb-10">
			<p className="text-center ">Formats acceptés:</p>
			<div className="flex flex-row items-center justify-center">
				<Chip color="primary" className="m-1 text-default-100">
					CSV
				</Chip>
				<Chip color="primary" className="m-1 text-default-100">
					JSON
				</Chip>
				<Chip color="primary" className="m-1 text-default-100">
					XLSX
				</Chip>
			</div>
		</div>
	);
}
