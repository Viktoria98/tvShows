import React from 'react';
import { shallow, configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import mock from 'jest-mock';

import Film from '../ui/components/shows/Film';
import PaginationComponent from '../ui/components/PaginationComponent';
import FilmListWrapper from '../ui/containers/FilmListWrapper';

configure({ adapter: new Adapter() });

describe('<Film/>', () => {
  it('should have an image to display the poster', () => {
    const wrapper = shallow(<Film />);
    expect(wrapper.find('img')).to.have.length(1);
  });
});

describe('<PaginationComponent/>', () => {
  it('should have an button to display the poster', () => {
    const wrapper = shallow(<PaginationComponent />);
    expect(wrapper.find('button')).to.have.length(1);
  });

  it('test loadMore button', () => {
    const mockCallBack = mock.fn();
    const wrapper = shallow(<PaginationComponent loadMore={mockCallBack} />);
    wrapper.find('button').simulate('click');
    expect(mockCallBack.mock.calls.length).equal(1);
  });
});

describe('<FilmListWrapper/>', () => {
  it('should have an buttons to sort', () => {
    const wrapper = shallow(<FilmListWrapper />);
    expect(wrapper.find('button')).to.have.length(3);
  });

  it('should have a <FilmsList/> component', () => {
    const wrapper = shallow(<FilmListWrapper />);
    expect(wrapper.find(FilmsList)).to.have.length(1);
  });

  it('should have an input to search', () => {
    const wrapper = shallow(<FilmListWrapper />);
    expect(wrapper.find('input')).to.have.length(1);
  });

  it('test sort button', () => {
    const mockCallBack = mock.fn();
    const wrapper = shallow(<FilmListWrapper onSort={mockCallBack} />);
    wrapper.find('button').simulate('click');
    expect(mockCallBack.mock.calls.length).equal(1);
  });

  it('test change input', () => {
    const mockCallBack = mock.fn();
    const wrapper = shallow(<FilmListWrapper onSearch={mockCallBack} />);
    wrapper.find('button').simulate('click');
    expect(mockCallBack.mock.calls.length).equal(1);
  });
});
