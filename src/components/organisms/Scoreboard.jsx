import { PlayerCard } from '../molecules/PlayerCard';

export const Scoreboard = ({ 
  players = [], 
  currentPlayerIndex = 0,
  leaderId = null,
  t
}) => {
  return (
    <div id="scoreboard" className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-2 sm:mb-3 w-full px-2 z-10">
      {players.map((player, index) => {
        const isActive = index === currentPlayerIndex;
        const isLeader = player.id === leaderId;
        
        return (
          <PlayerCard 
            key={player.id} 
            player={player} 
            isActive={isActive} 
            isLeader={isLeader} 
            t={t}
          />
        );
      })}
    </div>
  );
};
