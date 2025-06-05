import { useRef, type Dispatch, type SetStateAction } from "react";
import { useUploadPhoto } from "../model/mutations/use-upload-photo";

type Props = {
	preview: string | null;
	setPreview: Dispatch<SetStateAction<string | null>>;
};

export const LeftSection = ({ preview, setPreview }: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { mutate: uploadPhoto, isPending } = useUploadPhoto();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !file.type.startsWith("image/")) {
			alert("Загрузи изображение (JPG, PNG)");
			return;
		}

		const body = new FormData();
		body.append("file", file);

		uploadPhoto(body, {
			onSuccess: (response) => {
				console.log("Изображение успешно обработано:", response);
				setPreview(response.url);
			},
			onError: (error) => {
				alert("Ошибка загрузки изображения");
				console.error("Ошибка загрузки изображения:", error);
			},
		});
	};

	return (
		<div className="flex flex-col items-center w-[400px] gap-3">
			<div className="w-[400px] h-[600px] rounded-[20px] relative flex flex-col justify-end items-center overflow-hidden bg-white">
				{isPending ? (
					<p className="text-center text-3xl text-purple-600 mb-[230px] leading-snug">
						Идет загрузка изображения...
					</p>
				) : preview ? (
					<img
						src={preview}
						alt="Preview"
						className="absolute top-0 left-0 w-full h-full object-cover z-10"
					/>
				) : (
					<video
						autoPlay
						muted
						loop
						className="absolute top-0 left-0 w-full h-full object-cover"
					>
						<source src="/example.mp4" type="video/mp4" />
					</video>
				)}

				<label
					htmlFor="upload-photo"
					className="z-20 mb-2.5 px-[120px] py-3 bg-gradient-to-r from-[#A033FF] to-[#FF963A] rounded-[20px] text-white font-medium text-xl cursor-pointer"
				>
					Загрузи лицо
				</label>

				<input
					type="file"
					id="upload-photo"
					accept="image/*"
					className="hidden"
					ref={fileInputRef}
					onChange={handleFileChange}
				/>
			</div>

			<div className="text-center text-lg text-[#ccc] leading-snug">
				<span className="count">3/3 осталось сегодня</span>
				<br />
				<span className="locked">
					🔒{" "}
					<a href="#" className="text-[#7f5af0] font-bold no-underline">
						Получить больше генераций
					</a>
				</span>
			</div>
		</div>
	);
};
