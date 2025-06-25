import { useState, useCallback, useEffect } from 'react'
import { Play, Pause, Plus, Search, Music, Headphones, Volume2, Share2, Download, Loader2, Sparkles, Zap } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent } from './components/ui/card'
import { Progress } from './components/ui/progress'
import { Badge } from './components/ui/badge'
import { Slider } from './components/ui/slider'
import { toast } from 'react-hot-toast'
import { WaveformVisualizer } from './components/WaveformVisualizer'
import { FloatingParticles } from './components/FloatingParticles'

interface Track {
  id: string
  title: string
  artist: string
  duration: string
  bpm: number
  key: string
  genre: string
  artwork?: string
}

interface Mashup {
  id: string
  title: string
  tracks: Track[]
  duration: string
  created: string
  plays: number
}

function App() {
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [currentMashup, setCurrentMashup] = useState<Mashup | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState([75])
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  // Generate AI suggestions when tracks are selected
  useEffect(() => {
    if (selectedTracks.length >= 2) {
      const suggestions = [
        `Perfect BPM match: ${selectedTracks[0].bpm} + ${selectedTracks[1].bpm}`,
        `Key compatibility: ${selectedTracks[0].key} × ${selectedTracks[1].key}`,
        `Genre fusion: ${selectedTracks[0].genre} + ${selectedTracks[1].genre}`,
        'AI recommends: Add transition effects for smooth blending'
      ]
      setAiSuggestions(suggestions)
    } else {
      setAiSuggestions([])
    }
  }, [selectedTracks])

  // Mock data for demonstration
  const mockTracks: Track[] = [
    { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', bpm: 171, key: 'F# minor', genre: 'Synthpop' },
    { id: '2', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', bpm: 103, key: 'B minor', genre: 'Disco Pop' },
    { id: '3', title: 'Good 4 U', artist: 'Olivia Rodrigo', duration: '2:58', bpm: 166, key: 'A major', genre: 'Pop Rock' },
    { id: '4', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', duration: '2:21', bpm: 169, key: 'C major', genre: 'Hip Hop' },
    { id: '5', title: 'Heat Waves', artist: 'Glass Animals', duration: '3:58', bpm: 80, key: 'C# minor', genre: 'Indie Pop' },
    { id: '6', title: 'Industry Baby', artist: 'Lil Nas X, Jack Harlow', duration: '3:32', bpm: 150, key: 'C minor', genre: 'Hip Hop' },
  ]

  const filteredTracks = mockTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addTrack = useCallback((track: Track) => {
    if (selectedTracks.length >= 4) {
      toast.error('Maximum 4 tracks allowed for mashup')
      return
    }
    if (selectedTracks.find(t => t.id === track.id)) {
      toast.error('Track already added')
      return
    }
    setSelectedTracks(prev => [...prev, track])
    toast.success(`Added "${track.title}" to mashup`)
  }, [selectedTracks])

  const removeTrack = useCallback((trackId: string) => {
    setSelectedTracks(prev => prev.filter(t => t.id !== trackId))
  }, [])

  const createMashup = useCallback(async () => {
    if (selectedTracks.length < 2) {
      toast.error('Add at least 2 tracks to create a mashup')
      return
    }

    setIsCreating(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newMashup: Mashup = {
      id: Date.now().toString(),
      title: `${selectedTracks[0].title} × ${selectedTracks[1].title}${selectedTracks.length > 2 ? ' + more' : ''}`,
      tracks: selectedTracks,
      duration: '3:45',
      created: new Date().toLocaleDateString(),
      plays: 0
    }
    
    setCurrentMashup(newMashup)
    setIsCreating(false)
    toast.success('Mashup created successfully!')
  }, [selectedTracks])

  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying)
    if (!isPlaying && currentMashup) {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 100)
    }
  }, [isPlaying, currentMashup])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <FloatingParticles />
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-heading bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Rave.AI
                  </h1>
                  <p className="text-sm text-white/60">AI Music Mashup Studio</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Beta
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Track Search & Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-purple-400" />
                  Find Tracks
                </h2>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    placeholder="Search for songs or artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500"
                  />
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTracks.map(track => (
                    <div key={track.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                          <Music className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{track.title}</h3>
                          <p className="text-sm text-white/60">{track.artist}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-white/40">{track.duration}</span>
                            <span className="text-xs text-white/40">{track.bpm} BPM</span>
                            <span className="text-xs text-white/40">{track.key}</span>
                            <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                              {track.genre}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => addTrack(track)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={selectedTracks.some(t => t.id === track.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mashup Creator */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Music className="w-5 h-5 mr-2 text-pink-400" />
                  Your Mashup
                </h2>
                
                <div className="space-y-3 mb-6">
                  {selectedTracks.length === 0 ? (
                    <div className="text-center py-8 text-white/40">
                      <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Add tracks to start creating</p>
                    </div>
                  ) : (
                    selectedTracks.map((track, index) => (
                      <div key={track.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white truncate">{track.title}</p>
                            <p className="text-xs text-white/60">{track.artist}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeTrack(track.id)}
                          size="sm"
                          variant="ghost"
                          className="text-white/60 hover:text-white hover:bg-white/10"
                        >
                          ×
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <Button
                  onClick={createMashup}
                  disabled={selectedTracks.length < 2 || isCreating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating AI Mashup...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create AI Mashup
                    </>
                  )}
                </Button>
                
                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <h3 className="text-sm font-medium text-white mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                      AI Insights
                    </h3>
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <p key={index} className="text-xs text-white/70 flex items-start">
                          <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {suggestion}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Player */}
            {currentMashup && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Now Playing</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-white truncate">{currentMashup.title}</h3>
                      <p className="text-sm text-white/60">{currentMashup.tracks.length} tracks • {currentMashup.duration}</p>
                    </div>

                    <div className="space-y-3">
                      <WaveformVisualizer isPlaying={isPlaying} progress={progress} className="bg-white/5 backdrop-blur-sm" />
                      <Progress value={progress} className="h-1" />
                      <div className="flex justify-between text-xs text-white/60">
                        <span>{Math.floor((progress / 100) * 225)}</span>
                        <span>{currentMashup.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        onClick={togglePlayback}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-12 h-12"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </Button>
                      
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <Volume2 className="w-4 h-4 text-white/60" />
                        <Slider
                          value={volume}
                          onValueChange={setVolume}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                        onClick={() => toast.success('Share link copied!')}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                        onClick={() => toast.success('Download started!')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App