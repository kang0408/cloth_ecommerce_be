export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  avatar: string;
  cloudinary_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserJWT {
  id: string;
  email: string;
  role: "user" | "admin";
}
