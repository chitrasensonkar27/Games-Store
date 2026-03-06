import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'
import GameCard from './components/GameCard'
import GameModal from './components/GameModal'
import { getAllGames, createGame, updateGame, deleteGame } from './services/api'

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMode, setSelectedMode] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [currentTheme, setCurrentTheme] = useState('dracula')

  const categories = ['all', 'action', 'adventure', 'simulation', 'rpg', 'sports', 'puzzle', 'strategy', 'racing']

  // Theme Toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dracula'
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dracula' ? 'cupcake' : 'dracula'
    setCurrentTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    toast.success(`Switched to ${newTheme === 'dracula' ? 'Dark' : 'Light'} Mode`)
  }

  const fetchGames = async () => {
    try {
      setLoading(true)
      const res = await getAllGames()
      setGames(res.data.data || res.data)
    } catch (err) {
      toast.error('Backend not running? Start your server first!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGames() }, [])

  const filteredGames = useMemo(() => {
    let result = [...games]
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      result = result.filter(g =>
        g.title.toLowerCase().includes(term) || g.developer.toLowerCase().includes(term)
      )
    }
    if (selectedCategory !== 'all') result = result.filter(g => g.category === selectedCategory)
    if (selectedMode !== 'all') result = result.filter(g => g.online_or_offline === selectedMode)

    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    if (sortBy === 'downloads') result.sort((a, b) => b.downloads - a.downloads)
    if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title))

    return result
  }, [games, searchTerm, selectedCategory, selectedMode, sortBy])

  const handleSave = async (data) => {
    try {
      if (editingGame) {
        await updateGame(editingGame._id, data)
        toast.success(' Game updated successfully!')
      } else {
        await createGame(data)
        toast.success(' New game added successfully!')
      }
      fetchGames()
      setModalOpen(false)
      setEditingGame(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this game permanently?')) return
    try {
      await deleteGame(id)
      toast.success(' Game deleted successfully')
      fetchGames()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Clean Navbar - "Games Store" only */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="navbar-start px-6 flex items-center gap-4">
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl shadow-inner">🎮</div>
          <h1 className="text-3xl font-black tracking-tighter text-base-content">Games Store</h1>
        </div>

        <div className="navbar-center hidden lg:flex">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search any game or developer..."
              className="input input-bordered w-full pl-11 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-base-content/50" />
          </div>
        </div>

        <div className="navbar-end pr-6 flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle text-xl"
            title="Switch Theme"
          >
            {currentTheme === 'dracula' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => { setEditingGame(null); setModalOpen(true) }}
            className="btn btn-primary gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" /> Add New Game
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-base-100 p-5 rounded-3xl shadow">
          <div className="flex gap-4">
            <select className="select select-bordered" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c.toUpperCase()}
                </option>
              ))}
            </select>

            <select className="select select-bordered" value={selectedMode} onChange={e => setSelectedMode(e.target.value)}>
              <option value="all">All Modes</option>
              <option value="Online">Online Only</option>
              <option value="Offline">Offline Only</option>
              <option value="both">Both</option>
            </select>

            <select className="select select-bordered" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="downloads">Most Downloaded</option>
              <option value="title">A - Z</option>
            </select>
          </div>
          <div className="text-sm font-medium text-base-content/70">
            {filteredGames.length} games found
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-96 rounded-3xl"></div>)}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl text-base-content/50">No games found</p>
            <p className="text-base-content/40 mt-2">Try changing filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map(game => (
              <GameCard
                key={game._id}
                game={game}
                onEdit={(g) => { setEditingGame(g); setModalOpen(true) }}
                onDelete={handleDelete}
                onView={(g) => toast.success(`Opened ${g.title}`)}
              />
            ))}
          </div>
        )}
      </div>

      <GameModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingGame(null) }}
        game={editingGame}
        onSave={handleSave}
      />
    </div>
  )
}

export default App