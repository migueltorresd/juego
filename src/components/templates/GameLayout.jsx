export const GameLayout = ({
  header,
  scoreboard,
  leftSidebar,
  boardProgress,
  boardGrid,
  rightSidebar,
  bottomDialog,
  bottomControls
}) => {
  return (
    <div className="w-full lg:h-screen lg:overflow-hidden flex flex-col pt-1 px-4 max-w-[1400px] mx-auto pb-2 justify-between">
      {/* 1. Header (Full Width) */}
      <div className="w-full mb-1 shrink-0">
        {header}
      </div>

      {/* 2. Scoreboard (Full Width) */}
      <div className="w-full mb-1 shrink-0">
        {scoreboard}
      </div>

      {/* 3. Main content (3 Columns on Large Screens, Stacked on Mobile) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-center justify-center flex-grow overflow-hidden">
        
        {/* Left column: Tip panel & Help button (lg:col-span-3 xl:col-span-2) */}
        {/* On mobile, we place this below the board grid so it is not hidden */}
        <div className="hidden lg:flex flex-col gap-3 lg:col-span-3 xl:col-span-2 h-full justify-between overflow-hidden py-1">
          {leftSidebar}
        </div>

        {/* Center column: Progress bar & Tablero (lg:col-span-6 xl:col-span-8) */}
        <div className="col-span-1 lg:col-span-6 xl:col-span-8 flex flex-col items-center justify-center w-full h-full overflow-hidden">
          {boardProgress}
          <div className="w-full mt-1 flex items-center justify-center">
            {boardGrid}
          </div>
        </div>

        {/* Right column: Challenges, Progress, Streak (lg:col-span-3 xl:col-span-2) */}
        {/* On mobile, we stack it at the bottom */}
        <div className="hidden lg:flex flex-col gap-3 lg:col-span-3 xl:col-span-2 h-full justify-start overflow-hidden py-1">
          {rightSidebar}
        </div>

      </div>

      {/* Mobile-only section: Stacks Left and Right sidebars beneath the board grid so they remain accessible! */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden mt-6">
        <div className="flex flex-col gap-4">
          {leftSidebar}
        </div>
        <div className="flex flex-col gap-4">
          {rightSidebar}
        </div>
      </div>

      {/* 4. Bottom Footer Section (Robot mascot dialog bubble & Help buttons) */}
      <div className="w-full mt-2 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0">
        {bottomDialog}
        {bottomControls && (
          <div className="shrink-0 w-full md:w-auto flex justify-end">
            {bottomControls}
          </div>
        )}
      </div>
    </div>
  );
};
