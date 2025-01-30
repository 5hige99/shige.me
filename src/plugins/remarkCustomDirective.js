import { visit } from 'unist-util-visit';

export function remarkCustomDirective() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        const data = node.data || (node.data = {});
        data.hName = 'div';
        data.hProperties = {
          class: node.name
        };
      }
    });
  };
}