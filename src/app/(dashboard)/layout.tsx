

interface SettingsLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout = async ({ children }: SettingsLayoutProps) => {


	return (
		<>
			<div className="flex flex-col h-screen">
				<div className="flex flex-1 h-full overflow-hidden">
					{/* <MainSideBar isPro={isPro} apiLimitCount={apiLimitCount} /> */}
					{/* <HeaderDashboard /> */}

					<div className="flex flex-1 h-full place-content-center overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-primary">
						<div className="p-0 md:p-2 mb-0 rounded-sm  w-full  max-w-screen-2xl mt-[80px]">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardLayout;
