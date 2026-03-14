import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Sun, Moon, X } from 'lucide-react'
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

  // Delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [gameToDelete, setGameToDelete] = useState(null)

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
        g.title.toLowerCase().includes(term) ||
        g.developer.toLowerCase().includes(term)
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
        toast.success('Game updated successfully!')
      } else {
        await createGame(data)
        toast.success('New game added successfully!')
      }
      fetchGames()
      setModalOpen(false)
      setEditingGame(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  const requestDelete = (game) => {
    setGameToDelete(game)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!gameToDelete?._id) return
    try {
      await deleteGame(gameToDelete._id)
      toast.success('Game deleted successfully!')
      fetchGames()
    } catch (err) {
      toast.error('Delete failed')
    } finally {
      setDeleteConfirmOpen(false)
      setGameToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmOpen(false)
    setGameToDelete(null)
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar with YouTube-like Professional Search Bar */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="navbar-start px-4 sm:px-6 flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl shadow-inner">
            🎮
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-base-content">Games Store</h1>
        </div>

        {/* YouTube-style Search Bar - Large, Centered, Professional */}
        <div className="navbar-center flex-1 px-2 sm:px-4 lg:px-6">
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="flex items-center bg-base-200 rounded-full border border-base-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all duration-200 shadow-sm hover:shadow">
              <Search className="ml-4 w-5 h-5 sm:w-6 sm:h-6 text-base-content/70 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search games or developers..."
                className="flex-1 bg-transparent border-none outline-none px-3 py-2.5 sm:py-3 text-base sm:text-lg placeholder:text-base-content/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="mr-3 btn btn-ghost btn-xs p-1 hover:bg-base-300 rounded-full transition-colors"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="navbar-end px-4 sm:px-6 flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            title="Switch Theme"
          >
            {currentTheme === 'dracula' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => { setEditingGame(null); setModalOpen(true) }}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-5 h-5" /> Add
          </button>
        </div>
      </div>

      {/* The rest of your code remains EXACTLY the same */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 mb-8 bg-base-100 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow">
          <div className="flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
            <select className="select select-bordered select-sm sm:select-md flex-1 min-w-[140px]" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c.toUpperCase()}
                </option>
              ))}
            </select>

            <select className="select select-bordered select-sm sm:select-md flex-1 min-w-[140px]" value={selectedMode} onChange={e => setSelectedMode(e.target.value)}>
              <option value="all">All Modes</option>
              <option value="Online">Online Only</option>
              <option value="Offline">Offline Only</option>
              <option value="both">Both</option>
            </select>

            <select className="select select-bordered select-sm sm:select-md flex-1 min-w-[140px]" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="downloads">Most Downloaded</option>
              <option value="title">A - Z</option>
            </select>
          </div>

          <div className="text-sm font-medium text-base-content/70 whitespace-nowrap">
            {filteredGames.length} games found
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-xl text-base-content/70">Loading Games Store...</p>
            <p className="text-sm text-base-content/50 mt-2 max-w-md">
              First load may take 20–60 seconds (Render free tier wake-up). Subsequent visits will be faster.
            </p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <p className="text-2xl sm:text-3xl text-base-content/50">No games found</p>
            <p className="text-base-content/40 mt-2">Try changing filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredGames.map(game => (
              <GameCard
                key={game._id}
                game={game}
                onEdit={(g) => { setEditingGame(g); setModalOpen(true) }}
                onDelete={() => requestDelete(game)}
                onView={(g) => toast.success(`Opened ${g.title}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <GameModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingGame(null) }}
        game={editingGame}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${deleteConfirmOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-md sm:max-w-lg p-5 sm:p-6">
          <h3 className="font-bold text-lg sm:text-xl text-error">Confirm Deletion</h3>
          <p className="py-4 text-base sm:text-lg">
            Are you sure you really want to delete  
            <strong className="text-base-content break-words"> "{gameToDelete?.title || 'this game'}"</strong>?<br />
            This action cannot be undone.
          </p>
          <div className="modal-action flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="btn btn-ghost w-full sm:w-auto order-2 sm:order-1" onClick={cancelDelete}>
              Cancel
            </button>
            <button className="btn btn-error w-full sm:w-auto order-1 sm:order-2" onClick={confirmDelete}>
              Yes, Delete
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={cancelDelete}></div>
      </dialog>
    </div>
  )
}

export default App