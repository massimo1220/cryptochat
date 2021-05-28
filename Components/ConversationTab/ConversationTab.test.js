import React from 'react';
import { shallow } from 'enzyme';
import ConversationTab from './ConversationTab';

describe('ConversationTab', () => {
  let wrapper;
  const mockUpdateSelectedConversation = jest.fn();
  beforeEach(() => {
    wrapper = shallow(
      <ConversationTab
        from="sender"
        time="12:00 PM"
        updateSelectedConversation={mockUpdateSelectedConversation}
      />,
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('when pressed the conversation tab should call updateSelectedConversation', () => {
    wrapper.simulate('press');
    expect(mockUpdateSelectedConversation).toHaveBeenCalledWith('sender');
  });
});
