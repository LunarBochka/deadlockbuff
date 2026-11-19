import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page with a centered logo and player ID search', () => {
  window.location.hash = '/';
  const { container } = render(<App />);

  expect(screen.getByRole('heading', { level: 1, name: /deadlock\s*buff/i })).toBeInTheDocument();
  expect(screen.getByRole('searchbox', { name: 'Поиск игрока по ID' })).toBeInTheDocument();
  expect(container.querySelectorAll('.topbar-link-placeholder')).toHaveLength(3);
});

test('opens a separate player page and keeps the topbar', () => {
  window.location.hash = '/';
  render(<App />);

  const topbarSearch = screen.getByRole('searchbox', { name: 'Поиск игрока по ID' });
  fireEvent.change(topbarSearch, { target: { value: '12345' } });
  fireEvent.keyDown(topbarSearch, { key: 'Enter' });

  expect(window.location.hash).toBe('#/player/12345');
  expect(screen.getByRole('button', { name: 'На главную' })).toBeInTheDocument();
  expect(screen.getByRole('banner')).toBeInTheDocument();
});

test('opens the featured static player ID from the navbar', () => {
  window.location.hash = '/';
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Открыть игрока 76561198360505563' }));

  expect(window.location.hash).toBe('#/player/76561198360505563');
});

test('the navbar logo returns to the home page', () => {
  window.location.hash = '#/player/12345';
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'На главную' }));

  expect(window.location.hash).toBe('#/');
});
