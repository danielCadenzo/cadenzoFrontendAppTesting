import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, act } from 'react-testing-library';
import { unmountComponentAtNode } from 'react-dom';

import PopupModal from '../index';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render targer
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  //cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('Header renders with correct text', () => {
  const handleClick = jest.fn();
  const component = render(
    <PopupModal onClose={handleClick} header="Settings" />,
  );

  const headerElement = component.getByTestId('header');

  expect(headerElement.textContent).toBe('Settings');
});

test('Handle Click function is called when exit button is clicked', () => {
  const handleClick = jest.fn();
  const { getByTestId } = render(<PopupModal onClose={handleClick} />);
  const exitButton = getByTestId('exitButton');

  fireEvent.click(exitButton);

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('Component is hidden if isOpen is false', () => {
  const handleClick = jest.fn();
  const isOpen = false;
  const { getByTestId } = render(
    <PopupModal onClose={handleClick} isOpen={isOpen} />,
  );
  const modal = getByTestId('popupModal');

  expect(modal).not.toBeVisible();
});

test('Component is visible if isOpen is true', () => {
  const handleClick = jest.fn();
  const isOpen = true;
  const { getByTestId } = render(
    <PopupModal onClose={handleClick} isOpen={isOpen} />,
  );
  const modal = getByTestId('popupModal');

  expect(modal).toBeVisible();
});

/*
describe('<PopupModal>', () => {
  it('renders and matches the snapshot', () => {});

  it('handles clicks', () => {});

  it('Renders the correct title', () => {
    act(() => {
      render(<PopupModal />);
    });
    expect();
  });
});
*/
