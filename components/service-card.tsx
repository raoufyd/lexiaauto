import { Car, Search, Shield, Ship } from "lucide-react"

interface ServiceCardProps {
  icon: string
  title: string
  description: string
}

export default function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        {icon === "car" && <Car className="h-8 w-8 text-red-600" />}
        {icon === "search" && <Search className="h-8 w-8 text-red-600" />}
        {icon === "shield" && <Shield className="h-8 w-8 text-red-600" />}
        {icon === "ship" && <Ship className="h-8 w-8 text-red-600" />}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
