import './App.css'
import WebGL from './WebGLComponent'
import InputComponent from './InputComponent'

function App() {

  return (
    <>
      <h1>Building Model Generation</h1>
      <div className="canvas-container">
        <WebGL />
      </div>
      <div>
        <InputComponent />
      </div>
    </>
  )
}

export default App