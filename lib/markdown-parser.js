import remarkContainer from 'remark-container';

const options = {
  containers: ['note', 'warning', 'tip']
};

const processor = unified()
  .use(remarkParse)
  .use(remarkContainer, options)
  .use(remarkHtml); 