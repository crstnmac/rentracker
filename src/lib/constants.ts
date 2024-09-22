export const APP_TITLE = "Rentracker";
export const DATABASE_PREFIX = "rentrack";
export const TEST_DB_PREFIX = "test_rentrack";
export const EMAIL_SENDER = '"Rentracker" <noreply@rentracker.com>';

export enum Paths {
  Home = "/",
  Login = "/login",
  Signup = "/signup",
  Dashboard = "/dashboard",
  Properties = "/dashboard/properties",
  Property = "/dashboard/properties/[propertyId]",
  Tenants = "/dashboard/tenants",
  Tenant = "/dashboard/tenants/[tenantId]",
  Profile = "/dashboard/profile",
  VerifyEmail = "/verify-email",
  ResetPassword = "/reset-password",
}
