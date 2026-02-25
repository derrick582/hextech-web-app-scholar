import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../Header'
import Hero from '../Hero'
import Footer from '../Footer'

describe('UI Components', () => {
  it('renders Header correctly', () => {
    render(<Header />)
    expect(screen.getByText('HEXTECH_SCHOLAR.exe')).toBeInTheDocument()
    expect(screen.getByText('[ LAB ]')).toBeInTheDocument()
  })

  it('renders Hero correctly', () => {
    render(<Hero />)
    expect(screen.getByText('EMPOWERING_INNOVATORS')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /INITIALIZE_SEQUENCE/i })).toBeInTheDocument()
  })

  it('renders Footer correctly', () => {
    render(<Footer />)
    expect(screen.getByText(/2024 HEXTECH_SCHOLAR/i)).toBeInTheDocument()
  })
})
