import HeaderDashboard from "./_components/HeaderDashboard";


interface SettingsLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout = ({ children }: SettingsLayoutProps) => {
	return (
		<>
			<div className="flex flex-col  h-full min-h-dvh">
				<HeaderDashboard />
				<div className="flex flex-1 h-full place-content-center overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-primary">
					<div className=" w-full  max-w-screen-2xl mt-[80px]">
						{children}
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardLayout;
