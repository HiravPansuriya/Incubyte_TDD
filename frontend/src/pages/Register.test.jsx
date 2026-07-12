import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import api from '../api/axios';

// Mock Axios Client
jest.mock('../api/axios', () => ({
  post: jest.fn()
}));

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders registration inputs: full name, email, password, confirm password', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/account role/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('shows error when passwords do not match', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitBtn = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(fullNameInput, { target: { value: 'Alex Mercer' } });
    fireEvent.change(emailInput, { target: { value: 'user@apex.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  test('submits successfully and registers user', async () => {
    const mockUser = {
      token: 'jwt-token-xyz',
      email: 'owner@apex.com',
      role: 'user'
    };

    api.post.mockResolvedValueOnce({
      data: { user: mockUser }
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitBtn = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(fullNameInput, { target: { value: 'Owner Name' } });
    fireEvent.change(emailInput, { target: { value: 'owner@apex.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        fullName: 'Owner Name',
        email: 'owner@apex.com',
        password: 'password123'
      });
      expect(localStorage.getItem('token')).toBe('jwt-token-xyz');
      expect(localStorage.getItem('email')).toBe('owner@apex.com');
      expect(localStorage.getItem('role')).toBe('user');
    });
  });

  test('displays API failure error message', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: { message: 'User already exists' }
      }
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitBtn = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(fullNameInput, { target: { value: 'Existing User' } });
    fireEvent.change(emailInput, { target: { value: 'existing@apex.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });
});
