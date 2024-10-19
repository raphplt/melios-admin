import FileDropzone from "./FileZone";
import ToolTipImport from "./ToolTipImport";

export default function ImportHabits() {
	return (
		<div>
			<h1 className="text-center text-4xl font-bold text-gray-800 py-10">
				Importer des habitudes
			</h1>
			<ToolTipImport />
			<FileDropzone />
		</div>
	);
}
