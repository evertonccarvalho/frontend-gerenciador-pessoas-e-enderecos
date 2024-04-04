import { Navbar } from "./_components/Navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="h-full items-center flex flex-1 min-h-svh bg-background overflow-x-clip overflow-y-auto">
			<Navbar />
			{children}
		</main>
	);
};

export default LandingLayout;
