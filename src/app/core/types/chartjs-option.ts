import { ChartConfiguration } from "chart.js";

export type ChartjsOption = {
  labels: string[];
  configuration: ChartConfiguration['data']['datasets'];
  options?: ChartConfiguration['options'];
};