"use client";
import usePaginatedFetch from "@/hooks/usePaginatedFetch";
import { Habit } from "@/type/habit";
import DataTable from "@/components/Table";
import { useState } from "react";

const HabitsList = () => {
	const {
		data,
		loading,
		error,
		fetchNextPage,
		fetchPreviousPage,
		hasPreviousPage,
		totalCount,
		setPageSize,
		setSearchQuery,
	} = usePaginatedFetch<Habit>("habits", 10);

	const [search, setSearch] = useState("");

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		setSearchQuery(e.target.value);
	};

	const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPageSize(Number(e.target.value));
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	const columns = [
		{ uid: "name", name: "Name" },
		{ uid: "description", name: "Description" },
		{ uid: "category", name: "Category" },
		{ uid: "duration", name: "Duration" },
		{ uid: "difficulty", name: "Difficulty" },
		{ uid: "actions", name: "Actions" },
	];

	return (
		<div>
			<h1 className="text-center text-2xl font-semibold text-gray-800 py-10">
				Liste d&apos;habitudes
			</h1>
			<DataTable
				data={data}
				columns={columns}
				fetchNextPage={fetchNextPage}
				fetchPreviousPage={fetchPreviousPage}
				hasPreviousPage={hasPreviousPage}
				totalCount={totalCount}
				setSearchQuery={setSearchQuery}
				setPageSize={setPageSize}
				search={search}
				handleSearchChange={handleSearchChange}
				handlePageSizeChange={handlePageSizeChange}
			/>
		</div>
	);
};

export default HabitsList;
