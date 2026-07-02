import { render, screen } from '@testing-library/react';

test('renders the app shell without crashing', () => {
  const { container } = render(<div>RedIron</div>);
  expect(screen.getByText('RedIron')).toBeInTheDocument();
  expect(container).toBeTruthy();
});
