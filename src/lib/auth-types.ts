export type SessionRole = "SUPER_ADMIN" | "EDITOR";

export type SessionCompany = {
  id: string;
  slug: string;
  name: string;
  canEdit: boolean;
};

export type AuthSessionUser = {
  id: string;
  email: string;
  name: string;
  role: SessionRole;
  mustChangePassword: boolean;
  companies: SessionCompany[];
};
