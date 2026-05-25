import { useState, useEffect, Fragment } from 'react';
import { GameCard } from '../molecules/GameCard';

const getGridLayout = (pairsCount, isMobile) => {
  if (isMobile) {
    switch (pairsCount) {
      case 7: return { cols: 2, rows: 7 };
      case 8: return { cols: 4, rows: 4 };
      case 9: return { cols: 3, rows: 6 };
      case 10: return { cols: 4, rows: 5 };
      case 11: return { cols: 4, rows: 6 }; // 24 slots (22 cards, 2 decorative)
      case 12: return { cols: 4, rows: 6 }; // 24 slots (24 cards)
      case 13: return { cols: 4, rows: 7 }; // 28 slots (26 cards, 2 decorative)
      case 14: return { cols: 4, rows: 7 }; // 28 slots (28 cards)
      case 15: return { cols: 5, rows: 6 }; // 30 slots (30 cards)
      case 16: return { cols: 4, rows: 8 }; // 32 slots (32 cards)
      default: return { cols: 4, rows: 6 };
    }
  } else {
    switch (pairsCount) {
      case 7: return { cols: 7, rows: 2 };
      case 8: return { cols: 4, rows: 4 };
      case 9: return { cols: 6, rows: 3 };
      case 10: return { cols: 5, rows: 4 };
      case 11: return { cols: 6, rows: 4 }; // 24 slots (22 cards, 2 decorative)
      case 12: return { cols: 6, rows: 4 }; // 24 slots (24 cards)
      case 13: return { cols: 7, rows: 4 }; // 28 slots (26 cards, 2 decorative)
      case 14: return { cols: 7, rows: 4 }; // 28 slots (28 cards)
      case 15: return { cols: 6, rows: 5 }; // 30 slots (30 cards)
      case 16: return { cols: 8, rows: 4 }; // 32 slots (32 cards)
      default: return { cols: 6, rows: 4 };
    }
  }
};

export const BoardGrid = ({ 
  cards = [], 
  onCardClick, 
  lockBoard = false, 
  pairsCount = 12 
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { cols, rows } = getGridLayout(pairsCount, isMobile);

  // Generate column labels (A, B, C...)
  const colLabels = Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i));
  
  // Generate row labels (1, 2, 3...)
  const rowLabels = Array.from({ length: rows }, (_, i) => i + 1);

  // Col labels CSS colors from the screenshot
  const colColors = [
    'text-blue-400',   // A
    'text-rose-400',   // B
    'text-emerald-400', // C
    'text-amber-400',  // D
    'text-purple-400', // E
    'text-teal-400',   // F
    'text-pink-400',   // G
    'text-indigo-400'  // H
  ];

  // We need to render the grid with R rows and C columns.
  // In HTML, we use CSS Grid with `grid-template-columns: minmax(30px, 50px) repeat(C, 1fr)`.
  // First row has an empty cell (top-left corner), then the column labels (A, B, C...).
  // Each subsequent row starts with the row label (1, 2, 3...) followed by the cards in that row.
  
  // Total cards in the grid will be cols * rows. 
  // If cards.length is less than cols * rows, we insert decorative cards in some cells to fill the grid.
  const gridCells = [];
  let cardIndex = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellIndex = r * cols + c;
      // For N=11 (22 cards, 24 slots), we put placeholders at the last two cells
      // For N=13 (26 cards, 28 slots), we put placeholders at the last two cells
      const isPlaceholder = cardIndex >= cards.length;
      
      if (isPlaceholder) {
        gridCells.push({ type: 'placeholder', id: `placeholder-${cellIndex}` });
      } else {
        gridCells.push({ type: 'card', card: cards[cardIndex], index: cardIndex });
        cardIndex++;
      }
    }
  }

  // Generate columns CSS for grid
  const gridStyle = {
    gridTemplateColumns: `minmax(18px, 30px) repeat(${cols}, var(--card-size))`
  };

  return (
    <div 
      className="board-container w-full max-w-fit mx-auto overflow-hidden select-none p-2 sm:p-3"
      style={{
        '--grid-cols': cols,
        '--grid-rows': rows
      }}
    >
      <div 
        className="game-board grid gap-1.5 sm:gap-2 md:gap-2.5 items-center justify-center w-full"
        style={gridStyle}
      >
        {/* Top Left Corner (Empty) */}
        <div className="w-full h-6" />

        {/* Column Labels */}
        {colLabels.map((label, idx) => (
          <div 
            key={label} 
            className={`grid-label ${colColors[idx % colColors.length]} flex items-center justify-center font-title text-xs sm:text-sm md:text-base font-black`}
          >
            {label}
          </div>
        ))}

        {/* Rows of Labels and Cards */}
        {rowLabels.map((rowNum, rIdx) => (
          <Fragment key={rowNum}>
            {/* Row label (1, 2, 3...) */}
            <div className="grid-label row-num text-yellow-300 font-title text-xs sm:text-sm md:text-base font-black flex items-center justify-center">
              {rowNum}
            </div>

            {/* Cards in this row */}
            {gridCells.slice(rIdx * cols, (rIdx + 1) * cols).map((cell) => {
              if (cell.type === 'placeholder') {
                return (
                  <div 
                    key={cell.id} 
                    className="w-full aspect-square border-2 border-indigo-950/40 bg-slate-950/40 rounded-2xl flex items-center justify-center text-slate-800 text-sm sm:text-xl font-title shadow-inner"
                  >
                    &lt;/&gt;
                  </div>
                );
              }

              return (
                <GameCard
                  key={cell.card.uniqueId}
                  card={cell.card}
                  onClick={() => onCardClick(cell.index)}
                  disabled={lockBoard}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
