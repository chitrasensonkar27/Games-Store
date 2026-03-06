// src/components/GameCard.jsx
import { Edit2, Trash2, Calendar, Download, HardDrive, Gamepad2, Star, StarHalf } from 'lucide-react'

const GameCard = ({ game, onEdit, onDelete, onView }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  })

  // Half-star logic as previously implemented
  const rating = Number(game.reviews) || 0
  const fullStars = Math.floor(rating)
  const hasHalfStar = (rating % 1) >= 0.5

  return (
    <div 
      onClick={() => onView(game)}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-base-200"
    >
      <div className="card-body p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {/* Dark blue game logo / icon */}
            <div className="w-8 h-8 bg-blue-950 text-blue-300 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Gamepad2 className="w-5 h-5" />
            </div>

            <h2 className="card-title text-xl font-bold group-hover:text-primary transition-colors">
              {game.title}
            </h2>
          </div>

          <div className={`badge ${game.online_or_offline === 'Online' ? 'badge-success' : game.online_or_offline === 'Offline' ? 'badge-error' : 'badge-info'}`}>
            {game.online_or_offline}
          </div>
        </div>

        <p className="text-base-content/70 text-sm">by {game.developer}</p>

        <div className="flex gap-2 my-3">
          <div className="badge badge-outline badge-sm">{game.category}</div>
          <div className="badge badge-outline badge-sm">{game.game_size}</div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{game.downloads.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="w-4 h-4" />
            <span>{game.game_size}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(game.release_date)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            {game.subscription_price > 0 ? (
              <span className="text-2xl font-bold text-primary">₹{game.subscription_price}</span>
            ) : (
              <span className="text-2xl font-bold text-success">Free</span>
            )}
          </div>

          {/* Rating with half-star support */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {/* Full stars */}
              {Array.from({ length: fullStars }, (_, i) => (
                <Star key={`full-${i}`} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}

              {/* Half star if applicable */}
              {hasHalfStar && (
                <StarHalf className="w-5 h-5 fill-amber-400 text-amber-400" />
              )}

              {/* Empty stars */}
              {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }, (_, i) => (
                <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
              ))}
            </div>

            <span className="text-sm font-medium text-base-content/70 ml-1">
              ({rating.toFixed(1)})
            </span>
          </div>
        </div>

        <div className="card-actions justify-end mt-6 gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(game) }} 
            className="btn btn-sm btn-outline btn-primary"
          >
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(game._id) }} 
            className="btn btn-sm btn-outline btn-error"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameCard