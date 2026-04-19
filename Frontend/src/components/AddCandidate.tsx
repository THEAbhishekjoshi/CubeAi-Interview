import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import { useState } from "react"

export function AddCandidate({
  children,
  handleSubmit,
}: {
  children: React.ReactNode
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, close: () => void) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(e, () => setOpen(false)) 
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              Enter candidate details to add them for interview.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input name="name" />
            </Field>

            <Field>
              <Label>Email</Label>
              <Input name="email" />
            </Field>

            <Field>
              <Label>Phone</Label>
              <Input name="phone" />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}