import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CandidatesTable } from "../components/CandidatesTable"
import { AddCandidate } from "../components/AddCandidate"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Candidate {
  id: string
  serialNumber?: number
  candidateName: string
  email: string
  phone?: string
  status: string
  interviewUrl?: string | null
}

const CandidateDashboardPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCandidates = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/candidates`)

    const formatted = res.data.data.map((candidate: any, index: number) => ({
      id: candidate.id,
      candidateName: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      status: candidate.status,
      interviewUrl: candidate.interview?.interviewUrl || null,
      interviewId: candidate.interview?.interviewId || null,
      serialNumber: index + 1,
    }))

    setCandidates(formatted)
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    close: () => void
  ) => {
    try {
      setLoading(true)

      const formData = new FormData(e.currentTarget)

      await axios.post(`${import.meta.env.VITE_API_URL}/api/candidates`, {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      })

      toast.success("Candidate added successfully")

      close()
      fetchCandidates()
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-6 px-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl montserrat-font">Candidates</h1>

        <AddCandidate handleSubmit={handleSubmit}>
          <Button type="button" disabled={loading}>
             {loading ? "Adding..." : <Plus className="size-4" />}
          </Button>
        </AddCandidate>
      </div>

      <div className="montserrat-font">
        <CandidatesTable data={candidates} setCandidatesData={setCandidates} />
      </div>
    </div>
  )
}

export default CandidateDashboardPage