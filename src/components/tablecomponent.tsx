"use client"
import { useEffect, useState } from "react"
import { fetchArtists } from "@/api/api"
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

export default function TableDemo() {
  const [artists, setArtists] = useState<Array<{ 
    id: number; 
    name: string; 
    dob: string; 
    gender: string; 
    address: string; 
    first_release_year: number; 
    no_of_albums_released: number; 
  }>>([]) 

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Gender mapping (Fixed Case Sensitivity)
  const genderMap: { [key: string]: string } = {
    m: "Male",
    f: "Female",
    o: "Other",
  };

  useEffect(() => {
    const getArtists = async () => {
      try {
        const data = await fetchArtists() 
        setArtists(data.artists || []) 
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    getArtists()
  }, [])

  return (
    <div className="p-4">
      {loading && <p className="text-center text-lg">Loading artists...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      
      {!loading && !error && (
        <Table>
          <TableCaption>List of Artists</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>First Release Year</TableHead>
              <TableHead>No. of Albums Released</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.length > 0 ? (
              artists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>{artist.id}</TableCell>
                  <TableCell>{artist.name}</TableCell>
                  <TableCell>{new Date(artist.dob).toISOString().split("T")[0]}</TableCell>

                  <TableCell>{genderMap[artist.gender] || "Unknown"}</TableCell>
                  <TableCell>{artist.address}</TableCell>
                  <TableCell>{artist.first_release_year}</TableCell>
                  <TableCell>{artist.no_of_albums_released}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No artists found
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={9} className="text-right font-bold">
                Total: {artists.length} artists
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  )
}   