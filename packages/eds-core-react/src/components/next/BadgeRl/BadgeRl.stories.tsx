import { useState, useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  save,
  check_circle_outlined,
  error_outlined,
  boat,
  arrow_forward,
} from '@equinor/eds-icons'
import page from './BadgeRl.docs.mdx'
import { BadgeRl } from './BadgeRl'
import { Chip } from '../Chip'
import { Icon } from '../Icon'
import { Card } from '../../Card'
import { Menu } from '../../Menu'
import { Typography } from '../../Typography'
import type { BadgeRlProps, BadgeRlColor } from './BadgeRl.types'
import type { ChipColor } from '../Chip/Chip.types'

type StoryArgs = BadgeRlProps & { color?: BadgeRlColor }

const meta: Meta<StoryArgs> = {
  title: 'EDS 2.0 (beta)/Data Display/BadgeRl',
  component: BadgeRl,
  parameters: {
    docs: {
      page,
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['md', 'sm', 'xs'],
      description: 'Size of the badge',
    },
    emphasis: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual emphasis level',
    },
    color: {
      control: 'select',
      options: [
        'neutral',
        'accent',
        'danger',
        'warning',
        'info',
        'success',
        'moss-green',
        'energy-red',
        'weathered-red',
        'slate-blue',
        'spruce-wood',
        'mist-blue',
        'lichen-green',
        'purple-berry',
        'pink-rose',
        'pink-salmon',
        'green-cucumber',
        'green-succulent',
        'green-mint',
        'blue-ocean',
        'blue-overcast',
        'blue-sky',
      ],
      description: 'Colour — semantic or data-visualisation',
    },
  },
  args: {
    children: 'Label',
    size: 'md',
    emphasis: 'primary',
    color: 'neutral',
  },
}

export default meta

type Story = StoryObj<StoryArgs>

const Wrapper = ({
  children,
  gap = 8,
}: {
  children: React.ReactNode
  gap?: number
}) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap,
    }}
  >
    {children}
  </div>
)

/* ------------------------------------------------------------------ */
/*  Introduction                                                      */
/* ------------------------------------------------------------------ */

export const Introduction: Story = {
  args: {
    children: 'Label',
  },
}

/* ------------------------------------------------------------------ */
/*  BadgeRl vs Chip                                                     */
/* ------------------------------------------------------------------ */

type StatusOption = {
  label: string
  chipColor?: ChipColor
  badgeColor: BadgeRlColor
}

const STATUS_OPTIONS: StatusOption[] = [
  { label: 'Tentative', chipColor: 'warning', badgeColor: 'warning' },
  { label: 'Official', badgeColor: 'neutral' },
  { label: 'In-transit', chipColor: 'info', badgeColor: 'info' },
  { label: 'Completed', chipColor: 'success', badgeColor: 'success' },
]

const CargoCard = ({
  statusElement,
  label,
}: {
  statusElement: React.ReactNode
  label: string
}) => (
  <Card
    elevation="raised"
    style={{
      width: 280,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon data={boat} size="sm" />
        <Typography variant="body_short" bold style={{ margin: 0 }}>
          Sola TS
        </Typography>
      </div>
      {statusElement}
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: 'var(--eds-color-text-subtle)',
      }}
    >
      <Typography
        variant="body_short"
        style={{ margin: 0, fontSize: '0.875rem' }}
      >
        Mongstad
      </Typography>
      <Icon data={arrow_forward} size="xs" />
      <Typography
        variant="body_short"
        style={{ margin: 0, fontSize: '0.875rem' }}
      >
        Rotterdam
      </Typography>
    </div>
    <Typography
      variant="body_short"
      style={{
        margin: 0,
        fontSize: '0.8125rem',
        color: 'var(--eds-color-text-subtle)',
      }}
    >
      750 000 bbl &middot; Johan Sverdrup
    </Typography>
    <div
      style={{
        borderTop: '1px solid var(--eds-color-border-subtle, #e0e0e0)',
        marginTop: 4,
        paddingTop: 8,
        fontSize: '0.75rem',
        color: 'var(--eds-color-text-subtle)',
      }}
    >
      {label}
    </div>
  </Card>
)

export const BadgeRlVsChip: Story = {
  name: 'BadgeRl vs Chip',
  render: () => {
    const [selected, setSelected] = useState<StatusOption>(STATUS_OPTIONS[2])
    const [menuOpen, setMenuOpen] = useState(false)
    const chipRef = useRef<HTMLDivElement>(null)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <CargoCard
            label="BadgeRl — non-interactive status indicator"
            statusElement={
              <BadgeRl color={selected.badgeColor}>{selected.label}</BadgeRl>
            }
          />
          <CargoCard
            label="Chip — interactive, opens a dropdown"
            statusElement={
              <>
                <Chip
                  ref={chipRef}
                  color={selected.chipColor}
                  dropdown
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  {selected.label}
                </Chip>
                <Menu
                  open={menuOpen}
                  anchorEl={chipRef.current}
                  onClose={() => setMenuOpen(false)}
                  placement="bottom-end"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <Menu.Item
                      key={opt.label}
                      onClick={() => {
                        setSelected(opt)
                        setMenuOpen(false)
                      }}
                    >
                      <BadgeRl color={opt.badgeColor} size="xs">
                        {opt.label}
                      </BadgeRl>
                    </Menu.Item>
                  ))}
                </Menu>
              </>
            }
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'A **BadgeRl** is a non-interactive label — it communicates status at a glance without inviting user action. A **Chip**, by contrast, is interactive: it can be clicked, selected, deleted, or used as a dropdown trigger. Because chips are interactive, they must meet minimum touch-target sizes (32 px height) and include hover/focus/pressed states, which makes them visually larger and heavier. When a status is purely informational and does not need user action, a badge keeps the interface compact and focused. When the user needs to change or act on that status, reach for a chip instead.',
      },
      source: {
        code: `const STATUS_OPTIONS = [
  { label: 'Tentative', chipColor: 'warning', badgeColor: 'warning' },
  { label: 'Official', badgeColor: 'neutral' },
  { label: 'In-transit', chipColor: 'info', badgeColor: 'info' },
  { label: 'Completed', chipColor: 'success', badgeColor: 'success' },
]

const [selected, setSelected] = useState(STATUS_OPTIONS[2])
const [menuOpen, setMenuOpen] = useState(false)
const chipRef = useRef(null)

{/* Non-interactive — use BadgeRl */}
<BadgeRl color={selected.badgeColor}>{selected.label}</BadgeRl>

{/* Interactive — use Chip + Menu */}
<Chip ref={chipRef} color={selected.chipColor} dropdown onClick={() => setMenuOpen(o => !o)}>
  {selected.label}
</Chip>
<Menu open={menuOpen} anchorEl={chipRef.current} onClose={() => setMenuOpen(false)}>
  {STATUS_OPTIONS.map(opt => (
    <Menu.Item key={opt.label} onClick={() => { setSelected(opt); setMenuOpen(false) }}>
      <BadgeRl color={opt.badgeColor} size="xs">{opt.label}</BadgeRl>
    </Menu.Item>
  ))}
</Menu>`,
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  All Variants                                                      */
/* ------------------------------------------------------------------ */

const SEMANTIC_COLORS: BadgeRlColor[] = [
  'neutral',
  'accent',
  'info',
  'success',
  'warning',
  'danger',
]

const SIZES: Array<{ value: BadgeRlProps['size']; label: string }> = [
  { value: 'md', label: 'Default' },
  { value: 'sm', label: 'Small' },
  { value: 'xs', label: 'Extra small' },
]

const EMPHASIS: Array<{ value: BadgeRlProps['emphasis']; label: string }> = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
]

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ overflow: 'auto' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontFamily: 'Equinor, sans-serif',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr
            style={{
              background: '#c4c4c4',
              color: '#3d3d3d',
            }}
          >
            <th style={{ padding: '8px 16px' }}>Size</th>
            <th style={{ padding: '8px 16px' }}>Emphasis</th>
            {SEMANTIC_COLORS.map((c) => (
              <th
                key={c}
                style={{
                  padding: '8px 16px',
                  textTransform: 'capitalize',
                }}
              >
                {c === 'danger' ? 'Error' : c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZES.map((size) =>
            EMPHASIS.map((emphasis) => (
              <tr
                key={`${size.value}-${emphasis.value}`}
                style={{
                  background:
                    SIZES.indexOf(size) % 2 === 0 ? '#f0f0f0' : '#fff',
                }}
              >
                {emphasis.value === 'primary' && (
                  <td
                    rowSpan={2}
                    style={{
                      padding: '12px 16px',
                      fontWeight: 500,
                      verticalAlign: 'middle',
                    }}
                  >
                    {size.label}
                  </td>
                )}
                <td style={{ padding: '12px 16px' }}>{emphasis.label}</td>
                {SEMANTIC_COLORS.map((color) => (
                  <td key={color} style={{ padding: '12px 16px' }}>
                    <BadgeRl
                      size={size.value}
                      emphasis={emphasis.value}
                      color={color}
                    >
                      Label
                    </BadgeRl>
                  </td>
                ))}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete matrix of all size, emphasis, and semantic colour combinations.',
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  With Icons                                                        */
/* ------------------------------------------------------------------ */

export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <Wrapper>
      <BadgeRl icon={save} color="accent">
        Saved
      </BadgeRl>
      <BadgeRl icon={check_circle_outlined} color="success">
        Approved
      </BadgeRl>
      <BadgeRl icon={error_outlined} color="danger">
        Error
      </BadgeRl>
      <BadgeRl icon={save} color="accent" emphasis="secondary">
        Saved
      </BadgeRl>
      <BadgeRl
        icon={check_circle_outlined}
        color="success"
        emphasis="secondary"
      >
        Approved
      </BadgeRl>
      <BadgeRl icon={error_outlined} color="danger" emphasis="secondary">
        Error
      </BadgeRl>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'BadgeRls with leading icons for added visual context.',
      },
      source: {
        code: `<BadgeRl icon={save} color="accent">Saved</BadgeRl>
<BadgeRl icon={check_circle_outlined} color="success">Approved</BadgeRl>
<BadgeRl icon={error_outlined} color="danger">Error</BadgeRl>`,
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Dataviz Colors                                                    */
/* ------------------------------------------------------------------ */

const DATAVIZ_COLORS: BadgeRlColor[] = [
  'moss-green',
  'energy-red',
  'weathered-red',
  'slate-blue',
  'spruce-wood',
  'mist-blue',
  'lichen-green',
  'purple-berry',
  'pink-rose',
  'pink-salmon',
  'green-cucumber',
  'green-succulent',
  'green-mint',
  'blue-ocean',
  'blue-overcast',
  'blue-sky',
]

export const DatavizColors: Story = {
  name: 'Data-visualisation colors',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Wrapper>
        {DATAVIZ_COLORS.map((color) => (
          <BadgeRl key={color} color={color}>
            {color}
          </BadgeRl>
        ))}
      </Wrapper>
      <Wrapper>
        {DATAVIZ_COLORS.map((color) => (
          <BadgeRl key={color} color={color} emphasis="secondary">
            {color}
          </BadgeRl>
        ))}
      </Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Data-visualisation palette in both primary and secondary emphasis.',
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Sizes                                                             */
/* ------------------------------------------------------------------ */

export const Sizes: Story = {
  render: () => (
    <Wrapper>
      <BadgeRl size="md" color="accent">
        Default
      </BadgeRl>
      <BadgeRl size="sm" color="accent">
        Small
      </BadgeRl>
      <BadgeRl size="xs" color="accent">
        Extra small
      </BadgeRl>
      <BadgeRl size="md" color="accent" emphasis="secondary">
        Default
      </BadgeRl>
      <BadgeRl size="sm" color="accent" emphasis="secondary">
        Small
      </BadgeRl>
      <BadgeRl size="xs" color="accent" emphasis="secondary">
        Extra small
      </BadgeRl>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes: `md` (20 px, default), `sm` (16 px), and `xs` (12 px). Extra-small secondary badges use bold uppercase text for legibility at small sizes.',
      },
      source: {
        code: `<BadgeRl size="md">Default</BadgeRl>
<BadgeRl size="sm">Small</BadgeRl>
<BadgeRl size="xs">Extra small</BadgeRl>`,
      },
    },
  },
}
