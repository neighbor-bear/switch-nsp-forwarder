import { useEffect, useState } from 'react';
import { Image, type ImageProps } from 'react-tela';

export interface AppIconProps extends Omit<ImageProps, 'src'> {
	app: Switch.Application;
}

export function AppIcon({
	app,
	width = 256,
	height = 256,
	...rest
}: AppIconProps) {
	const [imgUrl, setImgUrl] = useState<string | null>(null);

	useEffect(() => {
		const { icon } = app;
		if (!icon) return;
		const url = URL.createObjectURL(new Blob([icon], { type: 'image/jpeg' }));
		setImgUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [app]);

	return (
		imgUrl && <Image {...rest} src={imgUrl} width={width} height={height} />
	);
}
