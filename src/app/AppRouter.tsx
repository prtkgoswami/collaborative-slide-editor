import {Routes, Route} from 'react-router-dom'
import Welcome from '../pages/Welcome'
import CollabEditor from '../pages/CollabEditor'
import PageNotFound from '@/pages/PageNotFound'

const AppRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/join/:deckId" element={<Welcome />} />
        <Route path="/deck/:deckId" element={<CollabEditor />} />
        <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default AppRouter;