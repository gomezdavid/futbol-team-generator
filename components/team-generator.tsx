"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shuffle, UserMinus, UserPlus, Pin, PinOff } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Player = {
  name: string
  pinnedTeam?: 1 | 2 | null
}

export default function TeamGenerator() {
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayer, setNewPlayer] = useState("")
  const [teams, setTeams] = useState<{ team1: Player[]; team2: Player[] }>({
    team1: [],
    team2: [],
  })

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPlayer.trim()) {
      setPlayers([...players, { name: newPlayer.trim(), pinnedTeam: null }])
      setNewPlayer("")
    }
  }

  const removePlayer = (playerToRemove: string) => {
    setPlayers(players.filter((player) => player.name !== playerToRemove))
    // Reset teams when removing a player
    setTeams({ team1: [], team2: [] })
  }

  const togglePin = (playerName: string, team: 1 | 2 | null) => {
    setPlayers(players.map(player =>
      player.name === playerName
        ? { ...player, pinnedTeam: team }
        : player
    ))
    // Reset teams when pinning changes
    setTeams({ team1: [], team2: [] })
  }

  const generateTeams = () => {
    // First, separate pinned and unpinned players
    const team1Pinned = players.filter(p => p.pinnedTeam === 1)
    const team2Pinned = players.filter(p => p.pinnedTeam === 2)
    const unpinnedPlayers = players.filter(p => p.pinnedTeam === null)

    // Shuffle unpinned players
    const shuffledUnpinned = [...unpinnedPlayers].sort(() => Math.random() - 0.5)

    // Calculate how many players we need to add to each team
    const remainingSpots = {
      team1: Math.ceil((unpinnedPlayers.length) / 2),
      team2: Math.floor((unpinnedPlayers.length) / 2)
    }

    // Distribute unpinned players
    const team1Unpinned = shuffledUnpinned.slice(0, remainingSpots.team1)
    const team2Unpinned = shuffledUnpinned.slice(remainingSpots.team1)

    // Combine pinned and unpinned players for each team
    setTeams({
      team1: [...team1Pinned, ...team1Unpinned],
      team2: [...team2Pinned, ...team2Unpinned],
    })
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">¿Quien falta?</h1>
        <h2>Arma tus equipos de futbol o lo que quieras con amigos</h2>
        <br />
        <form onSubmit={addPlayer} className="flex gap-2 max-w-sm mx-auto mb-4">
          <Input
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="Enter player name"
            className="flex-1"
          />
          <Button type="submit">
            <UserPlus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
      </div>

      {/* Players List */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Players ({players.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {players.map((player) => (
              <div
                key={player.name}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full px-3 py-1"
              >
                {player.name}
                <Select
                  value={player.pinnedTeam?.toString() || "unpinned"}
                  onValueChange={(value) =>
                    togglePin(
                      player.name,
                      value === "unpinned" ? null : Number(value) as 1 | 2
                    )
                  }
                >
                  <SelectTrigger className="h-7 w-[110px]">
                    <SelectValue placeholder="Pin to team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpinned">Unpin</SelectItem>
                    <SelectItem value="1">Pin to Team 1</SelectItem>
                    <SelectItem value="2">Pin to Team 2</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={() => removePlayer(player.name)}
                  className="hover:text-destructive"
                  aria-label={`Remove ${player.name}`}
                >
                  <UserMinus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Teams Button */}
      <div className="text-center mb-8">
        <Button
          onClick={generateTeams}
          size="lg"
          disabled={players.length < 2}
          className="gap-2"
        >
          <Shuffle className="h-4 w-4" />
          {teams.team1.length ? "Shuffle Teams" : "Generate Teams"}
        </Button>
      </div>

      {/* Teams Display */}
      {teams.team1.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Team 1</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {teams.team1.map((player) => (
                  <li
                    key={player.name}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded px-3 py-2"
                  >
                    {player.pinnedTeam === 1 && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                    {player.name}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Team 2</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {teams.team2.map((player) => (
                  <li
                    key={player.name}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded px-3 py-2"
                  >
                    {player.pinnedTeam === 2 && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                    {player.name}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

