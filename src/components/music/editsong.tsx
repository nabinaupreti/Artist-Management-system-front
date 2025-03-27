"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchArtists } from "@/api/api"

type SongData = {
  id?: number
  artist_id: number
  title: string
  album_name: string
  genre: "rnb" | "country" | "classic" | "rock" | "jazz"
}

type Artist = {
  id: number
  name: string
}

interface EditSongDialogProps {
  song: SongData
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (song: SongData) => Promise<void>
}

export function EditSongDialog({ song, open, onOpenChange, onSave }: EditSongDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])
  const [loadingArtists, setLoadingArtists] = useState(false)
  const [formData, setFormData] = useState<SongData>(song)

  useEffect(() => {
    setFormData(song)
  }, [song])

  // Fetch artists when dialog opens
  useEffect(() => {
    if (open) {
      fetchArtistsList()
    }
  }, [open])

  const fetchArtistsList = async () => {
    setLoadingArtists(true)
    try {
      const data = await fetchArtists()
      setArtists(data.artists || [])
    } catch (error) {
      console.error("Error fetching artists:", error)
    } finally {
      setLoadingArtists(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArtistChange = (artistId: string) => {
    setFormData((prev) => ({
      ...prev,
      artist_id: Number.parseInt(artistId),
    }))
  }

  const handleGenreChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: value as "rnb" | "country" | "classic" | "rock" | "jazz",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSave(formData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating song:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Song</DialogTitle>
          <DialogDescription>Update the song details and save your changes.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="artist_id" className="text-right">
                Artist
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.artist_id.toString()}
                  onValueChange={handleArtistChange}
                  disabled={loadingArtists}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingArtists ? "Loading artists..." : "Select an artist"} />
                  </SelectTrigger>
                  <SelectContent>
                    {artists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id.toString()}>
                        {artist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="album_name" className="text-right">
                Album
              </Label>
              <Input
                id="album_name"
                name="album_name"
                value={formData.album_name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genre" className="text-right">
                Genre
              </Label>
              <Select value={formData.genre} onValueChange={handleGenreChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rnb">R&B</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

