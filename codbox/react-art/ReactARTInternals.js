export const TYPES = {
  CLIPPING_RECTANGLE: 'ClippingRectangle',
  GROUP: 'Group',
  SHAPE: 'Shape',
  TEXT: 'Text',
};

export const EVENT_TYPES = {
  onClick: 'click',
  onMouseMove: 'mousemove',
  onMouseOver: 'mouseover',
  onMouseOut: 'mouseout',
  onMouseUp: 'mouseup',
  onMouseDown: 'mousedown',
};

export function childrenAsString(children) {
  if (!children) {
    return '';
  } else if (typeof children === 'string') {
    return children;
  } else if (children.length) {
    return children.join('');
  } else {
    return '';
  }
}
