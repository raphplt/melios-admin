import { Card, CardBody, CardHeader, Divider, Link } from "@nextui-org/react";

export default function DashboardCard({
	title,
	link,
	icon,
}: {
	title: string;
	link: string;
	icon: React.ReactNode;
}) {
	return (
		<Card>
			<CardHeader>
				<h4 className="text-lg font-semibold text-gray-800">{title}</h4>
			</CardHeader>
			<Divider />
			<CardBody>
				<Link href={link} className="flex flex-col items-center justify-center">
					<div className="p-4 bg-gray-100 rounded-full">{icon}</div>
					<p className="text-center mt-4">Accéder au tableau Admin {title}</p>
				</Link>
			</CardBody>
		</Card>
	);
}
