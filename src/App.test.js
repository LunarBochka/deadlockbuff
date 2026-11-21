import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page with a centered logo and player ID search', () => {
  window.history.replaceState(null, '', '/');
  const { container } = render(<App />);

  expect(screen.getByRole('heading', { level: 1, name: /deadlock\s*buff/i })).toBeInTheDocument();
  expect(screen.getByRole('searchbox', { name: 'Поиск игрока по ID' })).toBeInTheDocument();
  expect(container.querySelectorAll('.topbar-link-placeholder')).toHaveLength(3);
});

test('opens a separate player page and keeps the topbar', () => {
  window.history.replaceState(null, '', '/');
  render(<App />);

  const topbarSearch = screen.getByRole('searchbox', { name: 'Поиск игрока по ID' });
  fireEvent.change(topbarSearch, { target: { value: '12345' } });
  fireEvent.keyDown(topbarSearch, { key: 'Enter' });

  expect(window.location.pathname).toBe('/player/12345');
  expect(window.location.hash).toBe('');
  expect(screen.getByRole('button', { name: 'На главную' })).toBeInTheDocument();
  expect(screen.getByRole('banner')).toBeInTheDocument();
});

test('opens the featured static player ID from the navbar', () => {
  window.history.replaceState(null, '', '/');
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Открыть игрока 76561198360505563' }));

  expect(window.location.pathname).toBe('/player/76561198360505563');
  expect(window.location.hash).toBe('');
});

test('the navbar logo returns to the home page', () => {
  window.history.replaceState(null, '', '/player/12345');
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'На главную' }));

  expect(window.location.pathname).toBe('/');
  expect(window.location.hash).toBe('');
});

test('opens a player page when loading its URL directly', () => {
  window.history.replaceState(null, '', '/player/12345');
  render(<App />);

  expect(screen.getByRole('region', { name: 'Страница игрока' })).toBeInTheDocument();
});

test('updates the page when browser history changes', () => {
  window.history.replaceState(null, '', '/player/12345');
  render(<App />);

  window.history.replaceState(null, '', '/');
  act(() => {
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  expect(screen.queryByRole('region', { name: 'Страница игрока' })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: /deadlock\s*buff/i })).toBeInTheDocument();
});
