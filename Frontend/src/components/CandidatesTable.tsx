import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import {  Copy, Check } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MoreHorizontal } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Candidate {
  id: string
  serialNumber?: number
  candidateName: string
  email: string
  phone?: string
  status: string
  interviewUrl?: string | null
  interviewId?: string | null
}

export function CandidatesTable({ data, setCandidatesData }: { data: Candidate[]; setCandidatesData: React.Dispatch<React.SetStateAction<Candidate[]>> }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleCopy = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)

    setTimeout(() => {
      setCopiedId(null)
    }, 1500)
  }

  const generateInterviewUrl = async (candidateId: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/interview/generate-url?candidateId=${candidateId}`
      )

      if (res.status === 200 && res.data.interviewLink) {
        setCandidatesData((prev) =>
          prev.map((c) =>
            c.id === candidateId
              ? {
                ...c,
                interviewUrl: res.data.interviewLink,
                interviewId: res.data.interviewId,
              }
              : c
          )
          
        )
        console.log(res.data.interviewLink)
      }
    } catch (error) {
      console.error("Error generating interview URL:", error)
    }
  }

  return (
    <Table className="table-fixed w-full">
      <TableCaption>Candidate list</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">S.No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[200px]">Interview Link</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length > 0 ? (
          data.map((candidate, index) => (
            <TableRow key={candidate.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{candidate.candidateName}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.phone || "-"}</TableCell>
              <TableCell>{candidate.status}</TableCell>

              <TableCell>
                {candidate.interviewUrl ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={candidate.interviewUrl}
                      target="_blank"
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Open
                    </a>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleCopy(candidate.id, candidate.interviewUrl!)
                      }
                    >
                      {copiedId === candidate.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>

              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-40 p-2">
                    <div className="flex flex-col gap-1">

                      {/* Generate Link */}
                      <Button
                        variant="ghost"
                        className="justify-start text-sm"
                        onClick={() => generateInterviewUrl(candidate.id)}
                      >
                        Generate Link
                      </Button>

                      {/* Open Report (only if interview exists) */}
                      {candidate.interviewId && (
                        <Button
                          variant="ghost"
                          className="justify-start text-sm"
                          onClick={() =>
                            navigate(`/interview-report/${candidate.interviewId}`)
                          }
                        >
                          Open Report
                        </Button>
                      )}

                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              Loading...
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}