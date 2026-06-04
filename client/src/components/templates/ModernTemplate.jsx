import React from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Link
} from 'lucide-react'

const ModernTemplate = ({ data, accentColor }) => {
  return (
    <div className="p-6">

      {/* Name */}
      <h1 className="text-3xl font-bold" style={{ color: accentColor }}>
        {data?.personal_info?.full_name}
      </h1>

      {/* Contact Section */}
      <div className="mt-4 space-y-2 text-sm text-gray-600">

        {data?.personal_info?.email && (
          <div className="flex items-center gap-2">
            <Mail className="size-4" />
            {data.personal_info.email}
          </div>
        )}

        {data?.personal_info?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="size-4" />
            {data.personal_info.phone}
          </div>
        )}

        {data?.personal_info?.location && (
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            {data.personal_info.location}
          </div>
        )}

        {data?.personal_info?.website && (
          <div className="flex items-center gap-2">
            <Globe className="size-4" />
            {data.personal_info.website}
          </div>
        )}

        {data?.personal_info?.linkedin && (
          <div className="flex items-center gap-2">
            <Link className="size-4" />
            {data.personal_info.linkedin}
          </div>
        )}

      </div>

    </div>
  )
}

export default ModernTemplate