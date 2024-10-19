/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
	checkColumns,
	formatFileSize,
	parseFile,
	requiredColumns,
} from "@/utils/import";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const FileDropzone = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [fileData, setFileData] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [viewLength, setViewLength] = useState<number>(15);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setError(null);
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				const content = event.target?.result;
				try {
					const columns = parseFile(file, content);
					if (checkColumns(columns)) {
						setFiles((prevFiles) => [...prevFiles, file]);
						const parsedData = JSON.parse(content as string);
						setFileData((prevData) => [...prevData, ...parsedData]);
					} else {
						setError(
							`Les colonnes suivantes sont manquantes : ${requiredColumns
								.filter((col) => !columns.includes(col))
								.join(", ")}`
						);
					}
				} catch (e: any) {
					setError(e.message);
				}
			};
			if (
				file.type ===
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			) {
				reader.readAsBinaryString(file);
			} else {
				reader.readAsText(file);
			}
		});
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"text/csv": [".csv"],
			"application/json": [".json"],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
				".xlsx",
			],
		},
	});

	const onSendData = async () => {
		try {
			const habitsCollection = collection(db, "habits");
			const promises = fileData.map((habit) => addDoc(habitsCollection, habit));
			await Promise.all(promises);
			console.log("Données importées avec succès");
			onOpenChange(); // Fermer la modale après l'importation
		} catch (error) {
			console.error("Erreur lors de l'importation des données : ", error);
			setError("Erreur lors de l'importation des données");
		}
	};

	return (
		<>
			<div
				{...getRootProps()}
				className="border-2 border-gray-300 border-dashed rounded-md p-8 text-center w-10/12 mx-auto mt-4"
			>
				<input {...getInputProps()} />
				{isDragActive ? (
					<p>Lâche le fichier ici ...</p>
				) : (
					<p>Déposez un fichier ici, ou cliquez pour sélectionner un fichier</p>
				)}
			</div>
			{error && <p className="text-red-500 mt-4 text-center">{error}</p>}
			<div className="mt-4 w-10/12 mx-auto">
				<h2 className="text-lg font-bold">Fichiers importés :</h2>
				<ul>
					{files.map((file, index) => (
						<li key={index} className="mt-2">
							{file.name} - {formatFileSize(file.size)}
						</li>
					))}
				</ul>
			</div>
			{files.length > 0 && (
				<>
					<Button
						color="primary"
						className="text-default-50 mx-auto w-fit mt-2  py-2 flex items-center"
						onClick={onOpen}
					>
						<Icon icon="mdi:firebase" className="mr-2" />
						Importer dans Firebase
					</Button>
					<div className="mt-4 w-10/12 mx-auto">
						<h2 className="text-lg font-bold">Aperçu des données :</h2>
						<table className="table-auto w-full mt-2">
							<thead>
								<tr>
									{requiredColumns.map((col, index) => (
										<th key={index} className="border border-gray-400 px-4 py-2">
											{col}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{fileData.slice(0, viewLength).map((row, rowIndex) => (
									<tr key={rowIndex}>
										{requiredColumns.map((col, colIndex) => (
											<td key={colIndex} className="border border-gray-400 px-4 py-2">
												{row[col]}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
						<Button
							onClick={() => setViewLength(viewLength + 15)}
							color="secondary"
							className="text-default-50 mx-auto w-fit mt-2  block py-2"
						>
							Voir plus
						</Button>
					</div>
				</>
			)}

			{/* Modale */}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Importer les données</ModalHeader>
							<ModalBody>
								<p>Êtes-vous sûr de vouloir importer les données ?</p>
								<div className="flex justify-center items-center">
									<Button
										color="danger"
										className="text-default-50 mx-auto w-fit mt-2  py-2"
										onClick={onClose}
									>
										Annuler
									</Button>
									<Button
										color="primary"
										className="text-default-50 mx-auto w-fit mt-2  py-2"
										onClick={onSendData}
									>
										Importer
									</Button>
								</div>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default FileDropzone;
