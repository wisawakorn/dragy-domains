/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DeployedSubDomain {
  subdomain: string;
  projectName: string;
  status: "ONLINE" | "STANDBY";
  type: string;
}

export interface GeneratedAsset {
  id: string;
  prompt: string;
  type: "IMAGE" | "VIDEO";
  style: string;
  url: string;
  createdDate: string;
}
