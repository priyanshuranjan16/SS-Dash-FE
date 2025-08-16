import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}

export function AuthCard({ 
  className, 
  title, 
  description, 
  children, 
  ...props 
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className={cn(
        "w-full max-w-md p-8 space-y-6 rounded-xl shadow-2xl",
        "bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 border-primary/20",
        className
      )} {...props}>
        <motion.div 
          className="space-y-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Card>
    </motion.div>
  )
}