global.React = require 'react'
global.classNames = require 'classnames'

assert = require 'assert'
shallow = require('enzyme').shallow
mount = require('enzyme').mount
Checkbox = require('../../../elements/checkboxes/components/checkbox.cjsx').Checkbox

describe 'Checkbox basic tests', ->
  it 'Should be rendered without props', ->
    wrapper = shallow(<Checkbox />)
    assert.equal 1, wrapper.find('.checkbox').length

  it 'Should display label', ->
    wrapper = shallow(<Checkbox label='label'/>)
    assert.equal true, wrapper.contains("label")

  it ('Should be checked'), ->
    wrapper = shallow(<Checkbox checked={true}/>)
    assert.equal true, wrapper.find('input').props().checked

  it ('Should not display an empty label'), ->
    wrapper = shallow(<Checkbox />)
    assert.equal 1, wrapper.find(".-hidden").length

  it ('Should display a label'), ->
    wrapper = shallow(<Checkbox label='label'/>)
    assert.equal 0, wrapper.find(".-hidden").length

describe 'Checkbox click tests', ->
  beforeEach ->
    @itShouldBeTrue = false

  it 'Should be checked after checkbox change', (done) ->
    @valueToCheck = true
    cb = (checked, name) =>
      @itShouldBeTrue = true
      assert.equal true , checked
      assert.equal "label", name
      done()
    @wrapper = mount(<Checkbox onCheck={cb} name="label"/>)
    @wrapper.find('input').simulate('change')

  it 'Should be uncheked after checkbox change with checked by default', (done) ->
    @valueToCheck = false
    cb = (checked, name) =>
      @itShouldBeTrue = true
      assert.equal false , checked
      assert.equal "label", name
      done()
    @wrapper = mount(<Checkbox checked={true} onCheck={cb} name="label"/>)
    @wrapper.find('input').simulate('change')

  it 'Should be checked after click on label', (done) ->
    @valueToCheck = true
    cb = (checked, name) =>
      @itShouldBeTrue = true
      assert.equal true , checked
      assert.equal "label", name
      done()
    @wrapper = mount(<Checkbox onCheck={cb} name="label"/>)
    @wrapper.find('label').simulate('click')

  it 'Should be uncheked after click on label with checked by default', (done) ->
    @valueToCheck = false
    cb = (checked, name) =>
      @itShouldBeTrue = true
      assert.equal false , checked
      assert.equal "label", name
      done()
    @wrapper = mount(<Checkbox checked={true} onCheck={cb} name="label"/>)
    @wrapper.find('label').simulate('click')

  afterEach ->
    assert.equal true, @itShouldBeTrue
    assert.equal @valueToCheck, @wrapper.find('input').props().checked
