"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`
        relative overflow-hidden transition-all duration-300 ease-in-out
        ${
          theme === "dark"
            ? "border-gray-700 hover:bg-gray-800 text-gray-200 bg-gray-900"
            : "border-gray-300 hover:bg-gray-100 text-gray-700 bg-white"
        }
      `}
    >
      <div className="relative flex items-center space-x-2">
        {theme === "dark" ? (
          <>
            <Sun className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Modo Claro</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Modo Noturno</span>
          </>
        )}
      </div>
    </Button>
  )
}
