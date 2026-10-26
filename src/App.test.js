import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page with a centered logo and player ID search', () => {
  const { container } = render(<App />);

  expect(screen.getByRole('heading', { level: 1, name: /deadlock\s*buff/i })).toBeInTheDocument();
  expect(screen.getByRole('searchbox', { name: 'Поиск игрока по ID' })).toBeInTheDocument();
  expect(container.querySelectorAll('.topbar-link-placeholder')).toHaveLength(3);
});
