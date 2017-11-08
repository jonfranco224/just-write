import React from 'react'
import './TextEditor.css'

class TextEditor extends React.Component {
  render () {
    return (
      <div>
        <div onKeyDown={(e) => this.props.onKeyDown(e.target.innerHTML)} className='project-title' contentEditable='true'>{this.props.projectTitle}</div>
        <div onKeyDown={(e) => this.props.onKeyDown(e.target.innerHTML)} className='text-editor' contentEditable='true'>{this.props.currentContent}</div>
      </div>
    )
  }
}

export default TextEditor
