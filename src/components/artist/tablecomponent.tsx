"use client"
import { useEffect, useState } from "react"
import { fetchArtists, updateArtist, deleteArtist } from "@/api/api"
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
import { AddArtistDialog } from "./addartistform"
import { EditArtistDialog } from "./editartist"
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

type Artist = {
  id: number
  name: string
  dob: string
  gender: string
  address: string
  first_release_year: string
  no_of_albums_released: number
}

export default function TableDemo() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // For edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null)

  // For delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [artistToDelete, setArtistToDelete] = useState<number | null>(null)

  // For sorting
  const [sortField, setSortField] = useState<keyof Artist>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Gender mapping
  const genderMap: { [key: string]: string } = {
    m: "Male",
    f: "Female",
    o: "Other",
  }

  const fetchArtistsData = async () => {
    setLoading(true)
    try {
      const data = await fetchArtists()
      // Sort the data consistently
      const sortedData = [...(data.artists || [])].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
        return 0
      })
      setArtists(sortedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArtistsData()
  }, [sortField, sortDirection]) // Re-fetch and sort when sort parameters change

  const handleSort = (field: keyof Artist) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleEdit = (artist: Artist) => {
    setCurrentArtist(artist)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setArtistToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (artistToDelete !== null) {
      try {
        await deleteArtist(artistToDelete)
        // Update local state instead of re-fetching
        setArtists(artists.filter((artist) => artist.id !== artistToDelete))
      } catch (error) {
        console.error("Error deleting artist:", error)
        setError("Failed to delete artist")
      } finally {
        setDeleteDialogOpen(false)
        setArtistToDelete(null)
      }
    }
  }

  const handleSaveEdit = async (updatedArtist: Artist) => {
    try {
      console.log("Saving artist with data:", updatedArtist)
      const { id, ...artistData } = updatedArtist

      // Ensure dates are in the correct format
      const formattedData = {
        ...artistData,
        dob: artistData.dob.split("T")[0],
        first_release_year: artistData.first_release_year.split("T")[0],
      }

      console.log("Formatted data for API:", formattedData)
      await updateArtist(id, formattedData)

      // Update the local state instead of re-fetching
      setArtists((prevArtists) =>
        prevArtists.map((artist) => (artist.id === updatedArtist.id ? updatedArtist : artist)),
      )
    } catch (error: any) {
      console.error("Error updating artist:", error)
      let errorMessage = "Failed to update artist"
      if (typeof error === "object" && error !== null) {
        errorMessage += `: ${JSON.stringify(error)}`
      } else if (typeof error === "string") {
        errorMessage += `: ${error}`
      }
      setError(errorMessage)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      return new Date(dateString).toISOString().split("T")[0]
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Artists</h2>
        <AddArtistDialog onArtistAdded={fetchArtistsData} />
      </div>

      {loading && <p className="text-center text-lg">Loading artists...</p>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
          <button className="text-sm underline mt-1" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      {!loading && (
        <Table>
          <TableCaption>List of Artists</TableCaption>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort("id")}>
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead> */}
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>First Release Date</TableHead>
              <TableHead>No. of Albums Released</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.length > 0 ? (
              artists.map((artist) => (
                <TableRow key={artist.id}>
                  {/* <TableCell>{artist.id}</TableCell> */}
                  <TableCell>{artist.name}</TableCell>
                  <TableCell>{formatDate(artist.dob)}</TableCell>
                  <TableCell>{genderMap[artist.gender] || "Unknown"}</TableCell>
                  <TableCell>{artist.address}</TableCell>
                  <TableCell>{formatDate(artist.first_release_year)}</TableCell>
                  <TableCell>{artist.no_of_albums_released}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(artist)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(artist.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No artists found
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={8} className="text-right font-bold">
                Total: {artists.length} artists
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {/* Edit Dialog */}
      {currentArtist && (
        <EditArtistDialog
          artist={currentArtist}
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
              This action cannot be undone. This will permanently delete the artist from the database.
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

