import './App.css'
import Details from './components/Details'
import List from './components/List'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<List/>}/>
          <Route path='/company/:id' element={<Details/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
