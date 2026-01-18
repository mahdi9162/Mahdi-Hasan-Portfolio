import { ReactNode, ElementType } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: ElementType
}

const Container = ({ children, className = '', as: Component = 'div' }: ContainerProps) => {
  // Merge default classes with custom className - matches Navbar width (max-w-7xl)
  const classes = `max-w-7xl mx-auto px-6 sm:px-8 ${className}`.trim()
  
  return <Component className={classes}>{children}</Component>
}

export default Container
