export const PHASES = [
  'Planning','Demo','Foundation','Framing','Rough-In',
  'Insulation','Drywall','Finishes','Fixtures','Punch-Out','Complete',
]

export const TRADES = [
  'General Contractor','Plumbing','Electrical','HVAC','Roofing',
  'Framing / Carpentry','Concrete / Masonry','Drywall','Painting',
  'Flooring','Landscaping','Insulation','Windows / Doors','Tile',
]

export const PHASE_COLORS: Record<string, string> = {
  'Planning':   'bg-slate-100 text-slate-700',
  'Demo':       'bg-red-100 text-red-700',
  'Foundation': 'bg-orange-100 text-orange-700',
  'Framing':    'bg-yellow-100 text-yellow-700',
  'Rough-In':   'bg-amber-100 text-amber-700',
  'Insulation': 'bg-lime-100 text-lime-700',
  'Drywall':    'bg-green-100 text-green-700',
  'Finishes':   'bg-teal-100 text-teal-700',
  'Fixtures':   'bg-cyan-100 text-cyan-700',
  'Punch-Out':  'bg-blue-100 text-blue-700',
  'Complete':   'bg-emerald-100 text-emerald-700',
}

export const STATUS_COLORS: Record<string, string> = {
  'active':   'bg-emerald-100 text-emerald-700',
  'paused':   'bg-yellow-100 text-yellow-700',
  'complete': 'bg-blue-100 text-blue-700',
  'planning': 'bg-slate-100 text-slate-700',
}
