import React from 'react';
import { shallow } from 'enzyme';
import Message from './Message';

describe('Message', () => {
  let wrapper;
  const mockDate = { seconds: '1581565040' };

  beforeEach(() => {
    wrapper = shallow(
      <Message
        content="test message"
        timestamp={mockDate}
      />,
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('formatTimestamp should return the time of a timestamp with correct AM and PM labels', () => {
    const expectedTime = '8:37 PM';
    const time = wrapper.instance().formatTimestamp(mockDate);
    expect(time).toEqual(expectedTime);
  });
});
