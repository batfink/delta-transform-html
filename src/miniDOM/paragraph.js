import BlockNode from './block';
import TextNode from './text';

export default class ParagraphNode extends BlockNode {
  openTag() {
    return '<p>';
  }
  closeTag() {
    return '</p>';
  }
  absorb(child) {
    return child;
  }

  toHTMLAsync(indentLevel = 0) {
    if (this.children.length === 0) {
      this.children.push(new TextNode({type: 'text', attributes: {}, contents: ''}));
    }
    return Promise.all(this.children.map((c) => c.toHTMLAsync(indentLevel + 2)))
    .then((childHTML) => {
      return `${new Array(indentLevel + 1).join(' ')}${this.openTag()}\n${childHTML.join('\n')}\n${new Array(indentLevel + 1).join(' ')}${this.closeTag()}`; // eslint-disable-line max-len
    });
  }

  toHTML(indentLevel = 0) {
    if (this.children.length === 0) {
      this.children.push(new TextNode({type: 'text', attributes: {}, contents: ''}));
    }
    // if (this.children.length === 0) {
      // return `${new Array(indentLevel + 1).join(' ')}${this.openTag()}&nbsp;${this.closeTag()}`;
    // } else {
      return super.toHTML(indentLevel);
    // }
  }

  static matches(token = {}) {
    return (
      (token.type === 'linebreak') && (
        (!!token.attributes) ||
        (
          (token.attributes.list === undefined) &&
          (token.attributes.header === undefined)
        )
      )
    );
  }
}

ParagraphNode.priority = 19;
