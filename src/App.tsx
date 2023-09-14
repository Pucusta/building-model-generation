import './App.css'
import WebGL from './WebGLComponent'
import InputComponent from './InputComponent'

function App() {

  return (
    <>
      <div>
        <WebGL />
      </div>
      <div id="topOverlay">
        <h1>Building Model Generation</h1>
      </div>
      <div id="bottomOverlay">
        <InputComponent />
      </div>
    </>
  )
}

export default App