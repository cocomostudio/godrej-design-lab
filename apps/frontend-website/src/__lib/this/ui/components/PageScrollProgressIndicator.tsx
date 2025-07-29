import React, { useEffect, useState } from 'react';

export const ScrollProgressBar = ({ hide = false }: { hide?: boolean }) => {
	const [scrollProgress, setScrollProgress] = useState(0);

	const handleScroll = () => {
		const scrollTop =
			document.documentElement.scrollTop || document.body.scrollTop;
		const scrollHeight =
			document.documentElement.scrollHeight -
			document.documentElement.clientHeight;

		const scrolled = scrollTop / scrollHeight;
		setScrollProgress(scrolled);
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	if (hide) return null;

	return (
		<div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
			<div
				className="h-full bg-blue-500 origin-left transition-transform duration-200 ease-out"
				style={{
					transform: `scaleX(${scrollProgress})`,
				}}
			></div>
		</div>
	);
};
