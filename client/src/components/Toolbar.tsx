import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { courseCategories } from "@/lib/utils";

const Toolbar = ({ onSearch, onCategoryChange }: ToolbarProps) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		onSearch(value);
	};

	return (
		<div className="flex items-center justify-between gap-4 w-full mb-4">
			<input
				type="text"
				value={searchTerm}
				onChange={(e) => handleSearch(e.target.value)}
				placeholder="Search courses"
				className="w-full px-5 h-12 bg-customgreys-primarybg placeholder-customgreys-dirtyGrey text-customgreys-dirtyGrey border-none rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			/>

			<Select onValueChange={onCategoryChange}>
				<SelectTrigger className="h-12 w-[180px] bg-customgreys-primarybg text-customgreys-dirtyGrey border-none">
					<SelectValue placeholder="Categories" />
				</SelectTrigger>

				<SelectContent className="bg-customgreys-primarybg hover:bg-customgreys-primarybg/10">
					<SelectItem
						value="All"
						className="cursor-pointer hover:!bg-gray-100 hover:!text-customgreys-darkGrey"
					>
						All Categories
					</SelectItem>
					{courseCategories.map((category) => (
						<SelectItem
							key={category.value}
							value={category.value}
							className="cursor-pointer hover:!bg-gray-100 hover:!text-customgreys-darkGrey"
						>
							{category.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default Toolbar;
