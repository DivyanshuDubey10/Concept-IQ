import { Routes, Route } from 'react-router-dom'
import { Shell } from './components/layout/Shell'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Practice from './pages/Practice'
import AITutor from './pages/AITutor'
import Progress from './pages/Progress'
import Revision from './pages/Revision'
import TopicDetail from './pages/TopicDetail'

function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/topic/:topicId" element={<TopicDetail />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/ai-tutor" element={<AITutor />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/revision" element={<Revision />} />
      </Route>
    </Routes>
  )
}

export default App
