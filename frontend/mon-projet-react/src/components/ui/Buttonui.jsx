
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function Buttonui({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-md h-8">
      <button
        onClick={onDecrease}
        className="px-2 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-md focus:outline-none"
        aria-label={quantity <= 1 ? 'Supprimer' : 'Diminuer la quantité'}
      >
        {quantity <= 1 ? <Trash2 size={14} /> : <Minus size={14} />}
      </button>
      <span className="px-3 h-full flex items-center justify-center min-w-[2rem] text-center border-x border-gray-300 text-gray-800 font-medium">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className="px-2 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-md focus:outline-none"
        aria-label="Augmenter la quantité"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
