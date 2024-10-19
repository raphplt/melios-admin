import React from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Pagination,
	Select,
	SelectItem,
	Input,
} from "@nextui-org/react";
import { Habit } from "@/type/habit";

const DataTable = ({
	data,
	columns,
	fetchNextPage,
	fetchPreviousPage,
	hasPreviousPage,
	totalCount,
	search,
	handleSearchChange,
	handlePageSizeChange,
}: {
	data: Habit[];
	columns: {
		uid: string;
		name: string;
		actions?: boolean;
	}[];
	fetchNextPage: () => void;
	fetchPreviousPage: () => void;
	hasPreviousPage: boolean;
	totalCount: number;
	setSearchQuery: (query: string) => void;
	setPageSize: (size: number) => void;
	search: string;
	handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
	const renderCell = React.useCallback((data: Habit, columnKey: React.Key) => {
		const cellValue = data[columnKey as keyof Habit];
		switch (columnKey) {
			default:
				return cellValue;
		}
	}, []);

	const handlePageChange = (page: number) => {
		if (page === 1) {
			fetchPreviousPage();
		} else {
			fetchNextPage();
		}
	};

	const totalPages = Math.ceil(totalCount / 10);
	const bottomContent = (
		<div className="flex flex-row items-center justify-between w-full mx-auto">
			<Pagination
				total={totalPages}
				initialPage={hasPreviousPage ? 2 : 1}
				onChange={handlePageChange}
				isCompact
				className="text-default-200"
			/>
			<div className="flex gap-2 items-center w-fit">
				<Select
					value={10}
					onChange={handlePageSizeChange}
					className="bg-transparent outline-none text-default-400 text-small"
				>
					<SelectItem key={10} value={10}>
						10
					</SelectItem>
					<SelectItem key={25} value={25}>
						25
					</SelectItem>
					<SelectItem key={50} value={50}>
						50
					</SelectItem>
				</Select>
			</div>
		</div>
	);

	const topContent = (
		<div className="flex flex-row items-center justify-between w-full mx-auto">
			<Input
				value={search}
				onChange={handleSearchChange}
				placeholder="Rechercher..."
				className="w-[50%] mx-auto"
			/>
		</div>
	);

	return (
		<div>
			<Table
				aria-label="Tableau des habitudes"
				bottomContentPlacement="outside"
				className="w-[95%] mx-auto"
				selectionMode="multiple"
				isStriped
				topContent={topContent}
				bottomContent={bottomContent}
			>
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							align={column.uid === "actions" ? "center" : "start"}
						>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody items={data}>
					{(item) => (
						<TableRow key={item.uid}>
							{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default DataTable;
