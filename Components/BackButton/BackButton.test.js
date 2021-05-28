import React from 'react';
import { shallow } from 'enzyme';
import BackButton from './BackButton';

describe('BackButton', () => {
  let wrapper;
  it('should m atch the snapshot', () => {
    wrapper = shallow(<BackButton />);
    expect(wrapper).toMatchSnapshot();
  });
});
