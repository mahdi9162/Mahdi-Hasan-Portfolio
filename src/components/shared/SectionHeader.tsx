import { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  rightSlot?: ReactNode
}

const SectionHeader = ({ 
  title, 
  subtitle, 
  align = 'left',
  rightSlot 
}: SectionHeaderProps) => {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  const maxWidthClass = align === 'center' ? 'mx-auto' : ''
  
  return (
    <div className={`mb-14 md:mb-16 ${alignClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Title with Divider Line - Matching Skills Style */}
          <div className={`flex ${align === 'center' ? 'justify-center' : 'items-center'} gap-4 mb-3`}>
            <h2 
              className="text-2xl md:text-5xl font-bold text-white uppercase tracking-[0.08em] hover:text-brand-gold-alt transition-all duration-300 cursor-pointer hover:drop-shadow-[0_0_15px_rgb(var(--brand-gold-alt)_/_0.25)]" 
              data-lens="on"
            >
              {title}
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent max-w-[140px]" />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className={`text-xs md:text-lg text-white/70 max-w-[620px] leading-relaxed ${maxWidthClass}`} data-lens="on">
              {subtitle}
            </p>
          )}
        </div>
        {rightSlot && (
          <div className="flex-shrink-0">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionHeader
