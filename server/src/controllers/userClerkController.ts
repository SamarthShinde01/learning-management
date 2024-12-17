import { Request, Response } from "express";
import { clerkClient } from "..";

export const updateUser = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const userData = req.body;
	try {
		await clerkClient.users.updateUserMetadata(userId, {
			publicMetadata: {
				userType: userData.publicMetadata.userType,
				settings: userData.publicMetadata.settings,
			},
		});

		res.json({ message: "User updated successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error updating user", error });
	}
};
