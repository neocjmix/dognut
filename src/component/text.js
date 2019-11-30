export const text = () => content => ({
  nodeName: '#text',
  render: container => {
    if (!container) {
      container = document.createTextNode(content)
    }

    if (container.nodeName !== '#text') {
      throw new Error('container type is not match with given one')
    }

    if (container.textContent !== content) {
      container.textContent = content
    }

    return container
  },
})
