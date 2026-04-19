import type{ Request, Response } from "express"
import prisma from "../config/db.js"

const createCandidate = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body
  const candidate = await prisma.candidate.create({
    data: {
      name,
      email,
      phone,
    },
  })
  res.status(201).json(candidate)
}

export default createCandidate