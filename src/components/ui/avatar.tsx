import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  online?: boolean;
  size?: "sm" | "md" | "lg";
  fallback?: React.ReactNode;
}

const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ src, alt = "User", online, size = "md", fallback, className, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    return (
      <div className="relative inline-flex">
        <Avatar 
          ref={ref} 
          className={cn(sizeClasses[size], className)} 
          {...props}
        >
          {src ? (
            <AvatarImage src={src} alt={alt} />
          ) : (
            <AvatarFallback>
              {fallback || <User className="w-5 h-5 text-gray-500" />}
            </AvatarFallback>
          )}
        </Avatar>
        {online && (
          <div className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white bg-green-500",
            {
              "h-2 w-2": size === "sm",
              "h-3 w-3": size === "md",
              "h-4 w-4": size === "lg",
            }
          )} />
        )}
      </div>
    );
  }
);
UserAvatar.displayName = "UserAvatar";

export { Avatar, AvatarImage, AvatarFallback, UserAvatar }
