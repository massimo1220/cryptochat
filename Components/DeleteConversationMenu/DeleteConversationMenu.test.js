import React from 'react';
import { shallow } from 'enzyme';
import DeleteConversationMenu from './DeleteConversationMenu';

describe('deleteConversationMenu', () => {
  const mockDeleteConversation = jest.fn();
  const mockToggleDeleteConversationMenu = jest.fn();
  const wrapper = shallow(<DeleteConversationMenu
    deleteConversation={mockDeleteConversation}
    toggleDeleteConversationMenu={mockToggleDeleteConversationMenu}
  />);

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('pressing the yes button should call deleteConversation', () => {
    wrapper.find('TouchableOpacity').at(0).simulate('press');
    expect(mockDeleteConversation).toHaveBeenCalled();
  });

  it('pressing the no button should call toggleDeleteConversationMenu', () => {
    wrapper.find('TouchableOpacity').at(1).simulate('press');
    expect(mockToggleDeleteConversationMenu).toHaveBeenCalled();
  });
});
