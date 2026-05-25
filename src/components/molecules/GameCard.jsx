import { CardFace } from '../atoms/CardFace';

export const GameCard = ({ 
  card, 
  onClick, 
  disabled = false 
}) => {
  const { isFlipped, isMatched, icon, text } = card;

  const handleClick = () => {
    if (!isFlipped && !isMatched && !disabled) {
      onClick();
    }
  };

  // Compute CSS classes based on state
  const flippedClass = isFlipped || isMatched ? 'flipped' : '';
  const matchedClass = isMatched ? 'matched' : '';

  return (
    <div 
      className={`card-container ${flippedClass} ${matchedClass}`}
      onClick={handleClick}
    >
      <div className="card-inner w-full h-full transform-style-3d transition-transform duration-500">
        {/* Front Face (Unflipped - purple grid pattern with ?) */}
        <CardFace type="front" />

        {/* Back Face (Flipped - content face) */}
        <CardFace 
          type="back" 
          icon={icon} 
          text={text} 
          isMatched={isMatched} 
        />
      </div>
    </div>
  );
};
