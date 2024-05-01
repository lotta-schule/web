import * as React from 'react';
import {
  TestBrowserWrapper,
  TestBrowserWrapperProps,
  fixtures,
  render,
} from '../test-utils';
import { StatusBar } from './StatusBar';
import userEvent from '@testing-library/user-event';

const defaultPath = fixtures.getPathForNode('14');

const WrappedStatusBar = ({
  currentPath = defaultPath,
  ...props
}: TestBrowserWrapperProps) => (
  <TestBrowserWrapper currentPath={currentPath} {...props}>
    <StatusBar />
  </TestBrowserWrapper>
);

describe('Browser/StatusBar', () => {
  it('should render correctly on home path', () => {
    const screen = render(<WrappedStatusBar currentPath={[]} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(
      screen.getByRole('link', { name: 'Wurzelverzeichnis' })
    ).toBeVisible();
  });

  it('should render correctly on a complex path', () => {
    const screen = render(<WrappedStatusBar />);
    expect(screen.getAllByRole('link')).toHaveLength(4); // Home + 3 directories
    expect(screen.getAllByRole('link')[1]).toHaveTextContent('folder 1');
    expect(screen.getAllByRole('link')[2]).toHaveTextContent('folder 8');
    expect(screen.getAllByRole('link')[3]).toHaveTextContent('folder 14');
  });

  it('should select a path on click', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    const screen = render(<WrappedStatusBar onNavigate={onNavigate} />);
    await user.click(screen.getByRole('link', { name: 'folder 8' }));

    expect(onNavigate).toHaveBeenCalledWith(fixtures.getPathForNode('8'));
  });

  it('should show the number of directories and files in the path', async () => {
    const screen = render(
      <WrappedStatusBar currentPath={fixtures.getPathForNode('8')} />
    );

    expect(await screen.findByText('Ordner: 4')).toBeVisible();
    expect(await screen.findByText('Dateien: 4')).toBeVisible();
  });
});
