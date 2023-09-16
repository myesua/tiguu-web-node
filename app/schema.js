import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

// export type Users = mongoose.InferSchemaType<typeof UserSchema>;
export const Users = mongoose.model("Users", UserSchema);
