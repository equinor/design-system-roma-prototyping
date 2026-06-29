import { forwardRef } from 'react'
import { Icon } from '../Icon'
import type { BadgeRlProps, BadgeRlSemanticColor } from './BadgeRl.types'
import './badgerl.css'

const SEMANTIC_COLORS = new Set<string>([
  'neutral',
  'accent',
  'danger',
  'warning',
  'info',
  'success',
])

const isSemanticColor = (color: string): color is BadgeRlSemanticColor =>
  SEMANTIC_COLORS.has(color)

/**
 * BadgeRl is a non-interactive component for displaying short pieces of
 * information that require more visual emphasis than plain text.
 *
 * If you need interactivity (click, select, delete), use the Chip component
 * instead.
 */
export const BadgeRl = forwardRef<HTMLSpanElement, BadgeRlProps>(
  function BadgeRl(
    {
      children,
      size = 'md',
      emphasis = 'primary',
      color = 'neutral',
      icon,
      className,
      ...rest
    },
    ref,
  ) {
    const semanticColor = isSemanticColor(color)
    const colorAppearance = semanticColor ? color : 'neutral'

    const classes = ['eds-badge-rl', className].filter(Boolean).join(' ')

    return (
      <span
        ref={ref}
        className={classes}
        data-size={size}
        data-emphasis={emphasis}
        data-color-appearance={colorAppearance}
        {...(!semanticColor && {
          'data-badge-color': color,
          'data-colored': '',
        })}
        {...rest}
      >
        {icon && (
          <Icon
            data={icon}
            size="xs"
            className="eds-badge-rl__icon"
            aria-hidden
          />
        )}
        <span className="eds-badge-rl__text">{children}</span>
      </span>
    )
  },
)
