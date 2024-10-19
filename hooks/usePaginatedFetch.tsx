/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
	collection,
	getDocs,
	query,
	limit,
	startAfter,
	where,
	getCountFromServer,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface UsePaginatedFetchResult<T> {
	data: (T & { uid: string })[];
	loading: boolean;
	error: Error | null;
	fetchNextPage: () => void;
	fetchPreviousPage: () => void;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	totalCount: number;
	setPageSize: (size: number) => void;
	setSearchQuery: (query: string) => void;
}

const usePaginatedFetch = <T,>(
	collectionName: string,
	initialPageSize: number
): UsePaginatedFetchResult<T> => {
	const [page, setPage] = useState(0);
	const [lastDoc, setLastDoc] = useState<any>(null);
	const [totalCount, setTotalCount] = useState(0);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [searchQuery, setSearchQuery] = useState("");

	const fetchData = async (
		page: number,
		pageSize: number,
		searchQuery: string
	) => {
		let q;
		if (searchQuery) {
			q = query(
				collection(db, collectionName),
				where("name", ">=", searchQuery),
				where("name", "<=", searchQuery + "\uf8ff"),
				limit(pageSize)
			);
		} else if (page === 0) {
			q = query(collection(db, collectionName), limit(pageSize));
		} else {
			q = query(
				collection(db, collectionName),
				startAfter(lastDoc),
				limit(pageSize)
			);
		}

		const querySnapshot = await getDocs(q);
		const dataList = querySnapshot.docs.map(
			(doc) =>
				({
					...doc.data(),
					uid: doc.id,
				} as T & { uid: string })
		);

		setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

		// Fetch total count only once
		if (totalCount === 0) {
			const totalQuery = query(collection(db, collectionName));
			const totalSnapshot = await getCountFromServer(totalQuery);
			setTotalCount(totalSnapshot.data().count);
		}

		return {
			data: dataList,
			hasMore: querySnapshot.docs.length === pageSize,
		};
	};

	const { data, error, isLoading, isFetching, isPlaceholderData } = useQuery({
		queryKey: [collectionName, page, pageSize, searchQuery],
		queryFn: () => fetchData(page, pageSize, searchQuery),
		placeholderData: keepPreviousData,
	});

	const fetchNextPage = () => {
		if (!isPlaceholderData && data?.hasMore) {
			setPage((old) => old + 1);
		}
	};

	const fetchPreviousPage = () => {
		setPage((old) => Math.max(old - 1, 0));
	};

	useEffect(() => {
		setPage(0);
		setLastDoc(null);
	}, [pageSize, searchQuery]);

	return {
		data: data?.data || [],
		loading: isLoading || isFetching,
		error,
		fetchNextPage,
		fetchPreviousPage,
		hasNextPage: !isPlaceholderData && Boolean(data?.hasMore),
		hasPreviousPage: page > 0,
		totalCount,
		setPageSize,
		setSearchQuery,
	};
};

export default usePaginatedFetch;
