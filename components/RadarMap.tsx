import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Radar, Map as MapIcon, ExternalLink, MapPin, Navigation } from 'lucide-react';
import { FamilyMember } from '../types';

interface RadarMapProps {
  members: FamilyMember[];
}

const RadarMap: React.FC<RadarMapProps> = ({ members }) => {
  const [viewMode, setViewMode] = useState<'radar' | 'map'>('radar');
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // Center coordinate for simulation (Central Park NY)
  const CENTER_LAT = 40.7829;
  const CENTER_LNG = -73.9654;

  const openGoogleMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (viewMode !== 'radar' || !svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = Math.min(width, 500);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(centerX, centerY) - 40;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Draw Radar Circles (Distance zones)
    const zones = [0.25, 0.5, 0.75, 1];
    zones.forEach((zone) => {
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', maxRadius * zone)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6') // Blue-500
        .attr('stroke-opacity', 0.2)
        .attr('stroke-width', 1);
    });

    // Draw Crosshairs
    svg.append('line')
      .attr('x1', centerX)
      .attr('y1', centerY - maxRadius)
      .attr('x2', centerX)
      .attr('y2', centerY + maxRadius)
      .attr('stroke', '#3b82f6')
      .attr('stroke-opacity', 0.1);

    svg.append('line')
      .attr('x1', centerX - maxRadius)
      .attr('y1', centerY)
      .attr('x2', centerX + maxRadius)
      .attr('y2', centerY)
      .attr('stroke', '#3b82f6')
      .attr('stroke-opacity', 0.1);

    // Center "You" Marker
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 8)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // Pulse animation for center
    const pulse = svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', 8)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2);
    
    function repeat() {
        pulse
        .transition()
        .duration(2000)
        .attr('r', 30)
        .attr('stroke-opacity', 0)
        .on('end', () => {
            pulse.attr('r', 8).attr('stroke-opacity', 1);
            repeat();
        });
    }
    repeat();

    // Map simulated members to polar coordinates
    const mappedMembers = members.map((m, i) => {
        const angle = (i * (360 / members.length) + 45) * (Math.PI / 180);
        const distFactor = 0.4 + (i % 3) * 0.2; 
        const r = maxRadius * distFactor;
        return {
            ...m,
            x: centerX + Math.cos(angle) * r,
            y: centerY + Math.sin(angle) * r
        };
    });

    // Draw Member Groups
    const nodes = svg.selectAll('.member-node')
      .data(mappedMembers)
      .enter()
      .append('g')
      .attr('class', 'member-node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Avatar Circle
    nodes.append('circle')
      .attr('r', 18)
      .attr('fill', '#fff')
      .attr('stroke', d => d.status === 'safe' ? '#22c55e' : d.status === 'warning' ? '#f59e0b' : '#ef4444')
      .attr('stroke-width', 3);

    // Avatar Image
    nodes.append('image')
      .attr('xlink:href', d => d.avatarUrl)
      .attr('x', -18)
      .attr('y', -18)
      .attr('width', 36)
      .attr('height', 36)
      .attr('clip-path', 'circle(18px at 18px 18px)');

    // === BATTERY INDICATOR (Bottom) ===
    const batteryGroup = nodes.append('g')
      .attr('transform', 'translate(-10, 20)'); 

    // Battery Shell
    batteryGroup.append('rect')
      .attr('width', 20)
      .attr('height', 8)
      .attr('rx', 2)
      .attr('fill', '#fff')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1);
    
    // Battery Nib
    batteryGroup.append('rect')
      .attr('x', 20)
      .attr('y', 2)
      .attr('width', 2)
      .attr('height', 4)
      .attr('rx', 1)
      .attr('fill', '#94a3b8');

    // Battery Fill
    batteryGroup.append('rect')
      .attr('x', 1)
      .attr('y', 1)
      .attr('width', d => 18 * (d.battery / 100))
      .attr('height', 6)
      .attr('rx', 1)
      .attr('fill', d => d.battery > 20 ? '#22c55e' : '#ef4444');

    // === SIGNAL INDICATOR (Top Right) ===
    const signalGroup = nodes.append('g')
       .attr('transform', 'translate(14, -14)');

    // Draw 4 signal bars
    [1, 2, 3, 4].forEach(i => {
       signalGroup.append('rect')
         .attr('x', i * 3)
         .attr('y', -((i + 1) * 2))
         .attr('width', 2)
         .attr('height', (i + 1) * 2)
         .attr('rx', 0.5)
         .attr('fill', d => d.signalStrength >= i ? '#3b82f6' : '#e2e8f0');
    });

    // Name Label
    nodes.append('text')
      .attr('y', 42)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4b5563')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text(d => d.name);

  }, [members, viewMode]);

  return (
    <div ref={containerRef} className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
           {viewMode === 'radar' ? <Radar size={18} /> : <MapIcon size={18} />}
           {viewMode === 'radar' ? 'Family Radar' : 'Map Tracking'}
        </h3>
        <div className="flex bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setViewMode('radar')}
             className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'radar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Radar
           </button>
           <button 
             onClick={() => setViewMode('map')}
             className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Map
           </button>
        </div>
      </div>
      
      {viewMode === 'radar' ? (
        <>
          <svg ref={svgRef} width="100%" height="400" className="overflow-visible" />
          <div className="w-full flex justify-center gap-4 mt-2 text-xs text-slate-400">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Safe</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Low Bat</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Offline</div>
          </div>
        </>
      ) : (
        <div className="w-full h-[400px] bg-slate-100 rounded-xl relative overflow-hidden group">
           {/* Simulated Map Grid */}
           <div 
             className="absolute inset-0 opacity-20" 
             style={{
               backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }}
           ></div>
           
           {/* Street Names Simulation */}
           <div className="absolute top-10 left-0 w-full h-px bg-slate-300"></div>
           <div className="absolute top-10 right-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fifth Ave</div>
           
           <div className="absolute top-0 left-1/3 w-px h-full bg-slate-300"></div>
           <div className="absolute bottom-4 left-[34%] text-[10px] text-slate-400 font-bold uppercase tracking-wider -rotate-90 origin-left">Broadway</div>

           {/* User Pin (Center) */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
             <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-md animate-pulse"></div>
             <div className="w-20 h-20 bg-indigo-500/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 animate-ping"></div>
           </div>
           
           {/* Family Member Pins */}
           {members.map((member) => {
              // Simple Mercator projection simulation centered on CENTER_LAT/LNG
              // 1 deg lat ~ 111km, 1 deg lng ~ 85km at 40 deg lat
              // Map view span is approx 1km for demo
              const latDiff = (member.location.lat - CENTER_LAT) * 10000; // Scale factor
              const lngDiff = (member.location.lng - CENTER_LNG) * 10000; 
              
              const x = 50 + lngDiff; // Percentage offset
              const y = 50 - latDiff; // Invert Y for latitude

              return (
                <div 
                  key={member.id}
                  className="absolute transition-all duration-1000 ease-in-out cursor-pointer z-20"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => setSelectedPin(selectedPin === member.id ? null : member.id)}
                >
                   {/* Tooltip Popup */}
                   {selectedPin === member.id && (
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2 mb-2">
                           <img src={member.avatarUrl} className="w-8 h-8 rounded-full bg-slate-100" />
                           <div>
                              <p className="font-bold text-sm text-slate-800">{member.name}</p>
                              <p className="text-[10px] text-slate-500">{member.location.address}</p>
                           </div>
                        </div>
                        <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             openGoogleMaps(member.location.lat, member.location.lng);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          <Navigation size={12} /> Open in Maps
                        </button>
                        {/* Arrow */}
                        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-slate-100"></div>
                     </div>
                   )}

                   {/* Marker Icon */}
                   <div className="relative -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform">
                      <MapPin size={32} className={`${selectedPin === member.id ? 'text-indigo-600' : 'text-slate-700'} drop-shadow-md`} fill="currentColor" />
                      <img 
                        src={member.avatarUrl} 
                        className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white object-cover"
                      />
                   </div>
                </div>
              );
           })}
        </div>
      )}
    </div>
  );
};

export default RadarMap;