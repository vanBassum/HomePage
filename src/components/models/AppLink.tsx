

export type AppLinkButton = {
  label: string
  url: string
}

export type AppLink = {
  id: string
  name: string
  title: string
  description: string
  link: string
  iconUrl?: string
  buttons?: AppLinkButton[]
  status?: "online" | "offline" | "unknown"
  category?: string
}
