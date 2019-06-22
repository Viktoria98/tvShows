export default function ConditionalRenderer (props) {
  if (!props.renderIf || props.notRenderIf) {
    return null;
  }
  return props.component;
}
