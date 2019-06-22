global.React = require 'react'
global.classNames = require 'classnames'
global.Checkbox = require('../../../elements/checkboxes/components/checkbox.cjsx').Checkbox
global.Dispatch = require('./dispatcherMock.cjsx').Dispatch

assert = require 'assert'
shallow = require('enzyme').shallow
mount = require('enzyme').mount
FormCheckbox = require('../../../elements/form/components/formCheckbox.cjsx').FormCheckbox

describe 'Form checkbox basic tests', ->
  it 'Should be rendered without props', ->
    wrapper = shallow(<FormCheckbox />)
    assert.equal 1, wrapper.find('Checkbox').length

  it 'Should be rendered with props', ->
    wrapper = shallow(<FormCheckbox label="label" name="name" checked={true} />)
    assert.equal "label", wrapper.find('Checkbox').props().label
    assert.equal "name", wrapper.find('Checkbox').props().name
    assert.equal true, wrapper.find('Checkbox').props().checked

  it 'Should render multiple checkboxes', ->
    options = [
        {
          text: "text1"
          name: "name1"
          checked: true
        }
        {
          text: "text2"
          name: "name2"
          checked: true
        }
    ]
    wrapper = shallow(<FormCheckbox options={options} />)
    assert.equal 2, wrapper.find('Checkbox').length
    for item, i in wrapper.find('Checkbox').nodes
      assert.equal options[i].text, item.props.label
      assert.equal options[i].name, item.props.name
      assert.equal options[i].checked, item.props.checked

describe 'Form checkbox click tests', ->
  beforeEach ->
    @called = 0

  it 'Should be checked and callback should be triggered after checkbox change', (done) ->
    @shouldBeCalledTimes = 1
    @valueToCheck = true
    cb = (checked, name) =>
      @called++
      assert.equal true , checked
      assert.equal "label", name
      done()
    @wrapper = mount(<FormCheckbox change={cb} name="label"/>)
    @wrapper.find('input').simulate('change')

  it 'Should be checked and event should be dispatched after checkbox change', (done) ->
    @valueToCheck = true
    @shouldBeCalledTimes = 0
    @wrapper = mount(<FormCheckbox name="label"/>)
    @wrapper.find('input').simulate('change')
    dispatchedEvent = Dispatch()
    assert.equal "FORM_FIELD_VALUE_CHANGE", dispatchedEvent.name
    assert.equal 'label', dispatchedEvent.action.name
    assert.equal true, dispatchedEvent.action.value
    done()

  it 'Should dispatch twice', (done) ->
    options = [
        {
          text: "text1"
          name: "name1"
        }
        {
          text: "text2"
          name: "name2"
        }
    ]
    @valueToCheck = true
    @shouldBeCalledTimes = 0
    @wrapper = mount(<FormCheckbox options={options}/>)
    @wrapper.find('input').forEach (node, i) ->
      node.simulate('change')
      dispatchedEvent = Dispatch()
      assert.equal "FORM_FIELD_VALUE_CHANGE", dispatchedEvent.name
      assert.equal options[i].name, dispatchedEvent.action.name
      assert.equal true, dispatchedEvent.action.value
    done()

  it 'Should call callback twice', (done) ->
    @valueToCheck = true
    @shouldBeCalledTimes = 2
    options = [
        {
          text: "text1"
          name: "name1"
        }
        {
          text: "text2"
          name: "name2"
        }
    ]
    cb = (checked, name) =>
      assert.equal true , checked
      assert.equal options[@called].name, name
      @called++
      done() if @called is @shouldBeCalledTimes
    @wrapper = mount(<FormCheckbox change={cb} options={options}/>)
    @wrapper.find('input').forEach (node, i) ->
      node.simulate('change')

  afterEach ->
    assert.equal @shouldBeCalledTimes, @called
    @wrapper.find('input').forEach (node) =>
      assert.equal @valueToCheck, node.props().checked
