import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { save } from '@equinor/eds-icons'
import { ChipRl } from '.'

describe('ChipRl (next)', () => {
  describe('Rendering', () => {
    it('renders with text children', () => {
      render(<ChipRl onClick={jest.fn()}>Filter</ChipRl>)
      expect(screen.getByText('Filter')).toBeInTheDocument()
    })

    it('forwards ref to the root element', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <ChipRl ref={ref} onClick={jest.fn()}>
          Ref chip
        </ChipRl>,
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('applies custom className', () => {
      render(
        <ChipRl className="custom-class" onClick={jest.fn()}>
          Styled
        </ChipRl>,
      )
      expect(screen.getByText('Styled')).toHaveClass('eds-chip-rl', 'custom-class')
    })

    it('spreads additional props to root element', () => {
      render(
        <ChipRl data-testid="my-chip" onClick={jest.fn()}>
          Props
        </ChipRl>,
      )
      expect(screen.getByTestId('my-chip')).toBeInTheDocument()
    })

    it('renders close button when onDelete is provided', () => {
      render(<ChipRl onDelete={jest.fn()}>Deletable</ChipRl>)
      expect(
        screen.getByRole('button', { name: /remove/i }),
      ).toBeInTheDocument()
    })

    it('does not render close button when onDelete is not provided', () => {
      render(<ChipRl onClick={jest.fn()}>Plain</ChipRl>)
      expect(
        screen.queryByRole('button', { name: /remove/i }),
      ).not.toBeInTheDocument()
    })

    it('sets data-deletable when onDelete is provided', () => {
      render(<ChipRl onDelete={jest.fn()}>Deletable</ChipRl>)
      expect(screen.getByText('Deletable')).toHaveAttribute('data-deletable')
    })

    it('renders leading icon when icon prop is provided', () => {
      render(
        <ChipRl onClick={jest.fn()} icon={save}>
          With icon
        </ChipRl>,
      )
      expect(screen.getByText('With icon')).toHaveAttribute('data-has-icon')
    })

    it('sets data-has-icon when icon prop is provided', () => {
      render(
        <ChipRl onClick={jest.fn()} icon={save}>
          With icon
        </ChipRl>,
      )
      expect(screen.getByText('With icon')).toHaveAttribute('data-has-icon')
    })

    it('does not set data-has-icon when no icon or selected', () => {
      render(<ChipRl onClick={jest.fn()}>No icon</ChipRl>)
      expect(screen.getByText('No icon')).not.toHaveAttribute('data-has-icon')
    })
  })

  describe('Selected state', () => {
    it('sets data-selected when selected', () => {
      render(
        <ChipRl onClick={jest.fn()} selected>
          Selected
        </ChipRl>,
      )
      expect(screen.getByText('Selected')).toHaveAttribute('data-selected')
    })

    it('does not set data-selected when not selected', () => {
      render(<ChipRl onClick={jest.fn()}>Unselected</ChipRl>)
      expect(screen.getByText('Unselected')).not.toHaveAttribute(
        'data-selected',
      )
    })

    it('sets aria-pressed on clickable chips', () => {
      const { rerender } = render(
        <ChipRl onClick={jest.fn()} selected>
          Pressed
        </ChipRl>,
      )
      expect(screen.getByRole('button', { name: /pressed/i })).toHaveAttribute(
        'aria-pressed',
        'true',
      )

      rerender(<ChipRl onClick={jest.fn()}>Pressed</ChipRl>)
      expect(screen.getByRole('button', { name: /pressed/i })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('does not set aria-pressed on non-clickable chips', () => {
      render(
        <ChipRl onDelete={jest.fn()} selected>
          Delete only
        </ChipRl>,
      )
      expect(screen.getByText('Delete only')).not.toHaveAttribute(
        'aria-pressed',
      )
    })

    it('shows checkmark icon when selected (replaces custom icon)', () => {
      render(
        <ChipRl onClick={jest.fn()} icon={save} selected>
          Selected
        </ChipRl>,
      )
      // Should have data-has-icon (checkmark replaces the save icon)
      expect(screen.getByText('Selected')).toHaveAttribute('data-has-icon')
    })

    it('shows checkmark icon when selected even without icon prop', () => {
      render(
        <ChipRl onClick={jest.fn()} selected>
          Selected
        </ChipRl>,
      )
      expect(screen.getByText('Selected')).toHaveAttribute('data-has-icon')
    })

    it('does not show checkmark when showCheckIcon is false', () => {
      render(
        <ChipRl onClick={jest.fn()} selected showCheckIcon={false}>
          No check
        </ChipRl>,
      )
      expect(screen.getByText('No check')).not.toHaveAttribute('data-has-icon')
      // Still has selected styling
      expect(screen.getByText('No check')).toHaveAttribute('data-selected')
    })

    it('preserves custom icon when showCheckIcon is false and selected', () => {
      render(
        <ChipRl onClick={jest.fn()} selected showCheckIcon={false} icon={save}>
          Keep icon
        </ChipRl>,
      )
      expect(screen.getByText('Keep icon')).toHaveAttribute('data-has-icon')
      expect(screen.getByText('Keep icon')).toHaveAttribute('data-selected')
    })

    it('sets data-color-appearance to accent when selected', () => {
      render(
        <ChipRl onClick={jest.fn()} selected>
          Accent
        </ChipRl>,
      )
      expect(screen.getByText('Accent')).toHaveAttribute(
        'data-color-appearance',
        'accent',
      )
    })

    it('sets data-color-appearance to neutral when not selected', () => {
      render(<ChipRl onClick={jest.fn()}>Neutral</ChipRl>)
      expect(screen.getByText('Neutral')).toHaveAttribute(
        'data-color-appearance',
        'neutral',
      )
    })

    it('sets data-color-appearance to neutral when disabled and selected', () => {
      render(
        <ChipRl onClick={jest.fn()} selected disabled>
          Disabled accent
        </ChipRl>,
      )
      expect(screen.getByText('Disabled accent')).toHaveAttribute(
        'data-color-appearance',
        'neutral',
      )
    })
  })

  describe('Dropdown', () => {
    it('sets data-dropdown when dropdown is true', () => {
      render(
        <ChipRl onClick={jest.fn()} dropdown>
          Dropdown
        </ChipRl>,
      )
      expect(screen.getByText('Dropdown')).toHaveAttribute('data-dropdown')
    })

    it('does not set data-dropdown when dropdown is false', () => {
      render(<ChipRl onClick={jest.fn()}>Plain</ChipRl>)
      expect(screen.getByText('Plain')).not.toHaveAttribute('data-dropdown')
    })

    it('sets aria-haspopup="menu" when dropdown is true', () => {
      render(
        <ChipRl onClick={jest.fn()} dropdown>
          Dropdown
        </ChipRl>,
      )
      expect(screen.getByText('Dropdown')).toHaveAttribute(
        'aria-haspopup',
        'menu',
      )
    })

    it('does not set aria-haspopup when dropdown is false', () => {
      render(<ChipRl onClick={jest.fn()}>No dropdown</ChipRl>)
      expect(screen.getByText('No dropdown')).not.toHaveAttribute(
        'aria-haspopup',
      )
    })

    it('onDelete takes precedence over dropdown', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
      render(
        <ChipRl onDelete={jest.fn()} dropdown>
          Both
        </ChipRl>,
      )
      const chip = screen.getByText('Both')
      // onDelete wins: deletable shown, dropdown suppressed
      expect(chip).toHaveAttribute('data-deletable')
      expect(chip).not.toHaveAttribute('data-dropdown')
      expect(chip).not.toHaveAttribute('aria-haspopup')
      expect(
        screen.getByRole('button', { name: /remove/i }),
      ).toBeInTheDocument()
      warnSpy.mockRestore()
    })

    it('renders dropdown arrow icon (not present without dropdown)', () => {
      const { rerender } = render(<ChipRl onClick={jest.fn()}>No dropdown</ChipRl>)
      const chipWithout = screen.getByText('No dropdown')
      expect(chipWithout).not.toHaveAttribute('data-dropdown')

      rerender(
        <ChipRl onClick={jest.fn()} dropdown>
          Has dropdown
        </ChipRl>,
      )
      const chipWith = screen.getByText('Has dropdown')
      expect(chipWith).toHaveAttribute('data-dropdown')
    })

    it('passes axe when dropdown', async () => {
      const { container } = render(
        <ChipRl onClick={jest.fn()} dropdown>
          Dropdown
        </ChipRl>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('States', () => {
    it('sets aria-disabled when disabled', () => {
      render(
        <ChipRl onClick={jest.fn()} disabled>
          Disabled
        </ChipRl>,
      )
      expect(screen.getByText('Disabled')).toHaveAttribute(
        'aria-disabled',
        'true',
      )
    })

    it('sets role="button" when onClick is provided', () => {
      render(<ChipRl onClick={jest.fn()}>Clickable</ChipRl>)
      expect(
        screen.getByRole('button', { name: /clickable/i }),
      ).toBeInTheDocument()
    })

    it('does not set role="button" when only onDelete is provided', () => {
      render(<ChipRl onDelete={jest.fn()}>Delete only</ChipRl>)
      expect(
        screen.queryByRole('button', { name: /delete only/i }),
      ).not.toBeInTheDocument()
    })

    it('always sets tabIndex=0', () => {
      render(<ChipRl onClick={jest.fn()}>Focusable</ChipRl>)
      expect(screen.getByText('Focusable')).toHaveAttribute('tabindex', '0')
    })

    it('disables the delete button when chip is disabled', () => {
      render(
        <ChipRl onDelete={jest.fn()} disabled>
          Disabled deletable
        </ChipRl>,
      )
      expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled()
    })

    it('shows selected appearance when disabled and selected', () => {
      render(
        <ChipRl onClick={jest.fn()} disabled selected>
          Disabled selected
        </ChipRl>,
      )
      const chip = screen.getByText('Disabled selected')
      expect(chip).toHaveAttribute('data-selected')
      expect(chip).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Behavior', () => {
    it('fires onClick when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<ChipRl onClick={handleClick}>Clickable</ChipRl>)
      await user.click(screen.getByRole('button', { name: /clickable/i }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not fire onClick when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(
        <ChipRl onClick={handleClick} disabled>
          Disabled
        </ChipRl>,
      )
      await user.click(screen.getByText('Disabled'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('fires onDelete when close button is clicked', async () => {
      const user = userEvent.setup()
      const handleDelete = jest.fn()
      render(<ChipRl onDelete={handleDelete}>Deletable</ChipRl>)
      await user.click(screen.getByRole('button', { name: /remove/i }))
      expect(handleDelete).toHaveBeenCalledTimes(1)
    })

    it('does not fire onDelete when disabled', async () => {
      const user = userEvent.setup()
      const handleDelete = jest.fn()
      render(
        <ChipRl onDelete={handleDelete} disabled>
          Disabled
        </ChipRl>,
      )
      await user.click(screen.getByRole('button', { name: /remove/i }))
      expect(handleDelete).not.toHaveBeenCalled()
    })

    it('fires onDelete on Enter key when deletable', async () => {
      const user = userEvent.setup()
      const handleDelete = jest.fn()
      render(<ChipRl onDelete={handleDelete}>Deletable</ChipRl>)
      const chip = screen.getByText('Deletable')
      chip.focus()
      await user.keyboard('{Enter}')
      expect(handleDelete).toHaveBeenCalledTimes(1)
    })

    it('fires onClick on Enter key when clickable (not deletable)', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<ChipRl onClick={handleClick}>Clickable</ChipRl>)
      const chip = screen.getByRole('button', { name: /clickable/i })
      chip.focus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('delete takes precedence over click on Enter key', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      const handleDelete = jest.fn()
      render(
        <ChipRl onClick={handleClick} onDelete={handleDelete}>
          Both
        </ChipRl>,
      )
      const chip = screen.getByText('Both')
      chip.focus()
      await user.keyboard('{Enter}')
      expect(handleDelete).toHaveBeenCalledTimes(1)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('stops propagation when delete button is clicked', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      const handleDelete = jest.fn()
      render(
        <ChipRl onClick={handleClick} onDelete={handleDelete}>
          Both
        </ChipRl>,
      )
      await user.click(screen.getByRole('button', { name: /remove/i }))
      expect(handleDelete).toHaveBeenCalledTimes(1)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Warnings', () => {
    it('warns when neither onClick nor onDelete is provided', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
      render(<ChipRl>No handler</ChipRl>)
      expect(warnSpy).toHaveBeenCalledWith(
        'ChipRl: A chip must have at least one of `onClick` or `onDelete`.',
      )
      warnSpy.mockRestore()
    })

    it('does not warn when onClick is provided', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
      render(<ChipRl onClick={jest.fn()}>Has click</ChipRl>)
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('does not warn when onDelete is provided', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
      render(<ChipRl onDelete={jest.fn()}>Has delete</ChipRl>)
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('warns when both dropdown and onDelete are provided', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
      render(
        <ChipRl onDelete={jest.fn()} dropdown>
          Both
        </ChipRl>,
      )
      expect(warnSpy).toHaveBeenCalledWith(
        'ChipRl: `dropdown` and `onDelete` cannot be used together. `onDelete` takes precedence.',
      )
      warnSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('passes axe accessibility test (clickable)', async () => {
      const { container } = render(
        <ChipRl onClick={jest.fn()}>Accessible chip</ChipRl>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe when selected', async () => {
      const { container } = render(
        <ChipRl onClick={jest.fn()} selected>
          Selected
        </ChipRl>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe when deletable', async () => {
      const { container } = render(<ChipRl onDelete={jest.fn()}>Deletable</ChipRl>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe when disabled', async () => {
      const { container } = render(
        <ChipRl onClick={jest.fn()} disabled>
          Disabled
        </ChipRl>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('close button has accessible label', () => {
      render(<ChipRl onDelete={jest.fn()}>Deletable</ChipRl>)
      expect(
        screen.getByRole('button', { name: /remove/i }),
      ).toBeInTheDocument()
    })
  })
})
