import React from 'react';
import { shallow } from 'enzyme';
import Login from './Login';

describe('Login', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Login navigation={jest.fn()} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should have properties of email, password and loading in state', () => {
    expect(wrapper.state()).toEqual({ email: '', password: '', loading: false });
  });

  it('handleEmailChange should update email in state', () => {
    wrapper.instance().handleEmailChange('test@test.com');
    expect(wrapper.state('email')).toEqual('test@test.com');
  });

  it('handlePasswordChange should update password in state', () => {
    wrapper.instance().handlePasswordChange('password');
    expect(wrapper.state('password')).toEqual('password');
  });
});
