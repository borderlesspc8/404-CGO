"use client"

interface HamburgerMenuProps {
  checked: boolean
  onToggle: () => void
  className?: string
}

export function HamburgerMenu({ checked, onToggle, className = "" }: HamburgerMenuProps) {
  return (
    <label
      className={`hamburger cursor-pointer flex items-center justify-center p-2 shrink-0 ${className}`}
      onClick={(e) => {
        e.preventDefault()
        onToggle()
      }}
      aria-label={checked ? "Fechar menu" : "Abrir menu"}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {}}
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <svg viewBox="0 0 32 32" className="h-[2.2em] w-[2.2em] hamburger-svg">
        <path
          className="line line-top-bottom"
          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
        />
        <path className="line" d="M7 16 27 16" />
      </svg>
    </label>
  )
}
