import React from 'react';
import { shallow } from 'enzyme';
import SignoutIconButton from './SignoutIconButton';

describe('SignoutIconButton', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<SignoutIconButton />);
    expect(wrapper).toMatchSnapshot();
  });
});
