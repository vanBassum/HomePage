import type { AppRecord } from "@/components/api/models/AppRecord"

export const DUMMY_APPS: AppRecord[] = [
  {
    id: "demo-1",
    name: "grafana",
    title: "Grafana",
    description: "Dashboards and visualization",
    link: "https://grafana.com",
    iconUrl: "https://cdn.simpleicons.org/grafana",
    category: "Monitoring",
  },
  {
    id: "demo-2",
    name: "loki",
    title: "Loki",
    description: "Logs aggregation",
    link: "https://grafana.com/oss/loki/",
    iconUrl: "https://cdn.simpleicons.org/grafana",
    category: "Monitoring",
  },
]
