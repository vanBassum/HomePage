
/**
 * Dummy data – this will move to the real backend later.
 */

import type { AppLink } from "@/components/models/AppLink";

export const DUMMY_APPS: AppLink[] = [
  {
    id: "minio",
    name: "MinIO",
    title: "MinIO",
    description: "S3-compatible object storage",
    link: "https://minio.example.local",
    iconUrl: "https://cdn.simpleicons.org/minio",
    buttons: [
      { label: "Console", url: "https://minio.example.local/console" },
      { label: "Health", url: "https://minio.example.local/minio/health/live" },
    ],
    status: "online",
    category: "Storage",
  },
  {
    id: "traefik",
    name: "Traefik",
    title: "Traefik",
    description: "Reverse proxy & certificate automation",
    link: "https://traefik.example.local",
    iconUrl: "https://cdn.simpleicons.org/traefikproxy",
    buttons: [{ label: "Dashboard", url: "https://traefik.example.local/dashboard" }],
    status: "online",
    category: "Networking",
  },
  {
    id: "keycloak",
    name: "Keycloak",
    title: "Keycloak",
    description: "Identity and access management",
    link: "https://auth.example.local",
    iconUrl: "https://cdn.simpleicons.org/keycloak",
    buttons: [{ label: "Admin", url: "https://auth.example.local/admin" }],
    status: "offline",
    category: "Auth",
  },
  {
    id: "homepage",
    name: "Homepage",
    title: "Homepage",
    description: "Service dashboard",
    link: "https://home.example.local",
    iconUrl: "https://cdn.simpleicons.org/homeassistant",
    buttons: [{ label: "Config", url: "https://home.example.local/settings" }],
    status: "unknown",
    category: "Dashboards",
  },
  {
    id: "grafana",
    name: "Grafana",
    title: "Grafana",
    description: "Dashboards & observability",
    link: "https://grafana.example.local",
    iconUrl: "https://cdn.simpleicons.org/grafana",
    buttons: [
      { label: "Explore", url: "https://grafana.example.local/explore" },
      { label: "Alerts", url: "https://grafana.example.local/alerting" },
    ],
    status: "online",
    category: "Observability",
  },
  {
    id: "prom",
    name: "Prometheus",
    title: "Prometheus",
    description: "Metrics time-series DB",
    link: "https://prom.example.local",
    iconUrl: "https://cdn.simpleicons.org/prometheus",
    buttons: [{ label: "Targets", url: "https://prom.example.local/targets" }],
    status: "online",
    category: "Observability",
  },
]
