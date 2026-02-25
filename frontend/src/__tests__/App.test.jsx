import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

// Mock global fetch
global.fetch = vi.fn()

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders with initial OFFLINE status', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves
    render(<App />)
    expect(screen.getByText('OFFLINE')).toBeInTheDocument()
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
  })

  it('updates status when API succeeds', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ status: 'active', database: 'connected' }),
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('ACTIVE')).toBeInTheDocument()
      expect(screen.getByText('CONNECTED')).toBeInTheDocument()
    })
  })

  it('shows error when API fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network failure'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('CONNECTION_ERROR')).toBeInTheDocument()
      expect(screen.getByText('DISCONNECTED')).toBeInTheDocument()
    })
  })
})
