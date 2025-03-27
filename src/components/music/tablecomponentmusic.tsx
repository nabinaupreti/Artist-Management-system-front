"use client"
import { useEffect, useState } from "react"
import { fetchMusic, updateSong, deleteSong, fetchArtists } from "@/api/api"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { AddSongDialog } from "./addsongform"
import { EditSongDialog } from "./editsong"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Song = {
  id: number
  artist_id: number
  title: string
  album_name: string
  genre: "rnb" | "country" | "classic" | "rock" | "jazz"
}

type Artist = {
  id: number
  name: string
}

type SortableField = keyof Song

export default function MusicTable() {
  const [music, setMusic] = useState<Song[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [artists, setArtists] = useState<Artist[]>([])

  // For edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)

  // For delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [songToDelete, setSongToDelete] = useState<number | null>(null)

  // For sorting
  const [sortField, setSortField] = useState<SortableField>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const fetchMusicData = async () => {
    setLoading(true)
    try {
      const data = await fetchMusic()
      // Sort the data consistently
      const sortedData = [...(data.music || [])].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
        return 0
      })
      setMusic(sortedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchArtistData = async () => {
    try {
      const data = await fetchArtists()
      setArtists(data.artists || [])
    } catch (err) {
      console.error("Error fetching artists:", err)
    }
  }

  useEffect(() => {
    fetchMusicData()
    fetchArtistData()
  }, [sortField, sortDirection]) // Re-fetch and sort when sort parameters change

  const handleSort = (field: SortableField) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleEdit = (song: Song) => {
    setCurrentSong(song)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setSongToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (songToDelete !== null) {
      try {
        await deleteSong(songToDelete)
        // Update local state instead of re-fetching
        setMusic(music.filter((song) => song.id !== songToDelete))
      } catch (error) {
        console.error("Error deleting song:", error)
        setError("Failed to delete song")
      } finally {
        setDeleteDialogOpen(false)
        setSongToDelete(null)
      }
    }
  }

  const handleSaveEdit = async (updatedSong: Song) => {
    try {
      if (updatedSong.id) {
        await updateSong(updatedSong.id, updatedSong)

        // Update the local state instead of re-fetching
        setMusic((prevMusic) => prevMusic.map((song) => (song.id === updatedSong.id ? updatedSong : song)))
      }
    } catch (error) {
      console.error("Error updating song:", error)
      setError("Failed to update song")
    }
  }

  // Format genre for display
  const formatGenre = (genre: string) => {
    const genreMap: Record<string, string> = {
      rnb: "R&B",
      country: "Country",
      classic: "Classic",
      rock: "Rock",
      jazz: "Jazz",
    }
    return genreMap[genre] || genre
  }

  // Get artist name by ID
  const getArtistName = (artistId: number) => {
    const artist = artists.find((a) => a.id === artistId)
    return artist ? artist.name : `Artist ID: ${artistId}`
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Music Library</h2>
        <AddSongDialog onSongAdded={fetchMusicData} />
      </div>

      {loading && <p className="text-center text-lg">Loading music...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <Table>
          <TableCaption>List of Music Tracks</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Artist</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("album_name")}>
                Album Name {sortField === "album_name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("genre")}>
                Genre {sortField === "genre" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {music.length > 0 ? (
              music.map((track) => (
                <TableRow key={track.id}>
                  <TableCell>{getArtistName(track.artist_id)}</TableCell>
                  <TableCell>{track.title}</TableCell>
                  <TableCell>{track.album_name}</TableCell>
                  <TableCell>{formatGenre(track.genre)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(track)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(track.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No music found
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="text-right font-bold">
                Total: {music.length} tracks
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {/* Edit Dialog */}
      {currentSong && (
        <EditSongDialog
          song={currentSong}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the song from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}





