import { environment } from "../../environments/environment.ts";

export const KajaConfig = {
  defaultPlace: environment.defaultPlace,
};

export const AwsConfig = {
  aws_project_region: environment.projectRegion,
  aws_cognito_region: environment.projectRegion,
  aws_user_pools_id: environment.cognitoPoolId,
  aws_user_pools_web_client_id: environment.cognitoPoolClientId,
};
