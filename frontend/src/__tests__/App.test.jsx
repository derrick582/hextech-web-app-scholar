import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock for any fetch call
    fetch.mockImplementation((url) => {
      if (url.includes('/API/health')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: 'active', database: 'connected' })
        })
      }
      if (url.includes('/api/projects')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([])
        })
      }
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  it('renders with initial OFFLINE status', async () => {
    // Override health check to stay pending
    fetch.mockImplementation((url) => {
        if (url.includes('/API/health')) {
            return new Promise(() => {})
        }
        return Promise.resolve({ ok: true, json: async () => [] })
    })

    await act(async () => {
      render(<App />)
    })

    expect(screen.getByText('OFFLINE')).toBeInTheDocument()
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
  })

  it('updates status when API succeeds', async () => {
    await act(async () => {
      render(<App />)
    })

    await waitFor(() => {
      expect(screen.getByText('ACTIVE')).toBeInTheDocument()
      expect(screen.getByText('CONNECTED')).toBeInTheDocument()
    })
  })

  it('shows error when API fails', async () => {
    fetch.mockImplementation((url) => {
      if (url.includes('/API/health')) {
        return Promise.reject(new Error('Network failure'))
      }
      return Promise.resolve({ ok: true, json: async () => [] })
    })

    await act(async () => {
      render(<App />)
    })

    await waitFor(() => {
      expect(screen.getByText('CONNECTION_ERROR')).toBeInTheDocument()
      expect(screen.getByText('DISCONNECTED')).toBeInTheDocument()
    })
  })
})
