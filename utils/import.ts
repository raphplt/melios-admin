import Papa from "papaparse";
import * as XLSX from "xlsx";

export const requiredColumns = [
	"name",
	"description",
	"duration",
	"moment",
	"difficulty",
	"type",
	"category",
];

export const checkColumns = (columns: string[]): boolean => {
	const missingColumns = requiredColumns.filter((col) => !columns.includes(col));
	return missingColumns.length === 0;
};

export const parseFile = (
	file: File,
	content: string | ArrayBuffer | null | undefined
): string[] => {
	let columns: string[] = [];
	if (file.type === "text/csv") {
		const parsed = Papa.parse(content as string, { header: true });
		columns = parsed.meta.fields || [];
	} else if (file.type === "application/json") {
		const json = JSON.parse(content as string);
		columns = Object.keys(json[0]);
	} else if (
		file.type ===
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	) {
		const workbook = XLSX.read(content, { type: "binary" });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
		if (json.length === 0 || !json || !json[0]) {
			throw new Error("Aucune donnée trouvée dans le fichier");
		}
		columns = json[0] as string[];
	}
	return columns;
};

export const formatFileSize = (size: number): string => {
	const units = ["Bytes", "KB", "MB", "GB", "TB"];
	let unitIndex = 0;
	let formattedSize = size;

	while (formattedSize >= 1024 && unitIndex < units.length - 1) {
		formattedSize /= 1024;
		unitIndex++;
	}

	return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
};
