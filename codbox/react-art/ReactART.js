import * as React from 'react';
import ReactVersion from 'shared/ReactVersion';
import {LegacyRoot} from 'react-reconciler/src/ReactRootTags';
import {
  createContainer,
  updateContainer,
  injectIntoDevTools,
} from 'react-reconciler/src/ReactFiberReconciler';
import Transform from 'art/core/transform';
import Mode from 'art/modes/current';
import FastNoSideEffects from 'art/modes/fast-noSideEffects';

import {TYPES, childrenAsString} from './ReactARTInternals';

Mode.setCurrent(
  // Change to 'art/modes/dom' for easier debugging via SVG
  FastNoSideEffects,
);

const slice = Array.prototype.slice;

class LinearGradient {
  constructor(stops, x1, y1, x2, y2) {
    this._args = slice.call(arguments);
  }

  applyFill(node) {
    node.fillLinear.apply(node, this._args);
  }
}

class RadialGradient {
  constructor(stops, fx, fy, rx, ry, cx, cy) {
    this._args = slice.call(arguments);
  }

  applyFill(node) {
    node.fillRadial.apply(node, this._args);
  }
}

class Pattern {
  constructor(url, width, height, left, top) {
    this._args = slice.call(arguments);
  }

  applyFill(node) {
    node.fillImage.apply(node, this._args);
  }
}

/** React Components */

class Surface extends React.Component {
  componentDidMount() {
    const {height, width} = this.props;

    this._surface = Mode.Surface(+width, +height, this._tagRef);

    this._mountNode = createContainer(
      this._surface,
      LegacyRoot,
      null,
      false,
      false,
      '',
    );
    updateContainer(this.props.children, this._mountNode, this);
  }

  componentDidUpdate(prevProps, prevState) {
    const props = this.props;

    if (props.height !== prevProps.height || props.width !== prevProps.width) {
      this._surface.resize(+props.width, +props.height);
    }

    updateContainer(this.props.children, this._mountNode, this);

    if (this._surface.render) {
      this._surface.render();
    }
  }

  componentWillUnmount() {
    updateContainer(null, this._mountNode, this);
  }

  render() {

    const props = this.props;
    const Tag = Mode.Surface.tagName;

    return (
      <Tag
        ref={ref => (this._tagRef = ref)}
        accessKey={props.accessKey}
        className={props.className}
        draggable={props.draggable}
        role={props.role}
        style={props.style}
        tabIndex={props.tabIndex}
        title={props.title}
      />
    );
  }
}

class Text extends React.Component {
  constructor(props) {
    super(props);
    // We allow reading these props. Ideally we could expose the Text node as
    // ref directly.
    ['height', 'width', 'x', 'y'].forEach(key => {
      Object.defineProperty(this, key, {
        get: function() {
          return this._text ? this._text[key] : undefined;
        },
      });
    });
  }
  render() {
    // This means you can't have children that render into strings...
    const T = TYPES.TEXT;
    return (
      <T {...this.props} ref={t => (this._text = t)}>
        {childrenAsString(this.props.children)}
      </T>
    );
  }
}

injectIntoDevTools({
  findFiberByHostInstance: () => null,
  bundleType: __DEV__ ? 1 : 0,
  version: ReactVersion,
  rendererPackageName: 'react-art',
});

/** API */

export const ClippingRectangle = TYPES.CLIPPING_RECTANGLE;
export const Group = TYPES.GROUP;
export const Shape = TYPES.SHAPE;
export const Path = Mode.Path;
export {LinearGradient, Pattern, RadialGradient, Surface, Text, Transform};
