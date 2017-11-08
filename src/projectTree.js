class ProjectTree {
  constructor (val) {
    this.value = val
    this.children = []
  }

  add (value) {
    this.children.push(new ProjectTree(value))
  }

  get (name) {
    let result = null
    this.children.forEach((projectItem) => {
      if (name === projectItem.value) {
        result = projectItem
      }
    })
    return result
  }
}

export default ProjectTree
