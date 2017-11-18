import React from 'react'
import ReactDOM from 'react-dom'
import './Main.css'
import jsPDF from 'jspdf'
let localStorage = window.localStorage

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      projects: [],
      activeProject: [],
      navOpen: true,
      darkMode: false,
      isFullScreen: false
    }

    let binds = ['add', 'delete', 'load', 'toggleMenu', 'toggleFullScreen', 'toggleLightDark'].forEach((name) => {
      this[name] = this[name].bind(this)
    })
  }

  componentDidMount () {
    // localStorage.clear() // only for start up emulation
    if (!localStorage[0] || (localStorage[0] === '[]')) {
      localStorage[0] = JSON.stringify([])
      this.add()
    } else {
      const localArray = JSON.parse(localStorage[0])
      const projects = localArray.map((elem) => {
        return JSON.parse(elem).title
      })
      this.setState({ projects: projects, activeProject: ['1'] })
      this.load(0)
    }

    window.addEventListener('beforeunload', () => { this.saveToLocalStorage() })
  }

  add () {
    // Set default placeholder text and add to local storage object
    const defaultProjectTitle = 'Chapter I: The Period'
    const defaultProjectText = '&#009 It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way--in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.'
    const localTemp = JSON.parse(localStorage[0])
    const index = localTemp.length
    localTemp.push(JSON.stringify({title: defaultProjectTitle, text: defaultProjectText}))
    localStorage[0] = JSON.stringify(localTemp)

    // Add new to state projects array. Add and set addition to active
    this.setState({
      projects: this.state.projects.concat(defaultProjectTitle)
    })
    this.load(index)
  }

  delete (index) {
    // Add confirm modal

    // Delete from local storage
    let localArray = JSON.parse(localStorage[0])
    localArray.splice(index, 1)
    localStorage[0] = JSON.stringify(localArray)

    // Reset active project to next item in line. If its last, load previous item.
    let loadIndex = (index === (this.state.projects.length - 1).toString()) ? (index - 1) : index
    this.setState({
      projects: this.changeArray('projects', null, 'delete', index),
      activeProject: this.changeArray('activeProject', null, 'deleteActive', loadIndex)
    })
    this.load(loadIndex)
  }

  load (id) {
    // Load text editor with content from local storage ID
    const localArray = JSON.parse(localStorage[0]) // parse array string
    const content = JSON.parse(localArray[id]) // then parse object string within array
    document.getElementById('title').innerHTML = content.title
    document.getElementById('text').innerHTML = content.text
    this.setState({activeProject: this.changeArray('activeProject', null, 'loadProject', id)})
  }

  textKeyListener (text, section) {
    const activeIndex = this.state.activeProject.indexOf(1)
    if (section === 'title') {
      this.setState({projects: this.changeArray('projects', text, 'updateProjectTitle', activeIndex)})
    }
  }

  changeArray (attr, item, action, index) {
    let stateArray = this.state[attr].slice()
    switch (action) {
      case 'delete':
        stateArray.splice(index, 1)
        return stateArray
      case 'addActive':
        stateArray = stateArray.map(() => { return 0 })
        stateArray.push(item)
        return stateArray
      case 'deleteActive':
        stateArray.splice(index, 1)
        return stateArray
      case 'loadProject':
        stateArray = stateArray.map(() => { return 0 })
        stateArray[index] = 1
        return stateArray
      case 'updateProjectTitle':
        stateArray[index] = item
        return stateArray
    }
  }

  toggleMenu () {
    this.setState({navOpen: !this.state.navOpen})
  }

  toggleFullScreen () {
    !this.state.isFullScreen ? this.enableFullScreen() : this.exitFullscreen()
    this.setState({isFullScreen: !this.state.isFullScreen})
  }

  enableFullScreen () {
    let docElm = document.documentElement
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen()
    } else if (docElm.msRequestFullscreen) {
      docElm = document.body //overwrite the element (for IE)
      docElm.msRequestFullscreen()
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen()
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen()
    }
  }

  exitFullscreen () {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }

  toggleLightDark () {
    this.setState({darkMode: !this.state.darkMode})
  }

  saveToLocalStorage () {
    const activeIndex = this.state.activeProject.indexOf(1)
    let localArray = JSON.parse(localStorage[0])
    const localTemp = JSON.parse(localArray[activeIndex])

    // Reset values in object, and update project item title if applicable
    const title = document.getElementById('title').innerHTML
    const text = document.getElementById('text').innerHTML
    localTemp['title'] = title
    localTemp['text'] = text

    // Re-String updated object/array and store into local storage
    localArray[activeIndex] = JSON.stringify(localTemp)
    localStorage[0] = JSON.stringify(localArray)
  }

  saveFile () {
    const title = document.getElementById('title').innerHTML
    const text = document.getElementById('text').innerHTML
    const doc = new jsPDF()
    const splitText = doc.splitTextToSize(text, 190)
    const textPrepped = [title, ' '].concat(splitText)
    doc.setFontSize(14)
    doc.text(textPrepped, 20, 20)
    doc.save(title + '.pdf')
  }

  render () {
    return (
      <div className={'main-app' + (this.state.darkMode ? ' darkModeActive' : '')}>

      <div className='menu-wrapper'>
        <div className={'projects-menu' + (this.state.navOpen ? ' open' : '')}>
          <div className='projects-header'>
            <h1>Write</h1>
            <div className='menu-options'>
              <button
                onClick={this.toggleLightDark}
              ><i className="fa fa-lightbulb-o" aria-hidden="true"></i></button>
              <button
                id='save-file'
                onClick={this.saveFile}
              ><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
              <button
                onClick={this.toggleFullScreen}
              ><i className='fa fa-arrows-alt' aria-hidden='true'></i></button>
            </div>
          </div>
          <div className='projects'>
            {this.state.projects.map((project, id) => {
              return (
                <div key={`project_${id}`} id={id} className={'project-item' + (this.state.activeProject[id] ? ' active' : '')}>
                  <div
                    key={`project_title_${id}`}
                    onClick={(e) => {
                      this.saveToLocalStorage()
                      this.load(e.target.parentNode.id)
                    }}
                  >{project}</div>
                  <button
                    key={`delete_key_${id}`}
                    onClick={(e) => this.delete(e.target.parentNode.id)}
                  ><i className="fa fa-trash"></i>
                  </button>
                </div>
              )
            })}
          </div>
          <button className='addProject' onClick={this.add}>+ Add Project</button>

          <footer>
            <p>Copyright 2017 <a href="">Github: @jonfranco</a></p>
          </footer>
        </div>

        <button
          className={'toggle' + (this.state.darkMode ? ' darkModeActive' : '')}
          onClick={this.toggleMenu}
        ><i className='fa fa-bars' aria-hidden='true'></i></button>

        </div>

        <div className={'text-editor' + (this.state.darkMode ? ' darkModeActive' : '')}>
          <h1
            id='title'
            contentEditable='true'
            onKeyUp={(e) => {
              this.textKeyListener(e.target.innerText, e.target.id)
            }}
          />
          <p
            id='text'
            contentEditable='true'
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                document.execCommand('insertHTML', false, '&#009')
                e.preventDefault()
              }
            }}
            onKeyUp={(e) => {
              this.textKeyListener(e.target.innerHTML, e.target.innerText, e.target.id, e.key)
              e.preventDefault()
            }}
          />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('app'))
