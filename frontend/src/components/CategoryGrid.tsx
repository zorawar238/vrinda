

export function CategoryGrid() {
  return (
    <section className="bg-[#f0f0f0] min-h-[788px] relative overflow-hidden flex items-center justify-center font-sans selection:bg-blue-500 selection:text-white">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center scale-[0.875] origin-center">
        <div className="w-full h-[900px] relative flex items-center justify-center px-6 py-12">
          
          {/* Huge Background Typography */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[120%] flex justify-center pointer-events-none select-none z-0">
            <h1 className="mt-12 mb-8 text-[14rem] md:text-[22rem] text-[#3d3d3d]/90 leading-none whitespace-nowrap drop-shadow-sm pr-12" style={{ fontFamily: "'Badaboom BB', cursive" }}>
              Order Now
            </h1>
          </div>

          <div className="max-w-[1200px] w-full h-[800px] relative z-10 mx-auto">
        
        {/* Center Main Image */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[75%] z-10 flex items-end">
          <img 
            src="/featured/image1.png" 
            alt="Main Feature" 
            className="h-full w-auto object-cover drop-shadow-[0_30px_30px_rgba(0,0,0,0.3)] filter contrast-110 saturate-125" 
          />
        </div>

        {/* Top Right: Blue Selection Box Image */}
        <div className="absolute top-10 right-4 md:right-20 z-20">
          <div className="relative border-[1.5px] border-secondary p-0.5 bg-white shadow-xl w-48 md:w-56">
            {/* Transform Nodes */}
            <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-secondary"></div>
            <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-secondary"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-secondary"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-secondary"></div>
            <img src="/featured/image3.png" alt="Detail Back" className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Left Middle: MacOS Alert Box */}
        <div className="absolute top-[40%] left-4 md:left-24 z-30">
          <div className="bg-[#fcfcfc]/90 backdrop-blur-md rounded-md shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] overflow-hidden w-[280px] border border-gray-300">
            {/* Header */}
            <div className="bg-gradient-to-b from-[#f0f0f0] to-[#e0e0e0] px-3 py-1.5 flex gap-2 items-center border-b border-gray-300">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm border border-[#e0443e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm border border-[#dea123]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm border border-[#1aab29]"></div>
            </div>
            {/* Content */}
            <div className="p-4 flex gap-3 items-start bg-white/50">
              <div className="bg-[#ff3b30] text-white rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0 mt-1 shadow-sm text-xs">!</div>
              <div>
                <p className="text-[#ff3b30] font-bold text-[10px] uppercase tracking-wider mb-0.5">note!</p>
                <p className="text-xs text-gray-800 leading-snug font-medium">only for baddies!!!!!!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Bottom: Info Card */}
        <div className="absolute bottom-12 right-4 md:right-[15%] z-30">
          <div className="bg-[#fcfcfc] p-6 rounded-3xl shadow-2xl w-[320px] relative overflow-hidden border border-gray-100">
            <h2 className="text-secondary font-serif text-[2.5rem] leading-none mb-1">
              Order Now! <span className="text-[0.6rem] text-gray-500 font-sans tracking-normal align-top inline-block -ml-1 mt-1 font-bold">2026</span>
            </h2>
            <p className="text-[10px] font-sans text-gray-400 tracking-widest mb-4 uppercase">
              /VRINDA/ <span className="text-gray-800 font-bold ml-1">Limited Edition</span>
            </p>
            
            <div className="mb-4 mt-2">
              <h4 className="text-secondary font-serif text-lg leading-tight">Deadline of Orders</h4>
              <p className="font-serif italic text-secondary text-base">/January 31, 2026/</p>
            </div>

            <h3 className="font-bold text-gray-900 text-sm mb-2 leading-tight font-serif">:VRINDA Crop Zip</h3>
            <p className="text-xs text-gray-700 mb-1">Jacket Sizes</p>
            <ul className="list-disc list-inside text-[11px] text-gray-900 font-bold mb-4 ml-1">
              <li>Medium</li>
              <li>Large</li>
              <li>X-Large</li>
              <li>XX-Large</li>
            </ul>

            <p className="text-xs text-gray-700 mb-1">Material</p>
            <ul className="list-disc list-inside text-[11px] text-gray-900 font-bold mb-6 ml-1">
              <li>Stretch Jersey</li>
              <li>embroidered</li>
            </ul>

            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-[3.5rem] font-serif text-gray-900 tracking-tighter leading-none">799</span>
              <span className="text-gray-500 font-sans text-[10px] uppercase tracking-wider mb-1">Php</span>
            </div>
          </div>
        </div>

        {/* Bottom Left: Another Blue Selection Box Image */}
        <div className="absolute bottom-16 left-4 md:left-24 z-20">
           <div className="relative border-[1.5px] border-secondary p-1 bg-white shadow-xl w-56 flex gap-1 justify-between">
             {/* Transform Nodes */}
             <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-secondary"></div>
             <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-secondary"></div>
             <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-secondary"></div>
             <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-secondary"></div>
             
             <img src="/featured/image2.png" alt="Detail Front" className="w-[49%] h-28 object-cover object-top" />
             <img src="/featured/image3.png" alt="Detail Back" className="w-[49%] h-28 object-cover object-center" />
           </div>
        </div>

          </div>
          
          {/* Bottom Left Signature */}
          <div className="absolute bottom-4 left-6 z-20">
            <p className="text-secondary font-sans text-[10px] tracking-wide leading-snug">Design by<br/>Vrinda</p>
          </div>

        </div>
      </div>
    </section>
  );
}
