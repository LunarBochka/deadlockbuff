import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the player statistics dashboard', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /игроки/i })).toBeInTheDocument();
  expect(screen.getByRole('row', { name: /marlow/i })).toBeInTheDocument();
  expect(screen.getByLabelText('Поиск игрока')).toBeInTheDocument();
});
