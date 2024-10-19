import DashboardCard from "./DashboardCard";
import { Icon } from "@iconify/react";

export default function Dashboard() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-11/12 mx-auto">
			<DashboardCard
				title="Habitudes"
				link="/habits"
				icon={<Icon icon="carbon:activity" width={32} height={32} />}
			/>
			<DashboardCard
				title="Imports"
				link="/imports"
				icon={<Icon icon="uil:import" width={32} height={32} />}
			/>
			<DashboardCard
				title="Se connecter"
				link="/login"
				icon={<Icon icon="uil:sign-in-alt" width={32} height={32} />}
			/>
		</div>
	);
}
