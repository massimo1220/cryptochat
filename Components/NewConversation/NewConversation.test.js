import React from 'react';
import { shallow } from 'enzyme';
import NewConversation from './NewConversation';

describe('NewConversation', () => {
  let wrapper;
  const mockHandleNewConversation = jest.fn();
  const mockToggleNewConversaton = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <NewConversation
        handleNewConversation={mockHandleNewConversation}
        toggleNewConversation={mockToggleNewConversaton}
      />,
    );
  });

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('closeNewConversation should call toggleNewConversation', () => {
    wrapper.instance().closeNewConversation();
    expect(mockToggleNewConversaton).toHaveBeenCalled();
  });
});
