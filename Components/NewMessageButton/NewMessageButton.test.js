import React from 'react';
import { shallow } from 'enzyme';
import NewMessageButton from './NewMessageButton';

describe('NewMessageButton', () => {
  let wrapper;
  it('should match the snapshot', () => {
    wrapper = shallow(<NewMessageButton />);
    expect(wrapper).toMatchSnapshot();
  });
});
