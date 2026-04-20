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
import {  Copy, Check, Loader2 } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MoreHorizontal } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const StatusBadge = ({ status }: { status: string }) => {
  const getBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
      case "SELECTED":
      case "PASS":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
      case "REJECTED":
      case "FAIL":
        return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(status)}`}>
      {status}
    </span>
  )
}

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
        toast.success("Link has been generated successfully")
      }
    } catch (error: any) {
      console.error("Error generating interview URL:", error)
      toast.error(error?.response?.data?.message || "Failed to generate link. Please try again.")
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
            <TableRow key={candidate.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
              <TableCell className="font-semibold">{candidate.candidateName}</TableCell>
              <TableCell className="text-slate-600 dark:text-slate-400">{candidate.email}</TableCell>
              <TableCell className="text-slate-600 dark:text-slate-400">{candidate.phone || "-"}</TableCell>
              <TableCell>
                <StatusBadge status={candidate.status} />
              </TableCell>

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
            <TableCell colSpan={7} className="h-32 text-center">
              <div className="flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin mb-2 text-slate-400" />
                <p>Loading candidates...</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}