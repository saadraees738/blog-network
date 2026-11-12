import Markdoc from '@markdoc/markdoc';
import React from 'react';

// Walks the transformed Markdoc tree and sets rel/target on external links.
// Posts flagged as containing affiliate links get rel="sponsored noopener".
function decorate(node: any, affiliate: boolean) {
  if (!node || typeof node !== 'object') return;
  if (node.name === 'a' && node.attributes?.href) {
    const external = /^https?:\/\//.test(node.attributes.href);
    if (external) {
      node.attributes.rel = affiliate ? 'sponsored noopener' : 'noopener';
      node.attributes.target = '_blank';
    }
  }
  if (node.name === 'img' && node.attributes) {
    node.attributes.loading = 'lazy';
    node.attributes.decoding = 'async';
  }
  if (Array.isArray(node.children)) node.children.forEach((c: any) => decorate(c, affiliate));
}

export function Render({ tree, affiliate }: { tree: any; affiliate?: boolean }) {
  decorate(tree, !!affiliate);
  return <>{Markdoc.renderers.react(tree, React)}</>;
}
