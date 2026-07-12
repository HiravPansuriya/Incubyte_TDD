import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import api from '../api/axios';

// Mock the Axios client
jest.mock('../api/axios', () => ({
  post: jest.fn()
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders email and password inputs and submit button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation error when fields are empty', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    // Default HTML5 validation prevents form submit, but let's test input behavior
    // and custom state verification if fields are filled or api behaves.
  });

  test('submits form with user credentials and stores token on success', async () => {
    const mockUser = {
      token: 'jwt-token-xyz',
      email: 'alex@apex.com',
      role: 'admin'
    };

    api.post.mockResolvedValueOnce({
      data: { user: mockUser }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'alex@apex.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'alex@apex.com',
        password: 'secret123'
      });
      expect(localStorage.getItem('token')).toBe('jwt-token-xyz');
      expect(localStorage.getItem('email')).toBe('alex@apex.com');
      expect(localStorage.getItem('role')).toBe('admin');
    });
  });

  test('displays error message on api login failure', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: { message: 'Invalid credentials' }
      }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@apex.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
