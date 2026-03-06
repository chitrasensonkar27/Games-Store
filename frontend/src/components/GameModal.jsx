import { useState, useEffect } from 'react'

const categories = ['action', 'adventure', 'simulation', 'rpg', 'sports', 'puzzle', 'strategy', 'racing']
const modes = ['Online', 'Offline', 'both']

const GameModal = ({ isOpen, onClose, game, onSave }) => {
  const [form, setForm] = useState({
    title: '', developer: '', category: 'action', online_or_offline: 'Online',
    game_size: '', subscription_price: 0, downloads: 0, reviews: 0, release_date: ''
  })

  useEffect(() => {
    if (game) {
      setForm({ ...game, release_date: game.release_date ? game.release_date.split('T')[0] : '' })
    } else {
      setForm({
        title: '', developer: '', category: 'action', online_or_offline: 'Online',
        game_size: '', subscription_price: 0, downloads: 0, reviews: 0,
        release_date: new Date().toISOString().split('T')[0]
      })
    }
  }, [game])

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataToSend = {
      ...form,
      release_date: new Date(form.release_date),
      subscription_price: Number(form.subscription_price),
      downloads: Number(form.downloads),
      reviews: Number(form.reviews),
    }
    onSave(dataToSend)
  }

  if (!isOpen) return null

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6 text-primary">
          {game ? '✏️ Edit Game' : '🎮 Add New Game'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Same form fields as before - unchanged */}
            <div className="form-control">
              <label className="label"><span className="label-text">Title</span></label>
              <input type="text" className="input input-bordered" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Developer</span></label>
              <input type="text" className="input input-bordered" required value={form.developer} onChange={e => setForm({...form, developer: e.target.value})} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Category</span></label>
              <select className="select select-bordered" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Mode</span></label>
              <select className="select select-bordered" value={form.online_or_offline} onChange={e => setForm({...form, online_or_offline: e.target.value})}>
                {modes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Game Size</span></label>
              <input type="text" className="input input-bordered" required value={form.game_size} onChange={e => setForm({...form, game_size: e.target.value})} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Release Date</span></label>
              <input type="date" className="input input-bordered" required value={form.release_date} onChange={e => setForm({...form, release_date: e.target.value})} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Price (₹)</span></label>
              <input type="number" min="0" className="input input-bordered" value={form.subscription_price} onChange={e => setForm({...form, subscription_price: e.target.value})} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Downloads</span></label>
              <input type="number" min="0" className="input input-bordered" value={form.downloads} onChange={e => setForm({...form, downloads: e.target.value})} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Rating (0-5)</span></label>
              <input type="number" min="0" max="5" step="0.1" className="input input-bordered" value={form.reviews} onChange={e => setForm({...form, reviews: e.target.value})} />
            </div>
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">{game ? 'Update Game' : 'Create Game'}</button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  )
}

export default GameModal