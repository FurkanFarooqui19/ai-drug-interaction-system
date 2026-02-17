/**
 * AI Drug Interaction Warning System — Root with router and layout.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import HomePage from './pages/HomePage'
import ScanPage from './pages/ScanPage'
import HistoryPage from './pages/HistoryPage'
import AnalyticsPage from './pages/AnalyticsPage'
import DrugInfoPage from './pages/DrugInfoPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-400">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/drug-info" element={<DrugInfoPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </BrowserRouter>
  )
}
