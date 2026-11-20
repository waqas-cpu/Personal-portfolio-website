import type { PortfolioProject } from "@/lib/schemas";
import { distributedSystemsSimulatorProject } from "./distributed-systems-simulator";
import { financialDocumentForensicsProject } from "./financial-document-forensics";
import { financialIntelligenceLakehouseProject } from "./financial-intelligence-lakehouse";
import { realEstateTokenizationProject } from "./real-estate-tokenization";
import { transactionRiskEngineProject } from "./transaction-risk-engine";

export const allProjects: PortfolioProject[] = [
  realEstateTokenizationProject,
  financialIntelligenceLakehouseProject,
  transactionRiskEngineProject,
  distributedSystemsSimulatorProject,
  financialDocumentForensicsProject,
];
